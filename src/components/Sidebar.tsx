"use client";

import React from "react";
import { DecisionHistory } from "./DecisionHistory";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { IconArrowBigLeftLine, IconSettings } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function MainSidebar() {
  const links = [
    {
      label: "New Decision",
      href: "/",
      icon: <IconArrowBigLeftLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];
  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1">
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
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg whitespace-pre"
            >
              Orcasion
            </motion.span>
          </Link>
          <DecisionHistory />
        </div>
        <div className="flex flex-col gap-2">
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
          <UserButton afterSignOutUrl="/" />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
