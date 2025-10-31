"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import SiriOrb from "@/components/ui/SiriOrb";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();
  const startDecision = useMutation(api.decisions.startDecision);

  useEffect(() => {
    // If the user is authenticated and finished loading, create a new decision.
    if (isAuthenticated && !isAuthLoading) {
      const createNewDecision = async () => {
        try {
          const decisionId = await startDecision();
          router.push(`/decision/${decisionId}`);
        } catch (error) {
          console.error("Failed to start a new decision:", error);
        }
      };
      createNewDecision();
    }
  }, [isAuthenticated, isAuthLoading, startDecision, router]);

  // Display a loading state while checking auth or creating a new decision.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <SiriOrb />
      <p className="mt-4">Creating new decision...</p>
    </main>
  );
}