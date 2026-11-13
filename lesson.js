// lesson.js — Màn "Hôm nay" + bài học mẫu "Chào hỏi lần đầu".
// Nạp SAU app.js để dùng window.App (phát âm, đếm thẻ đến hạn, chuyển ôn).
(function () {
  "use strict";

  const LESSON_KEY = "flashcard_zh_lesson_v1";
  const LESSON = {
    id: "greeting_intro", version: 1,
    title: "Chào hỏi lần đầu",
    goal: "Học cách chào một người bạn bằng tiếng Trung",
    minutes: 3,
    ni:  { char: "你", pinyin: "nǐ",  meaning: "bạn", comps: [{ c: "亻", vi: "bộ Nhân (người)" }, { c: "尔", vi: "nhĩ" }] },
    hao: { char: "好", pinyin: "hǎo", meaning: "tốt", comps: [{ c: "女", vi: "nữ · bên trái" }, { c: "子", vi: "tử · bên phải" }] },
    phrase: { text: "你好", pinyin: "nǐ hǎo", meaning: "xin chào" },
  };
  function charData(ch) { return ch === "好" ? LESSON.hao : LESSON.ni; }

  const $ = (id) => document.getElementById(id);
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  // ---------- State & storage ----------
  let storageBlocked = false;
  let ls = load();
  let currentView = "today";
  let subMode = null;          // null | "review" | "writing"
  let reviewIndex = 0;
  let subReveal4 = false;
  let subRevealRev = false;
  let subStep5 = null;         // null | "correct" | "wrong"
  let subInspect = false;
  let tempAssemble = [];
  let assembleFeedback = null; // { ok, text }
  let writingTarget = null;
  let returnAfterWriting = null; // { step } | { mode:"review" }
  let writeCanvas = null, writeCtx = null;

  function defaultState() {
    return {
      id: LESSON.id, version: LESSON.version,
      started: false, step: 1, completed: false,
      niChoice: null, haoChoice: null, step3Done: false, review: [],
    };
  }
  function load() {
    try {
      const raw = localStorage.getItem(LESSON_KEY);
      if (!raw) return defaultState();
      const d = JSON.parse(raw);
      if (!d || d.id !== LESSON.id) return defaultState();
      return Object.assign(defaultState(), d);
    } catch (e) { storageBlocked = true; return defaultState(); }
  }
  function save() {
    if (storageBlocked) return;
    try { localStorage.setItem(LESSON_KEY, JSON.stringify(ls)); }
    catch (e) { storageBlocked = true; }
  }

  // ---------- Phát âm & thông báo ----------
  function speakLesson(text) {
    if (!text || !window.App) return;
    const canSynth = ("speechSynthesis" in window);
    const hasAudio = !!$("googleAudio");
    if (!canSynth && !hasAudio) { toast("🔇 Chưa phát được âm thanh trên thiết bị này."); return; }
    try { window.App.stopSpeak(); window.App.speak(text); }
    catch (e) { toast("🔇 Chưa phát được âm thanh."); }
  }
  let toastTimer = null;
  function toast(msg) {
    let el = $("lessonToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lessonToast"; el.className = "lesson-toast"; el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg; el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // ---------- Điều hướng view ----------
  const VIEW_IDS = { today: "viewToday", lesson: "viewLesson", conversation: "viewConversation", sentences: "viewSentences", decks: "viewDecks", manage: "viewManage", mastery: "viewMastery", progress: "viewProgress", settings: "viewSettings", phrases: "viewPhrases" };
  function setView(name) {
    if (name !== "decks") {
      document.body.classList.remove("study-focus");
      $("focusStudyBtn").textContent = "⛶ Tập trung";
      $("focusStudyBtn").setAttribute("aria-pressed", "false");
    }
    if (name !== "conversation" && window.Conversation) window.Conversation.stop();
    currentView = name;
    Object.entries(VIEW_IDS).forEach(([k, id]) => { const el = $(id); if (el) el.hidden = (k !== name); });
    document.querySelectorAll(".nav-tab").forEach((b) => b.classList.toggle("active", b.dataset.view === (name === "lesson" || name === "conversation" ? "today" : name)));
    if (name === "today") renderToday();
    if (name === "today" && window.Conversation) window.Conversation.home();
    if (name === "lesson") { renderLesson(); focusTask(); }
    if (name === "mastery" && window.Mastery) window.Mastery.open();
    if (name === "sentences" && window.Sentences) window.Sentences.open();
    if (name === "phrases" && window.Phrases) window.Phrases.render();
    window.scrollTo(0, 0);
  }
  function goToday() { stopLessonAudio(); setView("today"); }
  function stopLessonAudio() { if (window.App) window.App.stopSpeak(); }

  // ---------- Hôm nay ----------
  function renderToday() {
    const c = $("todayContent");
    if (!c) return;
    const due = window.App ? window.App.dueCount() : 0;
    const started = !!ls.started;
    const done = !!ls.completed;
    const inProgress = started && !done;

    let lessonBtn;
    if (done) lessonBtn = `<button class="btn btn-primary" data-act="relearn">🔄 Học lại</button>`;
    else if (inProgress) {
      const label = ls.step >= 6 ? "Học tiếp" : `Học tiếp · Bước ${ls.step}/5`;
      lessonBtn = `<button class="btn btn-primary" data-act="continue">${label}</button>`;
    }
    else lessonBtn = `<button class="btn btn-primary" data-act="start">🚀 Bắt đầu học</button>`;

    const badge = done
      ? `<span class="chip chip-ok">✅ Đã hoàn thành</span>`
      : inProgress ? `<span class="chip chip-progress">⏳ Đang học dở · Bước ${Math.min(ls.step, 5)}/5</span>` : "";

    c.innerHTML = `
      <section class="home-intro"><p class="home-eyebrow">HỌC MỘT ÍT, DÙNG LẠI MỖI NGÀY</p>
        <h2>Hôm nay, mình học gì?</h2>
        <p>Nhớ mặt chữ, viết thành câu và kiểm tra điều mình đã học.</p>
      </section>
      <div class="home-choices">
        <article class="home-primary"><div class="home-symbol" lang="zh-CN">字</div><div>
          <p class="home-eyebrow">ÔN MẶT CHỮ</p><h3>Tiếp tục bộ thẻ của bạn</h3>
          <p>${due > 0 ? `Có ${due} thẻ đến hạn ôn hôm nay.` : "Mở bộ đang học và ôn từng chữ theo nhịp của bạn."}</p>
          <button class="btn btn-primary" data-act="open-decks">Vào học →</button>
        </div></article>
        <article class="home-choice"><span class="home-choice-icon">✍</span><h3>Đặt câu</h3><p>Đọc câu tiếng Việt, tự nhớ và gõ chữ Hán.</p><button class="btn btn-secondary" data-act="open-sentences">Luyện đặt câu →</button></article>
        <article class="home-choice"><span class="home-choice-icon">✓</span><h3>Kiểm tra</h3><p>Tự kiểm tra nghĩa, cách viết và pinyin của từng bộ.</p><button class="btn btn-secondary" data-act="open-mastery">Kiểm tra đã thuộc →</button></article>
      </div>
      <details class="home-extra"><summary>Bài hướng dẫn và luyện nghe</summary>
      <div id="conversationHome"></div>
      <div class="today-card lesson">
        ${badge}
        <div class="today-card-title">✍️ Luyện chữ bổ trợ · ${esc(LESSON.title)}</div>
        <p class="today-goal">${esc(LESSON.goal)}</p>
        <p class="muted today-meta">⏱ Khoảng ${LESSON.minutes} phút</p>
        ${lessonBtn}
      </div>
      </details>
      <div class="home-footer"><span>Tiến độ và công cụ của bạn</span><button class="btn btn-ghost" data-act="open-progress">Xem tiến độ</button><button class="btn btn-ghost" data-act="open-manage">Nhập / sửa thẻ</button></div>
      ${storageBlocked ? `<p class="warn">⚠️ Không ghi được tiến độ (bộ nhớ bị chặn). Tiến độ chỉ được giữ trong lần mở này.</p>` : ""}`;
  }

  function startLesson() {
    if (!ls.started) { ls = Object.assign(defaultState(), { started: true }); save(); }
    resetTransients();
    setView("lesson");
  }
  function continueLesson() { resetTransients(); setView("lesson"); }
  function relearn() {
    ls = Object.assign(defaultState(), { started: true });
    save();
    resetTransients();
    setView("lesson");
  }
  function resetTransients() {
    subMode = null; reviewIndex = 0; tempAssemble = []; assembleFeedback = null;
    subReveal4 = false; subRevealRev = false; subStep5 = null; subInspect = false;
  }

  function headerHTML(title, pct, stepText) {
    return `
      <div class="lesson-header">
        <button class="lesson-back" data-act="back">← Về Hôm nay</button>
        <div class="lesson-head-main">
          <h2 class="lesson-title">${esc(title)}</h2>
          <div class="lesson-progress"><div class="lesson-progress-bar" style="width:${pct}%"></div></div>
          <span class="lesson-step">${esc(stepText)}</span>
        </div>
      </div>`;
  }
  function focusTask() { const t = $("lessonTask"); if (t) t.focus({ preventScroll: true }); }

  // Gợi ý phím tắt theo bước (mục 8 — bàn phím từ đầu đến cuối).
  function updateKbdHint() {
    const el = $("lessonKbdHint");
    if (!el) return;
    let txt = "";
    if (subMode === "review") txt = "Phím: <kbd>1</kbd> Xem đáp án / Mình nhớ · <kbd>2</kbd> Ôn lại";
    else if (subMode !== "writing" && ls.step === 3 && !ls.step3Done) txt = "Phím: <kbd>1</kbd> 你 · <kbd>2</kbd> 好 · <kbd>←</kbd><kbd>→</kbd> chuyển ô · <kbd>Backspace</kbd> gỡ · <kbd>Enter</kbd> kích hoạt nút đang focus";
    else if (subMode !== "writing" && ls.step === 4) txt = "Phím: <kbd>1</kbd> Xem đáp án → Mình nhớ · <kbd>2</kbd> Ôn lại";
    else if (subMode !== "writing" && ls.step === 5 && !subStep5) txt = "Phím: <kbd>1</kbd> 你 · <kbd>2</kbd> 好";
    el.hidden = !txt;
    if (txt) el.innerHTML = "⌨️ " + txt;
    else el.textContent = "";
  }

  function renderLesson() {
    const c = $("lessonContent");
    if (!c) return;
    updateKbdHint();
    if (subMode === "writing") { renderWriting(c); return; }
    if (subMode === "review") { renderReview(c); return; }
    if (ls.step >= 6) { renderResult(c); return; }
    renderStep(c, ls.step);
  }
  function renderStep(c, step) {
    if (step === 1) c.innerHTML = step1HTML();
    else if (step === 2) c.innerHTML = step2HTML();
    else if (step === 3) c.innerHTML = step3HTML();
    else if (step === 4) c.innerHTML = step4HTML();
    else if (step === 5) c.innerHTML = step5HTML();
  }

  // ---------- Các bước bài học ----------
  function step1HTML() {
    const ni = LESSON.ni;
    return `${headerHTML(LESSON.title, 20, "Bước 1/5 · Gặp chữ 你")}
      <div class="lesson-body">
        <div class="lesson-task" tabindex="-1" id="lessonTask">
          <p class="lesson-kicker">Gặp chữ mới</p>
          <div class="lesson-hanzi" lang="zh-CN">${esc(ni.char)}</div>
          <div class="lesson-reading">${esc(ni.pinyin)} · ${esc(ni.meaning)}</div>
        </div>
        <div class="lesson-actions">
          <button class="btn btn-secondary" data-act="speak-ni">🔊 Nghe phát âm</button>
          <button class="btn btn-primary" data-act="next1">Học chữ tiếp theo →</button>
        </div>
      </div>`;
  }

  function step2HTML() {
    const hao = LESSON.hao;
    const inspect = subInspect
      ? `<div class="inspect-panel" id="inspectPanel">
          <div class="inspect-row">
            <span class="inspect-comp" lang="zh-CN">${esc(hao.comps[0].c)}<small>${esc(hao.comps[0].vi)}</small></span>
            <span class="inspect-plus">+</span>
            <span class="inspect-comp" lang="zh-CN">${esc(hao.comps[1].c)}<small>${esc(hao.comps[1].vi)}</small></span>
            <span class="inspect-plus">=</span>
            <span class="inspect-full" lang="zh-CN">${esc(hao.char)}</span>
          </div>
          <button class="btn btn-ghost" data-act="close-inspect">Đóng</button>
        </div>` : "";
    return `${headerHTML(LESSON.title, 40, "Bước 2/5 · Gặp chữ 好")}
      <div class="lesson-body">
        <div class="lesson-task" tabindex="-1" id="lessonTask">
          <p class="lesson-kicker">Gặp chữ mới</p>
          <div class="lesson-hanzi" lang="zh-CN">${esc(hao.char)}</div>
          <div class="lesson-reading">${esc(hao.pinyin)} · ${esc(hao.meaning)}</div>
        </div>
        ${inspect}
        <div class="lesson-actions">
          <button class="btn btn-secondary" data-act="speak-hao">🔊 Nghe phát âm</button>
          <button class="btn btn-ghost" data-act="inspect">🔍 Nhìn kỹ chữ 好</button>
          <button class="btn btn-ghost" data-act="write">✍️ Thử viết từ trí nhớ</button>
          <button class="btn btn-primary" data-act="to-assemble">Thử chào một người bạn →</button>
        </div>
      </div>`;
  }

  function step3HTML() {
    const phrase = LESSON.phrase;
    if (ls.step3Done) {
      return `${headerHTML(LESSON.title, 60, "Bước 3/5 · Ghép lời chào")}
        <div class="lesson-body">
          <div class="lesson-task" tabindex="-1" id="lessonTask">
            <p class="lesson-kicker">Tuyệt vời! Bạn đã ghép đúng.</p>
            <div class="lesson-hanzi" lang="zh-CN">${esc(phrase.text)}</div>
            <div class="lesson-reading">${esc(phrase.pinyin)} · ${esc(phrase.meaning)}</div>
          </div>
          <div class="lesson-actions">
            <button class="btn btn-secondary" data-act="listen-phrase">🔊 Nghe cả cụm</button>
            <button class="btn btn-primary" data-act="next3">Tiếp tục →</button>
          </div>
        </div>`;
    }
    const slots = [0, 1].map((i) => tempAssemble[i]
      ? `<button class="slot filled" data-act="unslot" data-i="${i}" lang="zh-CN">${esc(tempAssemble[i])}</button>`
      : `<div class="slot empty">·</div>`).join("");
    const bank = ["好", "你"].map((ch) => {
      const used = tempAssemble.includes(ch);
      return `<button class="tile${used ? " used" : ""}" data-act="tile" data-ch="${esc(ch)}" ${used ? "disabled" : ""} lang="zh-CN">${esc(ch)}</button>`;
    }).join("");
    const fb = assembleFeedback
      ? `<div class="feedback ${assembleFeedback.ok ? "ok" : "bad"}" role="status">${esc(assembleFeedback.text)}</div>` : "";
    return `${headerHTML(LESSON.title, 60, "Bước 3/5 · Ghép lời chào")}
      <div class="lesson-body">
        <div class="lesson-task" tabindex="-1" id="lessonTask">
          <p class="lesson-kicker">Bạn gặp một người bạn mới. Hãy ghép lời chào.</p>
          <div class="assemble-slots">${slots}</div>
          <div class="assemble-bank">${bank}</div>
          ${fb}
        </div>
      </div>`;
  }

  function step4HTML() {
    const ni = LESSON.ni;
    const body = subReveal4
      ? `<div class="lesson-task" tabindex="-1" id="lessonTask">
           <div class="lesson-hanzi" lang="zh-CN">${esc(ni.char)}</div>
           <div class="lesson-reading">${esc(ni.pinyin)} · ${esc(ni.meaning)}</div>
         </div>
         <div class="lesson-actions">
           <button class="btn btn-primary" data-act="ni-remember">✅ Mình nhớ</button>
           <button class="btn btn-secondary" data-act="ni-again">🔁 Ôn lại</button>
         </div>`
      : `<div class="lesson-task" tabindex="-1" id="lessonTask">
           <p class="lesson-kicker">Chữ này nghĩa là gì?</p>
           <div class="lesson-hanzi" lang="zh-CN">${esc(ni.char)}</div>
           <p class="muted">Hãy thử nhớ nghĩa trước khi xem đáp án.</p>
         </div>
         <div class="lesson-actions">
           <button class="btn btn-primary" data-act="reveal4">Xem đáp án</button>
         </div>`;
    return `${headerHTML(LESSON.title, 80, "Bước 4/5 · Nhớ nghĩa")}<div class="lesson-body">${body}</div>`;
  }

  function step5HTML() {
    const hao = LESSON.hao;
    if (subStep5) {
      const ok = subStep5 === "correct";
      const inner = ok
        ? `<div class="lesson-hanzi" lang="zh-CN">${esc(hao.char)}</div>
           <div class="lesson-reading">${esc(hao.pinyin)} · ${esc(hao.meaning)}</div>`
        : `<div class="lesson-hanzi" lang="zh-CN">${esc(hao.char)}</div>
           <div class="feedback bad" role="status">你 là bạn. 好 là tốt.</div>`;
      return `${headerHTML(LESSON.title, 100, "Bước 5/5 · Nhớ mặt chữ")}
        <div class="lesson-body">
          <div class="lesson-task" tabindex="-1" id="lessonTask">${inner}</div>
          <div class="lesson-actions">
            <button class="btn btn-secondary" data-act="speak-hao">🔊 Nghe</button>
            <button class="btn btn-primary" data-act="next5">Tiếp tục →</button>
          </div>
        </div>`;
    }
    return `${headerHTML(LESSON.title, 100, "Bước 5/5 · Nhớ mặt chữ")}
      <div class="lesson-body">
        <div class="lesson-task" tabindex="-1" id="lessonTask">
          <p class="lesson-kicker">Chữ nào có nghĩa là tốt?</p>
        </div>
        <div class="lesson-actions row">
          <button class="btn btn-option" data-act="pick-ni" lang="zh-CN">你</button>
          <button class="btn btn-option" data-act="pick-hao" lang="zh-CN">好</button>
        </div>
      </div>`;
  }

  // ---------- Logic ghép câu (bước 3) ----------
  function toggleTile(ch) {
    if (ls.step3Done) return;
    const i = tempAssemble.indexOf(ch);
    if (i >= 0) { tempAssemble.splice(i, 1); assembleFeedback = null; }
    else if (tempAssemble.length < 2) { tempAssemble.push(ch); assembleFeedback = null; }
    if (tempAssemble.length === 2) checkAssemble();
    else renderLesson();
  }
  function removeSlot(i) {
    if (ls.step3Done) return;
    tempAssemble.splice(i, 1); assembleFeedback = null; renderLesson();
  }
  function checkAssemble() {
    if (tempAssemble.join("") === "你好") {
      ls.step3Done = true; assembleFeedback = null; save();
    } else {
      assembleFeedback = { ok: false, text: "Hãy bắt đầu bằng chữ 你 (bạn)." };
      tempAssemble = [];
    }
    renderLesson();
  }
  // Di chuyển focus giữa các ô ghép (mục 8 — phím mũi tên).
  function moveAssembleFocus(forward) {
    const els = Array.from(document.querySelectorAll("#lessonContent .tile:not(:disabled), #lessonContent .slot.filled"));
    if (!els.length) return;
    const idx = els.indexOf(document.activeElement);
    const next = idx < 0 ? (forward ? 0 : els.length - 1) : (idx + (forward ? 1 : -1) + els.length) % els.length;
    els[next].focus();
  }

  // ---------- Kết quả & ôn lại ----------
  function computeReview() {
    const r = [];
    if (ls.niChoice === "again") r.push("你");
    if (ls.haoChoice === "wrong") r.push("好");
    return r;
  }
  function renderResult(c) {
    const phrase = LESSON.phrase;
    const review = ls.review;
    const n = review.length;
    const reviewBlock = n > 0
      ? `<div class="result-review">
           <p>📌 Cần xem lại: <strong lang="zh-CN">${review.map((ch) => esc(ch)).join("、")}</strong></p>
           <button class="btn btn-secondary" data-act="review-now">🔁 Ôn lại ${n} chữ</button>
         </div>`
      : `<p class="muted">🎉 Không còn chữ nào cần ôn lại.</p>`;
    c.innerHTML = `${headerHTML("Kết quả", 100, "Hoàn thành")}
      <div class="lesson-body">
        <div class="lesson-task" tabindex="-1" id="lessonTask">
          <p class="lesson-kicker">Bạn đã ghép được</p>
          <div class="lesson-hanzi" lang="zh-CN">${esc(phrase.text)}</div>
          <div class="lesson-reading">${esc(phrase.pinyin)} · ${esc(phrase.meaning)}</div>
        </div>
        ${reviewBlock}
        <div class="lesson-actions">
          <button class="btn btn-secondary" data-act="listen-phrase">🔊 Nghe</button>
          <button class="btn btn-primary" data-act="finish">✅ Hoàn tất</button>
        </div>
        <button class="btn btn-ghost btn-block" data-act="relearn">🔄 Học lại bài</button>
      </div>`;
  }

  function renderReview(c) {
    const review = ls.review;
    if (reviewIndex >= review.length) { subMode = null; renderLesson(); return; }
    const ch = review[reviewIndex];
    const data = charData(ch);
    const body = subRevealRev
      ? `<div class="lesson-task" tabindex="-1" id="lessonTask">
           <div class="lesson-hanzi" lang="zh-CN">${esc(data.char)}</div>
           <div class="lesson-reading">${esc(data.pinyin)} · ${esc(data.meaning)}</div>
         </div>
         <div class="lesson-actions">
           <button class="btn btn-primary" data-act="rev-remember">✅ Mình nhớ</button>
           <button class="btn btn-secondary" data-act="rev-again">🔁 Ôn lại</button>
           <button class="btn btn-ghost" data-act="write-rev">✍️ Thử viết</button>
         </div>`
      : `<div class="lesson-task" tabindex="-1" id="lessonTask">
           <p class="lesson-kicker">Chữ này nghĩa là gì?</p>
           <div class="lesson-hanzi" lang="zh-CN">${esc(data.char)}</div>
         </div>
         <div class="lesson-actions">
           <button class="btn btn-primary" data-act="reveal-rev">Xem đáp án</button>
         </div>`;
    c.innerHTML = `${headerHTML("Ôn lại", 100, `Ôn ${reviewIndex + 1}/${review.length}`)}<div class="lesson-body">${body}</div>`;
  }

  // ---------- Chuyển bước & lưu lựa chọn ----------
  function setNi(choice) {
    ls.niChoice = choice; ls.step = 5; subStep5 = null; save();
    renderLesson(); focusTask();
  }
  function pickHao(correct) {
    ls.haoChoice = correct ? "correct" : "wrong";
    subStep5 = correct ? "correct" : "wrong";
    save();
    if (correct) speakLesson(LESSON.hao.char);
    renderLesson(); focusTask();
  }
  function finishStep5() {
    ls.step = 6; ls.review = computeReview(); save();
    subMode = null; renderLesson(); focusTask();
  }
  function startReview() { subMode = "review"; reviewIndex = 0; subRevealRev = false; renderLesson(); focusTask(); }
  function revRemember() {
    ls.review.splice(reviewIndex, 1); subRevealRev = false; save(); renderLesson(); focusTask();
  }
  function revAgain() { subRevealRev = false; reviewIndex++; renderLesson(); focusTask(); }
  function finishLesson() { ls.completed = true; save(); goToday(); }

  // ---------- Luyện viết tự do (canvas) ----------
  function enterWriting(target, ret) {
    writingTarget = target;
    returnAfterWriting = ret;
    subMode = "writing";
    renderLesson();
  }
  function exitWriting() {
    subMode = returnAfterWriting && returnAfterWriting.mode === "review" ? "review" : null;
    writingTarget = null;
    renderLesson();
  }
  function renderWriting(c) {
    const t = writingTarget;
    c.innerHTML = `${headerHTML(`✍️ Viết chữ ${esc(t.char)}`, 100, "Luyện viết")}
      <div class="lesson-body">
        <div class="write-sample">
          <div class="write-big" lang="zh-CN">${esc(t.char)}</div>
          <div class="write-comps">${t.comps.map((cp) => `<span class="wc" lang="zh-CN">${esc(cp.c)} <small>${esc(cp.vi)}</small></span>`).join("")}</div>
        </div>
        <div class="write-stage">
          <canvas id="writeCanvas" width="300" height="300" aria-label="Vùng tự viết"></canvas>
          <div class="write-guide" id="writeGuide" hidden lang="zh-CN">${esc(t.char)}</div>
        </div>
        <div class="write-actions">
          <button class="btn btn-ghost" data-act="write-clear">🧹 Xóa</button>
          <button class="btn btn-ghost" data-act="write-hint">👁 Gợi ý</button>
          <button class="btn btn-ghost" data-act="write-compare">📐 So với mẫu</button>
          <button class="btn btn-secondary" data-act="write-back">← Quay lại bài</button>
        </div>
        <div class="write-compare" id="writeCompare" hidden>
          <div class="write-cmp-col"><div class="muted">Bài viết của bạn</div><img id="writeMyThumb" alt="Bài viết của bạn"></div>
          <div class="write-cmp-col"><div class="muted">Mẫu</div><div class="write-big" lang="zh-CN">${esc(t.char)}</div></div>
          <div class="write-actions"><button class="btn btn-secondary" data-act="write-retry">✍️ Viết lại</button></div>
        </div>
      </div>`;
    initCanvas();
  }
  function initCanvas() {
    const canvas = $("writeCanvas");
    if (!canvas) return;
    writeCanvas = canvas;
    writeCtx = canvas.getContext("2d");
    writeCtx.lineWidth = 14; writeCtx.lineCap = "round"; writeCtx.lineJoin = "round"; writeCtx.strokeStyle = "#1e293b";
    let drawing = false;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
    };
    canvas.addEventListener("pointerdown", (e) => {
      drawing = true; const p = pos(e);
      writeCtx.beginPath(); writeCtx.moveTo(p.x, p.y);
      try { canvas.setPointerCapture(e.pointerId); } catch {}
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pos(e); writeCtx.lineTo(p.x, p.y); writeCtx.stroke(); });
    const up = () => { drawing = false; };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
  }
  function clearWrite() { if (writeCtx && writeCanvas) writeCtx.clearRect(0, 0, writeCanvas.width, writeCanvas.height); }
  function toggleGuide() { const g = $("writeGuide"); if (g) g.hidden = !g.hidden; }
  function showCompare() {
    const cmp = $("writeCompare"); if (!cmp) return;
    cmp.hidden = false;
    const img = $("writeMyThumb");
    if (img && writeCanvas) img.src = writeCanvas.toDataURL("image/png");
  }
  function retryWrite() {
    clearWrite();
    const cmp = $("writeCompare"); if (cmp) cmp.hidden = true;
    const g = $("writeGuide"); if (g) g.hidden = true;
  }

  // ---------- Xử lý sự kiện ----------
  function onTodayClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act.startsWith("open-")) { setView(act.slice(5)); return; }
    if (act === "start") startLesson();
    else if (act === "continue") continueLesson();
    else if (act === "relearn") relearn();
    else if (act === "review-deck") {
      if (window.App && window.App.goToReview()) setView("decks");
      else toast("Không còn thẻ nào đến hạn.");
    }
  }

  function onLessonClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    switch (el.dataset.act) {
      case "back": goToday(); break;
      case "speak-ni": speakLesson(LESSON.ni.char); break;
      case "speak-hao": speakLesson(LESSON.hao.char); break;
      case "listen-phrase": speakLesson(LESSON.phrase.text); break;
      case "next1": ls.step = 2; save(); renderLesson(); focusTask(); break;
      case "inspect": subInspect = true; renderLesson(); break;
      case "close-inspect": subInspect = false; renderLesson(); break;
      case "write": enterWriting(LESSON.hao, { step: 2 }); break;
      case "to-assemble": ls.step = 3; save(); resetTransients(); renderLesson(); focusTask(); break;
      case "tile": toggleTile(el.dataset.ch); break;
      case "unslot": removeSlot(parseInt(el.dataset.i, 10)); break;
      case "next3": ls.step = 4; save(); subReveal4 = false; renderLesson(); focusTask(); break;
      case "reveal4": subReveal4 = true; renderLesson(); break;
      case "ni-remember": setNi("remember"); break;
      case "ni-again": setNi("again"); break;
      case "pick-ni": pickHao(false); break;
      case "pick-hao": pickHao(true); break;
      case "next5": finishStep5(); break;
      case "review-now": startReview(); break;
      case "reveal-rev": subRevealRev = true; renderLesson(); break;
      case "rev-remember": revRemember(); break;
      case "rev-again": revAgain(); break;
      case "write-rev": enterWriting(charData(ls.review[reviewIndex]), { mode: "review" }); break;
      case "finish": finishLesson(); break;
      case "relearn": relearn(); break;
      case "write-clear": clearWrite(); break;
      case "write-hint": toggleGuide(); break;
      case "write-compare": showCompare(); break;
      case "write-retry": retryWrite(); break;
      case "write-back": exitWriting(); break;
    }
  }

  document.addEventListener("keydown", (e) => {
    if (currentView !== "lesson") return;
    if (subMode === "writing") return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (subMode === "review") {
      if (e.key === "1") { if (subRevealRev) revRemember(); else { subRevealRev = true; renderLesson(); } }
      else if (e.key === "2") { if (subRevealRev) revAgain(); }
      return;
    }
    if (ls.step === 3 && !ls.step3Done) {
      if (e.key === "1") toggleTile("你");
      else if (e.key === "2") toggleTile("好");
      else if (e.key === "Backspace") { if (tempAssemble.length) removeSlot(tempAssemble.length - 1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); moveAssembleFocus(e.key === "ArrowRight"); }
      return;
    }
    if (ls.step === 4) {
      if (e.key === "1") { if (subReveal4) setNi("remember"); else { subReveal4 = true; renderLesson(); } }
      else if (e.key === "2") { if (subReveal4) setNi("again"); }
      return;
    }
    if (ls.step === 5 && !subStep5) {
      if (e.key === "1") pickHao(false);
      else if (e.key === "2") pickHao(true);
    }
  });

  // ---------- Khởi tạo ----------
  document.querySelectorAll(".nav-tab").forEach((b) => {
    b.addEventListener("click", () => { stopLessonAudio(); setView(b.dataset.view); });
  });
  const tc = $("todayContent"), lc = $("lessonContent");
  if (tc) tc.addEventListener("click", onTodayClick);
  if (lc) lc.addEventListener("click", onLessonClick);
  window.LearningNavigation = { setView };
  setView("today");
})();
