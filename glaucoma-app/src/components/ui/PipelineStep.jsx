export default function PipelineStep({ icon: Icon, title, subtitle }) {
  return (
    <div className="hospital-card p-4 flex flex-col items-center text-center gap-2">
      <div className="w-9 h-9 rounded-full bg-[#eff6ff] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#2563eb]" />
      </div>
      <p className="text-sm font-semibold text-[#0f172a]">{title}</p>
      <p className="text-xs text-[#64748b] leading-snug">{subtitle}</p>
    </div>
  );
}
