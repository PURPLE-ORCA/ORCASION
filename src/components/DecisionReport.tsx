"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, XCircle, Copy, Rocket, ArrowRight } from "lucide-react";
import { Separator } from "./ui/separator";

interface DecisionReportProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
  onSwitchToActionPlan: () => void;
}

const DecisionReport: React.FC<DecisionReportProps> = ({
  decisionId,
  onClose,
  onSwitchToActionPlan,
}) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });
  const generateActionPlan = useAction(api.decision_context.generateActionPlan);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const handleActionPlanClick = async () => {
    if (decisionContext?.actionPlan && decisionContext.actionPlan.length > 0) {
      onSwitchToActionPlan();
      return;
    }

    setIsLoadingPlan(true);
    try {
      await generateActionPlan({ decisionId });
      onSwitchToActionPlan(); // Switch view after successful generation
    } catch (error) {
      console.error("Failed to generate action plan:", error);
      // Optionally, show an error to the user
    } finally {
      setIsLoadingPlan(false);
    }
  };

  if (!decisionContext) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 text-white">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { finalChoice, confidenceScore, reasoning, options, criteria, actionPlan } =
    decisionContext;

  const handleCopy = () => {
    if (!decisionContext) return;

    const { finalChoice, confidenceScore, reasoning, options, criteria, actionPlan } =
      decisionContext;

    const reportParts = [
      "DECISION BRIEFING",
      "====================",
      `Recommendation: ${finalChoice}`,
      `Confidence: ${(confidenceScore * 100).toFixed(0)}%`,
      `\nReasoning:\n${reasoning}`,
      "\nYOUR PRIORITIES",
      "--------------------",
      ...criteria.map(
        (c) => `${c.name} - ${(c.weight * 100).toFixed(0)}%`
      ),
      "\nOPTIONS ANALYSIS",
      "--------------------",
    ];

    options.forEach((option) => {
      reportParts.push(
        `\nOption: ${option.name} (Score: ${option.score.toFixed(2)})`
      );
      reportParts.push("Pros:");
      reportParts.push(...option.pros.map((pro) => `  + ${pro}`));
      reportParts.push("Cons:");
      reportParts.push(...option.cons.map((con) => `  - ${con}`));
    });

    if (actionPlan && actionPlan.length > 0) {
        reportParts.push("\nACTION PLAN", "--------------------");
        reportParts.push(...actionPlan.map((step, index) => `${index + 1}. ${step}`));
    }

    const fullReportText = reportParts.join("\n");
    navigator.clipboard.writeText(fullReportText);
    // Consider adding a toast notification for better UX
  };

  const hasActionPlan = actionPlan && actionPlan.length > 0;

  return (
    <div className="bg-card text-gray-200 w-full h-full overflow-y-auto hide-scrollbar p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Decision Briefing</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleActionPlanClick}
            disabled={isLoadingPlan}
          >
            {isLoadingPlan ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : hasActionPlan ? (
              <ArrowRight className="h-4 w-4 mr-2" />
            ) : (
              <Rocket className="h-4 w-4 mr-2" />
            )}
            {isLoadingPlan ? "Generating..." : hasActionPlan ? "View Action Plan" : "Generate Action Plan"}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Section 1: The Verdict */}
      <div className="bg-gray-800/40 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Recommendation</p>
            <p className="text-3xl font-bold text-white">{finalChoice}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Confidence</p>
            <p className="text-3xl font-bold text-green-400">
              {(confidenceScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <Separator className="my-4 bg-gray-700" />
        <p className="text-gray-300">{reasoning}</p>
      </div>

      {/* Section 2: Your Priorities */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-white">Your Priorities</h3>
        <div className="flex flex-wrap gap-2">
          {criteria.map((criterion, index) => (
            <div
              key={index}
              className="bg-gray-700/50 text-gray-300 text-sm font-medium px-3 py-1 rounded-full"
            >
              {criterion.name} - {(criterion.weight * 100).toFixed(0)}%
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Options Analysis */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Options Analysis</h3>
        <div className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="bg-gray-800/40 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-bold text-white">{option.name}</p>
                <p className="text-md font-semibold text-purple-300">
                  Score: {option.score.toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros */}
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Cons */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {option.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 mt-0.5 text-red-500 hrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecisionReport;