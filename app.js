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
  if (typeof state.useGoogleTts !== "boolean") state.useGoogleTts = true;
  if (typeof state.onboarded !== "boolean") state.onboarded = false;
  // MIGRATION v1: user cũ đã có useGoogleTts=false → force true 1 lần
  let migratedNow = false;
  if (!state._ttsMigratedV1) {
    state.useGoogleTts = true;
    state._ttsMigratedV1 = true;
    migratedNow = true;
  }
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
  const relatedList = $("relatedList");
  const speakExampleBtn = $("speakExampleBtn");
  const speakFrontBtn = $("speakFront");
  const speakBackBtn = $("speakBack");
  const autoplayCheck = $("autoplayCheck");
  const voiceInfo = $("voiceInfo");
  const backupBtn = $("backupBtn");
  const restoreBtn = $("restoreBtn");
  const restoreFile = $("restoreFile");
  const useGoogleCheck = $("useGoogleCheck");
  const testWebBtn = $("testWebBtn");
  const testGoogleBtn = $("testGoogleBtn");
  const googleAudio = $("googleAudio");
  const writeTestBtn = $("writeTestBtn");
  const writingTestModal = $("writingTestModal");
  const writingTestCloseBtn = $("writingTestCloseBtn");
  const writingTestTarget = $("writingTestTarget");
  const writingTestHintBtn = $("writingTestHint");
  const writingTestAnimateBtn = $("writingTestAnimate");
  const writingTestSkipBtn = $("writingTestSkip");
  const writingTestOutlineBtn = $("writingTestOutline");
  const settingsBtn = $("settingsBtn");
  const settingsMenu = $("settingsMenu");
  const onboardingModal = $("onboardingModal");
  const onboardingCloseBtn = $("onboardingCloseBtn");
  const greetingEl = $("greeting");

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

  // Fisher–Yates: trả về mảng MỚI đã trộn ngẫu nhiên.
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function rebuildQueue() {
    ensureDeckBuckets();
    const cards = getDeckCards(state.deckId);
    // Trộn deck trước khi build để việc chọn 20 thẻ mới cũng ngẫu nhiên,
    // rồi trộn lại queue để thẻ ôn và thẻ mới đan xen → mỗi lần vào Học là một thứ tự mới.
    queue = shuffleArray(SRS.buildQueue(shuffleArray(cards), currentSRSMap()));
    queueIndex = 0;
  }

  // ---------- UI: populate ----------
  function populateDeckSelect() {
    deckSelect.innerHTML = "";

    const builtin = document.createElement("optgroup");
    builtin.label = "Bộ mẫu";
    Object.entries(DECKS).forEach(([id, d], idx) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = idx === 0 ? `🎯 ${d.name} (${d.cards.length})` : `${d.name} (${d.cards.length})`;
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
    const manager = $("manageDeckSelect");
    manager.replaceChildren(...Array.from(deckSelect.children, group => group.cloneNode(true)));
    manager.value = state.deckId;
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
    $("manageDeckSelect").value = state.deckId;
    closeCardLookup(false);
    stopExampleAudio();
    ensureDeckBuckets();
    deleteDeckBtn.style.display = isUserDeck(state.deckId) ? "" : "none";
    updateModeButtons();
    renderStats();
    renderGreeting();
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
      const doneStreak = SRS.streak(state.reviewLog);
      const doneToday = SRS.reviewsToday(state.reviewLog);
      showCard({
        hanzi: "🎉",
        pinyin: "",
        meaning: "Hết thẻ cần ôn hôm nay!",
        example: `Bạn đã ôn ${doneToday} thẻ hôm nay · chuỗi ${doneStreak} ngày 🔥. Chuyển sang chế độ Lướt để xem thêm.`,
      }, "done");
      setSRSButtonsEnabled(false);
      srsHint.textContent = "Làm tốt lắm! Quay lại khi có thẻ mới cần ôn.";
      renderEditList();
      return;
    }

    showCard(cur.card, cur.status);
    updateIntervalPreview(cur.srs);
    setSRSButtonsEnabled(false); // chỉ enable sau khi flip
    srsHint.textContent = "Lật thẻ để hiện các nút đánh giá.";
    renderEditList();
  }

  let currentExampleText = "";
  let autoplayTimer = null;
  function showCard(c, status) {
    const total = state.mode === "study" ? queue.length : getDeckCards(state.deckId).length;
    const position = state.mode === "study" ? queueIndex + 1 : state.index + 1;
    $("studyLocation").textContent = `${deckSelect.selectedOptions[0]?.textContent || state.deckId} · ${state.mode === "study" ? "Học" : "Lướt"} · Thẻ ${status === "done" || !total ? 0 : position}/${total}`;
    hanziEl.textContent = c.hanzi;
    // Câu dài (bộ hội thoại) → thu nhỏ font để không tràn thẻ.
    const hzLen = Array.from(c.hanzi || "").length;
    hanziEl.classList.toggle("long", hzLen > 3 && hzLen <= 6);
    hanziEl.classList.toggle("xlong", hzLen > 6);
    pinyinEl.textContent = c.pinyin || "(chưa có pinyin)";
    meaningEl.textContent = c.meaning || "(chưa có nghĩa — sửa ở bảng dưới)";
    currentExampleText = c.example || "";
    renderExample(exampleEl, currentExampleText);
    const details = window.EXAMPLE_DETAILS?.[currentExampleText];
    $("examplePinyin").textContent = c.examplePinyin || details?.pinyin || (/[一-鿿]/.test(currentExampleText) && window.pinyinPro ? window.pinyinPro.pinyin(currentExampleText) : "");
    $("exampleMeaning").textContent = c.exampleMeaning || details?.meaning || (/[一-鿿]/.test(currentExampleText) ? "Câu tự thêm chưa có bản dịch. Bạn có thể bổ sung nghĩa trong dữ liệu thẻ." : "");
    $("exampleAudioStatus").textContent = "";
    speakExampleBtn.disabled = !/[一-鿿]/.test(currentExampleText);
    const tag = tagLabel(status);
    cardTagFront.textContent = tag;
    cardTagBack.textContent = tag;
    cardTagFront.className = "card-tag tag-" + status;
    cardTagBack.className = "card-tag tag-" + status;
    card.classList.remove("flipped");
    renderRadicals(c.hanzi);
    renderRelated(c);
    // Autoplay: chỉ chạy khi đã có user gesture (browser block TTS trước đó).
    // Hủy timer cũ trước để tránh phát nhầm thẻ khi user lướt nhanh.
    if (autoplayTimer) { clearTimeout(autoplayTimer); autoplayTimer = null; }
    if (state.autoplay && userHasInteracted && c.hanzi && /[一-鿿]/.test(c.hanzi)) {
      autoplayTimer = setTimeout(() => { autoplayTimer = null; speak(c.hanzi); }, 250);
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
    // Ưu tiên theo thứ tự: giọng Mandarin China (zh-CN) → Taiwan (zh-TW) → Cantonese
    const preferred = [
      /tingting|ting-?ting/i,                             // macOS Mandarin (zh-CN)
      /xiaoxiao|yaoyao|kangkang|huihui/i,                 // Windows Mandarin
      /google.*(?:中国|mandarin|普通话|zh[-_]cn)/i,         // Chrome Google Mandarin
      /中国大陆/,
      /mei-?jia/i,                                        // macOS Taiwan (zh-TW) — fallback
      /sin-?ji/i,                                         // macOS Cantonese — last resort
    ];
    let picked = null;
    for (const re of preferred) {
      picked = allZhVoices.find((x) => re.test(x.name));
      if (picked) break;
    }
    // Nếu regex không match ai, ưu tiên zh-CN; nếu không có thì bất kỳ giọng Trung nào
    if (!picked && allZhVoices.length) {
      picked = allZhVoices.find((v) => /zh-cn/i.test(v.lang))
            || allZhVoices.find((v) => /zh/i.test(v.lang))
            || allZhVoices[0];
    }
    zhVoice = picked || null;
    updateVoiceInfo();
  }

  function updateVoiceInfo() {
    if (!voiceInfo) return;
    if (!synth) {
      voiceInfo.innerHTML = "⚠️ Trình duyệt không hỗ trợ speechSynthesis — dùng Google TTS.";
      return;
    }
    const totalVoices = (synth.getVoices() || []).length;
    if (zhVoice) {
      voiceInfo.innerHTML = `🎙 Giọng máy: <strong>${zhVoice.name}</strong> (${zhVoice.lang})`;
    } else if (totalVoices === 0) {
      voiceInfo.textContent = "⏳ Đang chờ trình duyệt load danh sách giọng...";
    } else {
      voiceInfo.textContent = `⚠️ Không có giọng tiếng Trung trong ${totalVoices} giọng khả dụng.`;
    }
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
    if (!text) return;
    stopSpeak();
    if (state.useGoogleTts) {
      speakGoogle(text);
      return;
    }
    speakWeb(text, (err) => {
      // Nếu speechSynthesis fail/silent → tự động fallback Google TTS
      if (err) speakGoogle(text);
    });
  }

  // Dừng mọi âm đang phát (tránh đọc chồng khi rời bước / nghe lại).
  function stopSpeak() {
    stopExampleAudio();
    if (synth) { try { synth.cancel(); } catch {} }
    if (googleAudio) { try { googleAudio.pause(); googleAudio.currentTime = 0; } catch {} }
  }

  let chromeKeepAliveTimer = null;
  function speakWeb(text, cb) {
    if (!synth) { cb && cb(new Error("no speechSynthesis")); return; }
    if (!zhVoice) pickZhVoice();
    try {
      synth.cancel();
      if (synth.paused) synth.resume();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = 0.85;
      u.pitch = 1;
      if (zhVoice) u.voice = zhVoice;
      let startedAt = null;
      u.onstart = () => {
        startedAt = Date.now();
        if (chromeKeepAliveTimer) clearInterval(chromeKeepAliveTimer);
        chromeKeepAliveTimer = setInterval(() => {
          if (!synth.speaking) { clearInterval(chromeKeepAliveTimer); chromeKeepAliveTimer = null; return; }
          synth.pause(); synth.resume();
        }, 10000);
      };
      u.onend = () => {
        if (chromeKeepAliveTimer) { clearInterval(chromeKeepAliveTimer); chromeKeepAliveTimer = null; }
        const duration = startedAt ? Date.now() - startedAt : 0;
        // "你好" speak phải tối thiểu ~400ms. Nếu onend fire quá nhanh → silent fail
        if (startedAt && duration < 150) {
          console.warn("[TTS web] silent-success (onend quá nhanh, duration=" + duration + "ms)");
          cb && cb(new Error("silent-success"));
        } else {
          cb && cb(null);
        }
      };
      u.onerror = (e) => {
        console.warn("[TTS web] error:", e.error || e, "text:", text);
        cb && cb(new Error(e.error || "tts-error"));
      };
      synth.speak(u);
      // Auto-fallback nếu không fire onstart trong 700ms
      setTimeout(() => {
        if (!startedAt) {
          console.warn("[TTS web] no onstart after 700ms, assume silent, fallback");
          try { synth.cancel(); } catch {}
          cb && cb(new Error("no-onstart"));
        }
      }, 700);
    } catch (e) {
      console.warn("[TTS web] failed:", e);
      cb && cb(e);
    }
  }

  // Online TTS — Youdao primary (ổn định trong browser), Google fallback.
  // Google translate_tts hiện trả về MP3 với token-check, Chrome từ chối với
  // MEDIA_ELEMENT_ERROR: Format error. Youdao vẫn hoạt động tốt.
  function speakGoogle(text) {
    if (!googleAudio) return;
    const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=zh`;
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`;
    try {
      googleAudio.pause();
      googleAudio.src = youdaoUrl;
      googleAudio.play().catch((err) => {
        console.warn("[TTS youdao] play() rejected, thử Google:", err);
        googleAudio.src = googleUrl;
        googleAudio.play().catch((err2) => console.warn("[TTS google] also failed:", err2));
      });
    } catch (e) {
      console.warn("[TTS online] failed:", e);
    }
  }

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
      const match = findExactCard(char);
      const row = document.createElement("div");
      row.className = "rad-row";
      row.innerHTML = `
        <div class="rad-big ${match ? "clickable" : ""}" title="${match ? "Mở thẻ: " + char : ""}">${escapeHtml(char)}</div>
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
      if (match) {
        row.querySelector(".rad-big").addEventListener("click", () => {
          jumpToCard(match.deckId, match.index);
        });
      }
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
    $("statStreak").textContent = SRS.streak(state.reviewLog);
  }

  function renderGreeting() {
    if (!greetingEl) return;
    const c = SRS.countsFor(getDeckCards(state.deckId), currentSRSMap());
    const streakDays = SRS.streak(state.reviewLog);
    let msg;
    if (c.due > 0) msg = `Hôm nay cần ôn ${c.due} thẻ — cố lên! 💪`;
    else if (c.new > 0) msg = `Không còn thẻ cũ, học ${c.new} thẻ mới nào! ✨`;
    else msg = `Tuyệt vời, đã xong hết! 🔥 Chuỗi ${streakDays} ngày`;
    greetingEl.textContent = msg;
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
        <th>#</th><th>Hán</th><th>Pinyin</th><th>Nghĩa tiếng Việt</th><th>Ví dụ</th><th>Pinyin câu</th><th>Nghĩa câu</th><th></th>
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
        <td><input data-f="examplePinyin" aria-label="Pinyin câu ví dụ" value="${escapeHtml(c.examplePinyin || "")}" /></td>
        <td><input data-f="exampleMeaning" aria-label="Nghĩa câu ví dụ" value="${escapeHtml(c.exampleMeaning || "")}" /></td>
        <td><button class="del-row" title="Xoá dòng">✕</button></td>`;
      tr.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", (e) => {
          cards[i][e.target.dataset.f] = e.target.value;
          invalidateCardIndex();
          saveState();
        });
      });
      tr.querySelector(".del-row").addEventListener("click", () => {
        if (!confirm("Xoá thẻ này?")) return;
        const key = SRS.cardKey(cards[i]);
        delete currentSRSMap()[key];
        cards.splice(i, 1);
        invalidateCardIndex();
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

  // ---------- Tìm thẻ chứa chữ + nhảy tới ----------
  // Duyệt mọi thẻ (mẫu + của tôi + import) theo thứ tự cố định.
  function iterateAllCards(fn) {
    Object.entries(DECKS).forEach(([deckId, d]) => {
      d.cards.forEach((c, i) => fn(deckId, i, c, d.name));
    });
    state.customCards.forEach((c, i) => fn(CUSTOM_DECK_ID, i, c, "Của tôi"));
    Object.entries(state.importedDecks).forEach(([deckId, d]) => {
      d.cards.forEach((c, i) => fn(deckId, i, c, d.name));
    });
  }

  // Cache chỉ mục "ký tự → danh sách thẻ chứa ký tự đó". Được xây "lười" một lần rồi
  // tái sử dụng, giúp findCardsByChar/findExactCard trả về O(1) thay vì quét lại toàn
  // bộ thẻ cho MỖI ký tự (trước đây O(chars × totalCards) mỗi lần render).
  let cardIndexCache = null;

  function invalidateCardIndex() {
    cardIndexCache = null;
  }

  function buildCardIndex() {
    if (cardIndexCache) return cardIndexCache;
    const byChar = new Map(); // char -> [{deckId, index, card, source}]
    const exact = new Map();  // hanzi -> {deckId, index, card, source} (lần gặp đầu tiên)
    iterateAllCards((deckId, i, c, deckName) => {
      const m = { deckId, index: i, card: c, source: deckName };
      const hanzi = c.hanzi || "";
      if (hanzi && !exact.has(hanzi)) exact.set(hanzi, m);
      for (const ch of hanzi) {
        if (!/[一-鿿]/.test(ch)) continue;
        if (!byChar.has(ch)) byChar.set(ch, []);
        byChar.get(ch).push(m);
      }
    });
    cardIndexCache = { byChar, exact };
    return cardIndexCache;
  }

  function findCardsByChar(char) {
    const idx = buildCardIndex();
    return idx.byChar.get(char) || [];
  }

  // Tìm thẻ có hanzi KHỚP CHÍNH XÁC char trước, rồi mới tới thẻ chứa char
  function findExactCard(char) {
    const idx = buildCardIndex();
    const exact = idx.exact.get(char);
    if (exact) return exact;
    const partial = idx.byChar.get(char);
    return partial ? partial[0] : null;
  }

  let lookupOrigin = null;
  function closeCardLookup(restore = true) {
    const panel = $("cardLookup");
    if (!panel) return;
    panel.hidden = true;
    panel.replaceChildren();
    if (restore && lookupOrigin) {
      window.scrollTo(0, lookupOrigin.scroll);
      lookupOrigin.focus?.focus({ preventScroll: true });
    }
    lookupOrigin = null;
  }
  function jumpToCard(deckId, cardIndex) {
    const found = getDeckCards(deckId)[cardIndex];
    if (!found) return;
    if (!lookupOrigin) lookupOrigin = { scroll: window.scrollY, focus: document.activeElement };
    const panel = $("cardLookup");
    panel.replaceChildren(); panel.hidden = false;
    const back = document.createElement("button");
    back.textContent = "← Quay lại thẻ đang học";
    back.type = "button";
    back.addEventListener("click", () => closeCardLookup());
    panel.append(back);
    const origin = document.createElement("p");
    origin.textContent = "Bạn vẫn đang ở " + $("studyLocation").textContent;
    panel.append(origin);
    for (const [text, className] of [[found.hanzi, "lookup-hanzi"], [found.pinyin, "lookup-pinyin"], [found.meaning, "lookup-meaning"]]) {
      const line = document.createElement("p"); line.textContent = text || ""; line.className = className; panel.append(line);
    }
    const source = document.createElement("p");
    source.textContent = "Nguồn tra cứu: " + (DECKS[deckId]?.name || state.importedDecks[deckId]?.name || "Của tôi");
    panel.append(source);
    const listen = document.createElement("button"); listen.type = "button"; listen.textContent = "Nghe từ này";
    listen.addEventListener("click", () => speak(found.hanzi)); panel.append(listen);
    panel.scrollIntoView({ block: "start", behavior: "smooth" }); back.focus({ preventScroll: true });
  }

  let examplePlayer = null;
  let examplePlayback = 0;
  let exampleSegmentTimer = null;
  function stopExampleAudio() {
    clearInterval(exampleSegmentTimer);
    examplePlayback += 1;
    if (examplePlayer) { examplePlayer.pause(); examplePlayer = null; }
    if (speakExampleBtn) speakExampleBtn.disabled = false;
  }
  function speakExample(text) {
    stopExampleAudio(); stopSpeak();
    const token = examplePlayback;
    const status = $("exampleAudioStatus");
    status.textContent = "Đang tải âm thanh…";
    speakExampleBtn.disabled = true;
    const speech = text.replace(/\b[AB]\s*[:：]/g, "").trim();
    const sources = [
      "https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=" + encodeURIComponent(speech),
      "https://dict.youdao.com/dictvoice?le=zh&audio=" + encodeURIComponent(speech),
    ];
    const clip = window.EXAMPLE_AUDIO?.[text];
    if (clip) sources.unshift(clip.src);
    function finish(message) {
      if (token !== examplePlayback) return;
      clearInterval(exampleSegmentTimer);
      examplePlayer?.pause();
      status.textContent = message; speakExampleBtn.disabled = false;
    }
    function attempt(index) {
      if (token !== examplePlayback) return;
      if (index === sources.length) {
        status.textContent = "Đang thử giọng đọc trên thiết bị…";
        speakWeb(speech, error => finish(error ? "Chưa phát được câu. Hãy kiểm tra kết nối hoặc giọng tiếng Trung trên thiết bị rồi thử lại." : "Đã đọc xong câu."));
        return;
      }
      const audio = new Audio(sources[index]); examplePlayer = audio;
      let moved = false;
      const fallback = () => { if (moved || token !== examplePlayback) return; moved = true; clearInterval(exampleSegmentTimer); audio.pause(); attempt(index + 1); };
      audio.onerror = fallback;
      if (clip && index === 0) {
        audio.addEventListener("loadedmetadata", () => {
          if (token === examplePlayback) audio.currentTime = clip.start;
        }, { once: true });
      }
      audio.onplaying = () => {
        if (token !== examplePlayback) return;
        status.textContent = "Đang đọc câu ví dụ…";
        if (clip && index === 0) {
          clearInterval(exampleSegmentTimer);
          exampleSegmentTimer = setInterval(() => {
            if (token === examplePlayback && audio.currentTime >= clip.end - 0.02) finish("Đã đọc xong câu.");
          }, 30);
        }
      };
      audio.onended = () => finish("Đã đọc xong câu.");
      audio.play().catch(fallback);
    }
    attempt(0);
  }

  // Render example sentence với chars clickable
  function renderExample(container, text) {
    container.innerHTML = "";
    for (const ch of text || "") {
      const span = document.createElement("span");
      span.textContent = ch;
      if (/[一-鿿]/.test(ch)) {
        const match = findExactCard(ch);
        if (match) {
          span.className = "sent-clickable";
          span.tabIndex = 0;
          span.setAttribute("role", "button");
          span.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); jumpToCard(match.deckId, match.index); }
          });
          span.title = `${match.card.hanzi} · ${match.card.pinyin} — ${match.card.meaning}\n(nguồn: ${match.source})`;
          span.addEventListener("click", (e) => {
            e.stopPropagation();
            jumpToCard(match.deckId, match.index);
          });
        } else {
          span.className = "sent-char-plain";
        }
      } else {
        span.className = "sent-nonchar";
      }
      container.appendChild(span);
    }
  }

  // Render related cards: tìm các thẻ chứa chars của thẻ hiện tại (trừ chính nó)
  function renderRelated(currentCard) {
    relatedList.innerHTML = "";
    if (!currentCard || !currentCard.hanzi) {
      relatedList.innerHTML = '<p class="muted">—</p>';
      return;
    }
    const chars = Array.from(currentCard.hanzi).filter((c) => /[一-鿿]/.test(c));
    const seen = new Set();
    const items = [];
    chars.forEach((ch) => {
      findCardsByChar(ch).forEach((m) => {
        const key = m.card.hanzi + "|" + m.card.pinyin;
        const curKey = currentCard.hanzi + "|" + currentCard.pinyin;
        if (key === curKey || seen.has(key)) return;
        seen.add(key);
        items.push(m);
      });
    });
    if (items.length === 0) {
      relatedList.innerHTML = '<p class="muted">Không tìm thấy thẻ nào chứa chữ của thẻ này.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    items.slice(0, 30).forEach((m) => {
      const chip = document.createElement("button");
      chip.className = "related-chip";
      chip.innerHTML = `
        <span class="rc-hanzi">${escapeHtml(m.card.hanzi)}</span>
        <span class="rc-pinyin">${escapeHtml(m.card.pinyin || "")}</span>
        <span class="rc-meaning">${escapeHtml((m.card.meaning || "").slice(0, 40))}</span>
        <span class="rc-source">${escapeHtml(m.source)}</span>
      `;
      chip.title = `Mở thẻ: ${m.card.hanzi} (${m.source})`;
      chip.addEventListener("click", () => jumpToCard(m.deckId, m.index));
      frag.appendChild(chip);
    });
    if (items.length > 30) {
      const more = document.createElement("span");
      more.className = "muted rc-more";
      more.textContent = `+${items.length - 30} thẻ nữa`;
      frag.appendChild(more);
    }
    relatedList.appendChild(frag);
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

  // Sinh một thứ tự ngẫu nhiên (hoán vị) cho bộ, dùng cho chế độ Lướt.
  function randomizeOrder(deckId) {
    const n = getDeckCards(deckId).length;
    if (n === 0) return;
    const order = shuffleArray(Array.from({ length: n }, (_, i) => i));
    if (!state.progress[deckId]) state.progress[deckId] = { order: null };
    state.progress[deckId].order = order;
  }

  function shuffle() {
    if (state.mode !== "browse") return;
    if (getDeckCards(state.deckId).length === 0) return;
    randomizeOrder(state.deckId);
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
    invalidateCardIndex();
    state.index = 0;
    rebuildQueue();
    saveState();
    populateDeckSelect();
    render();
  }

  function switchMode(mode) {
    state.mode = mode;
    state.index = 0;
    if (mode === "study") {
      rebuildQueue(); // mỗi lần vào Học → trộn lại queue
    } else {
      randomizeOrder(state.deckId); // mỗi lần vào Lướt → trộn lại thứ tự
    }
    saveState();
    render();
  }

  // ---------- Events ----------
  deckSelect.addEventListener("change", () => {
    state.deckId = deckSelect.value;
    $("manageDeckSelect").value = state.deckId;
    state.index = 0;
    randomizeOrder(state.deckId); // mỗi lần mở bộ → trộn ngẫu nhiên
    rebuildQueue();
    saveState();
    render();
  });

  $("manageDeckSelect").addEventListener("change", (event) => {
    deckSelect.value = event.target.value;
    deckSelect.dispatchEvent(new Event("change", { bubbles: true }));
  });
  $("focusStudyBtn").addEventListener("click", () => {
    const focused = document.body.classList.toggle("study-focus");
    $("focusStudyBtn").textContent = focused ? "↙ Thoát tập trung" : "⛶ Tập trung";
    $("focusStudyBtn").setAttribute("aria-pressed", String(focused));
  });

  modeStudyBtn.addEventListener("click", () => switchMode("study"));
  modeBrowseBtn.addEventListener("click", () => switchMode("browse"));

  card.addEventListener("click", flip);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  shuffleBtn.addEventListener("click", shuffle);
  resetBtn.addEventListener("click", resetDeck);
  deleteDeckBtn.addEventListener("click", deleteCurrentDeck);

  // Menu cài đặt (⚙️)
  if (settingsBtn && settingsMenu) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsMenu.classList.toggle("open");
    });
    settingsMenu.addEventListener("click", (e) => {
      if (e.target.closest("button")) settingsMenu.classList.remove("open");
    });
    document.addEventListener("click", (e) => {
      if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsMenu.classList.remove("open");
      }
    });
  }

  // Hướng dẫn lần đầu (onboarding)
  function closeOnboarding() {
    if (onboardingModal) onboardingModal.classList.remove("active");
    state.onboarded = true;
    saveState();
  }
  if (onboardingCloseBtn) onboardingCloseBtn.addEventListener("click", closeOnboarding);
  if (onboardingModal) onboardingModal.addEventListener("click", (e) => {
    if (e.target === onboardingModal) closeOnboarding();
  });

  // Speaker
  const speakCurrent = (btn) => {
    const cur = getCurrentCard();
    if (cur && cur.card && cur.card.hanzi) {
      // Visual feedback: pulse animation để user biết click đã register
      if (btn) {
        btn.classList.add("speak-pulse");
        setTimeout(() => btn.classList.remove("speak-pulse"), 600);
      }
      speak(cur.card.hanzi);
    }
  };
  speakFrontBtn.addEventListener("click", (e) => { e.stopPropagation(); speakCurrent(speakFrontBtn); });
  speakBackBtn.addEventListener("click", (e) => { e.stopPropagation(); speakCurrent(speakBackBtn); });
  // Nghe cả câu ví dụ
  if (speakExampleBtn) {
    speakExampleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentExampleText) speakExample(currentExampleText);
    });
  }

  // Autoplay
  autoplayCheck.checked = state.autoplay;
  autoplayCheck.addEventListener("change", () => {
    state.autoplay = autoplayCheck.checked;
    saveState();
  });

  // Toggle Google TTS
  useGoogleCheck.checked = state.useGoogleTts;
  useGoogleCheck.addEventListener("change", () => {
    state.useGoogleTts = useGoogleCheck.checked;
    saveState();
  });

  // Test buttons (luôn có trong HTML, không inject)
  testWebBtn.addEventListener("click", () => {
    let startedAt = null;
    speakWeb("你好", (err) => {
      if (err) {
        alert(
          "❌ Giọng máy KHÔNG hoạt động.\n" +
          "Lý do: " + err.message + "\n\n" +
          "→ Tick '🌐 Google TTS' trong topbar để dùng Google thay thế."
        );
      } else {
        alert("✅ Giọng máy hoạt động (nếu không nghe tiếng → kiểm tra volume máy, hoặc bật '🌐 Google TTS' nếu vẫn silent).");
      }
    });
  });

  testGoogleBtn.addEventListener("click", () => {
    if (!googleAudio) { alert("❌ Không có audio element"); return; }
    let resolved = false;
    // onplaying fire khi audio bắt đầu có âm — kể cả Youdao fallback sau khi Google fail
    const onPlaying = () => {
      if (resolved) return;
      resolved = true;
      googleAudio.removeEventListener("playing", onPlaying);
      alert("✅ TTS online hoạt động!\nApp đã mặc định dùng cái này (toggle '🌐 TTS online' trong topbar).");
    };
    googleAudio.addEventListener("playing", onPlaying);
    speakGoogle("你好");
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        googleAudio.removeEventListener("playing", onPlaying);
        alert("⏱ TTS online timeout 4s — có thể CORS hoặc network bị block. Check DevTools Network tab.");
      }
    }, 4000);
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
      invalidateCardIndex();
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
    if (!$("cardLookup").hidden) {
      if (e.key === "Escape") { e.preventDefault(); closeCardLookup(); }
      return;
    }
    if ($("viewDecks").hidden) return;
    const tag = document.activeElement.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    // Bỏ qua phím tắt khi đang mở modal (quiz / viết / onboarding)
    if (document.querySelector(".quiz-modal.active, .writing-test-modal.active, .onboarding-modal.active")) return;
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
    state.customCards.push({ hanzi, pinyin, meaning, example, exampleMeaning: $("newExampleMeaning").value.trim() });
    invalidateCardIndex();
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

  // ---------- Writing test (HanziWriter) ----------
  let writer = null;
  let writingChars = [];
  let writingIndex = 0;
  let writingMistakesTotal = 0;
  let writingMistakesThisChar = 0;
  let writingShowOutline = false;

  function openWritingTest() {
    const cur = getCurrentCard();
    if (!cur || !cur.card || !cur.card.hanzi) {
      alert("Chưa có thẻ để test.");
      return;
    }
    const chars = Array.from(cur.card.hanzi).filter((c) => /[一-鿿]/.test(c));
    if (chars.length === 0) {
      alert("Thẻ không có chữ Hán để viết.");
      return;
    }
    // Pinyin có thể là space-separated cho từ nhiều chữ
    const pinyinParts = (cur.card.pinyin || "").trim().split(/\s+/);
    writingChars = chars.map((ch, i) => ({
      char: ch,
      pinyin: pinyinParts[i] || cur.card.pinyin || "",
      meaning: cur.card.meaning || "",
    }));
    writingIndex = 0;
    writingMistakesTotal = 0;
    writingMistakesThisChar = 0;
    writingTestModal.classList.add("active");
    document.body.style.overflow = "hidden";
    startCharTest();
  }

  function closeWritingTest() {
    writingTestModal.classList.remove("active");
    document.body.style.overflow = "";
    if (writer) {
      try { writer.cancelQuiz(); } catch {}
      writer = null;
    }
    writingTestTarget.innerHTML = "";
  }

  function startCharTest() {
    if (typeof HanziWriter === "undefined") {
      alert("Thư viện HanziWriter chưa tải xong. Chờ 1-2s rồi thử lại.");
      return;
    }
    const cur = writingChars[writingIndex];
    writingMistakesThisChar = 0;
    // Mặc định tự viết không có nét mờ hướng dẫn.
    writingShowOutline = false;
    if (writingTestOutlineBtn) {
      writingTestOutlineBtn.textContent = "👁 Nét mờ";
      writingTestOutlineBtn.classList.remove("on");
    }
    $("writingTestProgress").textContent = `${writingIndex + 1}/${writingChars.length}`;
    $("writingTestPinyin").textContent = cur.pinyin;
    $("writingTestMeaning").textContent = cur.meaning;
    $("writingTestMistakes").textContent = writingMistakesTotal;
    $("writingTestStatus").textContent = "";
    writingTestTarget.innerHTML = "";

    writer = HanziWriter.create(writingTestTarget, cur.char, {
      width: 260,
      height: 260,
      padding: 10,
      showOutline: false,
      showCharacter: false,
      strokeColor: "#1e293b",
      strokeHighlightColor: "#22c55e",
      radicalColor: "#f59e0b",
      outlineColor: "#94a3b8",
      drawingColor: "#8b5cf6",
      drawingWidth: 20,
      strokeFadeDuration: 400,
      // KHÔNG truyền charDataLoader: để hanzi-writer dùng loader mặc định,
      // tự fetch dữ liệu nét chữ từ CDN (hanzi-writer-data@2.0.1).
      // (Truyền một hàm trả về undefined sẽ khiến dữ liệu không bao giờ load.)
    });

    writer.quiz({
      showHintAfterMisses: 3,
      highlightOnComplete: true,
      onMistake: () => {
        writingMistakesThisChar++;
        writingMistakesTotal++;
        $("writingTestMistakes").textContent = writingMistakesTotal;
        $("writingTestStatus").textContent = "❌ Sai nét, thử lại";
      },
      onCorrectStroke: () => {
        $("writingTestStatus").textContent = "✅ Đúng!";
      },
      onComplete: () => {
        const grade = writingMistakesThisChar === 0 ? "🎉 Hoàn hảo!"
                    : writingMistakesThisChar <= 2 ? "👍 Tốt!"
                    : "✍️ Xong (nhiều sai)";
        $("writingTestStatus").textContent = `${grade} (${writingMistakesThisChar} sai)`;
        setTimeout(nextCharOrFinish, 1200);
      },
    });
  }

  function nextCharOrFinish() {
    if (writer) { try { writer.cancelQuiz(); } catch {} writer = null; }
    if (writingIndex + 1 < writingChars.length) {
      writingIndex++;
      startCharTest();
    } else {
      const total = writingChars.length;
      const avgMistakes = (writingMistakesTotal / total).toFixed(1);
      $("writingTestStatus").textContent =
        `🏁 Xong ${total} chữ! Tổng ${writingMistakesTotal} nét sai (TB ${avgMistakes}/chữ). Nhấn ✕ hoặc Esc để đóng.`;
    }
  }

  // Bật/tắt nét mờ hướng dẫn (outline) của chữ đang viết.
  function setWritingOutline(show) {
    writingShowOutline = show;
    if (writer) {
      try {
        if (show) writer.showOutline();
        else writer.hideOutline();
      } catch {}
    }
    if (writingTestOutlineBtn) {
      writingTestOutlineBtn.textContent = show ? "👁 Ẩn nét mờ" : "👁 Nét mờ";
      writingTestOutlineBtn.classList.toggle("on", show);
    }
  }

  if (writeTestBtn) writeTestBtn.addEventListener("click", openWritingTest);
  if (writingTestCloseBtn) writingTestCloseBtn.addEventListener("click", closeWritingTest);
  if (writingTestModal) {
    writingTestModal.addEventListener("click", (e) => {
      if (e.target === writingTestModal) closeWritingTest();
    });
  }
  if (writingTestOutlineBtn) writingTestOutlineBtn.addEventListener("click", () => {
    setWritingOutline(!writingShowOutline);
  });
  if (writingTestHintBtn) writingTestHintBtn.addEventListener("click", () => {
    // Tô đậm nét hiện tại (nét kế tiếp cần viết) để gợi ý.
    try {
      if (writer && writer._quiz && typeof writer._quiz._currentStrokeIndex === "number") {
        writer.highlightStroke(writer._quiz._currentStrokeIndex);
      }
    } catch {}
  });
  if (writingTestAnimateBtn) writingTestAnimateBtn.addEventListener("click", () => {
    if (writer) try { writer.cancelQuiz(); writer.animateCharacter(); } catch {}
  });
  if (writingTestSkipBtn) writingTestSkipBtn.addEventListener("click", () => {
    nextCharOrFinish();
  });

  // Esc to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && writingTestModal.classList.contains("active")) {
      closeWritingTest();
    }
  });

  // ---------- Public API cho import.js ----------
  window.addImportedDeck = function (name, cards) {
    const id = "imported_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    state.importedDecks[id] = { name, cards };
    invalidateCardIndex();
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

  // ---------- Public API cho quiz.js ----------
  window.QuizData = {
    currentDeckCards() { return getDeckCards(state.deckId); },
    allCards() {
      const out = [];
      iterateAllCards((deckId, i, c) => out.push(c));
      return out;
    },
    speak(text) { speak(text); },
  };

  // ---------- Public API cho lesson.js (bài học Hôm nay) ----------
  window.App = {
    speak(text) { speak(text); },
    stopSpeak() { stopSpeak(); },
    // Tổng số thẻ đến hạn trên MỌI bộ (kể cả bộ tự tạo/import).
    dueCount() {
      let total = 0;
      allDeckIds().forEach((id) => {
        const map = state.srs[id] || {};
        total += SRS.countsFor(getDeckCards(id), map).due;
      });
      return total;
    },
    newCount() {
      let total = 0;
      allDeckIds().forEach((id) => {
        const map = state.srs[id] || {};
        total += SRS.countsFor(getDeckCards(id), map).new;
      });
      return total;
    },
    // Chuyển sang chế độ Học của bộ đầu tiên còn thẻ đến hạn.
    goToReview() {
      const target = allDeckIds().find((id) => {
        const map = state.srs[id] || {};
        return SRS.countsFor(getDeckCards(id), map).due > 0;
      });
      if (!target) return false;
      state.deckId = target;
      state.mode = "study";
      state.index = 0;
      rebuildQueue();
      saveState();
      populateDeckSelect();
      render();
      return true;
    },
  };

  // ---------- Init ----------
  // Save ngay nếu migration v1 vừa chạy để persist qua refresh
  if (migratedNow) saveState();
  populateDeckSelect();
  randomizeOrder(state.deckId); // trộn ngẫu nhiên ngay khi mở app
  rebuildQueue();
  render();
  // Onboarding cũ đã được thay bằng màn "Hôm nay" — không tự mở nữa.
  // (giữ modal + handler để không phá HTML/CSS đang có)
})();
