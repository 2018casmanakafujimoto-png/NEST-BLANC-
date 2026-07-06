"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { signOutAdmin } from "@/lib/adminAuth";
import { TypeProfilesForm } from "@/components/admin/forms/TypeProfilesForm";
import { MaleTypesForm } from "@/components/admin/forms/MaleTypesForm";
import { CompatibilityForm } from "@/components/admin/forms/CompatibilityForm";
import { HappinessWeightsForm, CompatibilityWeightsForm } from "@/components/admin/forms/SettingsForm";
import { AITemplatesForm } from "@/components/admin/forms/AITemplatesForm";
import { MarriageStatsForm, MarriedVectorsForm } from "@/components/admin/forms/StatisticsForm";
import { QuestionsForm } from "@/components/admin/forms/QuestionsForm";
import { CTAForm } from "@/components/admin/forms/CTAForm";
import { ArticlesForm } from "@/components/admin/forms/ArticlesForm";

// Form-based CMS (no raw JSON editing). Every section reads/writes Firestore
// directly through src/repositories; Firestore is the source of truth once
// configured, with local defaults used only as a fallback. Gated by
// AdminGuard: unauthenticated or non-admin users are redirected to /admin/login.
export default function AdminPage() {
  return (
    <AdminGuard>
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">NEST BLANC 診断 CMS</h1>
            <p className="text-sm text-nb-text/60">
              Firestoreが未設定の場合、読み込みはコード内デフォルト値を表示し、保存は何も行いません。
            </p>
          </div>
          <button
            onClick={() => signOutAdmin()}
            className="rounded-full border border-nb-sub px-4 py-2 text-xs text-nb-text/70"
          >
            ログアウト
          </button>
        </div>

        <QuestionsForm />
        <TypeProfilesForm />
        <MaleTypesForm />
        <CompatibilityForm />
        <HappinessWeightsForm />
        <CompatibilityWeightsForm />
        <AITemplatesForm />
        <MarriageStatsForm />
        <MarriedVectorsForm />
        <CTAForm />
        <ArticlesForm />
      </main>
    </AdminGuard>
  );
}
