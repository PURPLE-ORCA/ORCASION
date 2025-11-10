"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import SiriOrb from "@/components/ui/SiriOrb";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();
  const startDecision = useMutation(api.decisions.startDecision);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDecision = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const decisionId = await startDecision();
      router.push(`/decision/${decisionId}`);
    } catch (error) {
      console.error("Failed to start a new decision:", error);
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <SiriOrb />
        <p className="mt-4">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <SiriOrb />
      <h1 className="text-4xl font-bold my-8">Welcome to Orcasion</h1>
      <p className="text-lg text-center mb-8">
        Your personal AI assistant to help you make better decisions.
      </p>
      {isAuthenticated ? (
        <Button onClick={handleStartDecision} disabled={isLoading}>
          {isLoading ? "Creating..." : "Start New Decision"}
        </Button>
      ) : (
        <p>Please sign in to start a new decision.</p>
      )}
    </main>
  );
}