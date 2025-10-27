"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Chat from "@/components/Chat";

export default function Home() {
  const decisions = useQuery(api.decisions.getDecisions);
  const createDecision = useMutation(api.decisions.createDecision);

  let decisionId: string | undefined;

  if (decisions && decisions.length > 0) {
    decisionId = decisions[0]._id;
  } else if (decisions && decisions.length === 0) {
    createDecision({ title: "New Decision" });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {decisionId ? (
        <Chat decisionId={decisionId} />
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
