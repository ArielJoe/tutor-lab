"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode, useEffect, useState } from "react";
import AppSidebarAdmin from "../components/AppSidebarAdmin";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import AppSidebarTeacher from "../components/AppSidebarTeacher";

export default function StudentLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session?.user.role !== "teacher") {
        return redirect("/login");
      }
    }
    fetchSession();
  }, []);

  return (
    <div>
      <SidebarProvider>
        <AppSidebarTeacher />
        <SidebarTrigger />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
