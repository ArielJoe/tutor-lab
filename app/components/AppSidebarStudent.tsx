"use client";

import { Gauge, LogOut, ReceiptText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/logout";
import { getSession } from "../lib/session";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

const items = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: Gauge,
  },
  {
    title: "Invoice",
    url: "/student/invoice",
    icon: ReceiptText,
  },
];

export default function AppSidebarStudent() {
  const pathname = usePathname();
  const [sessionData, setSessionData] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      setSessionData(session);
    }
    fetchSession();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <h1 className="text-center py-4 text-xl border-b border-b-primary">
            TutorLab
          </h1>
          <SidebarGroupContent className="my-3">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    pathname === item.url
                      ? "text-primary bg-primary/10 rounded-md"
                      : "text-muted-foreground hover:text-foreground",
                    "flex items-center gap-3 rounded-lg p-3 transition-all hover:text-primary"
                  )}
                >
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <div>
                        <item.icon />
                      </div>
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row justify-between items-center px-3 py-4 border-t border-t-primary">
        {sessionData?.user?.name && `${sessionData.user.name}`}
        <div className="flex gap-3 items-center">
          <form action={logout}>
            <Button className="h-8 w-8">
              <LogOut />
            </Button>
          </form>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
