import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Image as ImageIcon,
  Sparkles,
  Workflow,
  Target,
  CircleDot,
  GitCommit,
  Layers,
  ChevronRight
} from "lucide-react";

// Tooltip maps for pipeline stages
const PIPELINE_TOOLTIPS = {
  "Fundus": "Raw RGB retinal photograph input used for analysis.",
  "Preproc": "Green channel extraction and CLAHE local contrast normalization.",
  "K-Strange": "Deterministic anchor-based clustering for initial boundary localization.",
  "Optic Disc": "Extracts exact optic nerve disc diameter and pixel area.",
  "Optic Cup": "Segments the excavation optic cup area inside the disc boundary.",
  "CDR Math": "Computes vertical Cup-to-Disc Ratio (glaucoma indicator if >= 0.6).",
  "ResNet50": "Deep learning convolutional neural network classification (Normal / Glaucoma).",
  "Diagnosis": "Fused rule-based decision support combining CDR and ResNet predictions.",
};

export default function Landing() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="flex-1 flex flex-col relative w-full lg:h-full lg:overflow-hidden min-h-0 font-outfit">

      {/* Background Eye Image (Sleek background blending) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          src="/eye-bg.jpg"
          alt="Retinal Eye Structure"
          className="w-full h-full object-cover opacity-[0.40] mix-blend-multiply"
        />
        {/* Gradients to fade the image into the background canvas and ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f6]/85 via-[#f8fafc]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.2px] z-10" />
      </div>

      {/* Grid Content - Responsive layout stacked on mobile, side-by-side on desktop */}
      <main className="flex-1 flex items-center max-w-[95%] 2xl:max-w-[1600px] w-full mx-auto px-6 relative z-10 py-6 lg:py-3 min-h-0 overflow-y-auto lg:overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full min-h-0">

          {/* LEFT COLUMN: Hero text, Checklist, and Bottom AI metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-3.5 text-left justify-center lg:h-full"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a2540]/5 border border-[#0a2540]/10 text-[9px] font-bold tracking-wider uppercase text-slate-600 w-fit">
              <Activity size={12} className="text-[#00C2FF]" />
              Enhanced K-Strange + ResNet50
            </div>

            {/* Title: 3 lines, bold, all caps */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.1] tracking-tight uppercase font-outfit text-[#0a2540]">
              GLAUCOMA <br />
              <span className="text-[#00C2FF]">DETECTION</span> <br />
              SYSTEM
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm lg:text-xs leading-relaxed max-w-md">
              Advanced Retinal Image Analysis Using Enhanced K-Strange Segmentation and ResNet-50 Deep Learning.
            </p>

            {/* Feature Checklist */}
            <ul className="flex flex-col gap-1 text-[11px] font-bold text-slate-600 items-start">
              {[
                "Automated Optic Disc Detection",
                "Automated Optic Cup Segmentation",
                "CDR (Cup-to-Disc Ratio) Analysis",
                "Deep Learning Classification"
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#00C2FF]/10 border border-[#00C2FF]/30 flex items-center justify-center">
                    <span className="text-[#00C2FF] text-[9px] font-bold">✓</span>
                  </div>
                  <span className="tracking-wide">{feat}</span>
                </li>
              ))}
            </ul>

            {/* AI Product Metrics footer pill */}
            <div className="mt-1 p-2.5 rounded-xl bg-white/60 border border-[#0a2540]/5 shadow-sm w-fit backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2 text-[9.5px] font-extrabold text-[#0a2540] tracking-wide">
                <span className="text-[#10B981]">89.28% Accuracy</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#00C2FF]">0.961 AUC</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold">Enhanced K-Strange</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold">ResNet-50</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Statistics Grid, Pipeline Flow, and Output Previews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 lg:col-span-7 flex flex-col gap-4 justify-center"
          >

            {/* Section 1: Statistics Cards Grid */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#00C2FF] mb-2">
                Project Performance Statistics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { label: "Accuracy", value: "89.28%", desc: "Validation Score" },
                  { label: "AUC Score", value: "0.961", desc: "ROC Predict" },
                  { label: "Datasets", value: "4", desc: "Public Sources" },
                  { label: "Images Used", value: "3,456", desc: "Retinal Database" },
                  { label: "Inference", value: "< 3 sec", desc: "Processing Time" },
                ].map((stat, i) => (
                  <div key={i} className="hospital-card p-2.5 flex flex-col justify-center items-center text-center bg-white">
                    <span className="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold leading-tight">{stat.label}</span>
                    <span className="text-sm font-extrabold font-mono-data text-[#0a2540] mt-0.5">{stat.value}</span>
                    <span className="text-[7.5px] text-slate-400 font-medium mt-0.5 leading-none">{stat.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Pipeline flow (With horizontal scrolling on mobile/tablet) */}
            <div className="w-full min-w-0">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#00C2FF] mb-1.5">
                Screening Pipeline & Data Flow
              </h2>
              <div className="hospital-card p-2.5 bg-white flex flex-col gap-2 w-full overflow-hidden">
                <div className="w-full overflow-x-auto pb-1 scrollbar-thin">
                  <div className="flex items-center justify-between gap-1 min-w-[720px] lg:min-w-0">
                    {[
                      { label: "Fundus", icon: ImageIcon },
                      { label: "Preproc", icon: Sparkles },
                      { label: "K-Strange", icon: Workflow },
                      { label: "Optic Disc", icon: Target },
                      { label: "Optic Cup", icon: CircleDot },
                      { label: "CDR Math", icon: GitCommit },
                      { label: "ResNet50", icon: Layers },
                      { label: "Diagnosis", icon: Activity },
                    ].map((step, idx) => {
                      const Icon = step.icon;
                      const isHovered = activeTooltip === step.label;
                      return (
                        <div key={idx} className="flex items-center flex-1 min-w-0">
                          <div
                            onMouseEnter={() => setActiveTooltip(step.label)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className={`flex flex-col items-center justify-center p-1 border rounded-lg flex-1 text-center h-[52px] cursor-help transition-all ${isHovered
                                ? "bg-[#00C2FF]/5 border-[#00C2FF] shadow-sm"
                                : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                              }`}
                          >
                            <Icon size={13} className={isHovered ? "text-[#00C2FF]" : "text-[#0a2540]"} />
                            <span className={`text-[7.5px] font-extrabold uppercase tracking-wide mt-1 truncate w-full ${isHovered ? "text-[#00C2FF]" : "text-slate-500"
                              }`}>
                              {step.label}
                            </span>
                          </div>
                          {idx < 7 && (
                            <ChevronRight size={12} className="text-slate-300 shrink-0 mx-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pipeline Context Box */}
                <div className="text-[9.5px] font-semibold text-slate-500 text-center bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 min-h-[30px] flex items-center justify-center transition-all">
                  {activeTooltip ? (
                    <span className="text-[#0a2540] animate-fadeIn">
                      <strong>{activeTooltip}:</strong> {PIPELINE_TOOLTIPS[activeTooltip]}
                    </span>
                  ) : (
                    <span className="text-slate-400">Hover over or tap any pipeline stage to view its clinical utility.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Sample Outputs */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#00C2FF] mb-2">
                Sample Clinical Results
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Original Fundus", desc: "Raw Retinal Capture", src: "/demo/original.png" },
                  { title: "Segmented Disc", desc: "K-Strange Disc Mask", src: "/demo/optic_disc.png" },
                  { title: "Segmented Cup", desc: "K-Strange Cup Mask", src: "/demo/optic_cup.png" },
                  { title: "Final Prediction", desc: "Disc/Cup Overlay", src: "/demo/segmentation.png" }
                ].map((output, i) => (
                  <div
                    key={i}
                    className="hospital-card p-2 bg-white flex flex-col items-center gap-1.5 hover:border-[#00C2FF]/30 transition-all cursor-pointer group"
                  >
                    <div className="aspect-square w-full max-w-[110px] bg-slate-950 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-100">
                      <img
                        src={output.src}
                        alt={output.title}
                        className="w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-[8.5px] font-extrabold text-[#0a2540] uppercase tracking-wide truncate">
                        {output.title}
                      </p>
                      <p className="text-[7.5px] text-slate-400 font-medium truncate mt-0.5">
                        {output.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </main>

    </div>
  );
}
