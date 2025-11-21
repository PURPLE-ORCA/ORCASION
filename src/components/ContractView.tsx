import React, { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PenTool, Printer, Loader2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import remarkGfm from "remark-gfm";

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

  const handleDownload = () => {
    if (!decisionContext?.commitmentContract) return;
    const blob = new Blob([decisionContext.commitmentContract], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commitment-contract-${decisionId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!decisionContext) return <div>Loading...</div>;

  return (
    <div className="h-full flex flex-col bg-stone-50 p-6 overflow-y-auto print:overflow-visible print:h-auto print:bg-white print:p-0">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button variant="ghost" onClick={onClose} className="text-stone-600">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
        </Button>
        <div className="flex gap-2">
          {decisionContext.commitmentContract && (
            <>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="text-black hover:text-black"
              >
                <Download className="h-4 w-4 mr-2 text-black" /> Download MD
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="text-black hover:text-black"
              >
                <Printer className="h-4 w-4 mr-2 text-black" /> Print / Save PDF
              </Button>
            </>
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
        <div className="max-w-3xl mx-auto w-full relative print:static print:max-w-none print:w-full">
          <Card
            id="printable-contract"
            className="border-4 border-double border-stone-300 bg-[#fdfbf7] shadow-xl print:shadow-none print:border-none"
          >
            <CardContent className="p-12 print:p-8">
              <div className="w-full overflow-hidden print:overflow-visible">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-3xl font-bold font-serif text-stone-900 mb-4 mt-6 break-words"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-bold font-serif text-stone-900 mb-3 mt-5 break-words"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-bold font-serif text-stone-900 mb-2 mt-4 break-words"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="text-stone-800 mb-4 leading-relaxed font-serif text-lg break-words whitespace-pre-wrap"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-6 mb-4 text-stone-800 font-serif space-y-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-6 mb-4 text-stone-800 font-serif space-y-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-1 break-words" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-stone-900" {...props} />
                    ),
                  }}
                >
                  {decisionContext.commitmentContract
                    ?.replace(/```markdown/g, "")
                    .replace(/```/g, "")}
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
          }

          /* Hide the print button and other UI explicitly */
          .print\\:hidden {
            display: none !important;
          }

          /* Show the contract and its children */
          #printable-contract,
          #printable-contract * {
            visibility: visible;
          }

          /* Position the contract at the very top */
          #printable-contract {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px; /* Add padding for paper margins */
            background: white !important;
            box-shadow: none !important;
            border: none !important;
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
