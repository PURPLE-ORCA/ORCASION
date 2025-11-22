"use client";

import { MainSidebar } from "@/components/MainSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const AppLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { open, animate } = useSidebar();
  return (
    <div className="flex h-full w-full">
      <MainSidebar />
      <main
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
          "md:ml-[60px]" // Fixed margin for collapsed sidebar
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
