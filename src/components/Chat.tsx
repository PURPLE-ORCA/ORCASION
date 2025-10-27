"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Message from "./Message";
import MessageInput from "./MessageInput";

export default function Chat({ decisionId }: { decisionId: string }) {
  const messages = useQuery(api.messages.listMessages, { decisionId });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages?.map((message) => (
          <Message key={message._id} message={message} />
        ))}
      </div>
      <MessageInput decisionId={decisionId} />
    </div>
  );
}
