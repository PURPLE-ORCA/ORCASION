"use client";

import { MagicCard } from "./ui/magicCard";

interface QuickStartBadgesProps {
  onSelectPrompt: (prompt: string) => void;
}

export function QuickStartBadges({ onSelectPrompt }: QuickStartBadgesProps) {
  const quickStartPrompts = [
    "Which phone should I buy?",
    "Should I take this new job offer?",
    "What should I have for dinner?",
    "Where should I go for my next vacation?",
  ];

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-2xl">
      {quickStartPrompts.map((prompt) => (
        <MagicCard
          key={prompt}
          className="cursor-pointer px-4 py-2 rounded-full text-sm"
          gradientColor="rgba(128, 0, 128, 0.2)" // A subtle purple gradient
          onClick={() => onSelectPrompt(prompt)}
        >
          {prompt}
        </MagicCard>
      ))}
    </div>
  );
}
