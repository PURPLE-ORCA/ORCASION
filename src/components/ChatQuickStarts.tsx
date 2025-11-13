"use client";

import { useEffect, useState } from "react";
import { MagicCard } from "./ui/magicCard";
import { allPrompts, getRandomPrompts } from "@/lib/prompts";

interface ChatQuickStartsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function ChatQuickStarts({ onSelectPrompt }: ChatQuickStartsProps) {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    setPrompts(getRandomPrompts(allPrompts, 4));
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
        <p className="w-full text-lg text-gray-400 mb-2">
          Not sure where to start? Try one of these:
        </p>
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
    </div>
  );
}