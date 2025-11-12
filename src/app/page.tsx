"use client";

import LandingPage from "@/components/LandingPage";
import AppLayout from "@/components/AppLayout";
import GuestLayout from "@/components/GuestLayout";
import { Button } from "@/components/ui/button";
import SiriOrb from "@/components/ui/SiriOrb";
import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();
  const createDecision = useMutation(api.decisions.createDecision);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDecision = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const decisionId = await createDecision({ title: "New Decision" });
      router.push(`/decision/${decisionId}`);
    } catch (error) {
      console.error("Failed to create a new decision:", error);
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center">
        <SiriOrb />
        <p className="mt-4">Loading...</p>
      </main>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AppLayout>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <SiriOrb />
            <h1 className="text-4xl font-bold my-8">Welcome to Orcasion</h1>
            <p className="text-lg text-center mb-8">
              Your personal AI assistant to help you make better decisions.
            </p>
            <Button onClick={handleCreateDecision} disabled={isLoading}>
              {isLoading ? "Creating..." : "Start New Decision"}
            </Button>
          </div>
        </AppLayout>
      ) : (
        <GuestLayout>
          <LandingPage />
        </GuestLayout>
      )}
    </>
  );
}