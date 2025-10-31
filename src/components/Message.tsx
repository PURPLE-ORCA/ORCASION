import { Doc } from "../../convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        {/* TODO: User needs to manually install react-markdown and remark-gfm */}
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}