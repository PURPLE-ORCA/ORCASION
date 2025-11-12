"use client";

import { MainSidebar } from "@/components/MainSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <MainSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
