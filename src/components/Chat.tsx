"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Message from "./Message";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import AnimatedInput from "./ui/AnimatedInput";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { ChatQuickStarts } from "./ChatQuickStarts";

export default function Chat({
  showReport,
  setShowReport,
  decisionStatus,
}: {
  showReport: boolean;
  setShowReport: (show: boolean) => void;
  decisionStatus?: "in-progress" | "completed" | "gathering-context";
}) {
  const params = useParams();
  const decisionId = params.decisionId as Id<"decisions">;

  const messages = useQuery(
    api.messages.listMessages,
    decisionId ? { decisionId } : "skip"
  );
  const [content, setContent] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showRateLimitBanner, setShowRateLimitBanner] = useState(false);
  const sendChatMessage = useAction(api.decisions.sendChatMessage);

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim()) {
      setContent(""); // Clear input immediately
      setIsAiThinking(true);
      try {
        await sendChatMessage({
          decisionId,
          content: messageContent,
        });
      } catch (error: any) {
        console.error("Error sending message:", error);
        if (error.message.includes("RATE_LIMIT_EXCEEDED")) {
          setShowRateLimitBanner(true);
        }
        // Optionally, add an error message to the chat UI
      } finally {
        setIsAiThinking(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendMessage(content);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Message
              key={message._id}
              message={message}
              decisionId={decisionId}
              onSuggestionClick={handleSendMessage}
              isLastMessage={index === messages.length - 1}
              showReport={showReport}
              setShowReport={setShowReport}
              decisionStatus={decisionStatus}
            />
          ))
        ) : (
          <ChatQuickStarts onSelectPrompt={handleSendMessage} />
        )}
      </div>
      <div className="p-4">
        {isAiThinking && (
          <div className="mb-4">
            <Reasoning isStreaming={true}>
              <ReasoningTrigger />
            </Reasoning>
          </div>
        )}
        {showRateLimitBanner && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <span>You exceeded your quota, please try again later.</span>
            <button
              onClick={() => setShowRateLimitBanner(false)}
              className="hover:text-red-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <AnimatedInput
            value={content}
            onChange={(value) => setContent(value)}
            label="Your message"
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
