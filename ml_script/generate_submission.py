"""
RetinaScan-XAI — Kaggle APTOS 2019 Submission Generator
=========================================================
Runs the trained model on APTOS 2019 test images and generates
a submission.csv for upload to Kaggle.

Kaggle competition: https://www.kaggle.com/competitions/aptos2019-blindness-detection

USAGE:
    py -3.12 ml_script\generate_submission.py

Output: ml_script/submission.csv  (upload this to Kaggle)
"""

import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import pandas as pd
import numpy as np
from tqdm import tqdm

# ── Config ────────────────────────────────────────────────────────────────────
DATASET_ROOT = r"D:\AntiGravity projects\SIH\DataSet\aptos2019-blindness-detection"
TEST_CSV     = os.path.join(DATASET_ROOT, "test.csv")
TEST_DIR     = os.path.join(DATASET_ROOT, "test_images")
MODEL_PATH   = os.path.join(os.path.dirname(__file__), "retinascan_resnet50.pth")
OUTPUT_CSV   = os.path.join(os.path.dirname(__file__), "submission.csv")

IMG_SIZE     = 224
BATCH_SIZE   = 32          # higher batch size = faster on GPU
DEVICE       = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── Model ─────────────────────────────────────────────────────────────────────
def build_model():
    model = models.resnet50(weights=None)
    model.fc = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(model.fc.in_features, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, 5),
    )
    return model

# ── Transforms (same as validation — no augmentation) ─────────────────────────
test_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# ── TTA (Test Time Augmentation — optional, improves score slightly) ──────────
tta_transforms = [
    transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]),
    transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(p=1.0),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]),
    transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomVerticalFlip(p=1.0),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]),
]

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("=" * 65)
    print("📤 RetinaScan-XAI — Kaggle Submission Generator")
    print("=" * 65)
    print(f"🖥  Device: {DEVICE}")

    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model not found: {MODEL_PATH}")
        print("   Run train_model.py first!")
        return

    if not os.path.exists(TEST_CSV):
        print(f"❌ test.csv not found: {TEST_CSV}")
        return

    # Load model
    print(f"\n🔧 Loading model...")
    model = build_model().to(DEVICE)
    ckpt  = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()
    print(f"   Trained epoch: {ckpt.get('epoch', 'N/A')}")

    # Load test CSV
    test_df = pd.read_csv(TEST_CSV)
    print(f"\n📁 Test images: {len(test_df)}")
    print("🔄 Running inference with Test-Time Augmentation (3 flips)...\n")

    all_preds = []

    for _, row in tqdm(test_df.iterrows(), total=len(test_df), desc="Predicting"):
        id_code = row["id_code"]

        # Try .png then .jpg
        path = os.path.join(TEST_DIR, f"{id_code}.png")
        if not os.path.exists(path):
            path = os.path.join(TEST_DIR, f"{id_code}.jpg")
        if not os.path.exists(path):
            print(f"⚠ Missing: {id_code}")
            all_preds.append(0)
            continue

        try:
            img = Image.open(path).convert("RGB")

            # Average predictions across TTA augmentations
            avg_probs = np.zeros(5)
            for tfm in tta_transforms:
                tensor = tfm(img).unsqueeze(0).to(DEVICE)
                with torch.no_grad():
                    out   = model(tensor)
                    probs = torch.softmax(out, dim=1).cpu().numpy()[0]
                avg_probs += probs
            avg_probs /= len(tta_transforms)

            pred = int(avg_probs.argmax())
            all_preds.append(pred)

        except Exception as e:
            print(f"⚠ Error on {id_code}: {e}")
            all_preds.append(0)

    # Build submission CSV
    submission = pd.DataFrame({
        "id_code":   test_df["id_code"].values,
        "diagnosis": all_preds,
    })

    submission.to_csv(OUTPUT_CSV, index=False)

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "─" * 65)
    print("  PREDICTION DISTRIBUTION:")
    print("─" * 65)
    for grade in range(5):
        count = (submission["diagnosis"] == grade).sum()
        pct   = count / len(submission) * 100
        print(f"  Grade {grade}: {count:4d} ({pct:5.1f}%)")

    print("─" * 65)
    print(f"\n✅ Submission saved: {OUTPUT_CSV}")
    print(f"   Total predictions: {len(submission)}")
    print()
    print("📌 NEXT STEPS TO GET YOUR KAGGLE SCORE:")
    print("   1. Go to: https://www.kaggle.com/competitions/aptos2019-blindness-detection/submissions")
    print("   2. Click 'Submit Predictions'")
    print(f"   3. Upload: {OUTPUT_CSV}")
    print("   4. Wait ~2 minutes for score")
    print("   5. Your QWK score will appear (target: > 0.88)")
    print("=" * 65)


if __name__ == "__main__":
    main()
