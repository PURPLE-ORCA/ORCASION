import { Doc } from "../../convex/_generated/dataModel";

export default function Message({ message }: { message: Doc<"decision_messages"> }) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex items-center gap-2 ${isUser ? "justify-end" : ""}`}>
      <div
        className={`rounded-lg px-4 py-2 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
