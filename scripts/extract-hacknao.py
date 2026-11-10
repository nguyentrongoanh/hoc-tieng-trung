#!/usr/bin/env python3
"""Trích nội dung sách "Hack não 3000 chữ Hán" (PDF scan 275 trang).

YÊU CẦU:
- PyMuPDF:  pip install pymupdf
- tesseract + ngôn ngữ Trung (chi_sim):
    brew install tesseract tesseract-lang      (macOS)
    apt install tesseract-ocr tesseract-ocr-chi-sim  (Linux)
  (Máy hiện tại chỉ có eng/osd/snum → cần cài thêm để OCR tiếng Trung.)

CÁCH CHẠY:
  python3 scripts/extract-hacknao.py --pdf "Hack não 3000 chữ Hán.pdf" --out out/hacknao
  python3 scripts/extract-hacknao.py --pdf "..." --start 0 --end 10   # chỉ vài trang thử

Kết quả:
- out/hacknao/pages/page_XXXX.png : ảnh PNG từng trang (để đối chiếu)
- out/hacknao/manifest.json        : danh sách trang + text OCR (nếu có chi_sim)

QUAN TRỌNG: OCR chỉ là BẢN NHÁP. Phải đối chiếu ảnh gốc để soát chữ, pinyin,
dấu thanh, ranh giới dòng và giản thể/phồn thể trước khi nhập vào kho "Tra chữ".
"""
import argparse, json, os, subprocess, tempfile


def has_lang(lang):
    try:
        r = subprocess.run(["tesseract", "--list-langs"], capture_output=True, text=True)
        return lang in r.stdout.split()
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--out", default="out/hacknao")
    ap.add_argument("--lang", default="chi_sim")
    ap.add_argument("--dpi", type=int, default=150)
    ap.add_argument("--start", type=int, default=0)
    ap.add_argument("--end", type=int, default=None)
    a = ap.parse_args()

    import fitz
    doc = fitz.open(a.pdf)
    os.makedirs(os.path.join(a.out, "pages"), exist_ok=True)

    ocr_ok = has_lang(a.lang)
    if not ocr_ok:
        print(f"[!] Tesseract chưa có ngôn ngữ '{a.lang}' — chỉ xuất ảnh, chưa OCR text.")
        print("    Cài thêm: brew install tesseract-lang  (hoặc apt install tesseract-ocr-chi-sim)")

    end = a.end if a.end is not None else doc.page_count
    manifest = {"pages": []}
    for i in range(a.start, min(end, doc.page_count)):
        p = doc[i]
        img_path = os.path.join(a.out, "pages", f"page_{i:04d}.png")
        p.get_pixmap(dpi=a.dpi).save(img_path)
        text = ""
        if ocr_ok:
            with tempfile.NamedTemporaryFile(suffix=".png") as tf:
                p.get_pixmap(dpi=a.dpi).save(tf.name)
                r = subprocess.run(
                    ["tesseract", tf.name, "stdout", "-l", a.lang, "--psm", "6"],
                    capture_output=True, text=True,
                )
                text = r.stdout.strip()
        manifest["pages"].append({"page_pdf": i, "image": img_path, "ocr_draft": text})
        if (i + 1) % 25 == 0:
            print(f"  ... đã xử lý {i + 1}/{min(end, doc.page_count)} trang")

    out_json = os.path.join(a.out, "manifest.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"[✓] Xong {len(manifest['pages'])} trang → {out_json}")


if __name__ == "__main__":
    main()
