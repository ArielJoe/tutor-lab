"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode, useEffect, useState } from "react";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import AppSidebarStudent from "../components/AppSidebarStudent";

export default function StudentLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session?.user.role !== "student") {
        return redirect("/login");
      }
    }
    fetchSession();
  }, []);

  return (
    <div>
      <SidebarProvider>
        <AppSidebarStudent />
        <SidebarTrigger />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
