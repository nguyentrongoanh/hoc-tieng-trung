(function () {
  const importFile = document.getElementById("importFile");
  const importStatus = document.getElementById("importStatus");
  const importPreview = document.getElementById("importPreview");

  let pdfjsReady = !!window.pdfjsLib;
  window.addEventListener("pdfjs-ready", () => (pdfjsReady = true));

  function setStatus(msg) {
    importStatus.textContent = msg;
  }

  importFile.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    importPreview.innerHTML = "";
    setStatus(`Đang xử lý "${file.name}"...`);
    try {
      const pages = await extractByType(file);
      const nonEmpty = pages.filter((p) => extractChineseWords(p.text).length > 0);
      if (nonEmpty.length === 0) {
        setStatus("Không tìm thấy chữ Hán nào trong file.");
        return;
      }
      setStatus(`Đã trích xuất ${pages.length} trang/slide (${nonEmpty.length} có chữ Hán).`);
      renderPreview(pages, file.name);
    } catch (err) {
      console.error(err);
      setStatus("Lỗi: " + (err.message || err));
    }
  });

  async function extractByType(file) {
    const name = (file.name || "").toLowerCase();
    if (name.endsWith(".pdf")) return extractPdf(file);
    if (name.endsWith(".pptx")) return extractPptx(file);
    if ((file.type || "").startsWith("image/")) return extractImage(file);
    throw new Error("Chỉ hỗ trợ PDF, PPTX, hoặc ảnh (PNG/JPG).");
  }

  async function extractPdf(file) {
    if (!pdfjsReady) {
      setStatus("Đang tải PDF.js...");
      await new Promise((resolve) => {
        const check = () => (window.pdfjsLib ? resolve() : setTimeout(check, 100));
        check();
      });
    }
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      setStatus(`PDF: đang đọc trang ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((it) => it.str).join(" ");
      pages.push({ num: i, title: `Trang ${i}`, text });
    }
    return pages;
  }

  async function extractImage(file) {
    if (typeof Tesseract === "undefined") {
      throw new Error("Thư viện OCR chưa tải xong. Thử lại sau vài giây.");
    }
    setStatus("OCR ảnh (lần đầu phải tải dữ liệu chi_sim ~10MB)...");
    const result = await Tesseract.recognize(file, "chi_sim+chi_tra", {
      logger: (m) => {
        if (m.status && m.progress != null) {
          setStatus(`OCR: ${m.status} ${(m.progress * 100).toFixed(0)}%`);
        }
      },
    });
    return [{ num: 1, title: file.name, text: result.data.text || "" }];
  }

  async function extractPptx(file) {
    if (typeof JSZip === "undefined") {
      throw new Error("Thư viện JSZip chưa tải xong.");
    }
    const zip = await JSZip.loadAsync(file);
    const slideNames = Object.keys(zip.files)
      .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort((a, b) => {
        const na = parseInt(a.match(/slide(\d+)\.xml$/)[1], 10);
        const nb = parseInt(b.match(/slide(\d+)\.xml$/)[1], 10);
        return na - nb;
      });
    const pages = [];
    for (let i = 0; i < slideNames.length; i++) {
      setStatus(`PPTX: đang đọc slide ${i + 1}/${slideNames.length}...`);
      const xml = await zip.files[slideNames[i]].async("string");
      // Lấy tất cả nội dung trong <a:t>...</a:t>
      const texts = [];
      const re = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
      let m;
      while ((m = re.exec(xml)) !== null) {
        texts.push(decodeXml(m[1]));
      }
      pages.push({ num: i + 1, title: `Slide ${i + 1}`, text: texts.join(" ") });
    }
    return pages;
  }

  function decodeXml(s) {
    return s
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");
  }

  // ---------- Trích từ Hán ----------
  // Tách các khối chữ Hán liên tiếp, bỏ ký tự khác.
  // Với khối dài (>=5 ký tự): cắt cửa sổ 2 và 3 ký tự để làm từ vựng.
  function extractChineseWords(text) {
    if (!text) return [];
    const blocks = text.match(/[一-鿿]+/g) || [];
    const seen = new Set();
    const result = [];
    const push = (w) => {
      if (!seen.has(w)) {
        seen.add(w);
        result.push(w);
      }
    };
    for (const b of blocks) {
      if (b.length <= 4) {
        push(b);
      } else {
        // khối dài: tạo cửa sổ 2 và 3 ký tự
        for (let i = 0; i < b.length - 1; i++) push(b.substr(i, 2));
        for (let i = 0; i < b.length - 2; i++) push(b.substr(i, 3));
      }
    }
    return result;
  }

  function pinyinOf(w) {
    try {
      if (window.pinyinPro && typeof window.pinyinPro.pinyin === "function") {
        return window.pinyinPro.pinyin(w, { toneType: "symbol", nonZh: "consecutive" });
      }
      if (typeof window.pinyin === "function") {
        return window.pinyin(w, { toneType: "symbol" });
      }
    } catch (e) {
      /* ignore */
    }
    return "";
  }

  // ---------- Preview ----------
  function renderPreview(pages, filename) {
    importPreview.innerHTML = "";

    const header = document.createElement("div");
    header.className = "preview-header";
    header.innerHTML = `
      <div><strong>${escapeHtml(filename)}</strong> — ${pages.length} trang/slide</div>
      <button class="create-all-btn">📚 Tạo tất cả thành bộ thẻ</button>
    `;
    header.querySelector(".create-all-btn").addEventListener("click", () => {
      let total = 0;
      pages.forEach((p, idx) => total += createFromPage(p, idx, filename, true));
      if (total === 0) alert("Không có trang nào chứa chữ Hán.");
      else alert(`Đã tạo ${pages.filter(p => extractChineseWords(p.text).length).length} bộ thẻ.`);
    });
    importPreview.appendChild(header);

    pages.forEach((p, idx) => {
      const words = extractChineseWords(p.text);
      const block = document.createElement("div");
      block.className = "lesson-preview";
      const chips = words
        .slice(0, 40)
        .map((w) => `<span class="chip">${escapeHtml(w)}</span>`)
        .join("");
      block.innerHTML = `
        <div class="lesson-title">
          <strong>Buổi ${idx + 1}</strong> — ${escapeHtml(p.title)}
          <span class="muted">(${words.length} từ ứng viên)</span>
        </div>
        <details>
          <summary class="muted">Xem text gốc đã trích</summary>
          <pre class="extracted-text">${escapeHtml(p.text).slice(0, 2000)}${
        p.text.length > 2000 ? "\n..." : ""
      }</pre>
        </details>
        <div class="words-preview">${chips || '<em class="muted">Không có chữ Hán</em>'}${
        words.length > 40 ? ` <span class="muted">+${words.length - 40} từ nữa</span>` : ""
      }</div>
        <button class="create-deck-btn" ${words.length === 0 ? "disabled" : ""}>
          ➕ Tạo bộ thẻ "Buổi ${idx + 1}" (${words.length} thẻ)
        </button>
      `;
      block.querySelector(".create-deck-btn").addEventListener("click", () => {
        const n = createFromPage(p, idx, filename, false);
        if (n > 0) alert(`Đã tạo bộ "Buổi ${idx + 1}" với ${n} thẻ.`);
      });
      importPreview.appendChild(block);
    });
  }

  function createFromPage(page, idx, filename, silent) {
    const words = extractChineseWords(page.text);
    if (words.length === 0) return 0;
    const cards = words.map((w) => ({
      hanzi: w,
      pinyin: pinyinOf(w),
      meaning: "",
      example: "",
    }));
    const baseName = filename.replace(/\.[^.]+$/, "");
    const name = `Buổi ${idx + 1} · ${baseName}`;
    window.addImportedDeck(name, cards);
    return cards.length;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
