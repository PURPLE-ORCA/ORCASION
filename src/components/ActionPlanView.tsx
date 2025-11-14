"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { X, Copy, ArrowLeft, CheckSquare, Square } from "lucide-react";
import { Separator } from "./ui/separator";

interface ActionPlanViewProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
  onSwitchToReport: () => void;
}

const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  decisionId,
  onClose,
  onSwitchToReport,
}) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });

  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const handleToggleCheck = (index: number) => {
    setCheckedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleCopy = () => {
    if (!decisionContext || !decisionContext.actionPlan) return;

    const { actionPlan } = decisionContext;
    const planText = actionPlan
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n");

    const fullText = `ACTION PLAN\n====================\n${planText}`;
    navigator.clipboard.writeText(fullText);
    // Consider adding a toast notification
  };

  if (!decisionContext) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 text-white">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { actionPlan } = decisionContext;

  return (
    <div className="bg-card text-gray-200 w-full h-full overflow-y-auto hide-scrollbar p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Action Plan</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onSwitchToReport} title="Back to Report">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Plan">
            <Copy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title="Close Panel">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Checklist */}
      {actionPlan && actionPlan.length > 0 ? (
        <div className="space-y-4">
          <p className="text-gray-400">
            Here are the next steps to bring your decision to life. Check them off as you go!
          </p>
          <ul className="space-y-3">
            {actionPlan.map((step, index) => (
              <li
                key={index}
                onClick={() => handleToggleCheck(index)}
                className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${checkedItems.includes(index)
                    ? "bg-gray-700/50 text-gray-500"
                    : "bg-gray-800/40 hover:bg-gray-800/70"
                }`}
              >
                {checkedItems.includes(index) ? (
                  <CheckSquare className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-6 w-6 text-purple-400 shrink-0 mt-0.5" />
                )}
                <span
                  className={`transition-all duration-200 ${checkedItems.includes(index) ? "line-through" : ""}`}
                >
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-800/40 rounded-lg">
          <p className="text-gray-400">No action plan has been generated for this decision yet.</p>
        </div>
      )}
    </div>
  );
};

export default ActionPlanView;
