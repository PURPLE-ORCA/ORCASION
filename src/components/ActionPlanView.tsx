"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { X, Copy, ArrowLeft, CheckSquare, Square } from "lucide-react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

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

  const toggleActionItem = useMutation(api.decisions.toggleActionItem);

  const handleToggleCheck = async (index: number) => {
    try {
      await toggleActionItem({
        decisionId,
        itemIndex: index,
      });
    } catch (error) {
      console.error("Failed to toggle action item:", error);
      toast.error("Failed to update action item");
    }
  };

  const handleCopy = () => {
    if (!decisionContext || !normalizedPlan) return;

    const planText = normalizedPlan
      .map((item, index) => `${index + 1}. ${item.text}`)
      .join("\n");

    const fullText = `ACTION PLAN\n====================\n${planText}`;
    navigator.clipboard.writeText(fullText);
    toast.success("Action plan copied to clipboard!");
  };

  if (!decisionContext) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 text-white">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { actionPlan } = decisionContext;

  // Normalize action plan items (handle both old string format and new object format)
  const normalizedPlan = actionPlan?.map((item) =>
    typeof item === "string"
      ? { text: item, completed: false, completedAt: undefined }
      : item
  );

  // Calculate progress
  const completedCount =
    normalizedPlan?.filter((item) => item.completed).length || 0;
  const totalCount = normalizedPlan?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-card text-gray-200 w-full h-full overflow-y-auto hide-scrollbar p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Action Plan</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSwitchToReport}
            title="Back to Report"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            title="Copy Plan"
          >
            <Copy className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close Panel"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      {normalizedPlan && normalizedPlan.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800/40 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300 font-medium">Progress</span>
            <span className="text-purple-400 font-bold">
              {completedCount}/{totalCount} completed
            </span>
          </div>
          <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-green-400 text-sm mt-2 font-medium animate-pulse">
              🎉 All done! Great work!
            </p>
          )}
        </div>
      )}

      {/* Checklist */}
      {normalizedPlan && normalizedPlan.length > 0 ? (
        <div className="space-y-4">
          <p className="text-gray-400">
            Here are the next steps to bring your decision to life. Check them
            off as you go!
          </p>
          <ul className="space-y-3">
            {normalizedPlan.map((item, index) => (
              <li
                key={index}
                onClick={() => handleToggleCheck(index)}
                className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  item.completed
                    ? "bg-gray-700/50 text-gray-500"
                    : "bg-gray-800/40 hover:bg-gray-800/70"
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-6 w-6 text-purple-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span
                    className={`transition-all duration-200 ${
                      item.completed ? "line-through" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.completedAt && (
                    <span className="text-xs text-gray-500 ml-2">
                      ✓ {new Date(item.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-800/40 rounded-lg">
          <p className="text-gray-400">
            No action plan has been generated for this decision yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionPlanView;
