// One-time Firestore seeder. Run with `npm run seed`.
//
// Uses firebase-admin (server-side, privileged) rather than the client SDK,
// so it needs its own service-account credentials — never the NEXT_PUBLIC_*
// client config. Provide these via env vars only (e.g. in a local .env, not
// committed):
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY   (paste with literal \n line breaks; this script
//                           un-escapes them)
//
// Idempotent: every doc is written with { merge: false } only if it doesn't
// already exist, so re-running this after an admin has edited content in
// Firestore will NOT overwrite their changes.
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { questions } from "../src/data/questions";
import { TYPE_PROFILES, MALE_COMPATIBILITY_TABLE } from "../src/data/types";
import { MALE_TYPE_PROFILES } from "../src/data/maleTypes";
import {
  AI_COMMENT_TEMPLATES_DEFAULT,
  COMPATIBILITY_FORMULA_WEIGHTS_DEFAULT,
  CTA_CONTENT_DEFAULT,
  ARTICLES_DEFAULT,
  HAPPINESS_WEIGHTS_DEFAULT,
  MARRIAGE_STATS_DEFAULTS,
  MARRIED_AVERAGE_VECTORS_DEFAULT,
} from "../src/data/cms-defaults";
import { TYPE_IDS } from "../src/types/quiz";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
}

async function seedIfAbsent(
  db: FirebaseFirestore.Firestore,
  path: [string, string],
  data: FirebaseFirestore.DocumentData
) {
  const ref = db.collection(path[0]).doc(path[1]);
  const snapshot = await ref.get();
  if (snapshot.exists) {
    console.log(`skip  ${path[0]}/${path[1]} (already exists)`);
    return;
  }
  await ref.set(data);
  console.log(`seed  ${path[0]}/${path[1]}`);
}

async function main() {
  const db = getFirestore(getAdminApp());

  // questions
  await seedIfAbsent(db, ["questions", "all"], { items: questions });

  // resultTypes -> cms/typeProfiles, cms/compatibility
  await seedIfAbsent(db, ["cms", "typeProfiles"], TYPE_PROFILES);
  await seedIfAbsent(db, ["cms", "compatibility"], MALE_COMPATIBILITY_TABLE);

  // maleTypes -> cms/maleTypes
  await seedIfAbsent(db, ["cms", "maleTypes"], MALE_TYPE_PROFILES);

  // statistics -> cms/marriageStats, stats/{A,B,C,D}
  await seedIfAbsent(db, ["cms", "marriageStats"], MARRIAGE_STATS_DEFAULTS);
  for (const typeId of TYPE_IDS) {
    await seedIfAbsent(db, ["stats", typeId], MARRIED_AVERAGE_VECTORS_DEFAULT[typeId]);
  }

  // settings -> cms/happinessWeights, cms/compatibilityFormulaWeights
  await seedIfAbsent(db, ["cms", "happinessWeights"], HAPPINESS_WEIGHTS_DEFAULT);
  await seedIfAbsent(db, ["cms", "compatibilityFormulaWeights"], COMPATIBILITY_FORMULA_WEIGHTS_DEFAULT);

  // aiTemplates -> cms/aiTemplates
  await seedIfAbsent(db, ["cms", "aiTemplates"], AI_COMMENT_TEMPLATES_DEFAULT);

  // cta -> cta/main
  await seedIfAbsent(db, ["cta", "main"], CTA_CONTENT_DEFAULT);

  // articles -> articles/{id}
  for (const article of ARTICLES_DEFAULT) {
    await seedIfAbsent(db, ["articles", article.id], { title: article.title, body: article.body });
  }

  console.log("Seeding complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
