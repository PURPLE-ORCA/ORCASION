"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import AppLayout from "@/components/AppLayout";
import { ChatSkeleton } from "@/components/ChatSkeleton";
import { DecisionReportSkeleton } from "@/components/DecisionReportSkeleton";
import Chat from "@/components/Chat";
import DecisionReport from "@/components/DecisionReport";
import ActionPlanView from "@/components/ActionPlanView";
import SimulationView from "@/components/SimulationView";
import ContractView from "@/components/ContractView";
import CouncilReportView from "@/components/CouncilReportView";

type ActiveView =
  | "chat"
  | "report"
  | "actionPlan"
  | "simulation"
  | "contract"
  | "council";

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

  const [activeView, setActiveView] = useState<ActiveView>(() =>
    decision?.status === "completed" ? "report" : "chat"
  );

  const [hasAutoOpenedReport, setHasAutoOpenedReport] = useState(false);

  useEffect(() => {
    if (decision?.status === "completed" && !hasAutoOpenedReport) {
      setActiveView("report");
      setHasAutoOpenedReport(true);
    }
  }, [decision?.status, hasAutoOpenedReport]);

  const router = useRouter();

  useEffect(() => {
    if (decision === null) {
      router.push("/");
    }
  }, [decision, router]);

  if (decision === undefined || decisionContext === undefined) {
    return (
      <AppLayout>
        <div className="flex h-screen w-full">
          <div className="w-1/2">
            <ChatSkeleton />
          </div>
          <div className="w-1/2 border-l">
            <DecisionReportSkeleton />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (decision === null) {
    return (
      <AppLayout>
        <div className="flex h-screen w-full items-center justify-center">
          <p>Decision not found, redirecting...</p>
        </div>
      </AppLayout>
    );
  }

  const showPanel =
    activeView === "report" ||
    activeView === "actionPlan" ||
    activeView === "simulation" ||
    activeView === "contract" ||
    activeView === "council";

  return (
    <AppLayout>
      <div className="flex h-screen w-full">
        <div
          className={`transition-all duration-300 ease-in-out ${
            showPanel ? "w-1/2" : "w-full"
          }`}
        >
          <Chat
            showReport={showPanel}
            setShowReport={(show) => setActiveView(show ? "report" : "chat")}
            decisionStatus={decision?.status}
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden border-l border-gray-800 bg-gray-900 ${
            showPanel ? "w-1/2 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {activeView === "report" && (
            <DecisionReport
              decisionId={decisionId}
              onClose={() => setActiveView("chat")}
              onSwitchToActionPlan={() => setActiveView("actionPlan")}
              onSwitchToSimulation={() => setActiveView("simulation")}
              onSwitchToContract={() => setActiveView("contract")}
              onSwitchToCouncil={() => setActiveView("council")}
            />
          )}
          {activeView === "actionPlan" && (
            <ActionPlanView
              decisionId={decisionId}
              onClose={() => setActiveView("chat")}
              onSwitchToReport={() => setActiveView("report")}
            />
          )}
          {activeView === "simulation" && (
            <SimulationView
              decisionId={decisionId}
              onClose={() => setActiveView("chat")}
              onSwitchToReport={() => setActiveView("report")}
            />
          )}
          {activeView === "contract" && (
            <ContractView
              decisionId={decisionId}
              onClose={() => setActiveView("report")}
            />
          )}
          {activeView === "council" && (
            <CouncilReportView
              decisionId={decisionId}
              onClose={() => setActiveView("chat")}
              onSwitchToReport={() => setActiveView("report")}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
