import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Eye, Home, ScanEye, FileBarChart, Info } from "lucide-react";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isFixedLayout = isHome || pathname === "/upload" || pathname === "/processing";

  useEffect(() => {
    if (isFixedLayout) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [isFixedLayout]);

  const getIconClass = (path) => {
    const isActive = pathname === path || (path === "/upload" && pathname === "/processing");
    return `transition-all p-1.5 rounded-full ${isActive
      ? "text-[#00c2ff] bg-[#0a2540]/5 scale-110"
      : "text-slate-500 hover:text-[#0a2540] hover:bg-slate-100/80"
      }`;
  };

  const getMaxWidthClass = () => {
    switch (pathname) {
      case "/":
        return "max-w-[95%] 2xl:max-w-[1600px]";
      case "/upload":
      case "/results":
      case "/about":
        return "max-w-6xl";
      case "/processing":
        return "max-w-4xl";
      default:
        return "max-w-5xl";
    }
  };

  return (
    <div className={`w-full bg-gradient-to-r from-[#eef2f6] via-[#f8fafc] to-[#ffffff] text-[#0a2540] flex flex-col font-outfit relative ${isFixedLayout ? "h-screen overflow-hidden" : "min-h-screen"}`}>
 
      {/* Sticky Universal Header Logo & Navigation Bar */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-[#0a2540]/5 py-3 px-6 z-50 shadow-sm">
        <div className={`w-full mx-auto flex items-center justify-between relative h-10 ${getMaxWidthClass()}`}>
 
          {/* Left: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Eye className="w-5 h-5 text-[#0a2540]" />
            <span className="font-extrabold text-[13px] tracking-widest text-[#0a2540] uppercase font-outfit">
              GLAUCOMA
            </span>
          </div>
 
          {/* Center: Navigation Dock (Absolute Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white border border-[#0a2540]/10 shadow-md rounded-full px-4 py-1 z-20">
            <Link
              to="/upload"
              className="bg-[#0a2540] text-white hover:bg-[#1e293b] px-4.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center gap-1"
            >
              Start Analysis
            </Link>
            <div className="w-px h-5 bg-[#0a2540]/15" />
            <nav className="flex items-center gap-2.5 text-slate-500">
              <Link to="/" title="Home Dashboard" className={getIconClass("/")}>
                <Home size={15} />
              </Link>
              <Link to="/upload" title="Retinal Screening" className={getIconClass("/upload")}>
                <ScanEye size={15} />
              </Link>
              <Link to="/results" title="Diagnostic Results" className={getIconClass("/results")}>
                <FileBarChart size={15} />
              </Link>
              <Link to="/about" title="Documentation" className={getIconClass("/about")}>
                <Info size={15} />
              </Link>
            </nav>
          </div>
 
          {/* Right: Academic Project Tag */}
          <div className="hidden sm:block text-[9px] tracking-wider uppercase font-bold text-slate-500 bg-[#0a2540]/5 border border-[#0a2540]/10 px-3.5 py-1 rounded-full backdrop-blur-sm shrink-0">
            Academic Project
          </div>
 
        </div>
      </header>
 
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col relative z-10 min-h-0 ${isFixedLayout ? "overflow-hidden" : ""}`}>
        {children}
      </div>
 
      {/* Universal Educational Disclaimer Footer */}
      <footer className={`w-full mx-auto ${isFixedLayout ? "pb-3" : "pb-6"} text-center text-[10px] text-slate-500 relative z-20 px-6 mt-auto ${getMaxWidthClass()}`}>
        <p className="font-semibold text-slate-600">MITE — Information Science & Engineering · Academic Project 2025–26</p>
        <p className="mt-1 text-[#00c2ff] font-semibold tracking-wide">
          ▲ Academic Demonstration: This screening tool is for educational purposes only and not for medical diagnostic use.
        </p>
      </footer>
    </div>
  );
}
