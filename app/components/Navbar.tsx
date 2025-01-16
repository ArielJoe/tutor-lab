import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <div className="p-5 border-b flex items-center gap-3">
      <SidebarTrigger className="bg-primary text-secondary" />
      <h1 className="text-xl">{title}</h1>
    </div>
  );
}
