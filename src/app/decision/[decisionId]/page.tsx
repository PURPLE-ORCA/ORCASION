"use client";

import Chat from "@/components/Chat";
import DecisionReport from "@/components/DecisionReport";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (decision?.status === "completed") {
      setShowReport(true);
    }
  }, [decision?.status]);

  if (!decision) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <p>Loading decision...</p>
      </main>
    );
  }

  return (
    <main className="flex bg-red-600h h-full w-full">
      <div className={`flex-1 flex flex-col ${showReport ? 'w-1/2' : 'w-full'}`}>
        <Chat />
      </div>
      {showReport && (
        <div className="w-1/2 flex flex-col">
          <DecisionReport decisionId={decisionId} onClose={() => setShowReport(false)} />
        </div>
      )}
    </main>
  );
}
