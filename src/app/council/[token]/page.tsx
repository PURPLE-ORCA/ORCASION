"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, MessageSquare } from "lucide-react";

export default function CouncilPage() {
  const params = useParams();
  const token = params.token as string;

  const session = useQuery(api.council.getSession, { token });
  const submitVote = useMutation(api.council.submitVote);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voterName, setVoterName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  if (session === undefined) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a001a] to-[#0a0a0a] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a001a] to-[#0a0a0a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Session Not Found</h1>
          <p className="text-purple-300/60">
            This council session is invalid or has been closed.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selectedOption || !voterName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitVote({
        sessionId: session.sessionId,
        voterName: voterName,
        optionName: selectedOption,
        comment: comment,
      });
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to submit vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a001a] to-[#0a0a0a] text-white p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Vote Cast!</h2>
            <p className="text-purple-100">
              Thank you, <strong>{voterName}</strong>. Your wisdom has been
              recorded.
            </p>
            <p className="text-sm text-purple-300/60">
              The decision maker will see your advice in their report.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] via-[#1a001a] to-[#0a0a0a] text-white">
      <div className="min-h-full py-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto space-y-8 pb-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20">
              The Council is in Session
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              {session.title}
            </h1>
          </div>

          {/* Context */}
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200">The Dilemma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100/80 leading-relaxed">
                {session.reasoning}
              </p>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-200">
              Cast Your Vote
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {session.options.map((option: any) => (
                <div
                  key={option.name}
                  onClick={() => setSelectedOption(option.name)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === option.name
                      ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      : "border-purple-500/20 bg-black/40 hover:border-purple-500/40 hover:bg-black/60 backdrop-blur-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">
                      {option.name}
                    </h3>
                    {selectedOption === option.name && (
                      <CheckCircle2 className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-green-400 font-medium">Pros:</span>{" "}
                      <span className="text-purple-200/70">
                        {option.pros.join(", ")}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-red-400 font-medium">Cons:</span>{" "}
                      <span className="text-purple-200/70">
                        {option.cons.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voter Input */}
          {selectedOption && (
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200">
                    Your Name
                  </label>
                  <Input
                    placeholder="Who are you?"
                    value={voterName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVoterName(e.target.value)
                    }
                    className="bg-black/60 border-purple-500/30 text-white placeholder:text-purple-300/40 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200">
                    Advice / Comment (Optional)
                  </label>
                  <Textarea
                    placeholder="Why did you choose this option?"
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setComment(e.target.value)
                    }
                    className="bg-black/60 border-purple-500/30 text-white placeholder:text-purple-300/40 min-h-[100px] focus:border-purple-500"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!voterName.trim() || isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="h-5 w-5 mr-2" />
                  )}
                  Submit Vote
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
