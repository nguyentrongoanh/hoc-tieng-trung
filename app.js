(function () {
  const STORAGE_KEY = "flashcard_zh_v3";
  const CUSTOM_DECK_ID = "my_custom";

  // ---------- State ----------
  let state = loadState();
  if (!state.customCards) state.customCards = [];
  if (!state.importedDecks) state.importedDecks = {};
  if (!state.srs) state.srs = {};                // { deckId: { cardKey: srsState } }
  if (!state.reviewLog) state.reviewLog = [];    // [{t, deckId, cardKey, rating, intervalAfter}]
  if (!state.progress) state.progress = {};      // { deckId: { order } } — dùng cho browse shuffle
  if (!state.mode) state.mode = "study";         // "study" | "browse"
  if (typeof state.autoplay !== "boolean") state.autoplay = false;
  if (typeof state.index !== "number") state.index = 0;

  const allDeckIds = () => [
    ...Object.keys(DECKS),
    CUSTOM_DECK_ID,
    ...Object.keys(state.importedDecks),
  ];
  if (!allDeckIds().includes(state.deckId)) state.deckId = Object.keys(DECKS)[0];

  // Queue cho study mode (được tính lại khi đổi deck/mode)
  let queue = [];
  let queueIndex = 0;

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const deckSelect = $("deckSelect");
  const modeStudyBtn = $("modeStudyBtn");
  const modeBrowseBtn = $("modeBrowseBtn");
  const shuffleBtn = $("shuffleBtn");
  const resetBtn = $("resetBtn");
  const deleteDeckBtn = $("deleteDeckBtn");
  const card = $("card");
  const cardInner = $("cardInner");
  const hanziEl = $("hanzi");
  const pinyinEl = $("pinyin");
  const meaningEl = $("meaning");
  const exampleEl = $("example");
  const cardTagFront = $("cardTagFront");
  const cardTagBack = $("cardTagBack");
  const prevBtn = $("prevBtn");
  const nextBtn = $("nextBtn");
  const srsActions = $("srsActions");
  const srsHint = $("srsHint");
  const addForm = $("addForm");
  const editList = $("editList");
  const heatmapEl = $("heatmap");
  const heatmapTotal = $("heatmapTotal");
  const radicalsList = $("radicalsList");
  const speakFrontBtn = $("speakFront");
  const speakBackBtn = $("speakBack");
  const autoplayCheck = $("autoplayCheck");
  const voiceInfo = $("voiceInfo");
  const backupBtn = $("backupBtn");
  const restoreBtn = $("restoreBtn");
  const restoreFile = $("restoreFile");

  // ---------- Storage ----------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // ---------- Deck helpers ----------
  function isUserDeck(deckId) {
    return deckId === CUSTOM_DECK_ID || state.importedDecks[deckId] !== undefined;
  }
  function getDeckCards(deckId) {
    if (deckId === CUSTOM_DECK_ID) return state.customCards;
    if (state.importedDecks[deckId]) return state.importedDecks[deckId].cards;
    return (DECKS[deckId] && DECKS[deckId].cards) || [];
  }
  function ensureDeckBuckets() {
    if (!state.srs[state.deckId]) state.srs[state.deckId] = {};
    if (!state.progress[state.deckId]) state.progress[state.deckId] = { order: null };
  }
  function currentSRSMap() {
    ensureDeckBuckets();
    return state.srs[state.deckId];
  }

  // Thẻ hiện tại tùy chế độ
  function getCurrentCard() {
    const cards = getDeckCards(state.deckId);
    if (cards.length === 0) return null;

    if (state.mode === "study") {
      if (queue.length === 0) return null;
      if (queueIndex >= queue.length) queueIndex = 0;
      if (queueIndex < 0) queueIndex = queue.length - 1;
      const item = queue[queueIndex];
      return { card: item.card, status: item.status, srs: currentSRSMap()[SRS.cardKey(item.card)] };
    } else {
      // browse
      const order = state.progress[state.deckId].order;
      const list = order && order.length === cards.length ? order.map((i) => cards[i]) : cards;
      if (state.index >= list.length) state.index = 0;
      if (state.index < 0) state.index = list.length - 1;
      const c = list[state.index];
      return { card: c, status: "browse", srs: currentSRSMap()[SRS.cardKey(c)] };
    }
  }

  function rebuildQueue() {
    ensureDeckBuckets();
    const cards = getDeckCards(state.deckId);
    queue = SRS.buildQueue(cards, currentSRSMap());
    queueIndex = 0;
  }

  // ---------- UI: populate ----------
  function populateDeckSelect() {
    deckSelect.innerHTML = "";

    const builtin = document.createElement("optgroup");
    builtin.label = "Bộ mẫu";
    Object.entries(DECKS).forEach(([id, d]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${d.name} (${d.cards.length})`;
      builtin.appendChild(opt);
    });
    deckSelect.appendChild(builtin);

    const mine = document.createElement("optgroup");
    mine.label = "Của tôi";
    const myOpt = document.createElement("option");
    myOpt.value = CUSTOM_DECK_ID;
    myOpt.textContent = `Của tôi (${state.customCards.length})`;
    mine.appendChild(myOpt);
    deckSelect.appendChild(mine);

    const imported = Object.entries(state.importedDecks);
    if (imported.length) {
      const g = document.createElement("optgroup");
      g.label = "Import";
      imported.forEach(([id, d]) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = `${d.name} (${d.cards.length})`;
        g.appendChild(opt);
      });
      deckSelect.appendChild(g);
    }

    deckSelect.value = state.deckId;
  }

  function updateModeButtons() {
    modeStudyBtn.classList.toggle("active", state.mode === "study");
    modeBrowseBtn.classList.toggle("active", state.mode === "browse");
    shuffleBtn.style.display = state.mode === "browse" ? "" : "none";
    prevBtn.style.visibility = state.mode === "browse" ? "visible" : "hidden";
    nextBtn.style.visibility = state.mode === "browse" ? "visible" : "hidden";
  }

  // ---------- Render ----------
  function render() {
    ensureDeckBuckets();
    deleteDeckBtn.style.display = isUserDeck(state.deckId) ? "" : "none";
    updateModeButtons();
    renderStats();
    renderHeatmap();

    const cards = getDeckCards(state.deckId);
    if (cards.length === 0) {
      showCard({ hanzi: "—", pinyin: "", meaning: "Bộ thẻ trống. Import file hoặc thêm thẻ bên dưới.", example: "" }, "browse");
      setSRSButtonsEnabled(false);
      srsHint.textContent = "Chưa có thẻ.";
      renderEditList();
      return;
    }

    if (state.mode === "study" && queue.length === 0) rebuildQueue();

    const cur = getCurrentCard();
    if (!cur) {
      showCard({ hanzi: "🎉", pinyin: "", meaning: "Hết thẻ cần ôn hôm nay!", example: "Chuyển sang chế độ Lướt để xem lại toàn bộ." }, "done");
      setSRSButtonsEnabled(false);
      srsHint.textContent = "Không còn thẻ due. Quay lại sau, hoặc chọn bộ khác.";
      renderEditList();
      return;
    }

    showCard(cur.card, cur.status);
    updateIntervalPreview(cur.srs);
    setSRSButtonsEnabled(false); // chỉ enable sau khi flip
    srsHint.textContent = "Lật thẻ để hiện các nút đánh giá.";
    renderEditList();
  }

  function showCard(c, status) {
    hanziEl.textContent = c.hanzi;
    pinyinEl.textContent = c.pinyin || "(chưa có pinyin)";
    meaningEl.textContent = c.meaning || "(chưa có nghĩa — sửa ở bảng dưới)";
    exampleEl.textContent = c.example || "";
    const tag = tagLabel(status);
    cardTagFront.textContent = tag;
    cardTagBack.textContent = tag;
    cardTagFront.className = "card-tag tag-" + status;
    cardTagBack.className = "card-tag tag-" + status;
    card.classList.remove("flipped");
    renderRadicals(c.hanzi);
    // Autoplay: chỉ chạy khi đã có user gesture (browser block TTS trước đó)
    if (state.autoplay && userHasInteracted && c.hanzi && /[一-鿿]/.test(c.hanzi)) {
      setTimeout(() => speak(c.hanzi), 250);
    }
  }

  // ---------- Audio (TTS tiếng Trung) ----------
  let zhVoice = null;
  let allZhVoices = [];
  const synth = typeof window.speechSynthesis !== "undefined" ? window.speechSynthesis : null;

  function pickZhVoice() {
    if (!synth) return;
    const voices = synth.getVoices() || [];
    allZhVoices = voices.filter((v) => {
      const lang = (v.lang || "").toLowerCase().replace("_", "-");
      return lang.startsWith("zh") || lang.startsWith("cmn");
    });
    const preferred = [
      /tingting|mei-?jia|sin-?ji/i,                       // macOS
      /xiaoxiao|yaoyao|kangkang|huihui/i,                 // Windows
      /google.*(?:中国|mandarin|普通话|zh[-_]cn)/i,         // Chrome Google
      /中国大陆/,
    ];
    let picked = null;
    for (const re of preferred) {
      picked = allZhVoices.find((x) => re.test(x.name));
      if (picked) break;
    }
    if (!picked && allZhVoices.length) {
      picked = allZhVoices.find((v) => v.lang.toLowerCase().includes("zh-cn")) || allZhVoices[0];
    }
    zhVoice = picked || null;
    updateVoiceInfo();
  }

  function updateVoiceInfo() {
    if (!voiceInfo) return;
    if (!synth) {
      voiceInfo.textContent = "⚠️ Trình duyệt không hỗ trợ phát âm (Web Speech API).";
      return;
    }
    const totalVoices = (synth.getVoices() || []).length;
    const parts = [];
    if (zhVoice) {
      parts.push(`🎙 Giọng: <strong>${zhVoice.name}</strong> (${zhVoice.lang})`);
    } else if (totalVoices === 0) {
      parts.push("⏳ Đang chờ trình duyệt load danh sách giọng...");
    } else {
      parts.push(`⚠️ Không có giọng tiếng Trung trong ${totalVoices} giọng khả dụng.`);
    }
    parts.push(`<button class="voice-test-btn" id="voiceTestBtn">🔊 Test + chẩn đoán</button>`);
    voiceInfo.innerHTML = parts.join(" · ");
    const btn = document.getElementById("voiceTestBtn");
    if (btn) btn.addEventListener("click", diagnoseTTS);
  }

  // Chẩn đoán TTS: chạy test và hiện kết quả qua alert() để user thấy trực tiếp
  function diagnoseTTS() {
    const lines = [];
    if (!synth) {
      alert("❌ Trình duyệt không hỗ trợ speechSynthesis API.");
      return;
    }
    const allVoices = synth.getVoices() || [];
    const zhList = allVoices.filter((v) => /^zh|^cmn/i.test(v.lang));
    lines.push(`Tổng số giọng khả dụng: ${allVoices.length}`);
    lines.push(`Giọng Trung tìm thấy: ${zhList.length}`);
    if (zhList.length) {
      zhList.slice(0, 10).forEach((v, i) => lines.push(`  ${i + 1}. ${v.name} (${v.lang})`));
    }
    lines.push(`Giọng đang chọn: ${zhVoice ? zhVoice.name + " (" + zhVoice.lang + ")" : "(chưa có)"}`);
    lines.push(`synth.speaking: ${synth.speaking}, paused: ${synth.paused}, pending: ${synth.pending}`);
    lines.push(`User đã tương tác: ${userHasInteracted}`);
    lines.push("");
    lines.push("Đang thử phát '你好'...");

    let fired = { start: false, end: false, error: null };
    synth.cancel();
    if (synth.paused) synth.resume();
    const u = new SpeechSynthesisUtterance("你好");
    u.lang = "zh-CN";
    u.rate = 0.9;
    if (zhVoice) u.voice = zhVoice;
    u.onstart = () => { fired.start = true; };
    u.onend = () => { fired.end = true; };
    u.onerror = (e) => { fired.error = e.error || String(e); };
    synth.speak(u);

    setTimeout(() => {
      lines.push(`Sau 2.5s → onstart: ${fired.start}, onend: ${fired.end}, error: ${fired.error || "không"}`);
      if (!fired.start && !fired.error) {
        lines.push("");
        lines.push("⚠️ Không có sự kiện nào fire — khả năng cao:");
        lines.push("  1. Browser block TTS (click vào trang trước rồi thử lại)");
        lines.push("  2. OS chưa cài giọng tiếng Trung");
        if (navigator.userAgent.includes("Mac")) {
          lines.push("  Mac: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → Chinese");
        }
      } else if (fired.error) {
        lines.push(`\n⚠️ TTS trả error: ${fired.error}`);
      } else if (fired.start && !fired.end) {
        lines.push("\n✅ Đã bắt đầu phát (có thể đang phát hoặc đã kết thúc rất nhanh).");
      } else if (fired.start && fired.end) {
        lines.push("\n✅ Phát xong bình thường. Nếu không nghe tiếng → kiểm tra loa/volume máy.");
      }
      alert(lines.join("\n"));
    }, 2500);
  }

  function speak(text) {
    if (!synth || !text) {
      console.warn("[TTS] synth hoặc text không có");
      return;
    }
    if (!zhVoice) pickZhVoice();
    try {
      synth.cancel();
      // Chrome bug: nếu đang paused thì resume
      if (synth.paused) synth.resume();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = 0.85;
      u.pitch = 1;
      if (zhVoice) u.voice = zhVoice;
      u.onerror = (e) => console.warn("[TTS] error:", e.error || e, "text:", text);
      u.onstart = () => {
        // Chrome bug workaround: loop resume để tránh bị cắt ở 15s
        if (chromeKeepAliveTimer) clearInterval(chromeKeepAliveTimer);
        chromeKeepAliveTimer = setInterval(() => {
          if (!synth.speaking) { clearInterval(chromeKeepAliveTimer); chromeKeepAliveTimer = null; return; }
          synth.pause(); synth.resume();
        }, 10000);
      };
      u.onend = () => {
        if (chromeKeepAliveTimer) { clearInterval(chromeKeepAliveTimer); chromeKeepAliveTimer = null; }
      };
      synth.speak(u);
    } catch (e) {
      console.warn("[TTS] failed:", e);
    }
  }
  let chromeKeepAliveTimer = null;

  // Init voice với retry aggressive (một số browser load voices chậm)
  if (synth) {
    pickZhVoice();
    if (typeof synth.onvoiceschanged !== "undefined" || true) {
      synth.addEventListener("voiceschanged", pickZhVoice);
    }
    // Retry mỗi 400ms trong 6s cho đến khi có zhVoice
    let retryCount = 0;
    const retry = setInterval(() => {
      retryCount++;
      if (!zhVoice) pickZhVoice();
      if (zhVoice || retryCount > 15) clearInterval(retry);
    }, 400);
  } else {
    updateVoiceInfo();
  }

  // Theo dõi user gesture — speechSynthesis nhiều browser block trước gesture đầu tiên
  let userHasInteracted = false;
  const markInteracted = () => { userHasInteracted = true; };
  document.addEventListener("click", markInteracted, { capture: true, once: true });
  document.addEventListener("keydown", markInteracted, { capture: true, once: true });

  // ---------- Bộ thủ ----------
  // Dịch tên kết cấu chữ (struct) sang tiếng Việt
  const STRUCT_VI = {
    "左右结构": "Trái - phải",
    "上下结构": "Trên - dưới",
    "左中右结构": "Trái - giữa - phải",
    "上中下结构": "Trên - giữa - dưới",
    "独体结构": "Độc thể (một khối)",
    "半包围结构": "Bán bao vây",
    "全包围结构": "Toàn bao vây",
    "嵌套结构": "Lồng nhau",
    "品字结构": 'Kiểu chữ "品" (3 khối)',
    "田字结构": 'Kiểu chữ "田" (4 khối)',
  };

  function renderRadicals(hanzi) {
    radicalsList.innerHTML = "";
    const chars = Array.from(hanzi || "").filter((c) => /[一-鿿]/.test(c));
    if (chars.length === 0) {
      radicalsList.innerHTML = '<p class="muted">Không có chữ Hán để phân tích.</p>';
      return;
    }

    // cnchar.radical trả về MẢNG objects: [{ radical, radicalCount, struct }]
    let radInfos = [];
    try {
      if (window.cnchar && typeof window.cnchar.radical === "function") {
        const result = window.cnchar.radical(chars.join(""));
        radInfos = Array.isArray(result) ? result : [];
      }
    } catch (e) { /* ignore */ }

    const strokes = chars.map((c) => {
      try {
        if (window.cnchar && typeof window.cnchar.stroke === "function") {
          return window.cnchar.stroke(c);
        }
      } catch (e) {}
      return null;
    });

    const frag = document.createDocumentFragment();
    chars.forEach((char, i) => {
      const rInfo = radInfos[i] || {};
      const rad = rInfo.radical || "?";
      const residual = rInfo.radicalCount;    // nét ngoài bộ thủ
      const struct = rInfo.struct;
      const info = (typeof RADICALS !== "undefined" && RADICALS[rad]) || null;
      const row = document.createElement("div");
      row.className = "rad-row";
      row.innerHTML = `
        <div class="rad-big">${escapeHtml(char)}</div>
        <div class="rad-detail">
          <div class="rad-top">
            <button class="rad-speak" data-char="${escapeHtml(char)}" title="Nghe cách đọc">🔊</button>
            <span class="rad-glyph" title="Bộ thủ">${escapeHtml(rad)}</span>
            ${info
              ? `<span class="rad-name">Bộ <strong>${escapeHtml(info.viName)}</strong></span>
                 <span class="rad-mean">— ${escapeHtml(info.viMeaning)}</span>`
              : `<span class="muted">(chưa có dữ liệu Việt cho bộ thủ "${escapeHtml(rad)}")</span>`}
          </div>
          <div class="rad-sub muted">
            ${strokes[i] != null ? `<span>Tổng ${strokes[i]} nét</span>` : ""}
            ${residual != null ? `<span>· ngoài bộ thủ: ${residual} nét</span>` : ""}
            ${struct ? `<span>· kết cấu: <strong>${escapeHtml(STRUCT_VI[struct] || struct)}</strong></span>` : ""}
          </div>
        </div>`;
      row.querySelector(".rad-speak").addEventListener("click", (e) => {
        e.stopPropagation();
        speak(char);
      });
      frag.appendChild(row);
    });
    radicalsList.appendChild(frag);
  }

  function tagLabel(status) {
    switch (status) {
      case "new": return "🆕 Mới";
      case "review": return "🔁 Ôn lại";
      case "browse": return "👀 Lướt";
      case "done": return "✅ Xong";
      default: return "";
    }
  }

  function updateIntervalPreview(srs) {
    const prev = SRS.previewAll(srs);
    $("ivAgain").textContent = prev[1];
    $("ivHard").textContent = prev[2];
    $("ivGood").textContent = prev[3];
    $("ivEasy").textContent = prev[4];
  }

  function setSRSButtonsEnabled(enabled) {
    srsActions.classList.toggle("enabled", enabled);
    srsActions.querySelectorAll("button.rate").forEach((b) => (b.disabled = !enabled));
  }

  function renderStats() {
    const cards = getDeckCards(state.deckId);
    const map = currentSRSMap();
    const c = SRS.countsFor(cards, map);
    $("statDue").textContent = c.due;
    $("statNew").textContent = c.new;
    $("statLearning").textContent = c.learning;
    $("statMature").textContent = c.mature;
    $("statToday").textContent = SRS.reviewsToday(state.reviewLog);
    const r = SRS.retentionRate(state.reviewLog, 14);
    $("statRetention").textContent = r == null ? "—" : Math.round(r * 100) + "%";
  }

  function renderHeatmap() {
    const byDay = SRS.reviewsByDay(state.reviewLog, 90);
    const entries = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0]));
    heatmapEl.innerHTML = "";
    const max = Math.max(1, ...entries.map(([, v]) => v));
    entries.forEach(([day, count]) => {
      const level = count === 0 ? 0 : count >= max * 0.75 ? 4 : count >= max * 0.5 ? 3 : count >= max * 0.25 ? 2 : 1;
      const cell = document.createElement("div");
      cell.className = "hc hc-" + level;
      cell.title = `${day}: ${count} lượt ôn`;
      heatmapEl.appendChild(cell);
    });
    const total = entries.reduce((s, [, v]) => s + v, 0);
    heatmapTotal.textContent = `${total} lượt ôn / 90 ngày`;
  }

  function renderEditList() {
    editList.innerHTML = "";
    if (!isUserDeck(state.deckId)) {
      editList.innerHTML = '<p class="muted">Bộ mẫu không sửa được. Chọn bộ "Của tôi" hoặc bộ import.</p>';
      return;
    }
    const cards = getDeckCards(state.deckId);
    if (cards.length === 0) {
      editList.innerHTML = '<p class="muted">Bộ này chưa có thẻ.</p>';
      return;
    }
    const table = document.createElement("table");
    table.className = "edit-table";
    table.innerHTML = `
      <thead><tr>
        <th>#</th><th>Hán</th><th>Pinyin</th><th>Nghĩa tiếng Việt</th><th>Ví dụ</th><th></th>
      </tr></thead><tbody></tbody>`;
    const tbody = table.querySelector("tbody");
    cards.forEach((c, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td><input data-f="hanzi" value="${escapeHtml(c.hanzi)}" /></td>
        <td><input data-f="pinyin" value="${escapeHtml(c.pinyin || "")}" /></td>
        <td><input data-f="meaning" value="${escapeHtml(c.meaning || "")}" placeholder="điền nghĩa..." /></td>
        <td><input data-f="example" value="${escapeHtml(c.example || "")}" /></td>
        <td><button class="del-row" title="Xoá dòng">✕</button></td>`;
      tr.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", (e) => {
          cards[i][e.target.dataset.f] = e.target.value;
          saveState();
        });
      });
      tr.querySelector(".del-row").addEventListener("click", () => {
        if (!confirm("Xoá thẻ này?")) return;
        const key = SRS.cardKey(cards[i]);
        delete currentSRSMap()[key];
        cards.splice(i, 1);
        state.progress[state.deckId].order = null;
        rebuildQueue();
        saveState();
        render();
        populateDeckSelect();
      });
      tbody.appendChild(tr);
    });
    editList.appendChild(table);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- Actions ----------
  function flip() {
    card.classList.toggle("flipped");
    const flipped = card.classList.contains("flipped");
    setSRSButtonsEnabled(flipped);
    srsHint.textContent = flipped
      ? "Chọn mức độ bạn nhớ thẻ này."
      : "Lật thẻ để hiện các nút đánh giá.";
  }

  function rate(rating) {
    const cur = getCurrentCard();
    if (!cur) return;
    const key = SRS.cardKey(cur.card);
    const prev = currentSRSMap()[key];
    const next = SRS.rate(prev, rating);
    currentSRSMap()[key] = next;
    state.reviewLog.push({
      t: Date.now(),
      deckId: state.deckId,
      cardKey: key,
      rating,
      intervalAfter: next.interval,
      easeAfter: next.ease,
    });
    saveState();
    setSRSButtonsEnabled(false);
    advanceWithFade(() => advance(rating));
  }

  // Fade out → snap unflip tức thì (không animation) → update content → fade in.
  // Dùng cho rate + go: user KHÔNG thấy card quay 180°, chỉ thấy fade.
  function advanceWithFade(updateFn) {
    card.classList.add("fading");
    setTimeout(() => {
      // Tắt transition của card-inner để snap unflip không visible
      cardInner.style.transition = "none";
      card.classList.remove("flipped");
      // Force reflow để browser áp dụng thay đổi ngay
      void cardInner.offsetHeight;
      // Update content (gọi advance → render → showCard)
      updateFn();
      // Reset transition và fade in ở frame kế tiếp
      requestAnimationFrame(() => {
        cardInner.style.transition = "";
        card.classList.remove("fading");
      });
    }, 180);
  }

  function advance(lastRating) {
    if (state.mode === "study") {
      const item = queue[queueIndex];
      // Nếu Again (1): đẩy thẻ về cuối queue để ôn lại ngay trong session
      // Nếu Hard/Good/Easy: bỏ khỏi queue (đã schedule future)
      if (lastRating === 1 && item) {
        queue.splice(queueIndex, 1);
        queue.push(item);
      } else {
        queue.splice(queueIndex, 1);
      }
      if (queueIndex >= queue.length) queueIndex = 0;
      if (queue.length === 0) rebuildQueue();
    } else {
      const cards = getDeckCards(state.deckId);
      state.index = (state.index + 1) % cards.length;
    }
    saveState();
    render();
  }

  function go(delta) {
    if (state.mode !== "browse") return;
    const cards = getDeckCards(state.deckId);
    if (cards.length === 0) return;
    state.index = (state.index + delta + cards.length) % cards.length;
    saveState();
    setSRSButtonsEnabled(false);
    advanceWithFade(() => render());
  }

  function shuffle() {
    if (state.mode !== "browse") return;
    const n = getDeckCards(state.deckId).length;
    if (n === 0) return;
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    state.progress[state.deckId].order = order;
    state.index = 0;
    saveState();
    render();
  }

  function resetDeck() {
    if (!confirm("Đặt lại toàn bộ SRS, tiến độ và thứ tự của bộ hiện tại?")) return;
    state.srs[state.deckId] = {};
    state.progress[state.deckId] = { order: null };
    state.index = 0;
    rebuildQueue();
    saveState();
    render();
  }

  function deleteCurrentDeck() {
    if (!isUserDeck(state.deckId)) return;
    const label = state.deckId === CUSTOM_DECK_ID
      ? 'bộ "Của tôi" (xoá sạch mọi thẻ bên trong)'
      : `bộ "${state.importedDecks[state.deckId].name}"`;
    if (!confirm(`Xoá ${label}?`)) return;
    delete state.srs[state.deckId];
    delete state.progress[state.deckId];
    if (state.deckId === CUSTOM_DECK_ID) {
      state.customCards = [];
    } else {
      delete state.importedDecks[state.deckId];
      state.deckId = Object.keys(DECKS)[0];
    }
    state.index = 0;
    rebuildQueue();
    saveState();
    populateDeckSelect();
    render();
  }

  function switchMode(mode) {
    state.mode = mode;
    state.index = 0;
    if (mode === "study") rebuildQueue();
    saveState();
    render();
  }

  // ---------- Events ----------
  deckSelect.addEventListener("change", () => {
    state.deckId = deckSelect.value;
    state.index = 0;
    rebuildQueue();
    saveState();
    render();
  });

  modeStudyBtn.addEventListener("click", () => switchMode("study"));
  modeBrowseBtn.addEventListener("click", () => switchMode("browse"));

  card.addEventListener("click", flip);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  shuffleBtn.addEventListener("click", shuffle);
  resetBtn.addEventListener("click", resetDeck);
  deleteDeckBtn.addEventListener("click", deleteCurrentDeck);

  // Speaker
  const speakCurrent = () => {
    const cur = getCurrentCard();
    if (cur && cur.card && cur.card.hanzi) speak(cur.card.hanzi);
  };
  speakFrontBtn.addEventListener("click", (e) => { e.stopPropagation(); speakCurrent(); });
  speakBackBtn.addEventListener("click", (e) => { e.stopPropagation(); speakCurrent(); });

  // Autoplay
  autoplayCheck.checked = state.autoplay;
  autoplayCheck.addEventListener("change", () => {
    state.autoplay = autoplayCheck.checked;
    saveState();
  });

  // Backup / Restore
  backupBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `flashcard-zh-backup-${ts}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  restoreBtn.addEventListener("click", () => restoreFile.click());
  restoreFile.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!confirm(`Khôi phục từ "${file.name}"? Dữ liệu hiện tại sẽ bị thay thế.`)) {
      restoreFile.value = "";
      return;
    }
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") throw new Error("Không phải JSON hợp lệ.");
      state = data;
      // chuẩn hoá các trường còn thiếu
      if (!state.customCards) state.customCards = [];
      if (!state.importedDecks) state.importedDecks = {};
      if (!state.srs) state.srs = {};
      if (!state.reviewLog) state.reviewLog = [];
      if (!state.progress) state.progress = {};
      if (!state.mode) state.mode = "study";
      if (typeof state.autoplay !== "boolean") state.autoplay = false;
      if (!allDeckIds().includes(state.deckId)) state.deckId = Object.keys(DECKS)[0];
      saveState();
      populateDeckSelect();
      autoplayCheck.checked = state.autoplay;
      rebuildQueue();
      render();
      alert("Đã khôi phục dữ liệu.");
    } catch (err) {
      alert("Lỗi khi khôi phục: " + err.message);
    }
    restoreFile.value = "";
  });

  srsActions.querySelectorAll("button.rate").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.disabled) return;
      rate(parseInt(b.dataset.rating, 10));
    });
  });

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    switch (e.key) {
      case " ":
        e.preventDefault();
        flip();
        break;
      case "ArrowLeft":
        go(-1);
        break;
      case "ArrowRight":
        go(1);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
        if (card.classList.contains("flipped")) rate(parseInt(e.key, 10));
        break;
      case "s":
      case "S":
        shuffle();
        break;
      case "p":
      case "P":
        speakCurrent();
        break;
    }
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const hanzi = $("newHanzi").value.trim();
    const pinyin = $("newPinyin").value.trim();
    const meaning = $("newMeaning").value.trim();
    const example = $("newExample").value.trim();
    if (!hanzi || !pinyin || !meaning) return;
    state.customCards.push({ hanzi, pinyin, meaning, example });
    saveState();
    populateDeckSelect();
    deckSelect.value = CUSTOM_DECK_ID;
    state.deckId = CUSTOM_DECK_ID;
    state.index = state.customCards.length - 1;
    rebuildQueue();
    saveState();
    render();
    addForm.reset();
  });

  // ---------- Public API cho import.js ----------
  window.addImportedDeck = function (name, cards) {
    const id = "imported_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    state.importedDecks[id] = { name, cards };
    saveState();
    populateDeckSelect();
    deckSelect.value = id;
    state.deckId = id;
    state.index = 0;
    rebuildQueue();
    saveState();
    render();
    return id;
  };

  // ---------- Init ----------
  populateDeckSelect();
  rebuildQueue();
  render();
})();
