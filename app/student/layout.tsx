import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import AppSidebarStudent from "../components/AppSidebar/AppSidebarStudent";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (session?.user.role !== "student") {
    return redirect("/login");
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebarStudent />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
