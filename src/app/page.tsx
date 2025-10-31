"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import SiriOrb from "@/components/ui/SiriOrb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();

  // This query will only run if isAuthenticated is true.
  const decisions = useQuery(
    api.decisions.getDecisions,
    isAuthenticated ? undefined : "skip"
  );
  const startDecision = useMutation(api.decisions.startDecision);

  useEffect(() => {
    // If the query has run and we have at least one decision, redirect.
    if (decisions && decisions.length > 0) {
      router.push(`/decision/${decisions[0]._id}`);
    }
    // This effect should only re-run if the decisions array or router changes.
  }, [decisions, router]);

  const handleStartDecision = async () => {
    try {
      const decisionId = await startDecision();
      router.push(`/decision/${decisionId}`);
    } catch (error) {
      console.error("Failed to start a new decision:", error);
      // Optionally, show an error message to the user.
    }
  };

  // 1. Primary Loading State: Waiting for authentication to resolve.
  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <SiriOrb />
        <p className="mt-4">Signing in...</p>
      </main>
    );
  }

  // 2. Authenticated User Flow
  if (isAuthenticated) {
    // Still waiting for the decisions query to load after auth.
    if (decisions === undefined) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center">
          <SiriOrb />
          <p className="mt-4">Loading your decisions...</p>
        </main>
      );
    }

    // The user has no decisions, prompt them to start one.
    if (decisions.length === 0) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Welcome to Orcasion</h2>
            <p>Click the button below to start your first decision.</p>
            <Button onClick={handleStartDecision}>Start New Decision</Button>
          </div>
        </main>
      );
    }
  }

  // 3. Fallback/Default State (e.g., for unauthenticated users after loading)
  // This will also be shown briefly while the useEffect redirect is happening.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SiriOrb />
    </main>
  );
}
