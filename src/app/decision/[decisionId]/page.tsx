"use client";

import Chat from "@/components/Chat";
import DecisionReport from "@/components/DecisionReport";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";

export default function DecisionPage() {
  const params = useParams();
  const decisionId = params.decisionId as Id<"decisions">;

  const decision = useQuery(
    api.decisions.getDecision,
    decisionId ? { decisionId } : "skip"
  );
  const decisionContext = useQuery(
    api.decision_context.getDecisionContext,
    decisionId ? { decisionId } : "skip"
  );

  if (!decision) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <p>Loading decision...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {decision.status === "completed" ? (
        <DecisionReport decisionId={decisionId} />
      ) : (
        <>
          <Chat />
          {decisionContext && <DecisionReport decisionId={decisionId} />}
        </>
      )}
    </main>
  );
}
