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
    <main className="flex h-screen w-full">
      <div className={`transition-all duration-300 ease-in-out ${showReport ? 'w-1/2' : 'w-full'}`}>
        <Chat
          showReport={showReport}
          setShowReport={setShowReport}
          decisionStatus={decision?.status}
        />
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${showReport ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}`}
      >
        <DecisionReport decisionId={decisionId} onClose={() => setShowReport(false)} />
      </div>
    </main>
  );
}
