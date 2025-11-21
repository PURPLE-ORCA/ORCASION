import React, { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PenTool, Printer, Loader2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";

interface ContractViewProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
}

export default function ContractView({
  decisionId,
  onClose,
}: ContractViewProps) {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });
  const generateContract = useAction(api.ai.generateCommitmentContract);
  const signContract = useMutation(api.decisions.signContract);
  const user = useQuery(api.users.getCurrentUser);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!decisionContext || !user) return;
    setIsGenerating(true);
    try {
      await generateContract({
        decisionId,
        decisionContext: {
          finalChoice: decisionContext.finalChoice,
          reasoning: decisionContext.reasoning,
          userName: user.name,
        },
      });
    } catch (error) {
      console.error("Failed to generate contract:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSign = async () => {
    await signContract({ decisionId });
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#000000", "#ffffff"], // Gold, Black, White
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!decisionContext) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col bg-stone-50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button variant="ghost" onClick={onClose} className="text-stone-600">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
        </Button>
        <div className="flex gap-2">
          {decisionContext.commitmentContract && (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print / Save PDF
            </Button>
          )}
        </div>
      </div>

      {!decisionContext.commitmentContract ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-serif font-bold text-stone-800">
              Seal the Deal
            </h2>
            <p className="text-stone-600">
              Ready to make it official? Generate a binding(ish) contract to
              cement your commitment to{" "}
              <strong>{decisionContext.finalChoice}</strong>.
            </p>
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-stone-800 hover:bg-stone-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Drafting
                  Legalese...
                </>
              ) : (
                <>
                  <PenTool className="h-4 w-4 mr-2" /> Draft Contract
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full relative">
          <Card className="border-4 border-double border-stone-300 bg-[#fdfbf7] shadow-xl print:shadow-none print:border-2 print:border-black">
            <CardContent className="p-12 print:p-0">
              <div className="prose prose-stone max-w-none font-serif text-stone-900 prose-headings:text-stone-900 prose-p:text-stone-800 prose-strong:text-stone-900 prose-li:text-stone-800">
                <ReactMarkdown>
                  {decisionContext.commitmentContract}
                </ReactMarkdown>
              </div>

              <div className="mt-12 pt-8 border-t-2 border-stone-200 print:border-black">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="font-serif italic text-lg">
                      Signed this day,
                    </p>
                    {decisionContext.isSigned ? (
                      <div className="relative">
                        <p className="font-script text-4xl text-blue-900 transform -rotate-2 px-4 py-2 border-b-2 border-black inline-block min-w-[200px]">
                          {user?.name}
                        </p>
                        <div className="absolute -top-4 -right-12 border-4 border-red-700 text-red-700 rounded-full p-2 transform rotate-12 opacity-80 font-bold text-xl uppercase tracking-widest border-double">
                          SIGNED
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-12 border-b-2 border-black w-64"></div>
                        <Button
                          onClick={handleSign}
                          className="print:hidden bg-blue-900 hover:bg-blue-800 text-white"
                        >
                          <PenTool className="h-4 w-4 mr-2" /> Sign Here
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="text-center opacity-50 print:hidden">
                    <div className="w-24 h-24 border-4 border-stone-300 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xs font-bold uppercase text-stone-400">
                        Official Seal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .card,
          .card * {
            visibility: visible;
          }
          .card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
        }
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@700&display=swap");
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .font-script {
          font-family: "Dancing Script", cursive;
        }
      `}</style>
    </div>
  );
}
