import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import AppSidebarAdmin from "../components/AppSidebarAdmin";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (session?.user.role !== "admin") {
    return redirect("/login");
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebarAdmin />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
