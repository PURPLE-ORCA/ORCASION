"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Message from "./Message";
import { useEffect, useState } from "react";
import { X, Paperclip, File as FileIcon } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { useRef } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendChatMessage = useAction(api.decisions.sendChatMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim()) {
      setContent(""); // Clear input immediately
      setIsAiThinking(true);
      try {
        let storageId: Id<"_storage"> | undefined;
        let format: string | undefined;

        if (selectedFile) {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": selectedFile.type },
            body: selectedFile,
          });
          const { storageId: uploadedStorageId } = await result.json();
          storageId = uploadedStorageId;
          format = selectedFile.type;
        }

        await sendChatMessage({
          decisionId,
          content: messageContent,
          storageId,
          format,
        });

        setSelectedFile(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Message
              key={message._id}
              message={{
                ...message,
                imageUrl: message.imageUrl ?? undefined,
              }}
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

        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg w-fit">
            <FileIcon size={16} className="text-purple-400" />
            <span className="text-xs text-purple-200 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-purple-400 hover:text-purple-200"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,application/pdf"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
          </Button>
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
