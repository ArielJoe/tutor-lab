import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { registerCredentials } from "../lib/actions";
import { toast } from "@/hooks/use-toast";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <div className="p-5 border-b flex justify-between items-center gap-3">
      <div className="flex gap-3 items-center">
        <SidebarTrigger className="bg-primary text-secondary" />
        <h1 className="text-xl">{title}</h1>
      </div>
      <Button
        onClick={async () => {
          await registerCredentials(
            "Admin",
            "tutorlab@gmail.com",
            "admin",
            "123456"
          );
          toast({
            description: "Admin created!",
            className: "bg-green-900",
          });
        }}
      >
        Adm
      </Button>
    </div>
  );
}
