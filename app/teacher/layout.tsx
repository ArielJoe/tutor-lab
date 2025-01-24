import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import AppSidebarTeacher from "../components/AppSidebar/AppSidebarTeacher";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (session?.user.role !== "teacher") {
    return redirect("/login");
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebarTeacher />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
