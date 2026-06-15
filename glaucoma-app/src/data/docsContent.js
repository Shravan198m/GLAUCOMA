/** Documentation content sourced from IEEE & Comprehensive project reports */

export const PROJECT_METRICS = {
  accuracy: "89.28%",
  precision: "87.73%",
  sensitivity: "83.07%",
  specificity: "93.02%",
  f1: "0.853",
  auc: "0.961",
  images: "9,005",
  threshold: "0.474",
};

export const DOC_SECTIONS = [
  { id: "overview", label: "Project Overview" },
  { id: "methodology", label: "Methodology" },
  { id: "training", label: "Training Process" },
  { id: "outputs", label: "Output Analysis" },
  { id: "roc", label: "ROC Analysis" },
  { id: "performance", label: "Model Performance" },
  { id: "research", label: "Research Papers" },
  { id: "stack", label: "Technology Stack" },
];

export const OVERVIEW = {
  title: "Automated Glaucoma Detection from Fundus Images",
  subtitle: "A hybrid deep learning and computer vision approach for clinical screening support",
  problem: [
    "Glaucoma is one of the leading causes of irreversible blindness worldwide, affecting approximately 80 million individuals. The disease is characterized by progressive optic nerve damage, often accompanied by elevated intraocular pressure. A critical challenge is early detection — glaucoma frequently progresses asymptomatically during early stages, when intervention can still halt or slow vision loss.",
    "Fundus photography is a non-invasive, low-cost imaging modality widely used for glaucoma assessment. However, manual analysis by ophthalmologists is time-consuming, subject to inter-observer variability, and difficult to scale for population-wide screening. Quantitative metrics such as the Cup-to-Disc Ratio (CDR) provide objective measurements but require precise segmentation of optic disc and cup structures.",
    "Recent deep learning advances achieve strong classification performance, yet the black-box nature of CNNs limits clinical adoption without interpretability. This project addresses that gap with a hybrid pipeline combining Enhanced K-Strange deterministic segmentation, explicit CDR computation, and ResNet-50 transfer learning.",
  ],
  objectives: [
    "Automate glaucoma detection from digital fundus images with high accuracy and clinical interpretability",
    "Segment optic disc and cup using Enhanced K-Strange clustering with reproducible Kmin/Kmax anchors",
    "Compute vertical CDR and fuse with ResNet-50 CNN predictions for robust final diagnosis",
    "Enable large-scale screening via a FastAPI backend and React clinical UI with PDF reporting",
    "Achieve high sensitivity to minimize false negatives in medical screening workflows",
    "Support ophthalmologists as an auxiliary tool — not a replacement for expert judgment",
  ],
  innovations: [
    "Hybrid fusion of rule-based CDR and deep learning (ResNet-50) with transparent pipeline visuals",
    "Two-stage Enhanced K-Strange clustering for disc vs background and cup vs disc",
    "Full end-to-end pipeline: preprocessing → ROI → segmentation → CDR → CNN → PDF report",
    "Focal loss, LR scheduling, gradient clipping, and early stopping for optimized training",
  ],
};

