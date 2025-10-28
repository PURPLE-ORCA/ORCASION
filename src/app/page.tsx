"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import SiriOrb from "@/components/ui/SiriOrb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  // Correctly skip the query if the user is not authenticated.
  const decisions = useQuery(
    api.decisions.getDecisions,
    isAuthenticated ? undefined : "skip"
  );
  const startDecision = useMutation(api.decisions.startDecision);

  useEffect(() => {
    // If we have decisions, redirect to the first one.
    if (decisions && decisions.length > 0) {
      router.push(`/decision/${decisions[0]._id}`);
    }
  }, [decisions, router]);

  const handleStartDecision = async () => {
    const decisionId = await startDecision();
    router.push(`/decision/${decisionId}`);
  };

  // Main loading state
  if (isLoading || decisions === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <SiriOrb />
      </main>
    );
  }

  // If authenticated and there are no decisions, show the button.
  if (isAuthenticated && decisions.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Welcome to Orcasion</h2>
          <p>Click the button below to start your first decision.</p>
          <Button onClick={handleStartDecision}>Start New Decision</Button>
        </div>
      </main>
    );
  }

  // Fallback for logged-out users or other states.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SiriOrb />
    </main>
  );
}
