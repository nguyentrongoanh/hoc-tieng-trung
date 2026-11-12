// Bài kiểm tra độc lập để xác nhận một thẻ đã thuộc.
(() => {
  const content = document.getElementById("masteryContent");
  const deckSelect = document.getElementById("deckSelect");
  let cards = [], pending = [], deck, record = {}, current, writer, timer, ticker, deadline = 0;
  let phase = "menu", generation = 0;
  const key = (card) => JSON.stringify([card.hanzi, card.meaning, card.pinyin]);

  function stopActiveTask() {
    clearTimeout(timer);
    clearInterval(ticker);
    generation += 1;
    writer?.cancelQuiz();
    writer = null;
  }

  function element(tag, text, className, parent) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    (parent || content).append(el);
    return el;
  }

  function screen(eyebrow, title, description) {
    stopActiveTask();
    content.replaceChildren();
    const shell = element("div", undefined, "mastery-page");
    const head = element("header", undefined, "mastery-head", shell);
    element("p", eyebrow, "mastery-eyebrow", head);
    element("h2", title, "mastery-title", head);
    if (description) element("p", description, "mastery-description", head);
    return element("main", undefined, "mastery-stage", shell);
  }

  function action(parent, label, handler, primary = false) {
    const btn = element("button", label, "mastery-action " + (primary ? "mastery-action-primary" : "mastery-action-secondary"), parent);
    btn.type = "button";
    btn.addEventListener("click", handler);
    return btn;
  }

  function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function normalize(value) {
    return value.toLowerCase().normalize("NFC").replace(/u:|v/g, "ü")
      .replace(/([a-zü]+)([1-5])/g, (_, word, tone) => {
        const index = word.includes("a") ? word.indexOf("a") : word.includes("e") ? word.indexOf("e") :
          word.includes("ou") ? word.indexOf("o") : word.search(/[aeiouü](?!.*[aeiouü])/);
        if (index < 0 || tone === "5") return word;
        return word.slice(0, index + 1) + ["", "\u0304", "\u0301", "\u030c", "\u0300"][tone] + word.slice(index + 1);
      }).normalize("NFC").replace(/[\s'’.,!?，。！？-]/g, "");
  }

  function loadDeck() {
    deck = {
      name: deckSelect.selectedOptions[0]?.textContent || "Bộ thẻ",
      storage: "mastery_exam_v1:" + deckSelect.value,
    };
    cards = [...new Map(QuizData.currentDeckCards()
      .filter((card) => card.meaning && card.pinyin && /\p{Script=Han}/u.test(card.hanzi))
      .map((card) => [key(card), card])).values()];
    try { record = JSON.parse(localStorage.getItem(deck.storage)) || {}; }
    catch { record = {}; }
  }

  function deckPicker(parent) {
    const toolbar = element("div", undefined, "mastery-toolbar", parent);
    const label = element("label", "Bộ cần kiểm tra", "mastery-label", toolbar);
    const select = element("select", undefined, "mastery-select", toolbar);
    label.htmlFor = "masteryDeckSelect";
    select.id = "masteryDeckSelect";
    select.replaceChildren(...[...deckSelect.options].map((option) => option.cloneNode(true)));
    select.value = deckSelect.value;
    select.addEventListener("change", () => {
      deckSelect.value = select.value;
      deckSelect.dispatchEvent(new Event("change", { bubbles: true }));
      menu();
    });
  }

  function menu() {
    phase = "menu";
    loadDeck();
    const passed = cards.filter((card) => record[key(card)]).length;
    const stage = screen("KIỂM TRA THEO BỘ", "Bạn đã thật sự thuộc chữ chưa?", "Một thẻ cần vượt qua cả ba phần trong cùng một lượt.");
    deckPicker(stage);

    const progress = element("section", undefined, "mastery-progress-card", stage);
    const score = element("div", undefined, "mastery-score", progress);
    element("strong", String(passed), "mastery-score-number", score);
    element("span", "/ " + cards.length + " thẻ đã thuộc", "mastery-score-label", score);
    const track = element("div", undefined, "mastery-progress-track", progress);
    const fill = element("div", undefined, "mastery-progress-fill", track);
    fill.style.width = cards.length ? (passed / cards.length * 100) + "%" : "0%";

    const criteria = element("div", undefined, "mastery-criteria", stage);
    [["1", "Chọn nghĩa", "Đúng trong dưới 5 giây"], ["2", "Viết từ trí nhớ", "Không gợi ý, sai tối đa 4 nét"], ["3", "Gõ pinyin", "Đúng trong dưới 5 giây"]]
      .forEach(([number, title, detail]) => {
        const item = element("article", undefined, "mastery-criterion", criteria);
        element("span", number, "mastery-criterion-number", item);
        const copy = element("div", undefined, undefined, item);
        element("strong", title, undefined, copy);
        element("p", detail, undefined, copy);
      });

    pending = cards.filter((card) => !record[key(card)]);
    const actions = element("div", undefined, "mastery-actions", stage);
    if (pending.length) action(actions, "Bắt đầu " + pending.length + " thẻ chưa đạt", next, true);
    if (passed) action(actions, "Kiểm tra lại cả bộ", () => { pending = cards.slice(); next(); });
    if (!cards.length) element("p", "Bộ này chưa có thẻ phù hợp để kiểm tra.", "mastery-empty", actions);
  }

  function next() {
    current = pending.shift();
    if (!current) return menu();
    phase = "ready";
    const stage = screen("CÒN " + (pending.length + 1) + " THẺ", "Sẵn sàng?", "Khi bấm bắt đầu, bạn có 5 giây để chọn nghĩa đúng.");
    element("div", current.hanzi, "mastery-hanzi mastery-hanzi-preview", stage);
    const actions = element("div", undefined, "mastery-actions", stage);
    action(actions, "Bắt đầu", meaning, true);
    action(actions, "Về tổng kết", menu);
  }

  function startClock(stage) {
    const clock = element("div", "5.0", "mastery-clock", stage);
    deadline = performance.now() + 5000;
    ticker = setInterval(() => {
      clock.textContent = (Math.max(0, deadline - performance.now()) / 1000).toFixed(1);
    }, 50);
    timer = setTimeout(() => finish(false, "Hết 5 giây."), 5000);
  }

  function meaning() {
    phase = "meaning";
    const stage = screen("BƯỚC 1 / 3 · CHỌN NGHĨA", current.hanzi, "Chọn nghĩa đúng trong dưới 5 giây.");
    content.querySelector(".mastery-title").classList.add("mastery-question-hanzi");
    startClock(stage);
    const options = element("div", undefined, "mastery-options", stage);
    const others = [...new Set(QuizData.allCards().filter((card) => card.hanzi !== current.hanzi).map((card) => card.meaning))]
      .filter((meaningText) => meaningText && meaningText !== current.meaning);
    shuffled([current.meaning, ...shuffled(others).slice(0, 3)]).forEach((meaningText) => {
      const option = element("button", meaningText, "mastery-option", options);
      option.type = "button";
      option.addEventListener("click", () => {
        if (performance.now() >= deadline || meaningText !== current.meaning) return finish(false, "Chưa đạt phần chọn nghĩa.");
        write([...current.hanzi].filter((char) => /\p{Script=Han}/u.test(char)), 0, 0);
      });
    });
  }

  function write(chars, index, errors) {
    phase = "write";
    const stage = screen("BƯỚC 2 / 3 · VIẾT TỪ TRÍ NHỚ", current.meaning, "Viết chữ " + (index + 1) + "/" + chars.length + ". Không có nét mờ hoặc gợi ý.");
    const count = element("p", "Nét sai: " + errors + "/4", "mastery-mistakes", stage);
    const target = element("div", undefined, "mastery-write-target", stage);
    const token = generation;
    const unavailable = () => {
      if (token !== generation) return;
      const errorStage = screen("KHÔNG TẢI ĐƯỢC DỮ LIỆU NÉT", "Thử lại phần viết", "Kiểm tra kết nối rồi thử lại.");
      const actions = element("div", undefined, "mastery-actions", errorStage);
      action(actions, "Thử lại", () => write(chars, index, errors), true);
      action(actions, "Về tổng kết", menu);
    };
    if (!window.HanziWriter) return unavailable();
    const size = Math.min(360, window.innerWidth - 64);
    writer = HanziWriter.create(target, chars[index], {
      width: size, height: size, padding: 18, showOutline: false, showCharacter: false,
      strokeColor: "#221a12", drawingColor: "#8b5cf6", drawingWidth: 24,
      onLoadCharDataError: unavailable,
    });
    writer.quiz({
      showHintAfterMisses: Infinity,
      highlightOnComplete: false,
      onMistake: () => {
        if (token !== generation) return;
        errors += 1;
        count.textContent = "Nét sai: " + errors + "/4";
        if (errors >= 5) finish(false, "Đã sai 5 nét.");
      },
      onComplete: () => {
        if (token !== generation) return;
        if (index + 1 < chars.length) return write(chars, index + 1, errors);
        phase = "ready";
        const ready = screen("BƯỚC 3 / 3 · PINYIN", "Chuẩn bị gõ pinyin", "Thời gian bắt đầu sau khi bạn bấm nút.");
        const actions = element("div", undefined, "mastery-actions", ready);
        action(actions, "Bắt đầu · 5 giây", pinyin, true);
      },
    });
  }

  function pinyin() {
    phase = "pinyin";
    const stage = screen("BƯỚC 3 / 3 · GÕ PINYIN", current.hanzi, "Nhập pinyin có dấu hoặc số thanh rồi nhấn Enter.");
    content.querySelector(".mastery-title").classList.add("mastery-question-hanzi");
    startClock(stage);
    const form = element("form", undefined, "mastery-pinyin-form", stage);
    const input = element("input", undefined, "mastery-pinyin-input", form);
    input.setAttribute("aria-label", "Pinyin");
    input.placeholder = "Ví dụ: nǐ hǎo hoặc ni3 hao3";
    input.autocomplete = "off";
    input.spellcheck = false;
    const submit = element("button", "Nộp đáp án", "mastery-action mastery-action-primary", form);
    submit.type = "submit";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const ok = performance.now() < deadline && normalize(input.value) === normalize(current.pinyin);
      finish(ok, ok ? "Đạt cả ba tiêu chí." : "Chưa đạt phần pinyin.");
    });
    input.focus();
  }

  function finish(ok, message) {
    phase = "result";
    const stage = screen(ok ? "KẾT QUẢ · ĐÃ THUỘC" : "KẾT QUẢ · CẦN ÔN LẠI", ok ? "Tốt lắm!" : "Thử lại sau nhé", message);
    const result = element("div", undefined, "mastery-result " + (ok ? "mastery-result-pass" : "mastery-result-fail"), stage);
    element("div", current.hanzi, "mastery-result-hanzi", result);
    element("strong", current.pinyin, "mastery-result-pinyin", result);
    element("p", current.meaning, "mastery-result-meaning", result);
    record[key(current)] = ok;
    try { localStorage.setItem(deck.storage, JSON.stringify(record)); }
    catch { element("p", "Không lưu được kết quả trên thiết bị.", "mastery-save-error", stage); }
    const actions = element("div", undefined, "mastery-actions", stage);
    action(actions, pending.length ? "Thẻ tiếp theo" : "Xem tổng kết", next, true);
    action(actions, "Dừng và xem tổng kết", menu);
  }

  function open() { loadDeck(); menu(); }
  content.addEventListener("keydown", (event) => event.stopPropagation());
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.addEventListener("click", () => {
    if (tab.dataset.view !== "mastery") stopActiveTask();
  }));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !content.closest("[hidden]") && ["meaning", "pinyin"].includes(phase)) finish(false, "Lượt tính giờ bị gián đoạn.");
  });
  window.Mastery = { open };
})();
