"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  X,
  CheckCircle2,
  XCircle,
  Copy,
  Rocket,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  FastForward,
  Flame,
  Scroll,
  Loader2,
} from "lucide-react";
import { Separator } from "./ui/separator";

interface DecisionReportProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
  onSwitchToActionPlan: () => void;
  onSwitchToSimulation: () => void;
  onSwitchToContract: () => void;
}

const DecisionReport: React.FC<DecisionReportProps> = ({
  decisionId,
  onClose,
  onSwitchToActionPlan,
  onSwitchToSimulation,
  onSwitchToContract,
}) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });
  const generateActionPlan = useAction(api.decision_context.generateActionPlan);
  const generateSimulation = useAction(api.ai.generateSimulation);
  const generateDevilsAdvocate = useAction(api.ai.generateDevilsAdvocate);

  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isGeneratingSimulation, setIsGeneratingSimulation] = useState(false);
  const [isGeneratingDevilsAdvocate, setIsGeneratingDevilsAdvocate] =
    useState(false);

  const isActionPlanReady =
    !!decisionContext?.finalChoice && !!decisionContext?.reasoning;

  const handleActionPlanClick = async () => {
    if (decisionContext?.actionPlan && decisionContext.actionPlan.length > 0) {
      onSwitchToActionPlan();
      return;
    }

    if (!isActionPlanReady) {
      console.log(
        "Decision context is not ready for generating an action plan."
      );
      return;
    }

    setIsLoadingPlan(true);
    try {
      await generateActionPlan({ decisionId });
      onSwitchToActionPlan();
    } catch (error) {
      console.error("Failed to generate action plan:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleSimulationClick = async () => {
    if (decisionContext?.simulation) {
      onSwitchToSimulation();
      return;
    }

    if (!decisionContext) return;

    setIsGeneratingSimulation(true);

    try {
      await generateSimulation({
        decisionId,
        decisionContext: {
          finalChoice: decisionContext.finalChoice,
          reasoning: decisionContext.reasoning,
          options: decisionContext.options,
        },
      });
      onSwitchToSimulation();
    } catch (error) {
      console.error("Failed to generate simulation:", error);
    } finally {
      setIsGeneratingSimulation(false);
    }
  };

  const handleDevilsAdvocateClick = async () => {
    if (decisionContext?.devilsAdvocate) {
      // Scroll to section? Or just toggle?
      // For now, we assume it's already visible if it exists.
      return;
    }

    if (!decisionContext) return;

    setIsGeneratingDevilsAdvocate(true);

    try {
      await generateDevilsAdvocate({
        decisionId,
        decisionContext: {
          finalChoice: decisionContext.finalChoice,
          reasoning: decisionContext.reasoning,
          options: decisionContext.options,
        },
      });
    } catch (error) {
      console.error("Failed to generate devil's advocate:", error);
    } finally {
      setIsGeneratingDevilsAdvocate(false);
    }
  };

  if (!decisionContext) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 text-white">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    finalChoice,
    confidenceScore,
    reasoning,
    options,
    criteria,
    actionPlan,
    primaryRisk,
    hiddenOpportunity,
  } = decisionContext;

  const handleCopy = () => {
    if (!decisionContext) return;

    const reportParts = [
      "DECISION BRIEFING",
      "====================",
      `Recommendation: ${finalChoice}`,
      `Confidence: ${(confidenceScore * 100).toFixed(0)}%`,
      `\nReasoning:\n${reasoning}`,
    ];

    if (primaryRisk) {
      reportParts.push(`\nPrimary Risk: ${primaryRisk}`);
    }
    if (hiddenOpportunity) {
      reportParts.push(`Hidden Opportunity: ${hiddenOpportunity}`);
    }

    reportParts.push(
      "\nYOUR PRIORITIES",
      "--------------------",
      ...criteria.map((c) => `${c.name} - ${(c.weight * 100).toFixed(0)}%`),
      "\nOPTIONS ANALYSIS",
      "--------------------"
    );

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
      reportParts.push(
        ...actionPlan.map((step, index) => `${index + 1}. ${step}`)
      );
    }

    const fullReportText = reportParts.join("\n");
    navigator.clipboard.writeText(fullReportText);
  };

  const hasActionPlan = actionPlan && actionPlan.length > 0;
  const isButtonDisabled =
    isLoadingPlan || (!hasActionPlan && !isActionPlanReady);

  return (
    <div className="bg-card text-gray-200 w-full h-full overflow-y-auto hide-scrollbar p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-400">
          Decision Briefing
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDevilsAdvocateClick}
            className="border-red-500/50 text-red-300 hover:bg-red-500/10 hover:text-red-200"
            disabled={
              isGeneratingDevilsAdvocate || !!decisionContext?.devilsAdvocate
            }
          >
            {isGeneratingDevilsAdvocate ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Flame className="h-4 w-4 mr-2" />
            )}
            {isGeneratingDevilsAdvocate ? "Thinking..." : "Challenge This"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulationClick}
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            disabled={isGeneratingSimulation}
          >
            {isGeneratingSimulation ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FastForward className="h-4 w-4 mr-2" />
            )}
            {isGeneratingSimulation ? "Simulating..." : "Fast Forward"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchToContract}
            className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
          >
            <Scroll className="h-4 w-4 mr-2" />
            Commit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleActionPlanClick}
            disabled={isButtonDisabled}
          >
            {isLoadingPlan ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : hasActionPlan ? (
              <ArrowRight className="h-4 w-4 mr-2" />
            ) : (
              <Rocket className="h-4 w-4 mr-2" />
            )}
            {isLoadingPlan
              ? "Generating..."
              : hasActionPlan
              ? "View Action Plan"
              : "Generate Action Plan"}
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

      {/* Devil's Advocate Section */}
      {decisionContext.devilsAdvocate && (
        <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-lg mb-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-bold text-red-400">The Skeptic</h3>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 italic border-l-4 border-red-500/50 pl-4">
              {decisionContext.devilsAdvocate}
            </p>
          </div>
        </div>
      )}

      {/* Your Priorities */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-white">
          Your Priorities
        </h3>
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
        <h3 className="text-xl font-semibold mb-4 text-white">
          Options Analysis
        </h3>
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

      {/* Strategic Insights */}
      {(primaryRisk || hiddenOpportunity) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {primaryRisk && (
            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold">Primary Risk</h3>
              </div>
              <p className="text-sm text-gray-300">{primaryRisk}</p>
            </div>
          )}
          {hiddenOpportunity && (
            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-semibold">Hidden Opportunity</h3>
              </div>
              <p className="text-sm text-gray-300">{hiddenOpportunity}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionReport;
