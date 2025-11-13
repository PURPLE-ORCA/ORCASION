"use client";

import { useEffect, useState } from "react";
import { MagicCard } from "./ui/magicCard";
import { allPrompts, getRandomPrompts } from "@/lib/prompts";

interface QuickStartBadgesProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export function QuickStartBadges({ onSelectPrompt, className }: QuickStartBadgesProps) {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    setPrompts(getRandomPrompts(allPrompts, 4));
  }, []);

  return (
    <div className={`mt-8 flex flex-wrap justify-center gap-4 max-w-2xl ${className}`}>
      {prompts.map((prompt) => (
        <MagicCard
          key={prompt}
          className="cursor-pointer px-4 py-2 rounded-full text-sm"
          gradientColor="rgba(128, 0, 128, 0.2)"
          onClick={() => onSelectPrompt(prompt)}
        >
          {prompt}
        </MagicCard>
      ))}
    </div>
  );
}