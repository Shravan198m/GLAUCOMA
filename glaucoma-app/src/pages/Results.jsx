import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Download, Eye, Loader2, RotateCcw, User, CalendarDays, FileText, Activity } from "lucide-react";
import { fetchResult, mergeResult, resolveImageSrc } from "../api/client";
import ImageViewer from "../components/ui/ImageViewer";
import ResNetPanel from "../components/ui/ResNetPanel";
import TabBar from "../components/ui/TabBar";
import { diagnosisMetricColor, diagnosisStyle } from "../utils/diagnosis";

const VIEW_TABS = [
  { id: "original", label: "Original", key: "original_image" },
  { id: "preprocessed", label: "Preprocessed", key: "preprocessing_image" },
  { id: "disc", label: "Disc Segmentation", key: "segmentation_panel_image" },
  { id: "overlay", label: "Overlay", key: "segmentation_image" },
  { id: "resnet", label: "ResNet-50", key: "resnet_result_image" },
  { id: "cdr", label: "CDR Analysis", key: "cdr_report_image" },
];

function EmptyState({ title, message, ctaTo, ctaLabel }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center hospital-card-lg mt-10">
      <div className="w-16 h-16 rounded-full bg-[#00C2FF]/10 flex items-center justify-center mx-auto mb-6 border border-[#00C2FF]/20 animate-pulse">
        <Eye className="w-8 h-8 text-[#00C2FF]" />
      </div>
      <h2 className="text-2xl font-bold text-[#0a2540] mb-3">{title}</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        {message}
      </p>
      <Link to={ctaTo} className="btn-navy px-8 py-3.5 shadow-lg shadow-[#00C2FF]/10">
        {ctaLabel}
      </Link>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState("original");
  const [pdfReady, setPdfReady] = useState(true);

  useEffect(() => {
    async function load() {
      if (location.state?.result) {
        setResult(location.state.result);
        setLoading(false);
        return;
      }
      const jobId = sessionStorage.getItem("glaucoma_job_id");
      if (!jobId) { setLoading(false); return; }
      try {
        setResult(await fetchResult(jobId));
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [location.state, navigate]);

  useEffect(() => {
    if (!result?.job_id) return;

    const hasPDF = result.pdf_status === "ready" || result.pdf_status === "failed";
    const hasPanels = 
      result.preprocessing_image && 
      result.segmentation_panel_image && 
      result.cdr_report_image && 
      result.resnet_result_image;

    setPdfReady(result.pdf_status === "ready");

    if (hasPDF && hasPanels) {
      return;
    }

    let cancelled = false;
    (async () => {
      for (let i = 0; i < 30 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const data = await fetchResult(result.job_id);
          if (cancelled) return;
          
          setResult((p) => mergeResult(p, data));
          
          const nextPDF = data.pdf_status === "ready" || data.pdf_status === "failed";
          const nextPanels = 
            data.preprocessing_image && 
            data.segmentation_panel_image && 
            data.cdr_report_image && 
            data.resnet_result_image;

          if (nextPDF && nextPanels) {
            return;
          }
        } catch { /* retry */ }
      }
    })();
    return () => { cancelled = true; };
  }, [
    result?.job_id,
    result?.pdf_status === "ready",
    result?.preprocessing_image === null,
    result?.segmentation_panel_image === null,
    result?.cdr_report_image === null,
    result?.resnet_result_image === null
  ]);

  if (loading && !result) {
    return (
      <div className="flex justify-center items-center py-32 min-h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#00C2FF] mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">Retrieving diagnostic results…</p>
        </div>
      </div>
    );
  }

  if (!loading && !result && !loadError) {
    return (
      <EmptyState
        title="Ready for Screening"
        message="Upload a retinal fundus image to generate detailed clinical metrics. The pipeline executes: Preprocessing → Enhanced K-Strange Segmentation → CDR Analysis → ResNet-50 Classification."
        ctaTo="/upload"
        ctaLabel="Start Screening Analysis"
      />
    );
  }

  if (loadError && !result) {
    return (
      <EmptyState 
        title="Diagnostic Report Unavailable" 
        message={loadError} 
        ctaTo="/upload" 
        ctaLabel="New Analysis Run" 
      />
    );
  }

  if (!result) return null;

  const diag = diagnosisStyle(result.prediction);
  const DiagIcon = diag.icon;
  const activeTab = VIEW_TABS.find((t) => t.id === tab);
  const isNormal = result.prediction?.toLowerCase().includes("normal") && !result.prediction?.toLowerCase().includes("borderline");
  const isGlaucoma = result.prediction?.toLowerCase().includes("glaucoma") && !result.prediction?.toLowerCase().includes("borderline");

  const originalSrc = resolveImageSrc(result.original_image);
  const preprocessedSrc = resolveImageSrc(result.preprocessing_image);
  const discMaskSrc = resolveImageSrc(result.optic_disc_image || result.segmentation_image);
  const cupMaskSrc = resolveImageSrc(result.optic_cup_image || result.segmentation_image);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 sm:py-16 text-[#0a2540] min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        
        {/* ==========================================
            HEADER & ACTIONS
            ========================================== */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0a2540]">Clinical Diagnosis Report</h1>
            <p className="text-xs font-mono-data text-slate-500 mt-1.5 flex items-center gap-2">
              <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Report: {result.report_id}</span>
              <span className="text-slate-300">|</span>
              <span>Job ID: {result.job_id}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/upload" className="btn-navy-outline py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <RotateCcw size={14} /> Re-run screening
            </Link>
            {result.pdf_url && pdfReady ? (
              <a href={result.pdf_url} download={`glaucoma_report_${result.report_id}.pdf`} target="_blank" rel="noreferrer" className="btn-navy py-2.5 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00C2FF]/10">
                <Download size={14} /> Download PDF
              </a>
            ) : (
              <span className="btn-navy-outline py-2.5 px-5 text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#00C2FF]" /> Generating PDF…
              </span>
            )}
          </div>
        </div>

        {/* ==========================================
            GRID ROW 1 — PATIENT INFO & DIAGNOSIS
            ========================================== */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Patient Details Card */}
          <div className="hospital-card p-6 flex flex-col justify-between bg-white">
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#00C2FF] mb-4 flex items-center gap-1.5">
                <User size={13} className="text-[#00C2FF]" />
                Patient Demographics
              </h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Full Name</p>
                  <p className="text-sm font-bold text-[#0a2540] mt-0.5 truncate">{result.patient_name || "Anonymous Patient"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Patient MRN / ID</p>
                  <p className="text-sm font-semibold font-mono-data text-[#0a2540] mt-0.5 truncate">{result.patient_id || "GLC-MRN-TEMP"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Patient Age</p>
                  <p className="text-sm font-bold text-[#0a2540] mt-0.5">{result.patient_age ? `${result.patient_age} Years` : "Not Stated"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Screening Date</p>
                  <p className="text-sm font-semibold font-mono-data text-[#0a2540] mt-0.5 flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-slate-400" />
                    {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <FileText size={13} /> Labeled ground truth details
              </span>
              <span className="font-mono-data">MITE ISE 2025–26</span>
            </div>
          </div>

          {/* Screening Diagnosis Card */}
          <div className="hospital-card p-6 flex flex-col justify-between bg-white" style={{ borderLeft: `4px solid ${diag.color}` }}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Fused Clinical Impression
                </h2>
                <h3 className="text-3xl font-black tracking-tight" style={{ color: diag.color }}>
                  {result.prediction}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {diag.subtitle}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{ backgroundColor: diag.bg, borderColor: diag.border }}
              >
                <DiagIcon size={24} style={{ color: diag.color }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 border-t border-slate-100 pt-4">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                <p className="text-[9px] uppercase tracking-wider text-slate-500">ResNet CNN Call</p>
                <p className="text-sm font-bold text-[#0a2540] mt-0.5 truncate uppercase">
                  {result.cnn_prediction || "—"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                <p className="text-[9px] uppercase tracking-wider text-slate-500">CDR Interpretation</p>
                <p className="text-sm font-bold text-[#0a2540] mt-0.5 truncate uppercase">
                  {result.cdr_status || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 my-2" />

        {/* ==========================================
            GRID ROW 2 — KPI MEASUREMENTS
            ========================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Cup-to-Disc Ratio (CDR)",
              value: result.cup_disc_ratio?.toFixed(4),
              meta: result.cdr_status,
              color: result.cup_disc_ratio >= 0.6 ? "#EF4444" : result.cup_disc_ratio >= 0.5 ? "#F59E0B" : "#10B981"
            },
            {
              label: "Optic Disc Area",
              value: result.disc_area ? `${result.disc_area.toLocaleString()} px` : "—",
              meta: "Total Disc Canvas"
            },
            {
              label: "Optic Cup Area",
              value: result.cup_area ? `${result.cup_area.toLocaleString()} px` : "—",
              meta: "Excavation Canvas"
            },
            {
              label: "Clinical Risk Level",
              value: result.risk_level,
              meta: "Pipeline Confidence",
              color: result.risk_level === "High" ? "#EF4444" : result.risk_level === "Medium" ? "#F59E0B" : "#10B981"
            }
          ].map((kpi, idx) => (
            <div key={idx} className="hospital-card p-4 flex flex-col justify-between bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{kpi.label}</span>
              <div className="my-3">
                <span className="text-2xl font-extrabold font-mono-data" style={{ color: kpi.color || "#0a2540" }}>
                  {kpi.value}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C2FF] truncate">
                {kpi.meta}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 my-2" />

        {/* ==========================================
            GRID ROW 3 — 4-COLUMN IMAGE COMPARISON GRID
            ========================================== */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00C2FF] mb-4 flex items-center gap-2">
            <Activity size={14} className="text-[#00C2FF]" />
            Pipeline Visual Transformations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "1. Original Fundus", src: originalSrc },
              { label: "2. Preprocessed", src: preprocessedSrc },
              { label: "3. Optic Disc Mask", src: discMaskSrc },
              { label: "4. Optic Cup Mask", src: cupMaskSrc }
            ].map((img, idx) => (
              <div 
                key={idx} 
                className="hospital-card overflow-hidden group cursor-pointer hover:border-[#00C2FF]/30 transition-all duration-300 bg-white"
                onClick={() => {
                  const mappings = ["original", "preprocessed", "disc", "overlay"];
                  setTab(mappings[idx]);
                  const viewerElem = document.getElementById("tabbed-viewer-section");
                  if (viewerElem) viewerElem.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <div className="aspect-[4/3] relative bg-slate-50 flex items-center justify-center p-1 border-b border-slate-100">
                  {img.src ? (
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="text-[10px] text-slate-400 text-center p-3 flex flex-col items-center gap-1.5 justify-center h-full">
                      <Loader2 className="w-4 h-4 animate-spin text-[#00C2FF]" />
                      <span>Generating...</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] font-bold bg-[#00C2FF] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Inspect panel
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50">
                  <p className="text-[10px] font-bold text-[#0a2540] uppercase tracking-wider text-center">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 my-2" />

        {/* ==========================================
            GRID ROW 4 — TABBED VIEWER & AI EXPLAINABILITY
            ========================================== */}
        <div id="tabbed-viewer-section" className="grid lg:grid-cols-[1fr_360px] gap-6 scroll-mt-20">
          {/* Tabbed Image Viewer */}
          <div className="hospital-card overflow-hidden bg-white">
            <TabBar tabs={VIEW_TABS} active={tab} onChange={setTab} />
            <div className="p-6">
              {tab === "resnet" && !result.resnet_result_image ? (
                <ResNetPanel result={result} />
              ) : (
                <ImageViewer
                  src={result[activeTab?.key]}
                  alt={activeTab?.label}
                  label={activeTab?.label}
                  meta={`Fundus · ${activeTab?.label}`}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* AI Explainability Card */}
          <div className="hospital-card p-6 flex flex-col justify-between bg-white">
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#00C2FF] mb-4">
                Explainability Factors
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                The decision fusion algorithm maps clinical features together with structural segmentation to construct the diagnosis:
              </p>
              
              <ul className="space-y-4">
                {[
                  {
                    title: "Optic Cup Excavation",
                    desc: "Deterministic K-Strange maps localized cup structure.",
                    val: result.cup_area ? `${result.cup_area.toLocaleString()} pixels` : "—"
                  },
                  {
                    title: "Optic Disc Boundaries",
                    desc: "Detects structural perimeter contours to isolate the disc.",
                    val: result.disc_area ? `${result.disc_area.toLocaleString()} pixels` : "—"
                  },
                  {
                    title: "Cup-to-Disc Ratio (CDR)",
                    desc: "Suspected if vertical ratio exceeds 0.6 cutoff.",
                    val: result.cup_disc_ratio?.toFixed(4) || "—",
                    highlight: result.cup_disc_ratio >= 0.6
                  },
                  {
                    title: "Neural Network Confidence",
                    desc: "ResNet-50 features capture texture and global damage.",
                    val: `${result.confidence_score?.toFixed(1)}%`
                  }
                ].map((item, idx) => (
                  <li key={idx} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-[#0a2540]">{item.title}</span>
                      <span 
                        className="text-xs font-mono-data font-semibold text-right"
                        style={{ color: item.highlight ? "#EF4444" : "#00C2FF" }}
                      >
                        {item.val}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fused Recommendation Bullet */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <AlertTriangle size={15} className="text-[#00C2FF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">Pipeline Fusion Status</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    {result.prediction === "GLAUCOMA" 
                      ? "High agreement between ResNet CNN probability and segmented Cup-to-Disc excavation."
                      : "CDR and CNN features reflect structural stability. Screen annually."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            CLINICAL RECOMMENDATIONS SECTION
            ========================================== */}
        {result.recommendations?.length > 0 && (
          <div className="hospital-card p-6 bg-white">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#00C2FF] mb-4 flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[#00C2FF]" />
              Diagnostic Actions & Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {result.recommendations.map((r, i) => (
                <div key={i} className="flex gap-3 text-xs leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-xl items-start">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border mt-0.5"
                       style={{ 
                         backgroundColor: isGlaucoma ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                         borderColor: isGlaucoma ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                         color: isGlaucoma ? "#EF4444" : "#10B981"
                       }}>
                    <span className="text-[9px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-slate-600">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
