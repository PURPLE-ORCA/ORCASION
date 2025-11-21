import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { X, Copy, ArrowLeft, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SimulationViewProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
  onSwitchToReport: () => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({
  decisionId,
  onClose,
  onSwitchToReport,
}) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });

  const handleCopy = () => {
    if (!decisionContext || !decisionContext.simulation) return;
    navigator.clipboard.writeText(decisionContext.simulation);
    // Consider adding a toast notification
  };

  if (!decisionContext) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 text-white">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { simulation } = decisionContext;

  return (
    <div className="bg-card text-gray-200 w-full h-full overflow-y-auto hide-scrollbar p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Future Simulation
          </h2>
        </div>
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
            title="Copy Simulation"
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

      {/* Content */}
      {simulation ? (
        <div className="prose prose-invert prose-purple max-w-none">
          <div className="bg-gray-800/40 p-6 rounded-lg border border-purple-500/20 shadow-lg shadow-purple-900/10">
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">
              Projected Timeline: +6 Months
            </p>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p
                    className="mb-4 text-lg leading-relaxed text-gray-200"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="text-purple-300 font-bold" {...props} />
                ),
              }}
            >
              {simulation}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-pink-500 animate-spin reverse-spin"></div>
          </div>
          <p className="text-purple-300 animate-pulse text-sm font-medium">
            Constructing timeline...
          </p>
        </div>
      )}
    </div>
  );
};

export default SimulationView;
