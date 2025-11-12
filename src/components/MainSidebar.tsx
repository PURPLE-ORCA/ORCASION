"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { IconDotsVertical, IconPlus, IconTrash } from "@tabler/icons-react";

const MainSidebarContent = () => {
  const decisions = useQuery(api.decisions.getDecisions);
  const deleteDecision = useMutation(api.decisions.deleteDecision);
  const { open, setOpen } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleDelete = (e: React.MouseEvent, decisionId: Id<"decisions">) => {
    e.stopPropagation();
    deleteDecision({ decisionId });
  };

  return (
    <SidebarBody
      className="justify-between gap-10"
      onMouseLeave={() => {
        if (!isDropdownOpen) {
          setOpen(false);
        }
      }}
    >
      <div className="flex flex-col flex-1">
        <div className="shrink-0">
          <Link href="/" className="flex flex-row gap-2 items-center pb-2">
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
              {decisions?.map((decision) => (
                <div
                  key={decision._id}
                  className="group flex items-center justify-between pr-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SidebarLink
                    link={{
                      label: decision.title,
                      href: `/decision/${decision._id}`,
                      icon: null,
                    }}
                  />
                  <DropdownMenu onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDotsVertical className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) =>
                          handleDelete(e, decision._id as Id<"decisions">)
                        }
                        className="text-red-500"
                      >
                        <IconTrash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
        <AccountMenu />
      </div>
    </SidebarBody>
  );
};

const AccountMenu = () => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { open } = useSidebar();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 w-full">
          <Image
            src={user.imageUrl}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full h-8 w-8"
          />
          {open && (
            <span className="text-sm font-medium truncate">
              {user.fullName}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mb-2 ml-2">
        <DropdownMenuItem className="cursor-pointer" onClick={() => openUserProfile()}>
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ redirectUrl: "/" })}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const MainSidebar = () => {
  return (
    <Sidebar>
      <MainSidebarContent />
    </Sidebar>
  );
};
