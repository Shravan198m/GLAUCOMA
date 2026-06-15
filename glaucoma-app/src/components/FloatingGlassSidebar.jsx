import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileBarChart, Home, Info, ScanEye, Eye } from "lucide-react";

const NAV = [
  { to: "/", label: "Home Dashboard", icon: Home, match: (p) => p === "/" },
  { to: "/upload", label: "Retinal Screening", icon: ScanEye, match: (p) => p === "/upload" || p === "/processing" },
  { to: "/results", label: "Diagnostic Results", icon: FileBarChart, match: (p) => p === "/results" },
  { to: "/about", label: "Documentation", icon: Info, match: (p) => p.startsWith("/about") },
];

export default function FloatingGlassSidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-50 hidden sm:flex flex-col justify-between py-8 px-5 bg-[#0F2D4D] border-r border-white/5 shadow-2xl"
      style={{ width: 240 }}
      aria-label="Main Navigation Sidebar"
    >
      <div className="space-y-8">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#00C2FF]/10 border border-[#00C2FF]/20 flex items-center justify-center shadow-lg shadow-[#00C2FF]/5">
            <Eye className="w-5 h-5 text-[#00C2FF]" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-white">GLAUCOMA<span className="text-[#00C2FF]">AI</span></h1>
            <p className="text-[9px] uppercase tracking-wider text-[#8BA2C0] font-mono-data font-bold">Screening Hub</p>
          </div>
        </Link>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5" aria-label="Sidebar navigation links">
          {NAV.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="relative flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 group"
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-xl bg-[#11335A] border-l-4 border-l-[#00C2FF]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={18}
                  className="relative z-10 transition-colors"
                  style={{ color: active ? "#00C2FF" : "#b8c4d4" }}
                />
                <span
                  className="relative z-10 text-xs font-semibold tracking-wide transition-colors"
                  style={{ color: active ? "#ffffff" : "#b8c4d4" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Disclaimer */}
      <div className="border-t border-white/5 pt-5 px-2">
        <div className="p-3 rounded-xl bg-[#11335A]/50 border border-white/5">
          <p className="text-[8px] uppercase tracking-wider font-bold text-[#00C2FF] mb-1">Educational Notice</p>
          <p className="text-[9px] text-[#8BA2C0] leading-relaxed">
            Demonstration screening tool only. Not for clinical diagnosis. MITE ISE 2025–26.
          </p>
        </div>
      </div>
    </aside>
  );
}
