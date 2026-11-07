#!/usr/bin/env node
// Kiểm tra radicals.js có đủ 214 bộ thủ Khang Hy không.
// Chạy: node scripts/verify-radicals.js
//
// Danh sách 214 bộ thủ Khang Hy (Unicode block CJK Unified Ideographs,
// không dùng block Kangxi Radicals U+2F00-U+2FD5 vì cnchar trả về dạng CJK thường).

const fs = require("fs");
const path = require("path");

const KANGXI_214 = [
  "一","丨","丶","丿","乙","亅",
  "二","亠","人","儿","入","八","冂","冖","冫","几","凵","刀","力","勹","匕","匚","匸","十","卜","卩","厂","厶","又",
  "口","囗","土","士","夂","夊","夕","大","女","子","宀","寸","小","尢","尸","屮","山","巛","工","己","巾","干","幺","广","廴","廾","弋","弓","彐","彡","彳",
  "心","戈","戶","手","支","攴","文","斗","斤","方","无","日","曰","月","木","欠","止","歹","殳","毋","比","毛","氏","气","水","火","爪","父","爻","爿","片","牙","牛","犬",
  "玄","玉","瓜","瓦","甘","生","用","田","疋","疒","癶","白","皮","皿","目","矛","矢","石","示","禸","禾","穴","立",
  "竹","米","糸","缶","网","羊","羽","老","而","耒","耳","聿","肉","臣","自","至","臼","舌","舛","舟","艮","色","艸","虍","虫","血","行","衣","襾",
  "見","角","言","谷","豆","豕","豸","貝","赤","走","足","身","車","辛","辰","辵","邑","酉","釆","里",
  "金","長","門","阜","隶","隹","雨","青","非",
  "面","革","韋","韭","音","頁","風","飛","食","首","香",
  "馬","骨","高","髟","鬥","鬯","鬲","鬼",
  "魚","鳥","鹵","鹿","麥","麻",
  "黃","黍","黑","黹",
  "黽","鼎","鼓","鼠",
  "鼻","齊",
  "齒",
  "龍","龜",
  "龠",
];

const radicalsPath = path.join(__dirname, "..", "radicals.js");
const src = fs.readFileSync(radicalsPath, "utf8");

// Trích keys từ radicals.js (các chuỗi bên trong `"..."` trước `: {`).
const presentKeys = new Set();
const re = /"([^"]+)"\s*:\s*\{/g;
let m;
while ((m = re.exec(src)) !== null) presentKeys.add(m[1]);

const missing = KANGXI_214.filter((r) => !presentKeys.has(r));
const extras = [...presentKeys].filter((k) => !KANGXI_214.includes(k));

console.log(`Tổng bộ thủ đã có trong radicals.js: ${presentKeys.size}`);
console.log(`214 Kangxi chuẩn: ${KANGXI_214.length}`);
console.log(`\n✅ Có ${KANGXI_214.length - missing.length}/214 Kangxi.`);

if (missing.length) {
  console.log(`\n❌ Thiếu ${missing.length} bộ:`);
  missing.forEach((r, i) => console.log(`  ${i + 1}. ${r}  (U+${r.codePointAt(0).toString(16).toUpperCase()})`));
} else {
  console.log(`\n🎉 Đủ cả 214 bộ thủ Kangxi.`);
}

if (extras.length) {
  console.log(`\nℹ️  ${extras.length} biến thể / bộ thủ thêm (ngoài 214 chính):`);
  console.log("  " + extras.join(" "));
}
