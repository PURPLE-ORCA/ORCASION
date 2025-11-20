"use client";

import { Doc, Id } from "../../convex/_generated/dataModel";
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
  message: Omit<Doc<"decision_messages">, "attachments"> & {
    imageUrl?: string;
    attachments?: {
      storageId: Id<"_storage">;
      mimeType: string;
      name?: string;
      url: string | null;
    }[];
  };
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
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att, index) => (
              <div key={index} className="relative group">
                {att.mimeType.startsWith("image/") ? (
                  <img
                    src={att.url || ""}
                    alt={att.name || "Attached image"}
                    className="max-w-xs max-h-60 rounded-lg border border-white/10"
                  />
                ) : (
                  <div className="p-2 bg-black/20 rounded-lg border border-white/10 flex items-center gap-2">
                    <span className="text-sm">{att.name || "Attachment"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : message.imageUrl ? (
          <div className="mb-2">
            <img
              src={message.imageUrl}
              alt="Attached content"
              className="rounded-md max-h-60 object-contain bg-black/20"
            />
          </div>
        ) : null}

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
