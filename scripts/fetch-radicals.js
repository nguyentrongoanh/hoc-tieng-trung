#!/usr/bin/env node
// Cào data 214 bộ thủ Khang Hy từ Wikipedia để enrich radicals.js.
// Thêm các field tuỳ chọn: pinyin, số nét, nghĩa tiếng Anh, radical number.
//
// Chạy: node scripts/fetch-radicals.js [--write]
//   không --write: chỉ in ra console để xem diff
//   có --write   : cập nhật trực tiếp radicals.js (giữ nguyên viName/viMeaning)
//
// Nguồn: https://en.wikipedia.org/wiki/List_of_Kangxi_radicals

const https = require("https");
const fs = require("fs");
const path = require("path");

const WRITE = process.argv.includes("--write");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { "User-Agent": "flashcard-zh-scraper/1.0" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetch(res.headers.location));
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      }
    );
  });
}

function stripTags(s) {
  return s
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\[[^\]]*\]/g, "") // bỏ footnote [1]
    .replace(/\s+/g, " ")
    .trim();
}

(async () => {
  console.log("Fetching Wikipedia list of Kangxi radicals...");
  const html = await fetch("https://en.wikipedia.org/wiki/Kangxi_radical");

  // Parse table rows: tìm <tr>...</tr> có radical character và meaning
  // Cấu trúc bảng Wikipedia: nhiều cột, cột 2 thường có char, cột 6 có meaning
  const rows = html.match(/<tr\b[\s\S]*?<\/tr>/g) || [];
  const data = {};

  rows.forEach((row) => {
    // Lấy tất cả cells
    const cells = (row.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/g) || []).map(stripTags);
    if (cells.length < 5) return;

    // Số thứ tự Kangxi (1-214) thường là cell đầu
    const numMatch = cells[0].match(/^(\d{1,3})$/);
    if (!numMatch) return;
    const num = parseInt(numMatch[1], 10);
    if (num < 1 || num > 214) return;

    // Tìm char Hán (ký tự CJK đơn) trong các cells
    let radChar = null;
    for (const c of cells.slice(1, 4)) {
      const m = c.match(/[一-鿿⺀-⿕]/);
      if (m) { radChar = m[0]; break; }
    }
    if (!radChar) return;

    // Số nét: cell kế tiếp sau char thường là số
    let strokes = null;
    for (const c of cells) {
      const sm = c.match(/^(\d{1,2})$/);
      if (sm && parseInt(sm[1], 10) <= 30 && parseInt(sm[1], 10) !== num) {
        strokes = parseInt(sm[1], 10);
        break;
      }
    }

    // Pinyin: thường có dấu / chữ thường, tìm trong cells
    let pinyin = null;
    for (const c of cells) {
      if (/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüa-z\s,/-]+$/i.test(c) && c.length >= 1 && c.length <= 20) {
        pinyin = c;
        break;
      }
    }

    // Meaning tiếng Anh: cell dài có chữ English
    let meaning = null;
    for (let i = cells.length - 1; i >= 0; i--) {
      const c = cells[i];
      if (/^[A-Za-z][A-Za-z\s,()/.'-]{2,60}$/.test(c)) {
        meaning = c;
        break;
      }
    }

    data[radChar] = { kangxi: num, strokes, pinyin, meaningEN: meaning };
  });

  console.log(`Đã lấy ${Object.keys(data).length} bộ từ Wikipedia.\n`);

  // So với radicals.js hiện có
  const radicalsPath = path.join(__dirname, "..", "radicals.js");
  const src = fs.readFileSync(radicalsPath, "utf8");
  const presentKeys = new Set();
  const re = /"([^"]+)"\s*:\s*\{/g;
  let m;
  while ((m = re.exec(src)) !== null) presentKeys.add(m[1]);

  const inDict = Object.keys(data).filter((k) => presentKeys.has(k));
  const notInDict = Object.keys(data).filter((k) => !presentKeys.has(k));

  console.log(`Trong 214 Kangxi Wiki trả về: ${inDict.length} đã có trong dict.`);
  if (notInDict.length) {
    console.log(`${notInDict.length} chưa có trong dict:`, notInDict.join(" "));
  }

  // Xuất file JSON data cào được (để tham khảo, không auto-merge vào radicals.js)
  const outPath = path.join(__dirname, "kangxi-wiki.json");
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`\nĐã lưu dữ liệu Wikipedia → ${path.relative(process.cwd(), outPath)}`);

  if (WRITE) {
    console.log("\n⚠️  Flag --write chưa được hỗ trợ auto-merge.");
    console.log("Để enrich, chỉnh tay radicals.js dựa trên kangxi-wiki.json.");
    console.log("Script này giữ viName/viMeaning của bạn, chỉ dùng Wiki làm nguồn kiểm chứng.");
  } else {
    console.log("\nℹ️  Chỉ cào, không ghi. Dùng --write nếu muốn (chưa impl).");
  }
})();
