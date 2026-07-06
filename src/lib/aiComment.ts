import { AICommentTemplateSet } from "@/types/quiz";

// Deterministic template-assembly engine, not a live LLM call: no external AI
// API key is configured anywhere in this project, so generation here means
// "assemble the CMS-editable phrase banks in the spec's 5-part structure",
// each bank already written to satisfy the content/tone rules (no definitive
// personality claims, no fear-mongering, no income-only framing, no fixed
// gender roles, no "definitely incompatible" statements). If real per-user LLM
// generation is wanted later, this is the single call site to swap.
export function generateAIComment(template: AICommentTemplateSet): string {
  return [template.typeIntro, template.strengths, template.idealPartner, template.cautions, template.advice].join(
    "\n\n"
  );
}
