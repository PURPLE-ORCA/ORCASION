"use client";

import Chat from "@/components/Chat";
import { Id } from "../../../../convex/_generated/dataModel";

export default function DecisionPage({
  params,
}: {
  params: { decisionId: Id<"decisions"> };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Chat decisionId={params.decisionId} />
    </main>
  );
}
