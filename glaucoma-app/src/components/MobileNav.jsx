import { Link, useLocation } from "react-router-dom";
import { FileBarChart, Home, Info, ScanEye } from "lucide-react";

const ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/upload", icon: ScanEye, label: "Analyze" },
  { to: "/results", icon: FileBarChart, label: "Results" },
  { to: "/about", icon: Info, label: "About" },
];

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-4 border-t border-white/5 bg-[#0f2d4d]/95 backdrop-blur-lg"
      aria-label="Mobile navigation"
    >
      {ITEMS.map(({ to, icon: Icon, label }) => {
        const active = pathname === to || (to === "/upload" && pathname === "/processing");
        return (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className="flex flex-col items-center gap-0.5 p-2"
            style={{ color: active ? "#00C2FF" : "#b8c4d4" }}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
