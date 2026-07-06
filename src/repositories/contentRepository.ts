import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { Article, CTAContent } from "@/types/quiz";
import { ARTICLES_DEFAULT, CTA_CONTENT_DEFAULT } from "@/data/cms-defaults";

// Repository Pattern for the Firestore "cta" and "articles" collections.
// Marketing-style content, separate from the diagnosis-scoring CMS content in
// cmsRepository.ts. Falls back to bundled defaults when Firestore isn't
// configured.

export async function getCTAContent(): Promise<CTAContent> {
  const db = getFirestoreDb();
  if (!db) return CTA_CONTENT_DEFAULT;
  const snapshot = await getDoc(doc(db, "cta", "main"));
  return snapshot.exists() ? (snapshot.data() as CTAContent) : CTA_CONTENT_DEFAULT;
}

export async function setCTAContent(value: CTAContent): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.info("Firebase is not configured; skipping CTA write.");
    return;
  }
  await setDoc(doc(db, "cta", "main"), value);
}

export async function getArticles(): Promise<Article[]> {
  const db = getFirestoreDb();
  if (!db) return ARTICLES_DEFAULT;
  const snapshot = await getDocs(collection(db, "articles"));
  if (snapshot.empty) return ARTICLES_DEFAULT;
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, "id">) }));
}

export async function setArticles(articles: Article[]): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.info("Firebase is not configured; skipping articles write.");
    return;
  }
  await Promise.all(
    articles.map((article) => setDoc(doc(db, "articles", article.id), { title: article.title, body: article.body }))
  );
}
