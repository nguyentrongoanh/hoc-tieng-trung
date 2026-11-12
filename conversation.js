// A guided listening lesson with independent assessments and delayed review.
(() => {
  "use strict";
  const STORAGE = "zh_conversation_greeting_v1";
  const DAY = 86400000;
  const root = document.getElementById("conversationContent");
  const original = [
    { speaker: "A", text: "你好！你叫什么名字？", pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?", meaning: "Xin chào! Bạn tên gì?", chunks: [["你好", "nǐ hǎo", "Xin chào. Dùng để bắt đầu cuộc trò chuyện."], ["你", "nǐ", "Bạn, người đang được hỏi."], ["叫什么名字", "jiào shénme míngzi", "Tên là gì? 叫 là được gọi là, 什么 là gì, 名字 là tên."]] },
    { speaker: "B", text: "我叫安。你呢？", pinyin: "Wǒ jiào Ān. Nǐ ne?", meaning: "Mình tên An. Còn bạn?", chunks: [["我叫安", "wǒ jiào Ān", "Mình tên An. Đổi 安 thành tên của bạn để tự giới thiệu."], ["你呢", "nǐ ne", "Còn bạn thì sao? Hỏi lại cùng nội dung vừa được hỏi."]] },
    { speaker: "A", text: "我叫明。很高兴认识你。", pinyin: "Wǒ jiào Míng. Hěn gāoxìng rènshi nǐ.", meaning: "Mình tên Minh. Rất vui được làm quen với bạn.", chunks: [["我叫明", "wǒ jiào Míng", "Mình tên Minh."], ["很高兴认识你", "hěn gāoxìng rènshi nǐ", "Rất vui được làm quen với bạn. 很高兴 là rất vui, 认识你 là làm quen với bạn."]] },
  ];
  const transfer = [
    { speaker: "A", text: "你好！我叫兰。你叫什么名字？", pinyin: "Nǐ hǎo! Wǒ jiào Lán. Nǐ jiào shénme míngzi?", meaning: "Xin chào! Mình tên Lan. Bạn tên gì?" },
    { speaker: "B", text: "我叫林。很高兴认识你。", pinyin: "Wǒ jiào Lín. Hěn gāoxìng rènshi nǐ.", meaning: "Mình tên Lâm. Rất vui được làm quen với bạn." },
    { speaker: "A", text: "我也很高兴认识你。", pinyin: "Wǒ yě hěn gāoxìng rènshi nǐ.", meaning: "Mình cũng rất vui được làm quen với bạn. 也 nghĩa là cũng." },
  ];
  [...original, ...transfer].forEach((line, index) => {
    line.audio = "assets/conversations/greeting-" + index + ".mp3";
  });
  const questions = {
    baseline: [{ prompt: "Hai người đang nói về việc gì?", options: ["Làm quen và giới thiệu tên", "Hỏi đường", "Gọi đồ uống", "Mình chưa hiểu"], answer: 0 }],
    practice: [
      { prompt: "Người B tên gì?", options: ["An", "Minh", "Lan"], answer: 0, line: 1, explanation: "我叫安 nghĩa là mình tên An." },
      { prompt: "Người B nói 你呢？ để làm gì?", options: ["Chào tạm biệt", "Hỏi lại tên người A", "Hỏi tuổi"], answer: 1, line: 1, explanation: "Người A vừa hỏi tên. 你呢？ hỏi ngược lại: còn bạn tên gì?" },
    ],
    final: [
      { prompt: "Người nào tên Minh?", options: ["Người A", "Người B", "Cả hai người"], answer: 0 },
      { prompt: "Câu hỏi đầu tiên muốn biết điều gì?", options: ["Tuổi", "Tên", "Quê quán"], answer: 1 },
    ],
    transfer: [
      { prompt: "Trong đoạn mới, người A tên gì?", options: ["Minh", "Lâm", "Lan"], answer: 2 },
      { prompt: "Người B đáp lại lời hỏi tên bằng tên nào?", options: ["An", "Lâm", "Lan"], answer: 1 },
    ],
    review: [
      { prompt: "Sau khi tự giới thiệu, người B hỏi lại tên người A bằng cụm nào?", options: ["你好", "你呢", "我叫安"], answer: 1 },
      { prompt: "Ai nói mình rất vui được làm quen?", options: ["Người A", "Người B", "Không ai"], answer: 0 },
    ],
  };
  const defaults = () => ({ stage: "baseline", index: 0, results: {}, learned: [], completedAt: null, reviewAt: null, reviews: [] });
  let state;
  let storageWarning = false;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE));
    state = { ...defaults(), ...(saved || {}) };
    if (!["baseline", "learn", "practice", "final", "transfer", "result", "review"].includes(state.stage)) state = defaults();
    state.results = state.results && typeof state.results === "object" ? state.results : {};
    state.learned = Array.isArray(state.learned) ? state.learned : [];
    state.reviews = Array.isArray(state.reviews) ? state.reviews : [];
    const limit = state.stage === "learn" ? original.length : questions[state.stage]?.length || 1;
    if (!Number.isInteger(state.index) || state.index < 0 || state.index >= limit) state.index = 0;
  } catch { state = defaults(); storageWarning = true; }
  let revealed = false;
  let audioToken = 0;
  let audioStatus;
  let audioButton;
  let listened = false;
  let onlineAudio = null;

  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); }
    catch { storageWarning = true; }
  }
  function el(tag, text, parent = root, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    parent.append(node);
    return node;
  }
  function btn(text, handler, parent, primary = false) {
    const node = el("button", text, parent, primary ? "btn btn-primary" : "btn btn-secondary");
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  }
  function stop() {
    audioToken += 1;
    if (onlineAudio) { onlineAudio.pause(); onlineAudio = null; }
    window.speechSynthesis?.cancel();
    if (audioButton) audioButton.disabled = false;
    window.App?.stopSpeak();
  }
  function play(lines, slow = false) {
    stop();
    const synth = window.speechSynthesis;
    const voices = synth?.getVoices() || [];
    const voice = voices.find((v) => /^zh[-_]CN/i.test(v.lang)) || voices.find((v) => /^zh/i.test(v.lang));
    const token = audioToken;
    audioButton.disabled = true;
    let index = 0;
    const next = () => {
      if (token !== audioToken) return;
      if (index === lines.length) {
        listened = true;
        audioStatus.textContent = "Đã nghe xong. Bạn có thể nghe lại rồi trả lời.";
        audioButton.disabled = false;
        root.querySelectorAll("[data-listening-answer]").forEach((button) => { button.disabled = false; });
        return;
      }
      const line = lines[index++];
      audioStatus.textContent = "Đang nghe · người " + line.speaker + " · lượt " + index + "/" + lines.length;
      const failed = () => {
        if (token !== audioToken) return;
        audioButton.disabled = false;
        audioStatus.textContent = "Chưa phát được âm thanh. Hãy kiểm tra kết nối rồi thử nghe lại.";
      };
      const online = () => {
        if (token !== audioToken) return;
        onlineAudio = new Audio("https://dict.youdao.com/dictvoice?audio=" + encodeURIComponent(line.text) + "&le=zh");
        onlineAudio.playbackRate = slow ? 0.75 : 1;
        onlineAudio.onended = next;
        onlineAudio.onerror = failed;
        onlineAudio.play().catch(failed);
      };
      const recorded = new Audio(line.audio);
      onlineAudio = recorded;
      recorded.playbackRate = slow ? 0.75 : 1;
      recorded.onended = next;
      recorded.onerror = () => {
        if (token !== audioToken) return;
        if (synth && voice) deviceVoice();
        else online();
      };
      recorded.play().catch(() => { if (token === audioToken) online(); });
      function deviceVoice() {
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = "zh-CN";
      if (voice) utterance.voice = voice;
      utterance.rate = slow ? 0.65 : 0.9;
      utterance.onend = next;
      utterance.onerror = () => {
        if (token !== audioToken) return;
        online();
      };
      synth.speak(utterance);
      }
    };
    next();
  }
  function shell(title, subtitle) {
    stop(); revealed = false; listened = false;
    root.replaceChildren();
    const wrap = el("div", undefined, root, "conversation-page");
    btn("← Hôm nay", () => window.LearningNavigation.setView("today"), wrap);
    const header = el("header", undefined, wrap, "conversation-header");
    el("p", "BÀI 1 · LÀM QUEN", header, "conversation-kicker");
    const heading = el("h2", title, header);
    heading.tabIndex = -1;
    el("p", subtitle, header);
    const steps = ["Nghe thử", "Hiểu từng câu", "Luyện nghe", "Nghe cả đoạn", "Đoạn mới"];
    const active = ["baseline", "learn", "practice", "final", "transfer"].indexOf(state.stage);
    const nav = el("ol", undefined, header, "conversation-steps");
    steps.forEach((label, index) => {
      const item = el("li", label, nav, index === active ? "current" : index < active || state.stage === "result" ? "done" : "");
      if (index === active) item.setAttribute("aria-current", "step");
    });
    const body = el("div", undefined, wrap, "conversation-panel");
    if (storageWarning) el("p", "Tiến độ chỉ được giữ trong lần mở này vì chưa lưu được trên thiết bị.", body, "warn");
    heading.focus();
    return body;
  }
  function player(parent, lines) {
    const controls = el("div", undefined, parent, "conversation-actions");
    audioButton = btn("▶ Nghe", () => play(lines), controls, true);
    btn("Nghe chậm", () => play(lines, true), controls);
    btn("Dừng", stop, controls);
    audioStatus = el("p", "Bật âm thanh rồi bấm Nghe. Chữ A/B cho biết ai đang nói.", parent, "conversation-audio-status");
    audioStatus.setAttribute("role", "status");
  }
  function transcript(parent, lines) {
    lines.forEach((line) => {
      const row = el("div", undefined, parent, "conversation-line");
      el("span", line.speaker, row, "conversation-speaker");
      const text = el("p", line.text, row, "conversation-hanzi");
      text.lang = "zh-CN";
    });
  }
  function transition(stage) {
    state.stage = stage; state.index = 0; save(); render();
  }
  function learn() {
    const line = original[state.index];
    const body = shell("Hiểu lượt nói " + (state.index + 1) + "/3", "Nghe câu, đọc nghĩa rồi chạm từng cụm để hiểu cách nói.");
    player(body, [line]);
    transcript(body, [line]);
    el("p", line.pinyin, body, "conversation-pinyin");
    el("p", line.meaning, body, "conversation-translation");
    const chunks = el("div", undefined, body, "conversation-chunks");
    const explanation = el("div", "Chạm một cụm trong câu để xem nghĩa và cách dùng.", body, "conversation-explanation");
    explanation.setAttribute("role", "status");
    line.chunks.forEach(([text, pinyin, meaning]) => {
      btn(text, () => { explanation.textContent = pinyin + " — " + meaning; }, chunks);
    });
    const actions = el("div", undefined, body, "conversation-actions");
    if (state.index > 0) btn("← Câu trước", () => { state.index -= 1; save(); render(); }, actions);
    btn(state.index === 2 ? "Bắt đầu luyện nghe →" : "Đã hiểu · Câu tiếp →", () => {
      if (!state.learned.includes(state.index)) state.learned.push(state.index);
      if (state.index === 2) transition("practice");
      else { state.index += 1; save(); render(); }
    }, actions, true);
  }
  function assessment() {
    const stage = state.stage;
    const list = questions[stage];
    const question = list[state.index];
    const lines = stage === "transfer" ? transfer : stage === "practice" ? [original[question.line]] : original;
    const titles = { baseline: "Nghe thử trước khi học", practice: "Luyện nghe từng câu", final: "Nghe hiểu cả đoạn", transfer: "Thử một cuộc làm quen mới", review: "Ôn lại bằng tai" };
    const body = shell(titles[stage], stage === "baseline" ? "Chưa hiểu cũng được. Chọn câu trả lời sau khi nghe đoạn hội thoại." : "Nghe rồi trả lời câu " + (state.index + 1) + "/" + list.length + ". Bạn có thể nghe lại nhiều lần.");
    player(body, lines);
    let result = state.results[stage]?.[state.index];
    if (stage === "practice") {
      const details = el("details", undefined, body, "conversation-help");
      el("summary", "Xem lời thoại và nghĩa", details);
      transcript(details, lines);
      el("p", lines[0].meaning, details);
      details.addEventListener("toggle", () => {
        if (details.open && !result) { revealed = true; }
      });
    }
    el("h3", question.prompt, body, "conversation-question");
    const options = el("div", undefined, body, "conversation-options");
    const feedback = el("p", "", body, "conversation-feedback");
    feedback.setAttribute("role", "status");
    const actions = el("div", undefined, body, "conversation-actions");
    function showFeedback() {
      const correct = result.choice === question.answer;
      feedback.textContent = (correct ? "Đúng. " : "Đáp án: " + question.options[question.answer] + ". ") + (question.explanation || "");
      if (stage !== "baseline" && stage !== "practice") {
        const details = el("details", undefined, body, "conversation-help");
        el("summary", "Đối chiếu lời thoại sau khi trả lời", details);
        transcript(details, lines);
        lines.forEach((line) => {
          el("p", line.speaker + " · " + line.pinyin, details, "conversation-pinyin");
          el("p", line.meaning, details);
        });
      }
      btn(stage === "baseline" ? "Học từng câu →" : state.index + 1 < list.length ? "Câu tiếp →" : "Xem bước tiếp theo →", advance, actions, true);
    }
    question.options.forEach((option, index) => {
      const button = btn(option, () => {
        if (result || !listened) return;
        stop();
        result = { choice: index, supported: revealed, at: Date.now() };
        if (!Array.isArray(state.results[stage])) state.results[stage] = [];
        state.results[stage][state.index] = result;
        save(); render();
      }, options);
      button.dataset.listeningAnswer = "true";
      button.disabled = !!result || !listened;
      if (result && result.choice === index) button.classList.add("selected");
    });
    if (result) showFeedback();
    else el("p", "Nghe hết đoạn để mở các đáp án.", options, "conversation-note");
  }
  function advance() {
    const stage = state.stage;
    if (state.index + 1 < questions[stage].length) { state.index += 1; save(); render(); return; }
    if (stage === "baseline") return transition("learn");
    if (stage === "practice") return transition("final");
    if (stage === "final") return transition("transfer");
    if (stage === "review") {
      state.reviews.push({ at: Date.now(), correct: score("review"), total: questions.review.length });
      state.reviewAt = Date.now() + (score("review") === 2 ? 3 : 1) * DAY;
    } else {
      state.completedAt = Date.now(); state.reviewAt = Date.now() + DAY;
    }
    transition("result");
  }
  function score(stage) {
    return questions[stage].filter((q, i) => state.results[stage]?.[i]?.choice === q.answer).length;
  }
  function result() {
    const body = shell("Bạn đã đi hết bài làm quen", "Xem mình nghe được gì và chọn phần cần luyện tiếp.");
    const rows = [["Trước khi học · nhận ra tình huống", score("baseline") + "/1"], ["Nghe cả đoạn · không phụ đề", score("final") + "/2"], ["Đoạn mới · tên và câu nói thay đổi", score("transfer") + "/2"]];
    const table = el("table", undefined, body, "conversation-results");
    rows.forEach(([label, value]) => { const row = el("tr", undefined, table); el("th", label, row); el("td", value, row); });
    const missing = [];
    ["final", "transfer"].forEach((stage) => questions[stage].forEach((q, i) => {
      if (state.results[stage]?.[i]?.choice !== q.answer) missing.push(q.prompt);
    }));
    el("p", missing.length ? "Cần luyện thêm: " + missing.join(" · ") : "Bạn đã trả lời đúng các câu hỏi của cả hai đoạn. Hẹn kiểm tra lại sau một ngày.", body, "conversation-translation");
    if (state.reviews.length) {
      const last = state.reviews[state.reviews.length - 1];
      el("p", "Lần ôn gần nhất: " + last.correct + "/" + last.total + " câu đúng.", body);
    }
    el("p", "Lượt ôn tiếp theo: " + new Date(state.reviewAt).toLocaleString("vi-VN") + ".", body);
    el("p", "Các lượt kiểm tra này đo nội dung nghe hiểu. Hãy dùng mục Bộ thẻ và Kiểm tra để luyện chữ riêng.", body, "conversation-note");
    const actions = el("div", undefined, body, "conversation-actions");
    btn("Học lại từng câu", () => { state.results.practice = []; state.results.final = []; state.results.transfer = []; transition("learn"); }, actions, true);
    btn("Nghe ôn ngay", startReview, actions);
    btn("Về lộ trình", () => window.LearningNavigation.setView("today"), actions);
  }
  function startReview() { state.results.review = []; transition("review"); }
  function render() {
    if (state.stage === "learn") learn();
    else if (state.stage === "result") result();
    else assessment();
  }
  function open() { window.LearningNavigation.setView("conversation"); render(); }
  function home() {
    const container = document.getElementById("conversationHome");
    if (!container) return;
    container.replaceChildren();
    const card = el("section", undefined, container, "today-card conversation-home");
    el("p", "LỘ TRÌNH NGHE HIỂU · BÀI 1", card, "conversation-kicker");
    el("h2", "Nghe hai người làm quen", card);
    el("p", "Nghe ra người nào tên gì và hiểu cách hỏi lại tên người đối diện.", card, "today-goal");
    el("p", "3 lượt nói · khoảng 8–12 phút · có giải nghĩa từng cụm", card, "muted");
    if (state.completedAt) {
      el("p", "Đã học · Nghe cả đoạn " + score("final") + "/2 · Đoạn mới " + score("transfer") + "/2", card);
      const due = Date.now() >= state.reviewAt;
      el("p", due ? "Đến lúc nghe lại trước khi mở lời thoại." : "Ôn tiếp vào " + new Date(state.reviewAt).toLocaleString("vi-VN"), card);
      if (due) btn("Ôn nghe hôm nay", () => { window.LearningNavigation.setView("conversation"); startReview(); }, card, true);
    }
    const started = state.stage !== "baseline" || !!state.results.baseline?.length;
    btn(state.stage === "result" ? "Xem kết quả bài học" : started ? "Tiếp tục bài đang học" : "Bắt đầu nghe thử", open, card, true);
    const route = el("div", undefined, card, "conversation-route");
    el("strong", "Bạn đang ở: Làm quen", route);
    el("p", "Tiếp theo dự kiến: Quê quán → Gia đình → Hẹn giờ → Gọi đồ uống. Các bài này đang được biên soạn.", route);
  }
  window.Conversation = { home, stop };
  root.addEventListener("keydown", (event) => event.stopPropagation());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  home();
})();
