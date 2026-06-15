"""
Image preprocessing pipeline for glaucoma detection.

Pipeline steps:
  1. Load image + extract Green channel (best contrast for disc/cup)
  2. Gaussian filtering (noise suppression)
  3. Normalize pixel intensities to [0, 1]
  4. Save intermediate stages for report visualisation
"""

import cv2
import numpy as np
from pathlib import Path


def preprocess(image_path: str, output_dir: str | None = None) -> dict:
    """
    Run the full preprocessing pipeline and return stage file paths.

    Parameters
    ----------
    image_path : str
        Path to the input fundus image.
    output_dir : str | None
        Directory to save intermediate stage images. If None, no files are saved.

    Returns
    -------
    dict with keys:
        "original_path"    – path to saved original (copy)
        "green_path"       – path to green-channel image
        "gaussian_path"    – path to Gaussian-filtered image
        "normalized_path"  – path to normalised image
        "green_channel"    – 2-D array (H, W) green channel
        "gaussian_blurred" – 2-D array (H, W) after Gaussian
        "normalized"       – 2-D array (H, W) float in [0, 1]
    """
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {image_path}")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # ── 1. Green channel ──────────────────────────────────────────────────────
    green = img_rgb[:, :, 1].astype(np.float32)

    # ── 2. Gaussian blur ──────────────────────────────────────────────────────
    blurred = cv2.GaussianBlur(green, (5, 5), sigmaX=1.0)

    # ── 3. Normalise to [0, 1] ────────────────────────────────────────────────
    n_min, n_max = blurred.min(), blurred.max()
    normalized = (blurred - n_min) / (n_max - n_min + 1e-8)
    normalized_uint8 = (normalized * 255).astype(np.uint8)

    result: dict = {
        "green_channel":    green,
        "gaussian_blurred": blurred,
        "normalized":       normalized,
    }

    # ── Save stage images ─────────────────────────────────────────────────────
    if output_dir is not None:
        out = Path(output_dir)
        out.mkdir(parents=True, exist_ok=True)

        orig_path = str(out / "original.png")
        cv2.imwrite(orig_path, img)
        result["original_path"] = orig_path

        green_path = str(out / "green_channel.png")
        cv2.imwrite(green_path, green.astype(np.uint8))
        result["green_path"] = green_path

        gauss_path = str(out / "gaussian.png")
        cv2.imwrite(gauss_path, blurred.astype(np.uint8))
        result["gaussian_path"] = gauss_path

        norm_path = str(out / "normalized.png")
        cv2.imwrite(norm_path, normalized_uint8)
        result["normalized_path"] = norm_path

    return result
