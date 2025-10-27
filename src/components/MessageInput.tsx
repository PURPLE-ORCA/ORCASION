"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function MessageInput({ decisionId }: { decisionId: string }) {
  const [content, setContent] = useState("");
  const addMessage = useMutation(api.messages.addMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addMessage({
        decisionId,
        content,
        sender: "user",
      });
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
