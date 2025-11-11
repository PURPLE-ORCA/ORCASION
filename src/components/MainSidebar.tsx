"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import {
  IconPlus,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const MainSidebarContent = () => {
  const decisions = useQuery(api.decisions.getDecisions);
  const { open } = useSidebar();

  const links = decisions?.map((decision) => ({
    label: decision.title,
    href: `/decision/${decision._id}`,
    icon: null,
  }));

  return (
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1">
          <div className="shrink-0">
            <Link
              href="/"
              className="flex flex-row gap-2 items-center pb-2"
            >
              <Image
                src="/img/OrcasionLogo.png"
                alt="Orcasion Logo"
                width={30}
                height={30}
                className="h-8 w-8"
              />
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="font-bold text-lg whitespace-pre"
                >
                  Orcasion
                </motion.span>
              )}
            </Link>
          </div>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 overflow-y-auto overflow-x-hidden mt-8"
            >
              <div className="flex flex-col gap-2 overflow-x-hidden">
                {links?.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <SidebarLink
            link={{
              label: "New Decision",
              href: "/",
              icon: (
                <IconPlus className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
              ),
            }}
          />
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            {open && <span className="text-sm">Account</span>}
          </div>
        </div>
      </SidebarBody>
  );
}

export const MainSidebar = () => {
  return (
    <Sidebar>
      <MainSidebarContent />
    </Sidebar>
  );
};
