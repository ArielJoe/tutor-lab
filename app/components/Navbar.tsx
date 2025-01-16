interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <div className="p-5 border-b">
      <h1 className="text-xl">{title}</h1>
    </div>
  );
}

