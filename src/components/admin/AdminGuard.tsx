"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { subscribeAuthState, isAdminUser } from "@/lib/adminAuth";

/** Redirects to /admin/login unless the current user is signed in AND listed in `adminUsers`. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");

  useEffect(() => {
    const unsubscribe = subscribeAuthState((user: User | null) => {
      if (!user) {
        setStatus("denied");
        router.replace("/admin/login");
        return;
      }
      isAdminUser(user.uid).then((admin) => {
        if (!admin) {
          setStatus("denied");
          router.replace("/admin/login");
        } else {
          setStatus("allowed");
        }
      });
    });
    return unsubscribe;
  }, [router]);

  if (status !== "allowed") {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-nb-text/60">
        認証を確認しています…
      </main>
    );
  }

  return <>{children}</>;
}
