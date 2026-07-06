"use client";

import { motion } from "framer-motion";
import { Question, QuestionOption } from "@/types/quiz";

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionKey: QuestionOption["key"]) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <h2 className="mb-8 text-center text-lg font-medium leading-relaxed">
        {question.text}
      </h2>
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.key}
            onClick={() => onAnswer(option.key)}
            className="rounded-soft border border-nb-sub bg-white px-5 py-4 text-left text-sm transition hover:border-nb-accent hover:bg-nb-main"
          >
            <span className="mr-2 text-nb-accent">{option.key}.</span>
            {option.text}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
