"use client";

import React, { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
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
  Sparkles,
  Download,
  MessageCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface DecisionReportProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
  onSwitchToActionPlan: () => void;
  onSwitchToSimulation: () => void;
  onSwitchToContract: () => void;
  onSwitchToCouncil: () => void;
}

const DecisionReport: React.FC<DecisionReportProps> = ({
  decisionId,
  onClose,
  onSwitchToActionPlan,
  onSwitchToSimulation,
  onSwitchToContract,
  onSwitchToCouncil,
}) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });
  const generateActionPlan = useAction(api.decision_context.generateActionPlan);
  const generateSimulation = useAction(api.ai.generateSimulation);
  const generateDevilsAdvocate = useAction(api.ai.generateDevilsAdvocate);
  const generateRedditScout = useAction(api.ai.generateRedditScout);

  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isGeneratingSimulation, setIsGeneratingSimulation] = useState(false);
  const [isGeneratingDevilsAdvocate, setIsGeneratingDevilsAdvocate] =
    useState(false);
  const [isGeneratingRedditScout, setIsGeneratingRedditScout] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const createSession = useMutation(api.council.createSession);
  const councilVotes = useQuery(api.council.getVotes, { decisionId });

  const handleShareCouncil = async () => {
    // If votes exist, switch to council view
    if (councilVotes && councilVotes.length > 0) {
      onSwitchToCouncil();
      return;
    }

    // Otherwise, create session and copy link
    setIsCreatingSession(true);
    try {
      const token = await createSession({ decisionId });
      const url = `${window.location.origin}/council/${token}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", {
        description: "Share it with friends to gather their wisdom 🧙‍♂️",
        duration: 4000,
      });
    } catch (error) {
      console.error("Failed to create council session:", error);
      toast.error("Failed to create link", {
        description: "Please try again",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

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

  const handleRedditScoutClick = async () => {
    if (decisionContext?.redditScout) {
      return;
    }

    if (!decisionContext) return;

    setIsGeneratingRedditScout(true);

    try {
      await generateRedditScout({
        decisionId,
        decisionContext: {
          finalChoice: decisionContext.finalChoice,
          reasoning: decisionContext.reasoning,
          options: decisionContext.options,
        },
      });
    } catch (error) {
      console.error("Failed to scout Reddit:", error);
    } finally {
      setIsGeneratingRedditScout(false);
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

  const generateReportText = () => {
    if (!decisionContext) return "";

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

    return reportParts.join("\n");
  };

  const generateMarkdownReport = () => {
    if (!decisionContext) return "";

    const reportParts = [
      "# Decision Briefing",
      "",
      `**Recommendation:** ${finalChoice}`,
      `**Confidence:** ${(confidenceScore * 100).toFixed(0)}%`,
      "",
      "## Reasoning",
      reasoning,
      "",
    ];

    if (primaryRisk) {
      reportParts.push(`**Primary Risk:** ${primaryRisk}`, "");
    }
    if (hiddenOpportunity) {
      reportParts.push(`**Hidden Opportunity:** ${hiddenOpportunity}`, "");
    }

    reportParts.push("## Your Priorities");
    criteria.forEach((c) => {
      reportParts.push(`- **${c.name}**: ${(c.weight * 100).toFixed(0)}%`);
    });
    reportParts.push("");

    reportParts.push("## Options Analysis");
    options.forEach((option) => {
      reportParts.push(
        `### ${option.name} (Score: ${option.score.toFixed(2)})`
      );
      reportParts.push("**Pros:**");
      option.pros.forEach((pro) => reportParts.push(`- ${pro}`));
      reportParts.push("**Cons:**");
      option.cons.forEach((con) => reportParts.push(`- ${con}`));
      reportParts.push("");
    });

    if (actionPlan && actionPlan.length > 0) {
      reportParts.push("## Action Plan");
      actionPlan.forEach((step, index) => {
        reportParts.push(`${index + 1}. ${step}`);
      });
    }

    return reportParts.join("\n");
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateReportText());
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([generateMarkdownReport()], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decision-report-${decisionId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const hasActionPlan = actionPlan && actionPlan.length > 0;
  const isButtonDisabled =
    isLoadingPlan || (!hasActionPlan && !isActionPlanReady);

  return (
    <div
      id="printable-report"
      className="bg-card text-gray-200 w-full h-full overflow-y-auto hide-scrollbar p-6 print:bg-white print:text-black print:overflow-visible print:h-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-purple-400">
          Decision Briefing
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleActionPlanClick}
            disabled={isButtonDisabled}
            className="mr-2"
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
              >
                {isGeneratingDevilsAdvocate || isGeneratingSimulation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-900 border-gray-800 text-gray-200"
            >
              <DropdownMenuItem
                onClick={handleDevilsAdvocateClick}
                disabled={
                  isGeneratingDevilsAdvocate ||
                  !!decisionContext?.devilsAdvocate
                }
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                {isGeneratingDevilsAdvocate ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Flame className="h-4 w-4 mr-2 text-red-400" />
                )}
                <span>Challenge This</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSimulationClick}
                disabled={isGeneratingSimulation}
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                {isGeneratingSimulation ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FastForward className="h-4 w-4 mr-2 text-purple-400" />
                )}
                <span>Fast Forward</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onSwitchToContract}
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                <Scroll className="h-4 w-4 mr-2 text-amber-400" />
                <span>Commit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareCouncil}>
                {isCreatingSession ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : councilVotes && councilVotes.length > 0 ? (
                  <Users className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <Users className="mr-2 h-4 w-4" />
                )}
                {councilVotes && councilVotes.length > 0
                  ? `View Council (${councilVotes.length})`
                  : "Ask The Council"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRedditScoutClick}>
                {isGeneratingRedditScout ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="mr-2 h-4 w-4" />
                )}
                What does Reddit say?
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Download className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-gray-900 border-gray-800 text-gray-200"
            >
              <DropdownMenuItem
                onClick={handleDownloadMarkdown}
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                Download MD
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDownloadPDF}
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Copy className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-gray-900 border-gray-800 text-gray-200"
            >
              <DropdownMenuItem
                onClick={handleCopyMarkdown}
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                Copy MD
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleCopyText}
                className="cursor-pointer focus:bg-gray-800 focus:text-gray-100"
              >
                Copy Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Section 1: The Verdict */}
      <div className="bg-gray-800/40 p-6 rounded-lg mb-8 print:bg-white print:border print:border-gray-300 print:text-black">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 print:text-gray-600">
              Recommendation
            </p>
            <p className="text-3xl font-bold text-white print:text-black">
              {finalChoice}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 print:text-gray-600">
              Confidence
            </p>
            <p className="text-3xl font-bold text-green-400 print:text-black">
              {(confidenceScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <Separator className="my-4 bg-gray-700 print:bg-gray-300" />
        <p className="text-gray-300 print:text-black">{reasoning}</p>
      </div>

      {/* Devil's Advocate Section */}
      {decisionContext.devilsAdvocate && (
        <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-lg mb-8 animate-in fade-in slide-in-from-bottom-4 print:bg-white print:border-gray-300 print:text-black">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-6 w-6 text-red-500 print:text-black" />
            <h3 className="text-xl font-bold text-red-400 print:text-black">
              The Skeptic
            </h3>
          </div>
          <div className="prose prose-invert max-w-none print:prose-gray">
            <p className="text-gray-300 italic border-l-4 border-red-500/50 pl-4 print:text-black print:border-gray-400">
              {decisionContext.devilsAdvocate}
            </p>
          </div>
        </div>
      )}

      {/* Your Priorities */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-white print:text-black">
          Your Priorities
        </h3>
        <div className="flex flex-wrap gap-2">
          {criteria.map((criterion, index) => (
            <div
              key={index}
              className="bg-gray-700/50 text-gray-300 text-sm font-medium px-3 py-1 rounded-full print:bg-gray-100 print:text-black print:border print:border-gray-300"
            >
              {criterion.name} - {(criterion.weight * 100).toFixed(0)}%
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Options Analysis */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white print:text-black">
          Options Analysis
        </h3>
        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="bg-gray-800/40 p-4 rounded-lg print:bg-white print:border print:border-gray-300 print:text-black print:break-inside-avoid"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-bold text-white print:text-black">
                  {option.name}
                </p>
                <p className="text-md font-semibold text-purple-300 print:text-black">
                  Score: {option.score.toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros */}
                <div>
                  <h4 className="font-semibold text-green-400 mb-2 print:text-black">
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0 print:text-black" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Cons */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-2 print:text-black">
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {option.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0 print:text-black" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 print:break-inside-avoid">
          {primaryRisk && (
            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg print:bg-white print:border-gray-300 print:text-black">
              <div className="flex items-center gap-2 mb-2 text-red-400 print:text-black">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold">Primary Risk</h3>
              </div>
              <p className="text-sm text-gray-300 print:text-black">
                {primaryRisk}
              </p>
            </div>
          )}
          {hiddenOpportunity && (
            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg print:bg-white print:border-gray-300 print:text-black">
              <div className="flex items-center gap-2 mb-2 text-blue-400 print:text-black">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-semibold">Hidden Opportunity</h3>
              </div>
              <p className="text-sm text-gray-300 print:text-black">
                {hiddenOpportunity}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reddit Scout Section */}
      <div className="mt-8 print:break-inside-avoid">
        {!decisionContext.redditScout ? (
          <Button
            variant="outline"
            onClick={handleRedditScoutClick}
            disabled={isGeneratingRedditScout}
            className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
          >
            {isGeneratingRedditScout ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MessageCircle className="h-4 w-4 mr-2" />
            )}
            {isGeneratingRedditScout
              ? "Scouting Reddit..."
              : "What does Reddit say?"}
          </Button>
        ) : (
          <div className="bg-orange-950/30 border border-orange-900/50 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4 print:bg-white print:border-gray-300 print:text-black">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-orange-500 print:text-black" />
                <h3 className="text-xl font-bold text-orange-400 print:text-black">
                  The Internet's Verdict
                </h3>
              </div>
              <a
                href={decisionContext.redditScout.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-400/70 hover:text-orange-400 flex items-center gap-1 print:hidden"
              >
                View Thread <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-orange-500/80 uppercase tracking-wider mb-1 print:text-black">
                  Consensus
                </h4>
                <p className="text-gray-300 print:text-black">
                  {decisionContext.redditScout.consensus}
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded border-l-2 border-orange-500/50 print:bg-gray-100 print:border-gray-400">
                <h4 className="text-xs font-semibold text-orange-500/80 uppercase tracking-wider mb-1 print:text-black">
                  Top Vibe
                </h4>
                <p className="text-gray-300 italic print:text-black">
                  "{decisionContext.redditScout.topComment}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }

          /* Reset constraints on main containers to prevent clipping */
          html,
          body,
          #root,
          main {
            overflow: visible !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }

          /* Hide the print button and other UI explicitly */
          .print\\:hidden {
            display: none !important;
          }

          /* Show the report and its children */
          #printable-report,
          #printable-report * {
            visibility: visible;
          }

          /* Position the report at the very top */
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px; /* Add padding for paper margins */
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DecisionReport;
