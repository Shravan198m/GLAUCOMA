import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, ExternalLink, Loader2, Printer } from "lucide-react";
import { fetchResult } from "../api/client";

function loadHistory() {
  try {
    return JSON.parse(sessionStorage.getItem("glaucoma_report_history") || "[]");
  } catch {
    return [];
  }
}

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [history, setHistory] = useState(loadHistory);
  const [loading, setLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (result) return;
    const jobId = sessionStorage.getItem("glaucoma_job_id");
    if (!jobId) { setLoading(false); return; }
    fetchResult(jobId).then(setResult).finally(() => setLoading(false));
  }, [result]);

  const pdfUrl = result?.pdf_url;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#00C2FF]" />
      </div>
    );
  }

  if (!result?.pdf_url) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <p className="text-[#0A2540] font-semibold mb-2">No report available</p>
        <p className="text-sm text-[#64748B] mb-6">Run an analysis first to generate a PDF report.</p>
        <Link to="/upload" className="btn-navy px-6 py-3">Start Analysis</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Screening report</h1>
          <p className="text-xs font-mono-data text-[#64748B]">{result.report_id}</p>
        </div>
        <div className="flex gap-2">
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-navy-outline py-2 px-4 text-sm">
            <ExternalLink size={16} /> Open
          </a>
          <a href={pdfUrl} download className="btn-navy-outline py-2 px-4 text-sm">
            <Download size={16} /> Download
          </a>
          <button
            type="button"
            onClick={() => window.open(pdfUrl, "_blank")?.print()}
            className="btn-navy-outline py-2 px-4 text-sm"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div
        className="hospital-card-lg overflow-hidden mb-8"
        style={{ boxShadow: "0 20px 60px rgba(10,37,64,0.08)" }}
      >
        <iframe
          title="Glaucoma screening report"
          src={pdfUrl}
          className="w-full border-0"
          style={{ height: "min(80vh, 900px)" }}
        />
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748B] mb-4">Report history</h2>
        <div className="hospital-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left text-[#64748B] text-xs uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Report ID</th>
                <th className="px-4 py-3">Diagnosis</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[#94A3B8]">No previous reports</td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.report_id} className="border-b border-[#F1F5F9]">
                    <td className="px-4 py-3 font-mono-data text-xs">
                      {new Date(h.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-mono-data">{h.report_id}</td>
                    <td className="px-4 py-3">{h.prediction}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-[#00C2FF] hover:underline text-xs font-medium"
                        onClick={() => {
                          sessionStorage.setItem("glaucoma_job_id", h.job_id);
                          navigate("/results");
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
