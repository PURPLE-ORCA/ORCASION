"use client";

import Chat from "@/components/Chat";
import DecisionReport from "@/components/DecisionReport";
import ActionPlanView from "@/components/ActionPlanView"; // To be created
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";

import { ChatSkeleton } from '@/components/ChatSkeleton';
import { DecisionReportSkeleton } from '@/components/DecisionReportSkeleton';

type ActiveView = 'chat' | 'report' | 'actionPlan';

export default function DecisionPage() {
  const params = useParams();
  const decisionId = params.decisionId as Id<'decisions'>;

  const decision = useQuery(
    api.decisions.getDecision,
    decisionId ? { decisionId } : 'skip'
  );
  const decisionContext = useQuery(
    api.decision_context.getDecisionContext,
    decisionId ? { decisionId } : 'skip'
  );

  const [activeView, setActiveView] = useState<ActiveView>(() =>
    decision?.status === 'completed' ? 'report' : 'chat'
  );

  const [hasAutoOpenedReport, setHasAutoOpenedReport] = useState(false);

  useEffect(() => {
    if (decision?.status === 'completed' && !hasAutoOpenedReport) {
      setActiveView('report');
      setHasAutoOpenedReport(true);
    }
  }, [decision?.status, hasAutoOpenedReport]);

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
      <main className="flex h-screen flex-col items-center justify-center">
        <p>Decision not found.</p>
      </main>
    );
  }

  const showPanel = activeView === 'report' || activeView === 'actionPlan';

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
            setShowReport={(show) => setActiveView(show ? 'report' : 'chat')}
            decisionStatus={decision?.status}
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showPanel ? "w-1/2 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {activeView === 'report' && (
            <DecisionReport
              decisionId={decisionId}
              onClose={() => setActiveView('chat')}
              onSwitchToActionPlan={() => setActiveView('actionPlan')}
            />
          )}
          {activeView === 'actionPlan' && (
            <ActionPlanView
              decisionId={decisionId}
              onClose={() => setActiveView('chat')}
              onSwitchToReport={() => setActiveView('report')}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
