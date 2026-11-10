// phrases.js — Màn "50 câu giao tiếp" (mục 8) + chạm-cụm-giải-nghĩa (mục 9) + Tra chữ (mục 10).
// Nạp sau app.js (window.App.speak) và phrases-data.js (window.PHRASE_THEMES).
(function () {
  "use strict";
  const KEY = "flashcard_zh_phrases_v1";
  const $ = (id) => document.getElementById(id);
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function stripTones(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

  // ---------- State ----------
  let st = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  if (!st.done) st.done = {};       // { themeId: [n, ...] }
  if (!st.review) st.review = {};   // { themeId: true|false }

  const THEMES = window.PHRASE_THEMES || [];
  let currentTheme = null;   // theme object
  let currentIndex = 0;
  let revealed = false;
  let activeChunk = null;    // { text, pinyin, meaning }

  let HACKNAO = [];          // OCR nháp sách (mục 10)
  let EDITS = {};            // { page: {char, pinyin, hanviet, meaning} } — bản sửa của người dùng
  let editingEntry = null;   // { page, char, pinyin, hanviet, meaning, image, raw, words }
  const EDITS_KEY = "flashcard_zh_dict_edits";

  // ---------- Từ điển (mục 10, hạt giống từ 50 câu) ----------
  function buildDict() {
    const map = {};
    for (const t of THEMES) for (const it of t.items) for (const c of it.c) {
      const [text, pinyin, meaning] = c;
      if (!map[text]) map[text] = { text, pinyin, meaning };
    }
    return Object.values(map).sort((a, b) => a.text.localeCompare(b.text, "zh"));
  }
  const DICT = buildDict();

  function loadEdits() { try { EDITS = JSON.parse(localStorage.getItem(EDITS_KEY)) || {}; } catch (e) { EDITS = {}; } }
  function saveEdits() { try { localStorage.setItem(EDITS_KEY, JSON.stringify(EDITS)); } catch (e) {} }
  function loadHacknao() {
    fetch("out/hacknao/dict.json")
      .then((r) => r.json())
      .then((d) => { HACKNAO = Array.isArray(d) ? d : []; })
      .catch(() => {});
  }

  function speak(text) { if (text && window.App) { try { window.App.stopSpeak(); window.App.speak(text); } catch (e) {} } }

  // ---------- Render ----------
  const root = () => $("phrasesContent");

  function render() {
    const r = root();
    if (!r) return;
    if (currentTheme) renderSentence(r);
    else renderThemeList(r);
  }

  function doneCount(themeId) { return (st.done[themeId] || []).length; }
  function isDone(themeId, n) { return (st.done[themeId] || []).includes(n); }

  function renderThemeList(r) {
    const cards = THEMES.map((t) => {
      const done = doneCount(t.id);
      return `<button class="phrase-theme" data-theme="${esc(t.id)}">
        <span class="pt-name">${esc(t.name)}</span>
        <span class="pt-count">${done}/${t.items.length}</span>
      </button>`;
    }).join("");

    r.innerHTML = `
      <h2 class="view-title">💬 50 câu giao tiếp</h2>
      <p class="muted">Chọn một chủ đề để học từng câu. Chạm vào cụm chữ Hán để xem nghĩa từng phần.</p>
      <div class="phrases-themes">${cards}</div>
      <div class="dict-box">
        <h3>🔎 Tra chữ</h3>
        <input id="dictSearch" class="dict-search" type="search" placeholder="Gõ chữ Hán, pinyin hoặc nghĩa (vd: 女儿 / nü'er / con gái)" />
        <div id="dictResults" class="dict-results"></div>
      </div>
      ${renderEditPanel()}`;
  }

  function searchDict(q) {
    const results = document.getElementById("dictResults");
    if (!results) return;
    q = q.trim();
    if (!q) { results.innerHTML = ""; return; }
    const qn = stripTones(q);
    const ql = q.toLowerCase();

    const out = [];
    DICT.forEach((d) => {
      if (d.text.includes(q) || d.meaning.toLowerCase().includes(ql) || stripTones(d.pinyin).includes(qn)) {
        out.push({ kind: "vocab", text: d.text, pinyin: d.pinyin, meaning: d.meaning });
      }
    });
    HACKNAO.forEach((e) => {
      const edit = EDITS[e.page];
      const text = (edit && edit.char) || e.char;
      if (!text) return;
      const hay = [text, e.raw || "", (e.words || []).join(" ")].join(" ").toLowerCase();
      const m = (edit && edit.meaning) || "";
      const p = (edit && edit.pinyin) || "";
      if (hay.includes(q) || hay.includes(ql) || (m && m.toLowerCase().includes(ql)) || (p && stripTones(p).includes(qn))) {
        out.push({ kind: "book", key: e.page, text, pinyin: p, hanviet: (edit && edit.hanviet) || "", meaning: m, page: e.page, image: e.image, raw: e.raw, words: e.words });
      }
    });

    if (!out.length) { results.innerHTML = `<p class="muted">Không tìm thấy từ phù hợp.</p>`; return; }
    results.innerHTML = out.slice(0, 40).map((d) => {
      if (d.kind === "vocab") {
        return `<button class="dict-item" data-speak-item="${esc(d.text)}">
          <span class="di-hanzi" lang="zh-CN">${esc(d.text)}</span>
          <span class="di-pinyin">${esc(d.pinyin)}</span>
          <span class="di-meaning">${esc(d.meaning)}</span>
        </button>`;
      }
      return `<div class="dict-item book">
        <span class="di-hanzi" lang="zh-CN">${esc(d.text)}</span>
        <span class="di-meaning">${esc(d.meaning || "(chưa sửa — nhấn Sửa)")}</span>
        <span class="di-page">tr.${d.page}</span>
        <button class="btn btn-ghost di-edit" data-edit="${d.key}">✏️ Sửa</button>
      </div>`;
    }).join("");
  }

  function renderEditPanel() {
    if (editingEntry == null) return "";
    const e = editingEntry;
    return `<div class="chunk-panel edit-panel" role="dialog" aria-label="Sửa mục từ điển">
      <div class="chunk-panel-head">
        <strong>✏️ Sửa mục (trang ${e.page})</strong>
        <button class="cp-close" data-act="close-edit" aria-label="Đóng">✕</button>
      </div>
      <img class="edit-img" src="${esc(e.image)}" alt="Trang ${e.page}" />
      <label>Chữ Hán <input id="editChar" class="edit-input" value="${esc(e.char)}" /></label>
      <label>Pinyin <input id="editPinyin" class="edit-input" value="${esc(e.pinyin)}" /></label>
      <label>Âm Hán Việt <input id="editHanviet" class="edit-input" value="${esc(e.hanviet)}" /></label>
      <label>Nghĩa tiếng Việt <input id="editMeaning" class="edit-input" value="${esc(e.meaning)}" /></label>
      <div class="edit-actions">
        <button class="btn btn-secondary" data-act="save-edit">💾 Lưu</button>
      </div>
    </div>`;
  }

  // ---------- Màn học câu ----------
  function renderSentence(r) {
    const t = currentTheme;
    const it = t.items[currentIndex];
    const review = st.review[t.id] === true;
    const showAnswer = !review || revealed;
    const done = isDone(t.id, it.n);

    const chunks = it.c.map((c, i) =>
      `<button class="chunk${activeChunk && activeChunk.text === c[0] ? " active" : ""}" data-ci="${i}" lang="zh-CN">${esc(c[0])}</button>`
    ).join("");

    const answerHTML = showAnswer
      ? `<div class="phrase-pinyin">${esc(it.p)}</div><div class="phrase-meaning">${esc(it.m)}</div>` : "";
    const revealBtn = (review && !revealed) ? `<button class="btn btn-primary" data-act="reveal">Xem nghĩa</button>` : "";
    const chunkPanel = activeChunk
      ? `<div class="chunk-panel" role="dialog" aria-label="Giải thích cụm">
          <div class="chunk-panel-head">
            <span class="cp-hanzi" lang="zh-CN">${esc(activeChunk.text)}</span>
            <span class="cp-pinyin">${esc(activeChunk.pinyin)}</span>
            <button class="cp-close" data-act="close-chunk" aria-label="Đóng">✕</button>
          </div>
          <div class="cp-meaning">${esc(activeChunk.meaning)}</div>
          <button class="btn btn-ghost" data-act="speak-chunk">🔊 Nghe cụm</button>
        </div>` : "";

    r.innerHTML = `
      <div class="phrases-head">
        <button class="lesson-back" data-act="back-themes">← Chủ đề</button>
        <div class="phrases-head-main">
          <h2 class="view-title">${esc(t.name)}</h2>
          <span class="muted">Câu ${currentIndex + 1}/${t.items.length}</span>
        </div>
      </div>
      <div class="phrase-card">
        <div class="phrase-chunks">${chunks}</div>
        ${answerHTML}
        ${revealBtn}
        <button class="btn btn-ghost" data-act="speak">🔊 Nghe cả câu</button>
      </div>
      ${chunkPanel}
      <div class="phrase-nav">
        <button class="btn btn-secondary" data-act="prev" ${currentIndex === 0 ? "disabled" : ""}>← Trước</button>
        <button class="btn btn-ghost" data-act="toggle-review">${review ? "📖 Học" : "🧠 Ôn"}</button>
        <button class="btn btn-ghost" data-act="toggle-done">${done ? "✅ Đã học" : "☐ Đã học"}</button>
        <button class="btn btn-primary" data-act="next">${currentIndex + 1 >= t.items.length ? "Hoàn tất" : "Sau →"}</button>
      </div>`;
  }

  // ---------- Hành động ----------
  function openTheme(id) {
    const t = THEMES.find((x) => x.id === id);
    if (!t) return;
    currentTheme = t; currentIndex = 0; revealed = false; activeChunk = null; render();
  }
  function resetForNew() { revealed = false; activeChunk = null; }
  function openChunk(i) {
    const it = currentTheme.items[currentIndex];
    const c = it.c[i];
    if (!c) return;
    activeChunk = { text: c[0], pinyin: c[1], meaning: c[2] };
    render();
  }
  function nextSentence() {
    const t = currentTheme;
    const it = t.items[currentIndex];
    if (!isDone(t.id, it.n)) { (st.done[t.id] = st.done[t.id] || []).push(it.n); save(); }
    if (currentIndex + 1 < t.items.length) { currentIndex++; resetForNew(); render(); }
    else { currentTheme = null; render(); }
  }
  function toggleReview() {
    st.review[currentTheme.id] = st.review[currentTheme.id] !== true;
    revealed = false; activeChunk = null; save(); render();
  }
  function toggleDone() {
    const t = currentTheme, it = t.items[currentIndex];
    let arr = st.done[t.id] || [];
    arr = arr.includes(it.n) ? arr.filter((x) => x !== it.n) : arr.concat(it.n);
    st.done[t.id] = arr; save(); render();
  }
  function openEdit(page) {
    const e = HACKNAO.find((x) => x.page === page);
    if (!e) return;
    const ed = EDITS[page] || {};
    editingEntry = { page, char: ed.char || e.char, pinyin: ed.pinyin || "", hanviet: ed.hanviet || "", meaning: ed.meaning || "", image: e.image, raw: e.raw, words: e.words };
    render();
  }
  function saveEdit() {
    if (editingEntry == null) return;
    const page = editingEntry.page;
    EDITS[page] = {
      char: ($("editChar") && $("editChar").value) || "",
      pinyin: ($("editPinyin") && $("editPinyin").value) || "",
      hanviet: ($("editHanviet") && $("editHanviet").value) || "",
      meaning: ($("editMeaning") && $("editMeaning").value) || "",
    };
    saveEdits();
    editingEntry = null;
    render();
  }

  function onClick(e) {
    const themeBtn = e.target.closest("[data-theme]");
    if (themeBtn) { openTheme(themeBtn.dataset.theme); return; }
    const speakEl = e.target.closest("[data-speak]");
    if (speakEl) { e.stopPropagation(); speak(speakEl.dataset.speak); return; }
    const speakItem = e.target.closest("[data-speak-item]");
    if (speakItem) { speak(speakItem.dataset.speakItem); return; }
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) { openEdit(parseInt(editBtn.dataset.edit, 10)); return; }
    const chunk = e.target.closest("[data-ci]");
    if (chunk) { openChunk(parseInt(chunk.dataset.ci, 10)); return; }
    const act = e.target.closest("[data-act]");
    if (!act) return;
    switch (act.dataset.act) {
      case "back-themes": currentTheme = null; activeChunk = null; render(); break;
      case "reveal": revealed = true; render(); break;
      case "speak": speak(currentTheme.items[currentIndex].h); break;
      case "speak-chunk": if (activeChunk) speak(activeChunk.text); break;
      case "close-chunk": activeChunk = null; render(); break;
      case "close-edit": editingEntry = null; render(); break;
      case "save-edit": saveEdit(); break;
      case "prev": if (currentIndex > 0) { currentIndex--; resetForNew(); render(); } break;
      case "next": nextSentence(); break;
      case "toggle-review": toggleReview(); break;
      case "toggle-done": toggleDone(); break;
    }
  }

  document.addEventListener("input", (e) => { if (e.target && e.target.id === "dictSearch") searchDict(e.target.value); });

  const rc = root();
  if (rc) rc.addEventListener("click", onClick);

  loadEdits();
  loadHacknao();
  window.Phrases = { render };
  render();
})();

