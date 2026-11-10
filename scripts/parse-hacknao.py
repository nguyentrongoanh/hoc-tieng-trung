#!/usr/bin/env python3
"""Trích + phân tích sách "Hack não 3000 chữ Hán" thành từ điển (mục 10).

YÊU CẦU: PyMuPDF, tesseract với chi_sim + vie.
Kết quả: out/hacknao/dict.json  — mỗi trang một mục { page, char, pinyin, hanviet, meaning, words, raw }.
Lưu ý: OCR là bản nháp, cần đối chiếu + sửa (công cụ review trong app).
"""
import argparse, json, os, re, subprocess, tempfile
from collections import Counter

CJK = re.compile(r"[\u4e00-\u9fff]")


def ocr_tsv(pix):
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tf:
        pix.save(tf.name)
        r = subprocess.run(
            ["tesseract", tf.name, "stdout", "-l", "chi_sim+vie", "--psm", "6", "tsv"],
            capture_output=True, text=True,
        )
        os.unlink(tf.name)
    words = []
    for ln in r.stdout.splitlines()[1:]:
        p = ln.split("\t")
        if len(p) < 12 or p[0] != "5":
            continue
        try:
            words.append((int(p[6]), int(p[7]), int(p[8]), int(p[9]), float(p[10]), p[11]))
        except (ValueError, IndexError):
            continue
    return words


def analyze(words):
    cjk = [w[5] for w in words if CJK.search(w[5])]
    # Chữ chính = ký tự xuất hiện trong nhiều từ/cụm nhất (thường là chữ được dạy).
    freq = Counter()
    for w in cjk:
        for ch in set(w):
            if CJK.search(ch):
                freq[ch] += 1
    main = freq.most_common(1)[0][0] if freq else ""
    others = [w for w in cjk if w != main][:20]
    return main, others


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--out", default="out/hacknao")
    ap.add_argument("--dpi", type=int, default=200)
    ap.add_argument("--start", type=int, default=0)
    ap.add_argument("--end", type=int, default=None)
    a = ap.parse_args()

    import fitz
    doc = fitz.open(a.pdf)
    end = a.end if a.end is not None else doc.page_count
    imgdir = os.path.join(a.out, "pages")
    os.makedirs(imgdir, exist_ok=True)
    entries = []
    for i in range(a.start, min(end, doc.page_count)):
        pix = doc[i].get_pixmap(dpi=a.dpi)
        img = os.path.join(imgdir, f"page_{i:04d}.png")
        pix.save(img)
        words = ocr_tsv(pix)
        char, others = analyze(words)
        raw = " ".join(w[5] for w in words)
        entries.append({
            "page": i,
            "image": f"out/hacknao/pages/page_{i:04d}.png",
            "char": char,
            "pinyin": "",
            "hanviet": "",
            "meaning": "",
            "words": others,
            "raw": raw,
        })
        if (i + 1) % 25 == 0:
            print(f"  ... {i + 1}/{min(end, doc.page_count)}", flush=True)

    out = os.path.join(a.out, "dict.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=1)
    with_char = sum(1 for e in entries if e["char"])
    print(f"[✓] {len(entries)} trang → {out}  ({with_char} có chữ chính)")


if __name__ == "__main__":
    main()

