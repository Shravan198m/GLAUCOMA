export default function MetricCard({ label, value, subtext, valueColor, progress }) {
  return (
    <div className="hospital-card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-2">
        {label}
      </p>
      <p
        className="text-2xl font-semibold font-mono-data leading-tight"
        style={{ color: valueColor || "#0f172a" }}
      >
        {value}
      </p>
      {progress != null && (
        <div className="mt-3 h-1 rounded-full bg-[#e2e8f0] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2563eb] transition-all"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
      {subtext && (
        <p className="text-xs mt-2 text-[#94a3b8]">{subtext}</p>
      )}
    </div>
  );
}
