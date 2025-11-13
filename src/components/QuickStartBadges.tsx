"use client";

import { useEffect, useState } from "react";
import { MagicCard } from "./ui/magicCard";
import { allPrompts, getRandomPrompts } from "@/lib/prompts";

interface QuickStartBadgesProps {
  onSelectPrompt: (prompt: string) => void;
}

export function QuickStartBadges({ onSelectPrompt }: QuickStartBadgesProps) {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    setPrompts(getRandomPrompts(allPrompts, 4));
  }, []);

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-2xl">
      <p className="w-full text-lg text-gray-400 mb-2">Or, try a quick start:</p>
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