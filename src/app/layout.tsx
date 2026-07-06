import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEST BLANC 婚活価値観診断",
  description: "結婚後も幸せな関係を築きやすい価値観を可視化する診断",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-nb-bg font-sans">{children}</body>
    </html>
  );
}
