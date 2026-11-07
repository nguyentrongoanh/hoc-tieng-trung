#!/usr/bin/env node
// Quét tất cả chữ Hán trong decks.js, xem cnchar.radical() trả về
// bộ thủ gì cho mỗi chữ, so với radicals.js. Báo bộ nào còn thiếu.
//
// Chạy: node scripts/scan-decks.js
// Yêu cầu: npm install cnchar cnchar-radical (đã cài sẵn ở root)

const fs = require("fs");
const path = require("path");
const cnchar = require("cnchar");
cnchar.use(require("cnchar-radical"));

function loadDictKeys(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const keys = new Set();
  const re = /"([^"]+)"\s*:\s*\{/g;
  let m;
  while ((m = re.exec(src)) !== null) keys.add(m[1]);
  return keys;
}

function extractDeckChars(decksPath) {
  // Load decks.js như một script để lấy biến DECKS
  const src = fs.readFileSync(decksPath, "utf8");
  const mod = { exports: {} };
  const wrapped = src.replace("const DECKS", "module.exports.DECKS");
  new Function("module", wrapped)(mod);
  const DECKS = mod.exports.DECKS;

  const chars = new Set();
  Object.values(DECKS).forEach((d) => {
    d.cards.forEach((c) => {
      for (const ch of c.hanzi || "") {
        if (/[一-鿿]/.test(ch)) chars.add(ch);
      }
    });
  });
  return [...chars];
}

const dictKeys = loadDictKeys(path.join(__dirname, "..", "radicals.js"));
const allChars = extractDeckChars(path.join(__dirname, "..", "decks.js"));

console.log(`Số chữ Hán unique trong decks.js: ${allChars.length}`);
console.log(`Số bộ thủ trong radicals.js: ${dictKeys.size}\n`);

const radicalsUsed = new Map(); // radical -> [chars using it]
const missing = new Map();

allChars.forEach((ch) => {
  const res = cnchar.radical(ch);
  const r = Array.isArray(res) && res[0] ? res[0].radical : null;
  if (!r) return;
  if (!radicalsUsed.has(r)) radicalsUsed.set(r, []);
  radicalsUsed.get(r).push(ch);
  if (!dictKeys.has(r)) {
    if (!missing.has(r)) missing.set(r, []);
    missing.get(r).push(ch);
  }
});

console.log(`Bộ thủ xuất hiện trong decks (${radicalsUsed.size} bộ):`);
[...radicalsUsed.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 20)
  .forEach(([r, cs]) =>
    console.log(`  ${r} (${cs.length}): ${cs.slice(0, 10).join("")}${cs.length > 10 ? "..." : ""}`)
  );

if (missing.size === 0) {
  console.log(`\n✅ Tất cả bộ thủ dùng trong decks đều có trong radicals.js.`);
} else {
  console.log(`\n❌ Thiếu ${missing.size} bộ:`);
  [...missing.entries()].forEach(([r, cs]) => {
    console.log(`  "${r}" (U+${r.codePointAt(0).toString(16).toUpperCase()}) - dùng bởi: ${cs.join("")}`);
  });
}
