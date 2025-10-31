"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconMessage,
  IconPlus,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export const DecisionHistory = () => {
  const decisions = useQuery(api.decisions.getDecisions);

  const links = decisions?.map((decision) => ({
    label: decision.title,
    href: `/decision/${decision._id}`,
    icon: (
      <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  }));

  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="mt-8">
                <div className="flex flex-col gap-2">
                {links?.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                ))}
                </div>
            </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "New Decision",
              href: "/",
              icon: (
                <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};
