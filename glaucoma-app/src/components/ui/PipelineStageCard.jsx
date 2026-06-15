import { resolveImageSrc } from "../../api/client";

export default function PipelineStageCard({ title, subtitle, src, loading }) {
  const imgSrc = resolveImageSrc(src);

  return (
    <div className="hospital-card overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="p-3 flex-1 flex items-center justify-center bg-white min-h-[160px]">
        {loading ? (
          <p className="text-xs text-[#94a3b8]">Loading…</p>
        ) : imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className="w-full object-contain rounded"
            style={{ maxHeight: "200px" }}
          />
        ) : (
          <p className="text-xs text-[#94a3b8] text-center px-2">Unavailable — re-run analysis</p>
        )}
      </div>
    </div>
  );
}
