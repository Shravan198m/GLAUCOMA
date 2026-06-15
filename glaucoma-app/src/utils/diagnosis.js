import { AlertTriangle, CheckCircle2, TriangleAlert } from "lucide-react";

export function diagnosisStyle(prediction) {
  const p = prediction?.toLowerCase() || "";
  if (p.includes("glaucoma") && !p.includes("borderline")) {
    return {
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.2)",
      icon: AlertTriangle,
      title: "Glaucoma Indicators Detected",
      subtitle: "Specialist consultation recommended within 2 weeks",
    };
  }
  if (p.includes("borderline")) {
    return {
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.2)",
      icon: TriangleAlert,
      title: "Borderline Clinical Findings",
      subtitle: "Follow-up screening recommended within 3–6 months",
    };
  }
  return {
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
    icon: CheckCircle2,
    title: "No Glaucoma Indicators Detected",
    subtitle: "Continue routine annual eye examinations",
  };
}

export function riskStyle(level) {
  if (level === "High") {
    return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", dot: "#EF4444" };
  }
  if (level === "Medium" || level === "Borderline") {
    return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", dot: "#F59E0B" };
  }
  return { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", dot: "#10B981" };
}

export function diagnosisMetricColor(prediction) {
  const p = prediction?.toLowerCase() || "";
  if (p.includes("glaucoma") && !p.includes("borderline")) return "#EF4444";
  if (p.includes("borderline")) return "#F59E0B";
  return "#10B981";
}

