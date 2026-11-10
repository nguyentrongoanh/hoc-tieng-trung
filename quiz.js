// Bài tập kiểm tra (Luyện tập) cho mỗi bộ thẻ.
// 5 chế độ: Việt→Hán, Hán→Việt, Hán→Pinyin, Nghe→chọn, Viết chữ.
// Dữ liệu thẻ lấy từ window.QuizData (do app.js cung cấp).
(function () {
  const $ = (id) => document.getElementById(id);
  const modal = $("quizModal");
  const closeBtn = $("quizCloseBtn");
  const menuScreen = $("quizMenu");
  const playScreen = $("quizPlay");
  const summaryScreen = $("quizSummary");
  const progressEl = $("quizProgress");
  const scoreEl = $("quizScore");
  const promptEl = $("quizPrompt");
  const optionsEl = $("quizOptions");
  const feedbackEl = $("quizFeedback");
  const writeArea = $("quizWriteArea");
  const writeTarget = $("quizWriteTarget");
  const writeOutlineBtn = $("quizWriteOutlineBtn");
  const buildArea = $("quizBuildArea");
  const buildSlots = $("quizBuildSlots");
  const buildBank = $("quizBuildBank");
  const buildCheckBtn = $("quizBuildCheck");
  const summaryScoreEl = $("quizSummaryScore");
  const replayBtn = $("quizReplayBtn");
  const menuBtn = $("quizMenuBtn");
  const quizBtn = $("quizBtn");

  const QUIZ_SIZE = 10;
  const WRITE_SIZE = 8;
  const BUILD_SIZE = 8;

  let session = null;
  let writer = null;
  let showOutline = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function unique(arr) { return [...new Set(arr)]; }

  function showScreen(name) {
    menuScreen.hidden = name !== "menu";
    playScreen.hidden = name !== "play";
    summaryScreen.hidden = name !== "summary";
  }

  function open() {
    showScreen("menu");
    modal.classList.add("active");
  }

  function close() {
    modal.classList.remove("active");
    if (writer) { try { writer.cancelQuiz(); } catch {} writer = null; }
    if (writeTarget) writeTarget.innerHTML = "";
  }

  // ---------- Tạo câu hỏi ----------

  function buildOptions(mode, correct, all) {
    const key = mode === "han2vi" ? "meaning" : mode === "han2pinyin" ? "pinyin" : "hanzi";
    const correctText = correct[key] || "";
    const wrongs = shuffle(
      unique(all.map((c) => c[key]).filter((v) => v && v !== correctText))
    ).slice(0, 3);
    return { options: shuffle([correctText, ...wrongs]), correctText };
  }

  function buildWriteTargets(cards) {
    const single = cards.filter((c) => {
      const chars = Array.from(c.hanzi || "").filter((ch) => /[一-鿿]/.test(ch));
      return chars.length === 1;
    });
    const pool = single.length >= 3 ? single : cards;
    const targets = [];
    const seen = new Set();
    pool.forEach((c) => {
      const chars = Array.from(c.hanzi || "").filter((ch) => /[一-鿿]/.test(ch));
      const pinyinParts = (c.pinyin || "").trim().split(/\s+/);
      chars.forEach((ch, i) => {
        if (seen.has(ch)) return;
        seen.add(ch);
        targets.push({ char: ch, pinyin: pinyinParts[i] || c.pinyin || "", meaning: c.meaning || "" });
      });
    });
    return targets;
  }

  // ---------- Chuẩn bị dữ liệu cho chế độ Ghép câu ----------

  // Bỏ dấu câu/khoảng trắng để so sánh chữ Hán thuần.
  function normalizeHanzi(s) {
    return String(s || "").replace(/[^\u4e00-\u9fff]/g, "");
  }

  // Ưu tiên thẻ của bộ hiện tại; nếu bộ này không có `words`
  // thì mượn các bộ hội thoại (để chế độ vẫn dùng được ở mọi bộ).
  function buildSentencePool(cards, all) {
    const hasWords = (c) => Array.isArray(c.words) && c.words.length >= 2;
    let pool = (cards || []).filter(hasWords);
    if (pool.length === 0) pool = (all || []).filter(hasWords);
    return pool;
  }

  function makeBuildQuestions(pool) {
    return shuffle(pool).slice(0, BUILD_SIZE).map((c) => ({
      card: c,
      tiles: shuffle(c.words.map((w, i) => ({ text: w, id: i }))),
      chosen: [],
      answered: false,
    }));
  }

  function start(modeKey) {
    const cards = window.QuizData.currentDeckCards();
    const all = window.QuizData.allCards();
    if (!cards || cards.length === 0) { alert("Bộ thẻ hiện tại trống. Hãy chọn bộ có thẻ."); return; }

    if (modeKey === "build") {
      const pool = buildSentencePool(cards, all);
      if (pool.length === 0) {
        alert("Chưa có câu để ghép. Hãy chọn bộ 💬 Hội thoại & Đặt câu hoặc 🧳 Hội thoại du lịch.");
        return;
      }
      session = { mode: "build", questions: makeBuildQuestions(pool), index: 0, score: 0 };
    } else if (modeKey === "write") {
      const targets = buildWriteTargets(cards);
      if (targets.length === 0) { alert("Bộ này không có chữ Hán để viết."); return; }
      session = { mode: "write", targets: shuffle(targets).slice(0, WRITE_SIZE), index: 0, mistakes: 0 };
    } else {
      const pool = shuffle(cards).slice(0, QUIZ_SIZE);
      session = {
        mode: modeKey,
        questions: pool.map((c) => ({ card: c, ...buildOptions(modeKey, c, all) })),
        index: 0,
        score: 0,
      };
    }

    showOutline = false;
    showScreen("play");
    renderQuestion();
  }

  function promptHTML(mode, q) {
    if (mode === "vi2han") return `Nghĩa: <strong>${esc(q.card.meaning || "(chưa có nghĩa)")}</strong>`;
    if (mode === "han2vi") return `Chọn nghĩa đúng của:<span class="qz-hanzi">${esc(q.card.hanzi)}</span>`;
    if (mode === "han2pinyin") return `Chọn pinyin của:<span class="qz-hanzi">${esc(q.card.hanzi)}</span>`;
    if (mode === "listen") return `<button class="quiz-listen-btn" id="quizListenBtn">🔊 Nghe lại</button>`;
    return "";
  }

  function optLabel(mode, opt) {
    if (mode === "vi2han" || mode === "han2pinyin" || mode === "listen") {
      return `<span class="qz-opt-hanzi">${esc(opt)}</span>`;
    }
    return `<span>${esc(opt)}</span>`;
  }

  function renderQuestion() {
    const s = session;
    feedbackEl.textContent = "";
    feedbackEl.className = "quiz-feedback";
    optionsEl.innerHTML = "";

    if (s.mode === "write") { renderWriteQuestion(); return; }
    if (s.mode === "build") { renderBuildQuestion(); return; }

    const q = s.questions[s.index];
    progressEl.textContent = `${s.index + 1}/${s.questions.length}`;
    scoreEl.textContent = `Đúng: ${s.score}`;

    writeArea.hidden = true;
    buildArea.hidden = true;
    optionsEl.hidden = false;
    promptEl.innerHTML = promptHTML(s.mode, q);

    if (s.mode === "listen") {
      window.QuizData.speak(q.card.hanzi);
      const listenBtn = $("quizListenBtn");
      if (listenBtn) listenBtn.addEventListener("click", () => window.QuizData.speak(q.card.hanzi));
    }

    q.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "quiz-option";
      b.innerHTML = optLabel(s.mode, opt);
      b.addEventListener("click", () => answer(i));
      optionsEl.appendChild(b);
    });
  }

  function answer(i) {
    const s = session;
    if (s.answered) return;
    s.answered = true;
    const q = s.questions[s.index];
    const correct = q.options[i] === q.correctText;
    const btns = optionsEl.querySelectorAll(".quiz-option");

    if (correct) {
      s.score++;
      btns[i].classList.add("correct");
      feedbackEl.textContent = "✅ Đúng!";
      feedbackEl.className = "quiz-feedback ok";
    } else {
      btns[i].classList.add("wrong");
      q.options.forEach((opt, idx) => { if (opt === q.correctText) btns[idx].classList.add("correct"); });
      feedbackEl.textContent = `❌ Sai. Đáp án: ${q.correctText}`;
      feedbackEl.className = "quiz-feedback bad";
    }
    btns.forEach((b) => (b.disabled = true));
    scoreEl.textContent = `Đúng: ${s.score}`;

    setTimeout(() => next(), 900);
  }

  function next() {
    const s = session;
    const total = s.mode === "write" ? s.targets.length : s.questions.length;
    if (s.index + 1 < total) {
      s.index++;
      s.answered = false;
      renderQuestion();
    } else {
      showSummary();
    }
  }

  function showSummary() {
    showScreen("summary");
    const s = session;
    if (s.mode === "write") {
      summaryScoreEl.innerHTML = `<strong>✍️ ${s.targets.length} chữ</strong><span>${s.mistakes} nét sai</span>`;
    } else {
      const pct = Math.round((s.score / s.questions.length) * 100);
      summaryScoreEl.innerHTML = `<strong>${s.score}/${s.questions.length}</strong><span>đúng (${pct}%)</span>`;
    }
  }

  // ---------- Chế độ Ghép câu (đặt câu) ----------

  function renderBuildQuestion() {
    const s = session;
    const q = s.questions[s.index];
    progressEl.textContent = `${s.index + 1}/${s.questions.length}`;
    scoreEl.textContent = `Đúng: ${s.score}`;

    writeArea.hidden = true;
    optionsEl.hidden = true;
    buildArea.hidden = false;
    feedbackEl.textContent = "";
    feedbackEl.className = "quiz-feedback";
    buildSlots.classList.remove("correct", "wrong");

    promptEl.innerHTML = `Ghép thành câu: <strong>${esc(q.card.meaning || "(chưa có nghĩa)")}</strong>`;

    q.chosen = [];
    q.answered = false;
    renderBuildTiles();
  }

  function renderBuildTiles() {
    const q = session.questions[session.index];
    const chosenSet = new Set(q.chosen);

    buildSlots.innerHTML = "";
    if (q.chosen.length === 0) {
      const ph = document.createElement("span");
      ph.className = "quiz-build-placeholder";
      ph.textContent = "Chạm vào các từ bên dưới để xếp thành câu…";
      buildSlots.appendChild(ph);
    }
    q.chosen.forEach((id) => {
      const tile = q.tiles.find((t) => t.id === id);
      const b = document.createElement("button");
      b.className = "quiz-tile chosen";
      b.textContent = tile.text;
      b.addEventListener("click", () => {
        if (q.answered) return;
        q.chosen = q.chosen.filter((x) => x !== id);
        renderBuildTiles();
      });
      buildSlots.appendChild(b);
    });

    buildBank.innerHTML = "";
    q.tiles.forEach((t) => {
      if (chosenSet.has(t.id)) return;
      const b = document.createElement("button");
      b.className = "quiz-tile";
      b.textContent = t.text;
      b.addEventListener("click", () => {
        if (q.answered) return;
        q.chosen.push(t.id);
        renderBuildTiles();
      });
      buildBank.appendChild(b);
    });

    buildCheckBtn.disabled = q.answered || q.chosen.length !== q.tiles.length;
    buildCheckBtn.textContent = q.answered ? "Đã trả lời" : "Kiểm tra";
  }

  function checkBuild() {
    const s = session;
    if (!s || s.mode !== "build") return;
    const q = s.questions[s.index];
    if (q.answered || q.chosen.length !== q.tiles.length) return;
    q.answered = true;

    const answer = q.chosen.map((id) => q.tiles.find((t) => t.id === id).text).join("");
    const correct = normalizeHanzi(answer) === normalizeHanzi(q.card.hanzi);

    buildSlots.classList.toggle("correct", correct);
    buildSlots.classList.toggle("wrong", !correct);

    if (correct) {
      s.score++;
      feedbackEl.textContent = "✅ Đúng!";
      feedbackEl.className = "quiz-feedback ok";
      window.QuizData.speak(q.card.hanzi);
    } else {
      feedbackEl.innerHTML = `❌ Chưa đúng. Đáp án: <strong>${esc(q.card.hanzi)}</strong>`;
      feedbackEl.className = "quiz-feedback bad";
    }
    scoreEl.textContent = `Đúng: ${s.score}`;
    buildCheckBtn.disabled = true;
    buildCheckBtn.textContent = "Đã trả lời";

    setTimeout(() => next(), correct ? 1000 : 2000);
  }

  // ---------- Chế độ Viết chữ ----------

  function renderWriteQuestion() {
    const s = session;
    const t = s.targets[s.index];
    progressEl.textContent = `${s.index + 1}/${s.targets.length}`;
    scoreEl.textContent = `Nét sai: ${s.mistakes}`;

    writeArea.hidden = false;
    buildArea.hidden = true;
    optionsEl.hidden = true;
    promptEl.innerHTML = `Viết chữ: pinyin <strong>${esc(t.pinyin)}</strong> · nghĩa <strong>${esc(t.meaning)}</strong>`;
    feedbackEl.textContent = "";

    writeTarget.innerHTML = "";
    showOutline = false;
    updateOutlineBtn();

    if (typeof HanziWriter === "undefined") {
      feedbackEl.textContent = "Thư viện HanziWriter chưa tải. Thử lại sau vài giây.";
      return;
    }

    writer = HanziWriter.create(writeTarget, t.char, {
      width: 240,
      height: 240,
      padding: 10,
      showOutline: false,
      showCharacter: false,
      strokeColor: "#1e293b",
      drawingColor: "#8b5cf6",
      drawingWidth: 20,
      strokeFadeDuration: 400,
    });

    writer.quiz({
      showHintAfterMisses: 3,
      onMistake: () => {
        s.mistakes++;
        scoreEl.textContent = `Nét sai: ${s.mistakes}`;
      },
      onComplete: () => {
        feedbackEl.textContent = "✅ Xong!";
        setTimeout(() => next(), 900);
      },
    });
  }

  function updateOutlineBtn() {
    if (writeOutlineBtn) writeOutlineBtn.textContent = showOutline ? "👁 Ẩn nét mờ" : "👁 Nét mờ";
  }

  function toggleOutline() {
    showOutline = !showOutline;
    if (writer) {
      try { if (showOutline) writer.showOutline(); else writer.hideOutline(); } catch {}
    }
    updateOutlineBtn();
  }

  // ---------- Events ----------

  document.querySelectorAll(".quiz-mode-btn").forEach((b) => {
    b.addEventListener("click", () => start(b.dataset.mode));
  });

  if (quizBtn) quizBtn.addEventListener("click", open);
  if (buildCheckBtn) buildCheckBtn.addEventListener("click", checkBuild);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (writeOutlineBtn) writeOutlineBtn.addEventListener("click", toggleOutline);
  if (replayBtn) replayBtn.addEventListener("click", () => { if (session) start(session.mode); });
  if (menuBtn) menuBtn.addEventListener("click", () => showScreen("menu"));
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) close();
  });

  window.Quiz = { open, start, close };
})();
