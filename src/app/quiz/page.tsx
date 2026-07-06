"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { questions } from "@/data/questions";
import { Answer, QuestionOption } from "@/types/quiz";

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQuestion = questions[step];

  function handleAnswer(optionKey: QuestionOption["key"]) {
    const nextAnswers = [...answers, { questionId: currentQuestion.id, optionKey }];
    setAnswers(nextAnswers);

    if (step + 1 < questions.length) {
      setStep(step + 1);
      return;
    }

    // Last question answered: show the "診断中…" transition, then persist
    // answers for the result page to read and navigate.
    setIsFinishing(true);
    sessionStorage.setItem("nb-answers", JSON.stringify(nextAnswers));
    setTimeout(() => {
      router.push("/result");
    }, 3000);
  }

  if (isFinishing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-nb-sub border-t-nb-accent"
        />
        <p className="text-sm text-nb-accent">診断中…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-10 px-6 py-16">
      <ProgressBar current={step + 1} total={questions.length} />
      <AnimatePresence mode="wait">
        <QuestionCard key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} />
      </AnimatePresence>
    </main>
  );
}
