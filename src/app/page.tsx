import Link from "next/link";
import　Image　from "next/image";
import { questions } from "@/data/questions";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-10 px-6 py-20 text-center">
      <div className="space-y-4">
             <Image
  src="/images/top-1.png.png"
  alt="NEST BLANC 婚活価値観診断"
  width={300}
  height={300
  
  }
  className="ml-2 mr-auto rounded-2xl"
/>
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

      <div className="rounded-soft bg-nb-main p-8 text-sm leading-loose shadow-sm">
        あなた自身の価値観と、
        <br />
        相性の良い男性の特徴を分析します。
        <br />
        <span className="mt-2 inline-block text-nb-accent">
          所要時間 約3分・全{20}問
        </span>
      </div>

      <Link
        href="/quiz"
        className="rounded-full bg-nb-accent px-8 py-4 tracking-wide text-white shadow-md transition hover:opacity-90"
      >
        診断をはじめる
      </Link>
    </main>
  
  );
}
