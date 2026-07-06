import Link from "next/link";
import { questions } from "@/data/questions";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16 text-center">
      <div className="space-y-4">
        <p className="text-sm tracking-widest text-nb-accent">NEST BLANC</p>
        <h1 className="text-2xl font-bold leading-relaxed">
          婚活価値観診断
        </h1>
        <p className="leading-loose text-sm">
          この診断は性格診断ではありません。
          <br />
          NEST BLANCが実際の婚活データを分析し、
          <br />
          「結婚後も幸せな関係を築きやすい価値観」
          <br />
          を可視化するための診断です。
        </p>
      </div>

      <div className="rounded-soft bg-nb-main p-6 text-sm leading-loose">
        あなた自身の価値観と、
        <br />
        相性の良い男性の特徴を分析します。
        <br />
        <span className="mt-2 inline-block text-nb-accent">
          所要時間 約2分・全{6}問
        </span>
      </div>

      <Link
        href="/quiz"
        className="rounded-full bg-nb-accent px-8 py-4 text-white shadow-sm transition hover:opacity-90"
      >
        診断をはじめる
      </Link>
    </main>
  );
}
