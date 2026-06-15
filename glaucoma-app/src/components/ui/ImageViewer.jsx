import { Eye, Loader2 } from "lucide-react";
import { resolveImageSrc } from "../../api/client";


export default function ImageViewer({ src, alt, label, meta, loading }) {
  if (loading) {
    return (
      <div className="relative rounded-xl border border-white/8 bg-[#0F2D4D] min-h-[300px] flex flex-col items-center justify-center gap-3 text-sm text-[#B8C4D4]">
        <Loader2 className="w-6 h-6 animate-spin text-[#00C2FF]" />
        <span>Loading {label}…</span>
      </div>
    );
  }

  const imgSrc = resolveImageSrc(src);

  if (!imgSrc) {
    return (
      <div className="relative rounded-xl border border-slate-150 bg-slate-50 min-h-[300px] flex flex-col items-center justify-center gap-2 text-sm text-slate-500 px-4 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#00C2FF] mb-2" />
        <p className="font-bold text-[#0a2540]">{label} Generating...</p>
        <p className="text-[11px] text-slate-400">Compiling diagnostic visualization panel in background...</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-white/8 bg-[#0F2D4D] overflow-hidden flex items-center justify-center p-2">
      {meta && (
        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono-data bg-[#0A2540]/90 border border-white/10 text-[#00C2FF]">
          {meta}
        </span>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className="rounded-lg max-w-full h-auto object-contain shadow-lg shadow-black/20"
        style={{ maxHeight: "420px" }}
      />
    </div>
  );
}

