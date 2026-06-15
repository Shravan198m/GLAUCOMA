export default function StatusPill({ label, level = "Low" }) {
  const styles = {
    High: { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" },
    Medium: { bg: "#fffbeb", color: "#d97706", dot: "#d97706" },
    Low: { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
  };
  const s = styles[level] || styles.Low;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: s.dot }}
      />
      {label || level}
    </span>
  );
}
