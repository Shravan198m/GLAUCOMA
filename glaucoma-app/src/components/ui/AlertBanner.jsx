export default function AlertBanner({ icon: Icon, title, subtitle, variant = "warning" }) {
  const styles = {
    warning: { bg: "#fffbeb", border: "#fde68a", color: "#d97706" },
    success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a" },
    danger: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626" },
    info: { bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb" },
  };
  const s = styles[variant] || styles.warning;

  return (
    <div
      className="rounded-xl px-5 py-4 flex items-start gap-3"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: s.color }} />}
      <div>
        <p className="font-semibold text-sm" style={{ color: s.color }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm mt-0.5 opacity-90" style={{ color: s.color }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
