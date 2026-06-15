import { Brain } from "lucide-react";
import { resolveImageSrc } from "../../api/client";

/** Fallback ResNet view when resnet_result_image.png is missing on disk. */
export default function ResNetPanel({ result }) {
  const origSrc = resolveImageSrc(result.original_image);
  const isGlaucoma = result.cnn_prediction?.toUpperCase() === "GLAUCOMA";
  const statusColor = isGlaucoma ? "#EF4444" : "#10B981";

  return (
    <div className="relative rounded-xl border border-white/8 bg-[#0F2D4D] overflow-hidden min-h-[300px] flex items-center justify-center p-2">
      {origSrc ? (
        <img
          src={origSrc}
          alt="ResNet-50 analysis"
          className="rounded-lg max-w-full h-auto object-contain shadow-lg shadow-black/20"
          style={{ maxHeight: "360px" }}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[300px] text-[#B8C4D4]">
          Fundus image unavailable
        </div>
      )}
      <div
        className="absolute top-4 left-4 rounded-xl p-4 max-w-xs border bg-[#0A2540]/90 backdrop-blur-md shadow-xl border-white/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#00C2FF]/10 flex items-center justify-center border border-[#00C2FF]/20">
            <Brain className="w-3.5 h-3.5 text-[#00C2FF]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#00C2FF]">
            ResNet-50 CNN
          </p>
        </div>
        <dl className="space-y-2 text-xs">
          <div className="flex justify-between gap-6 border-b border-white/5 pb-1">
            <dt className="text-[#B8C4D4]">Prediction</dt>
            <dd className="font-bold uppercase" style={{ color: statusColor }}>
              {result.cnn_prediction || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-b border-white/5 pb-1">
            <dt className="text-[#B8C4D4]">Confidence</dt>
            <dd className="font-mono-data font-semibold text-white">
              {result.confidence_score?.toFixed(1)}%
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-b border-white/5 pb-1">
            <dt className="text-[#B8C4D4]">Probability</dt>
            <dd className="font-mono-data font-semibold text-white">
              {result.resnet_probability != null ? result.resnet_probability.toFixed(4) : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-[#B8C4D4]">Fused Decision</dt>
            <dd className="font-bold text-[#00C2FF] text-right">
              {result.final_diagnosis_label || result.prediction}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

