"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Message from "./Message";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import AnimatedInput from "./ui/AnimatedInput";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";

export default function Chat() {
  const params = useParams();
  const decisionId = params.decisionId as Id<"decisions">;

  const messages = useQuery(
    api.messages.listMessages,
    decisionId ? { decisionId } : "skip"
  );
  const [content, setContent] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const addMessage = useMutation(api.messages.addMessage);
  const getAiResponse = useAction(api.ai.getAiResponse);
  const summarizeDecisionTitle = useAction(api.ai.summarizeDecisionTitle);

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim()) {
      setIsAiThinking(true);
      try {
        // Check the number of user messages *before* adding the new one.
        const userMessages = messages?.filter((m) => m.sender === "user") || [];
        const isAboutToSendSecondUserMessage = userMessages.length === 1;

        await addMessage({
          decisionId,
          content: messageContent,
          sender: "user",
        });

        await getAiResponse({
          decisionId,
        });

        // If the user is about to send their second message, trigger title summarization.
        if (isAboutToSendSecondUserMessage) {
          await summarizeDecisionTitle({
            decisionId,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsAiThinking(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendMessage(content);
    setContent("");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {messages?.map((message) => (
          <Message
            key={message._id}
            message={message}
            decisionId={decisionId}
            onSuggestionClick={handleSendMessage}
          />
        ))}
      </div>
      <div className="p-4">
        {isAiThinking && (
          <div className="mb-4">
            <Reasoning isStreaming={true}>
              <ReasoningTrigger />
            </Reasoning>
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
