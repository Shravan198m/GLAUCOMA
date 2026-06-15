import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, UploadCloud, Check } from "lucide-react";
import { evalPlotUrl } from "../api/client";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png"];

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [drag, setDrag] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState({ name: "", age: "", id: "" });

  const validateAndSet = (f) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("Please upload JPG or PNG images only.");
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setError("Image must be under 15 MB.");
      return;
    }
    setError(null);
    setFile(f);
    setUploadDone(false);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      let p = 0;
      const iv = setInterval(() => {
        p += 12;
        setUploadProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(iv);
          setUploadDone(true);
        }
      }, 80);
    };
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    validateAndSet(e.dataTransfer.files[0]);
  }, []);

  const startAnalysis = () => {
    if (!file || !uploadDone) return;
    navigate("/processing", {
      state: { file, preview, patient },
    });
  };


  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-4 lg:py-6 text-[#0a2540] flex-1 flex flex-col min-h-0">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0a2540]">Image Analysis</h1>
        <p className="text-xs lg:text-sm text-slate-500 mt-0.5">Upload fundus images to run the automated glaucoma screening pipeline.</p>
      </div>

      <div className="grid lg:grid-cols-[55%_45%] gap-6 lg:gap-8 min-h-0 flex-1">
        {/* ==========================================
            LEFT COLUMN — UPLOAD AREA
            ========================================== */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3 lg:space-y-4 flex flex-col min-h-0"
        >
          {/* Patient Details Input */}
          <div className="hospital-card p-4 lg:p-5">
            <h2 className="text-xs lg:text-sm font-bold uppercase tracking-wider text-[#00C2FF] mb-3">Patient Information</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "name", label: "Patient Name", ph: "Optional" },
                { key: "age", label: "Age", ph: "Years" },
                { key: "id", label: "Patient ID", ph: "MRN" },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {label}
                  </label>
                  <input
                    value={patient[key]}
                    onChange={(e) => setPatient({ ...patient, [key]: e.target.value })}
                    placeholder={ph}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 border border-slate-200 text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/30 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => document.getElementById("fundus-input").click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className="hospital-card-lg p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden flex-1 flex flex-col justify-center min-h-[160px] lg:min-h-[200px]"
            style={{
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: drag ? "#00C2FF" : "rgba(10,37,64,0.15)",
              background: drag ? "rgba(0,194,255,0.04)" : "#ffffff",
            }}
          >
            <input
              id="fundus-input"
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => validateAndSet(e.target.files[0])}
            />

            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                    <UploadCloud className="w-6 h-6 lg:w-7 lg:h-7 text-[#00C2FF]" />
                  </div>
                  <p className="font-bold text-[#0a2540] text-sm lg:text-base">Drag & drop retinal fundus photograph</p>
                  <p className="text-[10px] lg:text-xs text-slate-400 mt-1.5">Supports JPG, JPEG, PNG · Maximum 15 MB</p>
                </motion.div>
              ) : (
                <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <img src={preview} alt="Preview" className="max-h-24 lg:max-h-36 mx-auto rounded-xl border border-slate-200 mb-3 shadow-md" />
                  <p className="text-xs font-semibold text-[#0a2540] truncate max-w-xs mx-auto">{file.name}</p>
                  <p className="text-[10px] font-mono-data text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  
                  {!uploadDone && (
                    <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden max-w-xs mx-auto">
                      <motion.div
                        className="h-full bg-[#00C2FF]"
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  {uploadDone && (
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] text-[#10B981] font-bold uppercase tracking-wider bg-[#10B981]/15 px-2.5 py-0.5 rounded-full"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Ready to analyze
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="flex gap-2 p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={startAnalysis}
            disabled={!file || !uploadDone}
            className="w-full btn-navy py-3 shadow-lg shadow-[#00C2FF]/10 text-sm lg:text-base font-bold uppercase tracking-wider"
          >
            Analyze Retinal Image
          </button>
        </motion.div>

        {/* ==========================================
            RIGHT COLUMN — SYSTEM FEATURES & SAMPLES
            ========================================== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3 lg:space-y-4 flex flex-col min-h-0"
        >
          {/* Features Card */}
          <div className="hospital-card p-4 lg:p-5 flex-1 flex flex-col min-h-0">
            <h2 className="text-xs lg:text-sm font-bold uppercase tracking-wider text-[#00C2FF] mb-3">Pipeline Integration Features</h2>
            <ul className="space-y-2 lg:space-y-2.5 overflow-y-auto pr-1 flex-1">
              {[
                { title: "Enhanced K-Strange Segmentation", desc: "Deterministic anchor-based clustering maps disc & cup borders." },
                { title: "Cup-to-Disc Ratio Computation", desc: "Calculates metric-aligned vertical CDR indicators Suspected (>0.6)." },
                { title: "Blood Vessel Suppression", desc: "Filters background vascular structures for clean optical scanning." },
                { title: "ResNet-50 Classification", desc: "Binary deep learning classification with calibrated probabilities." },
                { title: "PDF Report Generation", desc: "Produces printable 7-page summaries with data overlays." },
                { title: "Clinical Visualization", desc: "Generates high-contrast overlays for expert validation." }
              ].map((f, idx) => (
                <li key={idx} className="flex gap-3 text-xs leading-normal">
                  <div className="w-5 h-5 rounded-full bg-[#00C2FF]/10 flex items-center justify-center shrink-0 border border-[#00C2FF]/20">
                    <Check size={11} className="text-[#00C2FF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a2540] text-xs lg:text-sm">{f.title}</h3>
                    <p className="text-slate-500 mt-0.5 text-[11px] lg:text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