export const METHODOLOGY_STEPS = [
  {
    id: "upload",
    title: "Fundus Image Upload",
    purpose: "Accept RGB retinal fundus photographs for analysis.",
    input: "JPG/PNG fundus image (max 15 MB)",
    output: "Validated image buffer for preprocessing",
    algorithm: "File validation, patient metadata optional",
  },
  {
    id: "preprocess",
    title: "Preprocessing",
    purpose: "Enhance contrast and normalize intensity for downstream segmentation.",
    input: "Raw RGB fundus image",
    output: "Green channel, CLAHE-enhanced, Gaussian-filtered, normalized arrays",
    algorithm: "Green channel extraction → CLAHE → Gaussian blur → [0,1] normalization",
  },
  {
    id: "vessel",
    title: "Vessel Extraction",
    purpose: "Isolate vascular structure information from green channel.",
    input: "Preprocessed green channel",
    output: "Vessel-enhanced grayscale map",
    algorithm: "Morphological operations on green channel for vessel visualization",
  },
  {
    id: "roi",
    title: "Disc Localization (ROI)",
    purpose: "Crop optic disc region to reduce background interference.",
    input: "Normalized fundus image",
    output: "200×200 ROI, center coordinates, bounding box",
    algorithm: "Brightest connected-component search with percentile thresholding",
  },
  {
    id: "kstrange",
    title: "Enhanced K-Strange Clustering",
    purpose: "Segment optic disc and cup deterministically.",
    input: "Optic disc ROI",
    output: "Disc mask, cup mask (Stage 1: disc vs background; Stage 2: cup vs disc)",
    algorithm: "K=2 clustering with Kmin (min intensity) and Kmax (max intensity) anchors",
  },
  {
    id: "cup",
    title: "Cup Segmentation",
    purpose: "Refine cup boundary within segmented disc.",
    input: "Disc mask from Stage 1",
    output: "Binary cup mask constrained to disc region",
    algorithm: "Second-pass Enhanced K-Strange within disc ROI",
  },
  {
    id: "cdr",
    title: "CDR Calculation",
    purpose: "Quantify glaucomatous excavation via cup-to-disc ratio.",
    input: "Disc and cup masks",
    output: "Vertical CDR, area CDR, clinical status, risk level",
    algorithm: "Vertical diameter ratio; threshold 0.6 for glaucoma suspicion",
  },
  {
    id: "resnet",
    title: "ResNet-50 Classification",
    purpose: "Deep learning binary classification (Normal / Glaucoma).",
    input: "224×224 RGB fundus (ImageNet normalization)",
    output: "Sigmoid probability, CNN label, confidence %",
    algorithm: "Transfer-learned ResNet-50, fine-tuned on 9,005 fundus images",
  },
  {
    id: "fusion",
    title: "Decision Fusion",
    purpose: "Combine CDR and CNN for interpretable final diagnosis.",
    input: "CDR value + CNN prediction",
    output: "Final label (Normal / Borderline / Glaucoma), recommendations",
    algorithm: "Rule-based fusion with agreement/disagreement handling",
  },
  {
    id: "report",
    title: "Report Generation",
    purpose: "Produce clinical PDF with all pipeline panels.",
    input: "All pipeline outputs + patient metadata",
    output: "Downloadable PDF report (async background generation)",
    algorithm: "ReportLab PDF with JPEG-compressed pipeline images",
  },
];

export const DATASETS = [
  { name: "REFUGE", desc: "Retinal Fundus Glaucoma Evaluation — 1,200 labeled images, benchmark dataset", stats: "400 normal · 800 glaucoma" },
  { name: "RIM-ONE", desc: "Rich Indian fundus dataset with expert annotations", stats: "Multi-center clinical source" },
  { name: "DRISHTI-GS", desc: "High-quality Indian fundus images with detailed segmentation", stats: "Expert ground-truth masks" },
  { name: "G1020", desc: "Multi-ethnic fundus dataset for robustness", stats: "Diverse demographics" },
  { name: "ACRIMA / ORIGA / LAG", desc: "Supplementary datasets for training augmentation", stats: "Combined 9,005 images total" },
];

export const CDR_TABLE = [
  ["< 0.5", "Normal (Low risk)"],
  ["0.5 – 0.6", "Borderline (Monitor closely)"],
  ["0.6 – 0.8", "Glaucoma suspected (Refer to specialist)"],
  ["> 0.8", "High suspicion (Urgent referral)"],
];

