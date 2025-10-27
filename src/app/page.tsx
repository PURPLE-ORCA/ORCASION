"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Chat from "@/components/Chat";
import { useEffect } from "react";
import { useConvexAuth } from "convex/react";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const decisions = useQuery(
    api.decisions.getDecisions,
    isAuthenticated ? undefined : { skip: true }
  );
  const createDecision = useMutation(api.decisions.createDecision);

  useEffect(() => {
    if (isAuthenticated && decisions && decisions.length === 0) {
      createDecision({ title: "New Decision" });
    }
  }, [isAuthenticated, decisions, createDecision]);

  const decisionId = decisions?.[0]?._id;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading && <div>Loading...</div>}
      {!isLoading && decisionId && <Chat decisionId={decisionId} />}
    </main>
  );
}
