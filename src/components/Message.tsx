"use client";

import { Doc } from "../../convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";

export default function Message({
  message,
  decisionId,
  onSuggestionClick,
  isLastMessage,
  showReport,
  setShowReport,
  decisionStatus,
}: {
  message: Doc<"decision_messages"> & { imageUrl?: string };
  decisionId: string;
  onSuggestionClick: (content: string) => void;
  isLastMessage: boolean;
  showReport: boolean;
  setShowReport: (show: boolean) => void;
  decisionStatus?: "in-progress" | "completed" | "gathering-context";
}) {
  const isUser = message.sender === "user";

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  const isFinalAiMessage =
    !isUser && isLastMessage && decisionStatus === "completed";

  return (
    <div
      className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          isUser ? "bg-primary text-black" : "bg-muted text-white/90"
        }`}
      >
        {message.imageUrl && (
          <div className="mb-2">
            <img
              src={message.imageUrl}
              alt="Attached content"
              className="rounded-md max-h-60 object-contain bg-black/20"
            />
          </div>
        )}
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
      {!isUser && message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      {isFinalAiMessage && !showReport && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReport(true)}
          >
            See Report
          </Button>
        </div>
      )}
    </div>
  );
}
