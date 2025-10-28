"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Message from "./Message";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import AnimatedInput from "./ui/AnimatedInput";
import { Button } from "./ui/button";

export default function Chat({ decisionId }: { decisionId: Id<"decisions"> }) {
  const messages = useQuery(api.messages.listMessages, { decisionId });
  const [content, setContent] = useState("");
  const addMessage = useMutation(api.messages.addMessage);
  const getAiResponse = useAction(api.ai.getAiResponse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addMessage({
        decisionId,
        content,
        sender: "user",
      });
      getAiResponse({
        decisionId,
        message: content,
      });
      setContent("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <Message key={message._id} message={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <AnimatedInput
          value={content}
          onChange={(value) => setContent(value)}
          label="Your message"
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
