const API_BASE = import.meta.env.VITE_API_URL || "";

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("API unavailable");
  return res.json();
}

export async function predictImage(file, patient = {}) {
  const fd = new FormData();
  fd.append("file", file);
  if (patient.name) fd.append("patient_name", patient.name);
  if (patient.age) fd.append("patient_age", patient.age);
  if (patient.id) fd.append("patient_id", patient.id);

  const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.detail || data.error || "Prediction failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data;
}

/** Load saved result from server (images served as URLs). */
export async function fetchResult(jobId) {
  const res = await fetch(`${API_BASE}/results/${jobId}`);
  const data = await res.json();
  if (!res.ok) {
    const msg = data.detail || "Failed to load results";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data;
}

/** Base64 or URL string -> img src */
export function resolveImageSrc(value) {
  if (!value) return null;
  if (typeof value === "string" && (value.startsWith("http") || value.startsWith("/"))) {
    return value;
  }
  return `data:image/png;base64,${value}`;
}

export function b64Image(b64) {
  return resolveImageSrc(b64);
}

export function evalPlotUrl(filename) {
  return `${API_BASE}/eval/${filename}`;
}

export function trainingPlotUrl(filename) {
  return `${API_BASE}/training/${filename}`;
}

const IMAGE_KEYS = [
  "preprocessing_image",
  "segmentation_panel_image",
  "cdr_report_image",
  "pipeline_summary_image",
  "final_composite_image",
  "resnet_result_image",
  "original_image",
  "segmentation_image",
  "vessel_image",
];

/** Merge API reload without wiping images that were already loaded. */
export function mergeResult(prev, data) {
  const merged = { ...prev, ...data };
  for (const key of IMAGE_KEYS) {
    if (!data[key] && prev?.[key]) merged[key] = prev[key];
  }
  return merged;
}

/** Strip large base64 fields before sessionStorage */
export function slimResult(result) {
  const omit = new Set([
    "preprocessing_image",
    "segmentation_panel_image",
    "cdr_report_image",
    "pipeline_summary_image",
    "final_composite_image",
    "resnet_result_image",
    "original_image",
    "segmentation_image",
    "vessel_image",
    "optic_disc_image",
    "optic_cup_image",
    "segmentation_images",
    "stages",
  ]);
  return Object.fromEntries(
    Object.entries(result).filter(([k]) => !omit.has(k))
  );
}
