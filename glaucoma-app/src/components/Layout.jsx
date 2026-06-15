import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Eye, Home, ScanEye, FileBarChart, Info, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isHome = pathname === "/";
  const isFixedLayout = isHome || pathname === "/upload" || pathname === "/processing";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isFixedLayout) {
      // Apply fixed height only on large desktop screens where layout fits without scrolling
      const applyFixed = () => {
        if (window.innerWidth >= 1024) {
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
      };

      applyFixed();
      window.addEventListener("resize", applyFixed);
      return () => {
        window.removeEventListener("resize", applyFixed);
        document.body.style.overflow = "";
        document.body.style.height = "";
        document.documentElement.style.overflow = "";
        document.documentElement.style.height = "";
      };
    }
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
    <div className={`w-full bg-gradient-to-r from-[#eef2f6] via-[#f8fafc] to-[#ffffff] text-[#0a2540] flex flex-col font-outfit relative ${isFixedLayout ? "lg:h-screen lg:overflow-hidden min-h-screen" : "min-h-screen"}`}>
 
      {/* Sticky Universal Header Logo & Navigation Bar */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-[#0a2540]/5 py-3 px-6 z-50 shadow-sm">
        <div className={`w-full mx-auto flex items-center justify-between relative h-10 ${getMaxWidthClass()}`}>
 
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            <Eye className="w-5 h-5 text-[#0a2540]" />
            <span className="font-extrabold text-[13px] tracking-widest text-[#0a2540] uppercase font-outfit">
              GLAUCOMA
            </span>
          </Link>
 
          {/* Center: Navigation Dock (Absolute Centered on Desktop, hidden on Mobile) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 bg-white border border-[#0a2540]/10 shadow-md rounded-full px-4 py-1 z-20">
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
 
          {/* Right: Academic Project Tag on Desktop, Hamburger on Mobile/Tablet */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:block text-[9px] tracking-wider uppercase font-bold text-slate-500 bg-[#0a2540]/5 border border-[#0a2540]/10 px-3.5 py-1 rounded-full backdrop-blur-sm">
              Academic Project
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full text-slate-500 hover:text-[#0a2540] hover:bg-slate-100/80 transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
 
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden w-full bg-white border-b border-[#0a2540]/10 shadow-lg relative z-40 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <nav className="flex flex-col gap-3">
                <Link
                  to="/"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/" ? "bg-[#0a2540]/5 text-[#00c2ff]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Home size={15} />
                  <span>Home Dashboard</span>
                </Link>
                <Link
                  to="/upload"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/upload" || pathname === "/processing"
                      ? "bg-[#0a2540]/5 text-[#00c2ff]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ScanEye size={15} />
                  <span>Retinal Screening</span>
                </Link>
                <Link
                  to="/results"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/results" ? "bg-[#0a2540]/5 text-[#00c2ff]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FileBarChart size={15} />
                  <span>Diagnostic Results</span>
                </Link>
                <Link
                  to="/about"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/about" ? "bg-[#0a2540]/5 text-[#00c2ff]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Info size={15} />
                  <span>Documentation</span>
                </Link>
              </nav>
              <div className="h-px bg-slate-100" />
              <Link
                to="/upload"
                className="w-full bg-[#0a2540] text-white hover:bg-[#1e293b] py-2.5 text-xs font-extrabold uppercase tracking-widest rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                Start Analysis
              </Link>
              <div className="text-[9px] tracking-wider uppercase font-bold text-slate-400 text-center">
                Academic Project Demonstration
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col relative z-10 min-h-0 ${isFixedLayout ? "lg:overflow-hidden" : ""}`}>
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
