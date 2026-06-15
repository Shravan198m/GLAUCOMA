import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { evalPlotUrl, trainingPlotUrl } from "../api/client";
import {
  CDR_TABLE,
  DATASETS,
  DOC_SECTIONS,
  METHODOLOGY_STEPS,
  OUTPUT_SECTIONS,
  OVERVIEW,
  PROJECT_METRICS,
  RESEARCH_PAPERS,
  ROC_METRICS,
  TECH_STACK,
} from "../data/docsContent";
import { useScrollSpy } from "../hooks/useScrollSpy";

function Callout({ children }) {
  return (
    <div className="rounded-xl bg-slate-50 border-l-4 border-[#00C2FF] p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed shadow-md">
      {children}
    </div>
  );
}

function AccordionStep({ step, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hospital-card overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4.5 text-left hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <span className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#00C2FF]/10 text-[#00C2FF] text-xs font-black flex items-center justify-center border border-[#00C2FF]/20">
            {index + 1}
          </span>
          <span className="font-bold text-[#0a2540] text-base">{step.title}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-[#00C2FF]" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-slate-50/50"
          >
            <div className="px-6 pb-6 pt-4 space-y-3.5 text-xs border-t border-slate-100">
              {[
                { label: "Purpose", val: step.purpose },
                { label: "Input Data", val: step.input },
                { label: "Output Data", val: step.output },
                { label: "Clinical Algorithm", val: step.algorithm }
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 bg-white border border-slate-100 p-3.5 rounded-xl">
                  <span className="font-extrabold uppercase tracking-wider text-[#00C2FF]">{item.label}</span>
                  <span className="text-[#0a2540] leading-relaxed">{item.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function About() {
  const sectionIds = DOC_SECTIONS.map((s) => s.id);
  const active = useScrollSpy(sectionIds);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-[#0a2540] min-h-screen">
      <div className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2540]">System Documentation</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Technical specifications, model performance details, and mathematical methodology of the hybrid Glaucoma Detection pipeline (MITE ISE 2025–26).
        </p>
      </div>

      {/* Mobile quick-nav dropdown */}
      <div className="lg:hidden mb-8">
        <label htmlFor="mobile-doc-nav" className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
          Jump to Section
        </label>
        <div className="relative">
          <select
            id="mobile-doc-nav"
            value={active || ""}
            onChange={(e) => scrollTo(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0a2540] font-semibold focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] appearance-none shadow-sm cursor-pointer"
          >
            {DOC_SECTIONS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        {/* Sticky sub-nav */}
        <nav className="hidden lg:block sticky top-8 self-start">
          <ul className="space-y-1">
            {DOC_SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none"
                  style={{
                    color: active === id ? "#00C2FF" : "#64748b",
                    background: active === id ? "rgba(0,194,255,0.06)" : "transparent",
                    borderLeft: active === id ? "2px solid #00C2FF" : "2px solid transparent",
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="space-y-24 min-w-0">
          
          {/* Overview */}
          <section id="overview" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">{OVERVIEW.title}</h2>
            <p className="text-sm font-semibold text-[#00C2FF]">{OVERVIEW.subtitle}</p>
            
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Clinical Context & Problem Statement</h3>
              {OVERVIEW.problem.map((p, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">{p}</p>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Core Objectives</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
                  {OVERVIEW.objectives.map((o, idx) => (
                    <li key={idx} className="marker:text-[#00C2FF]">{o}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Novel Pipeline Innovations</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
                  {OVERVIEW.innovations.map((o, idx) => (
                    <li key={idx} className="marker:text-[#00C2FF]">{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Methodology — accordion pipeline */}
          <section id="methodology" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">Clinical Pipeline Steps</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                The screening workflow executes a sequential 10-stage processing chain designed to combine deterministic computer vision segmentations with robust ResNet deep learning outputs.
              </p>
            </div>
            <div className="space-y-3">
              {METHODOLOGY_STEPS.map((step, i) => (
                <AccordionStep key={step.id} step={step} index={i} />
              ))}
            </div>
          </section>

          {/* Training */}
          <section id="training" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">Training Process & Datasets</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                The deep learning engine is fine-tuned on a multi-ethnic cohort of 9,005 retinal fundus photographs.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {DATASETS.map((d) => (
                <div key={d.name} className="hospital-card p-5 border border-slate-100 hover:border-slate-200 transition-colors bg-white">
                  <p className="font-bold text-[#0a2540] text-base">{d.name}</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{d.desc}</p>
                  <span className="inline-block text-[10px] font-bold font-mono-data text-[#00C2FF] bg-[#00C2FF]/10 border border-[#00C2FF]/20 px-2 py-0.5 rounded mt-3">
                    {d.stats}
                  </span>
                </div>
              ))}
            </div>

            <div className="hospital-card overflow-hidden">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600 px-5 py-3 border-b border-slate-100 bg-slate-50">
                ResNet-50 Optimisation Curves
              </p>
              <div className="bg-slate-50 p-5 flex items-center justify-center">
                <img src={trainingPlotUrl("training_history_optimized.png")} alt="Training curves" className="max-h-[350px] object-contain rounded-lg shadow-md" />
              </div>
            </div>

            <Callout>
              Training runs incorporate Focal Loss weight parameters, Cosine Annealing learning rate schedules, gradient clipping (1.0), and early stopping callbacks. The validation accuracy reached <strong>90.44%</strong> inside the latest run with balanced test thresholds at <strong>{PROJECT_METRICS.threshold}</strong>.
            </Callout>
          </section>

          {/* Output analysis — zigzag per sketch */}
          <section id="outputs" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">Output Analysis Specifications</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Every intermediate output is structured to build clinical interpretability, providing clear visual validations for clinicians.
              </p>
            </div>
            
            <div className="space-y-16">
              {OUTPUT_SECTIONS.map((sec, i) => (
                <div
                  key={sec.title}
                  className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
                >
                  <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                    {sec.image ? (
                      <div className="hospital-card overflow-hidden">
                        <div className="bg-slate-50 p-4 flex items-center justify-center">
                          <img src={evalPlotUrl(sec.image)} alt={sec.title} className="max-h-[260px] object-contain rounded" />
                        </div>
                      </div>
                    ) : (
                      <div className="hospital-card p-12 text-center bg-slate-50 border border-slate-100">
                        <p className="text-sm font-bold text-[#0a2540] uppercase tracking-wider">ResNet-50 CNN Feature Map</p>
                        <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">Generated dynamically per run containing probability metrics and diagnostic label overlays.</p>
                      </div>
                    )}
                  </div>
                  <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                    <h3 className="font-extrabold text-[#00C2FF] text-lg mb-4">{sec.title}</h3>
                    <dl className="space-y-4 text-xs">
                      {[
                        ["Purpose", sec.purpose],
                        ["How it works", sec.how],
                        ["Clinical importance", sec.clinical],
                        ["Interpretation", sec.interpretation]
                      ].map(([k, v]) => (
                        <div key={k} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                          <dt className="font-bold text-[#0a2540] uppercase tracking-wider text-[10px] mb-0.5">{k}</dt>
                          <dd className="text-slate-600 leading-relaxed">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ROC */}
          <section id="roc" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">ROC Analysis</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Evaluating classification power across balanced thresholds highlights model discriminative efficiency.
              </p>
            </div>
            
            <div className="grid md:grid-cols-[220px_1fr] gap-6 items-center">
              <div className="hospital-card p-6 text-center space-y-1 flex flex-col justify-center h-full bg-white">
                <p className="text-5xl font-black font-mono-data text-[#00C2FF]">{PROJECT_METRICS.auc}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Area Under Curve (AUC)</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROC_METRICS.map((m) => (
                  <div key={m.label} className="hospital-card p-4 text-center bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{m.label}</p>
                    <p className="text-base font-extrabold font-mono-data text-[#0a2540] mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hospital-card overflow-hidden">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600 px-5 py-3 border-b border-slate-100 bg-slate-50">
                Receiver Operating Characteristic (ROC) Curve
              </p>
              <div className="bg-slate-50 p-5 flex items-center justify-center">
                <img src={evalPlotUrl("roc_curve.png")} alt="ROC curve" className="max-h-[350px] object-contain rounded-lg shadow-md" />
              </div>
            </div>

            <Callout>
              The ROC evaluation validates high robustness with an AUC of <strong>0.961</strong>. Setting the optimal clinical decision threshold to <strong>0.474</strong> aligns true positive rates to <strong>83.1%</strong> with a low false positive rate of <strong>7.0%</strong>.
            </Callout>
          </section>

          {/* Performance */}
          <section id="performance" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">Clinical Metrics Scorecard</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Comprehensive evaluation metrics achieved on the test corpus following fine-tuning.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Accuracy", value: PROJECT_METRICS.accuracy, note: "Overall test set" },
                { label: "Sensitivity", value: PROJECT_METRICS.sensitivity, note: "True positive rate" },
                { label: "Specificity", value: PROJECT_METRICS.specificity, note: "True negative rate" },
                { label: "Precision", value: PROJECT_METRICS.precision, note: "Positive predictive value" },
                { label: "F1-Score", value: PROJECT_METRICS.f1, note: "Harmonic mean" },
                { label: "AUC", value: PROJECT_METRICS.auc, note: "ROC area" },
                { label: "Images", value: PROJECT_METRICS.images, note: "Training corpus" },
                { label: "Threshold", value: PROJECT_METRICS.threshold, note: "Optimal operating point" },
              ].map((m) => (
                <div key={m.label} className="hospital-card p-4 flex flex-col justify-between bg-white">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{m.label}</span>
                  <p className="text-lg font-extrabold font-mono-data text-[#00C2FF] my-1">{m.value}</p>
                  <span className="text-[9px] font-medium text-slate-500">{m.note}</span>
                </div>
              ))}
            </div>

            <div className="hospital-card overflow-hidden">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600 px-5 py-3 border-b border-slate-100 bg-slate-50">
                Test Set Confusion Matrix
              </p>
              <div className="bg-slate-50 p-5 flex items-center justify-center">
                <img src={evalPlotUrl("confusion_matrix.png")} alt="Confusion matrix" className="max-h-[350px] object-contain rounded-lg shadow-md" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-[#0a2540] mt-8 mb-3">CDR Clinical Classification Thresholds</h3>
            <div className="hospital-card overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] font-extrabold uppercase border-b border-slate-100">
                      <th className="px-5 py-3 text-left">CDR Range</th>
                      <th className="px-5 py-3 text-left">Interpretation & Referral Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CDR_TABLE.map(([range, interp]) => (
                      <tr key={range} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold font-mono-data text-[#0a2540]">{range}</td>
                        <td className="px-5 py-3.5 text-slate-600 leading-relaxed">{interp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Research */}
          <section id="research" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">Literature Survey</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Research foundations that inspired our hybrid architectural paradigm.
              </p>
            </div>
            
            <div className="space-y-4">
              {RESEARCH_PAPERS.map((p) => (
                <div key={p.title} className="hospital-card p-6 border border-slate-100 hover:border-slate-200 transition-all bg-white">
                  <p className="font-extrabold text-[#0a2540] text-base leading-snug">{p.title}</p>
                  <p className="text-[10px] font-bold text-[#00C2FF] mt-1.5 uppercase tracking-wider">{p.meta}</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 text-xs leading-relaxed">
                    <div>
                      <p className="font-bold text-[#0a2540] uppercase tracking-wider text-[9px] mb-0.5">Contribution</p>
                      <p className="text-slate-600">{p.contribution}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[#0a2540] uppercase tracking-wider text-[9px] mb-0.5">Limitation</p>
                      <p className="text-slate-600">{p.limitation}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-[#00C2FF]/5 border border-[#00C2FF]/20 p-4 text-xs text-[#00C2FF] leading-relaxed">
                    <strong className="font-bold uppercase tracking-wider text-[9px] block mb-1">Our Integrated Advancement</strong>
                    {p.improvement}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stack */}
          <section id="stack" className="scroll-mt-24 pb-16 space-y-6">
            <div>
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-3 text-[#0a2540]">Technology Stack</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Full-stack toolchain supporting asynchronous predictions and dynamic rendering.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TECH_STACK.map((t) => (
                <div
                  key={t.name}
                  className="hospital-card p-5 border border-slate-100 hover:border-[#00C2FF]/40 transition-all duration-300 group bg-white"
                  title={t.role}
                >
                  <p className="font-bold text-[#0a2540] text-base group-hover:text-[#00C2FF] transition-colors">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed leading-normal">{t.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

