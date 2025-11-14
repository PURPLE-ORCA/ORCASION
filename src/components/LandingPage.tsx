"use client";

import Link from "next/link";
import { MagicCard } from "./ui/magicCard";
import SiriOrb from "./ui/SiriOrb";
import { QuickStartBadges } from "./QuickStartBadges";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <SiriOrb />
      <h1 className="text-4xl font-bold my-8">Welcome to Orcasion</h1>
      <p className="text-lg text-center mb-8 max-w-2xl">
        Stop overthinking. Start deciding. Orcasion is your personal AI
        assistant that cuts through the noise, analyzes your options, and helps
        you make better, faster decisions with confidence.
      </p>
      <div className="flex gap-4">
        <Link href="/sign-in">
          <MagicCard
            className="cursor-pointer"
            gradientColor="rgba(255, 255, 255, 0.1)"
          >
            <span className="font-medium">Get Started</span>
          </MagicCard>
        </Link>
      </div>
      {/* Pass a dummy function to onSelectPrompt to make it decorative */}
      <QuickStartBadges className="cursor-pointer" onSelectPrompt={() => {}} />
    </div>
  );
}
