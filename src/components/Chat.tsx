"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Message from "./Message";
import { Send, Paperclip, X, Upload, File as FileIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import AnimatedInput from "./ui/AnimatedInput";
import { Reasoning, ReasoningTrigger } from "@/components/ui/reasoning";
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

  const messages =
    useQuery(api.messages.listMessages, decisionId ? { decisionId } : "skip") ||
    [];
  const sendChatMessage = useAction(api.decisions.sendChatMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const [content, setContent] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showRateLimitBanner, setShowRateLimitBanner] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setSelectedFiles((prev) => [
        ...prev,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const handleSendMessage = async (messageContent?: string) => {
    const textToSend = messageContent || content;
    if ((!textToSend.trim() && selectedFiles.length === 0) || isAiThinking)
      return;

    setContent("");
    setIsAiThinking(true);
    setShowRateLimitBanner(false);

    try {
      const attachments = [];

      if (selectedFiles.length > 0) {
        // Upload all files in parallel
        const uploadPromises = selectedFiles.map(async (file) => {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await result.json();
          return {
            storageId: storageId as Id<"_storage">,
            mimeType: file.type,
            name: file.name,
          };
        });

        const uploadedAttachments = await Promise.all(uploadPromises);
        attachments.push(...uploadedAttachments);
      }

      await sendChatMessage({
        decisionId,
        content: textToSend,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      setSelectedFiles([]);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      if (
        error.message.includes("RATE_LIMIT_EXCEEDED") ||
        error.message.includes("429")
      ) {
        setShowRateLimitBanner(true);
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendMessage(content);
  };

  return (
    <div
      className="flex flex-col h-full w-full max-w-4xl mx-auto relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-purple-900/80 z-50 flex flex-col items-center justify-center border-4 border-dashed border-purple-400 rounded-lg backdrop-blur-sm animate-in fade-in duration-200">
          <Upload className="w-16 h-16 text-purple-200 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-white">Drop files here</h3>
          <p className="text-purple-200 mt-2">
            Upload images or documents for analysis
          </p>
        </div>
      )}

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
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        {isAiThinking && (
          <div className="mb-4">
            <Reasoning isStreaming={true}>
              <ReasoningTrigger />
            </Reasoning>
          </div>
        )}

        {/* Rate Limit Banner */}
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

        {/* File Preview Area */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <div className="w-16 h-16 rounded-lg border border-purple-500/30 overflow-hidden bg-gray-800 flex items-center justify-center">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon className="w-8 h-8 text-purple-400" />
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white p-0.5 truncate text-center">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
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
            label={
              selectedFiles.length > 0
                ? "Add a message about these files..."
                : "Your message"
            }
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={
              (!content.trim() && selectedFiles.length === 0) || isAiThinking
            }
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