export const OUTPUT_SECTIONS = [
  {
    title: "Preprocessing Pipeline",
    image: "preprocessing_normal_000001.png",
    purpose: "Prepare fundus images for reliable segmentation by enhancing contrast and suppressing noise.",
    how: "Extracts green channel (best vessel/disc contrast), applies CLAHE, Gaussian filtering, and normalizes to [0,1].",
    clinical: "Consistent preprocessing reduces variability from different cameras and lighting conditions.",
    interpretation: "Each sub-panel shows one transformation stage; normalized output feeds ROI detection.",
  },
  {
    title: "Enhanced K-Strange Segmentation",
    image: "segmentation_normal_000001.png",
    purpose: "Automatically delineate optic disc and cup boundaries for CDR measurement.",
    how: "Two-stage K=2 clustering with intensity-based Kmin/Kmax anchors — deterministic and reproducible.",
    clinical: "CDR cannot be computed without accurate disc/cup boundaries; this is the core interpretable step.",
    interpretation: "Green overlay = disc, yellow = cup. Enlarged cup relative to disc suggests glaucoma.",
  },
  {
    title: "Cup-to-Disc Ratio Analysis",
    image: "cdr_normal_000001.png",
    purpose: "Quantify vertical excavation of the optic nerve head.",
    how: "Measures vertical disc and cup diameters from masks; computes ratio and compares to 0.6 threshold.",
    clinical: "CDR > 0.6 is a standard screening indicator for glaucomatous damage.",
    interpretation: "Bar chart shows disc vs cup vertical diameters; report panel lists status and risk.",
  },
  {
    title: "ResNet-50 Classification",
    image: null,
    purpose: "Deep learning detection of subtle morphological patterns not captured by CDR alone.",
    how: "Fine-tuned ResNet-50 outputs sigmoid probability; threshold 0.5 for Glaucoma/Normal label.",
    clinical: "Captures texture and global fundus patterns complementary to geometric CDR.",
    interpretation: "Probability and confidence % shown on annotated fundus; fused with CDR for final call.",
  },
];

export const ROC_METRICS = [
  { label: "AUC", value: "0.961" },
  { label: "Sensitivity", value: "83.07%" },
  { label: "Specificity", value: "93.02%" },
  { label: "Precision", value: "87.73%" },
  { label: "Accuracy", value: "89.28%" },
  { label: "Optimal Threshold", value: "0.474" },
];

export const RESEARCH_PAPERS = [
  {
    title: "Deep Learning for Glaucoma Detection",
    meta: "Various authors · Medical Image Analysis",
    contribution: "Demonstrated CNN superiority over handcrafted features on large fundus datasets.",
    limitation: "End-to-end models lack CDR interpretability required for clinical trust.",
    improvement: "Our system adds explicit CDR + Enhanced K-Strange segmentation alongside ResNet-50.",
  },
  {
    title: "Enhanced K-Strange Points Clustering",
    meta: "Kamat et al. · Fundus segmentation",
    contribution: "Deterministic Kmin/Kmax clustering for disc, cup, and vessel segmentation.",
    limitation: "Handcrafted features from segmented regions limit classification accuracy.",
    improvement: "We fuse K-Strange segmentation with ResNet-50 transfer learning for higher accuracy.",
  },
  {
    title: "REFUGE Challenge Benchmark",
    meta: "ORBIT · 2018",
    contribution: "Standardized glaucoma evaluation dataset with 1,200 expert-labeled fundus images.",
    limitation: "Single-dataset models may not generalize across ethnicities and camera types.",
    improvement: "Training on combined 9,005 images from REFUGE, RIM-ONE, DRISHTI-GS, and others.",
  },
];

export const TECH_STACK = [
  { name: "React 18", role: "Clinical UI with tabbed pipeline viewer and PDF download" },
  { name: "FastAPI", role: "REST API for prediction, results reload, and report serving" },
  { name: "PyTorch", role: "ResNet-50 training and inference" },
  { name: "OpenCV", role: "Preprocessing, ROI detection, mask operations" },
  { name: "Enhanced K-Strange", role: "Two-stage disc/cup segmentation" },
  { name: "ReportLab", role: "Medical PDF report generation" },
  { name: "Framer Motion", role: "UI animations and page transitions" },
  { name: "Tailwind CSS", role: "Hospital-grade design system" },
];

export const PROCESSING_STAGES = [
  "Upload",
  "Preprocessing",
  "Vessel Extraction",
  "Disc Localization",
  "Enhanced K-Strange Clustering",
  "Cup Segmentation",
  "CDR Calculation",
  "ResNet-50 Classification",
  "Report Generation",
  "Complete",
];
