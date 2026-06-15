import { motion } from "framer-motion";

export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex overflow-x-auto border-b border-white/8 relative">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="relative px-5 py-4.5 text-sm whitespace-nowrap font-semibold transition-colors"
            style={{ color: isActive ? "#00C2FF" : "#B8C4D4" }}
          >
            {t.label}
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute bottom-0 left-2 right-2 h-0.75 rounded-full"
                style={{ background: "#00C2FF" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

