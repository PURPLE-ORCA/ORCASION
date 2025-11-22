import React from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { MagicCard } from "./ui/magicCard";
import ReactMarkdown from "react-markdown";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: string | null;
  isLoading: boolean;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  simulation,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 animate-in zoom-in-95 duration-300">
        <MagicCard
          className="w-full h-full flex flex-col bg-black/90 text-white"
          gradientColor="#9333ea"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Future Simulation
                </h2>
                <p className="text-xs text-gray-400">
                  Projected Timeline: +6 Months
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-t-2 border-pink-500 animate-spin reverse-spin"></div>
                </div>
                <p className="text-purple-300 animate-pulse text-sm font-medium">
                  Constructing timeline...
                </p>
              </div>
            ) : simulation ? (
              <div className="prose prose-invert prose-purple max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 text-lg leading-relaxed text-gray-200"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="text-purple-300 font-bold"
                        {...props}
                      />
                    ),
                  }}
                >
                  {simulation}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>No simulation available.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
            >
              Close Simulation
            </Button>
          </div>
        </MagicCard>
      </div>
    </div>
  );
};
