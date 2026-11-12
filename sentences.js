// Vietnamese-to-Chinese recall practice. Accepted answers are curated, not AI-graded.
(() => {
  const KEY = "zh_sentence_recall_v1";
  const DAY = 86400000;
  const bank = [
    { id: "name", vi: "Tôi tên An.", context: "Bạn giới thiệu mình với bạn học mới.", answers: ["我叫安", "我的名字是安"], note: "我叫 + tên là cách tự giới thiệu ngắn gọn.", family: "Làm quen" },
    { id: "your-name", vi: "Bạn tên gì?", context: "Bạn muốn biết tên người vừa ngồi cạnh mình.", answers: ["你叫什么名字", "你的名字是什么"], note: "什么名字 hỏi tên gì. 你 là người được hỏi.", family: "Làm quen" },
    { id: "vietnam", vi: "Tôi là người Việt Nam.", context: "Một người hỏi bạn đến từ nước nào.", answers: ["我是越南人"], note: "越南 là Việt Nam. 越南人 là người Việt Nam.", family: "Làm quen" },
    { id: "friend", vi: "Cô ấy là bạn của tôi.", context: "Bạn giới thiệu người bạn nữ đi cùng mình.", answers: ["她是我的朋友", "她是我朋友"], note: "她 dùng để nói về cô ấy. 我的朋友 là bạn của tôi.", family: "Gia đình và bạn bè" },
    { id: "daughter", vi: "Đây là con gái tôi.", context: "Bạn giới thiệu con gái mình với hàng xóm.", answers: ["这是我女儿", "这是我的女儿"], note: "女儿 là con gái. Với người thân, có thể bỏ 的 sau 我.", family: "Gia đình và bạn bè" },
    { id: "tea", vi: "Tôi muốn uống trà.", context: "Bạn đang gọi đồ uống.", answers: ["我想喝茶", "我要喝茶"], note: "想喝 là muốn uống. 茶 là trà.", family: "Đồ uống" },
    { id: "water", vi: "Tôi muốn uống nước.", context: "Vừa đi bộ xong, bạn nói mình muốn uống gì.", answers: ["我想喝水", "我要喝水"], note: "Giữ 我想喝, thay 茶 bằng 水 để đổi đồ uống.", family: "Đồ uống" },
    { id: "no-tea", vi: "Tôi không uống trà.", context: "Bạn từ chối trà và nói thói quen của mình.", answers: ["我不喝茶"], note: "不 đứng trước 喝 để nói không uống.", family: "Đồ uống" },
    { id: "you-tea", vi: "Bạn có uống trà không?", context: "Bạn mời khách chọn đồ uống.", answers: ["你喝茶吗", "你喝不喝茶"], note: "Có thể hỏi bằng 吗 ở cuối câu hoặc mẫu 喝不喝.", family: "Đồ uống" },
    { id: "book", vi: "Tôi thích đọc sách.", context: "Bạn nói về sở thích của mình.", answers: ["我喜欢看书", "我喜欢读书"], note: "喜欢 là thích. 看书 và 读书 đều có thể diễn đạt đọc sách ở đây.", family: "Sở thích" },
    { id: "no-book", vi: "Tôi không thích đọc sách.", context: "Bạn nói mình thích hoạt động khác hơn.", answers: ["我不喜欢看书", "我不喜欢读书"], note: "不喜欢 phủ định việc thích, đứng trước hoạt động 看书.", family: "Sở thích" },
    { id: "like-book", vi: "Bạn có thích đọc sách không?", context: "Bạn muốn tìm người cùng sở thích.", answers: ["你喜欢看书吗", "你喜欢读书吗", "你喜不喜欢看书", "你喜不喜欢读书"], note: "Đổi 我 thành 你 và thêm 吗 để hỏi sở thích người đối diện.", family: "Sở thích" },
    { id: "home", vi: "Nhà tôi có ba người.", context: "Bạn kể về gia đình mình.", answers: ["我家有三口人", "我家有三个人", "我家有三人"], note: "口 thường được dùng khi đếm số người trong gia đình.", family: "Gia đình và bạn bè" },
    { id: "how-much", vi: "Cái này bao nhiêu tiền?", context: "Bạn chỉ vào một món đồ ở cửa hàng.", answers: ["这个多少钱", "这个要多少钱", "这个东西多少钱"], note: "多少钱 hỏi giá tiền. 这个 chỉ cái này.", family: "Mua sắm" },
    { id: "not-spicy", vi: "Tôi không ăn cay.", context: "Bạn nói với nhân viên nhà hàng trước khi gọi món.", answers: ["我不吃辣", "我不吃辣的"], note: "不吃辣 diễn đạt không ăn cay.", family: "Ăn uống" },
  ];
  const root = document.getElementById("sentencesContent");
  let state = { records: {}, session: null, alternatives: [] };
  let warning = false;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved.records === "object" && saved.records) state = { ...state, ...saved };
    if (!Array.isArray(state.alternatives)) state.alternatives = [];
    if (state.session && (!Array.isArray(state.session.queue) || !Number.isInteger(state.session.index))) state.session = null;
    if (state.session) {
      state.session.queue = state.session.queue.filter(id => bank.some(item => item.id === id));
      if (state.session.index < 0) state.session = null;
    }
  } catch { warning = true; }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { warning = true; }
  }
  const normalize = value => value.normalize("NFKC").replace(/[\p{P}\p{Z}\s]/gu, "");
  function node(tag, text, parent = root, className = "") {
    const el = document.createElement(tag); el.textContent = text || ""; el.className = className; parent.append(el); return el;
  }
  function button(text, action, parent, primary = false) {
    const el = node("button", text, parent, primary ? "btn btn-primary" : "btn btn-secondary");
    el.type = "button"; el.addEventListener("click", action); return el;
  }
  function frame(title, detail) {
    root.replaceChildren();
    const page = node("div", "", root, "sentence-page");
    node("p", "TIẾNG VIỆT → TIẾNG TRUNG", page, "conversation-kicker");
    const h = node("h2", title, page); h.tabIndex = -1; h.focus();
    node("p", detail, page, "sentence-detail");
    if (warning) node("p", "Chưa lưu được tiến độ. Bài vẫn tiếp tục trong lần mở này.", page, "warn");
    return node("div", "", page, "conversation-panel");
  }
  function menu() {
    const due = bank.filter(item => !state.records[item.id] || state.records[item.id].due <= Date.now());
    const body = frame("Nhớ chữ bằng cách đặt câu", "Tự nhớ và gõ cả câu. Khi đổi người nói, đồ uống hay ý phủ định, bạn sẽ dùng lại các chữ đã gặp.");
    node("p", "Mỗi buổi 5 câu · " + due.length + " câu đến lượt luyện · " + bank.length + " câu mẫu", body);
    node("p", "Gõ bằng bàn phím tiếng Trung của thiết bị. Không biết chữ nào thì cứ thử phần mình nhớ, hoặc chọn Chưa nhớ để học lại câu.", body);
    const actions = node("div", "", body, "conversation-actions");
    if (state.session && state.session.index < state.session.queue.length) button("Tiếp tục buổi đang làm", task, actions, true);
    else if (due.length) button("Bắt đầu 5 câu", () => start(due), actions, true);
    else node("p", "Đã xong lượt ôn hôm nay. Lần tiếp theo: " + new Date(Math.min(...bank.map(item => state.records[item.id].due))).toLocaleString("vi-VN"), body);
    if (!state.session || state.session.index >= state.session.queue.length) button("Luyện thêm 5 câu", () => start(bank), actions);
    if (state.alternatives.length) {
      const details = node("details", "", body, "conversation-help");
      node("summary", "Câu diễn đạt khác đã lưu (" + state.alternatives.length + ")", details);
      state.alternatives.slice(-10).forEach(entry => node("p", entry.vi + " → " + entry.text, details));
    }
  }
  function start(items) {
    // Least recently attempted first. Interleave related patterns across sessions.
    const order = items.slice().sort((a, b) => (state.records[a.id]?.last || 0) - (state.records[b.id]?.last || 0));
    state.session = { queue: order.slice(0, 5).map(item => item.id), index: 0, failed: [], correct: 0, reviewed: false, draft: "", pending: null };
    save(); task();
  }
  function task() {
    const session = state.session;
    if (!session || session.index >= session.queue.length) return summary();
    const item = bank.find(item => item.id === session.queue[session.index]);
    const body = frame("Câu " + (session.index + 1) + "/" + session.queue.length + " · " + item.family, item.context);
    node("p", item.vi, body, "sentence-prompt");
    const form = node("form", "", body, "sentence-form");
    const label = node("label", "Bạn viết câu này bằng tiếng Trung thế nào?", form); label.htmlFor = "sentenceAnswer";
    const input = node("textarea", "", form, "sentence-input");
    input.id = "sentenceAnswer"; input.lang = "zh-CN"; input.rows = 3; input.value = session.draft || "";
    input.placeholder = "Gõ chữ Hán ở đây…"; input.autocomplete = "off";
    input.addEventListener("input", () => { session.draft = input.value; save(); });
    const actions = node("div", "", form, "conversation-actions");
    const submit = node("button", "Đối chiếu câu", actions, "btn btn-primary"); submit.type = "submit";
    const forget = button("Chưa nhớ · Xem câu mẫu", () => check(false), actions);
    const feedback = node("div", "", body, "sentence-feedback"); feedback.setAttribute("role", "status");
    function check(force) {
      if (session.pending) return;
      if (force && !input.value.trim()) { input.focus(); return; }
      const ok = force && item.answers.some(answer => normalize(answer) === normalize(input.value));
      session.pending = { ok: !!ok, text: input.value, skipped: !force };
      save(); show();
    }
    function show() {
      if (!session.pending) return;
      input.disabled = true; submit.disabled = true; forget.disabled = true;
      const { ok, text, skipped } = session.pending;
      node("h3", ok ? "Đúng câu rồi!" : skipped ? "Học lại câu này" : "Câu bạn viết chưa khớp các mẫu đã có", feedback);
      const answer = node("p", item.answers[0], feedback, "sentence-model"); answer.lang = "zh-CN";
      node("p", item.note, feedback, "conversation-translation");
      if (!ok) node("p", "Đọc và đối chiếu với câu của bạn. Ở lượt sau, mẫu sẽ ẩn để bạn tự viết lại.", feedback);
      const next = node("div", "", feedback, "conversation-actions");
      button("Câu tiếp →", () => complete(ok), next, true);
      if (!ok && !skipped) button("Tôi diễn đạt khác · Lưu để xem lại", () => {
        state.alternatives.push({ vi: item.vi, text, at: Date.now() });
        complete(false);
      }, next);
    }
    function complete(ok) {
      const previous = state.records[item.id] || { streak: 0 };
      if (!ok && !session.failed.includes(item.id)) session.failed.push(item.id);
      const clean = ok && !session.failed.includes(item.id);
      const streak = clean ? Math.min(previous.streak + 1, 3) : 0;
      state.records[item.id] = { streak, last: Date.now(), due: Date.now() + (clean ? [1, 3, 7][streak - 1] * DAY : 600000) };
      if (ok) session.correct += 1;
      // Revisit only after at least three other questions, once per failed item.
      if (!ok && session.queue.length - session.index - 1 >= 3 && session.queue.indexOf(item.id) === session.index) session.queue.push(item.id);
      session.index += 1; session.pending = null; session.draft = "";
      save(); task();
    }
    form.addEventListener("submit", event => { event.preventDefault(); check(true); });
    input.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.isComposing && (event.ctrlKey || event.metaKey)) { event.preventDefault(); check(true); }
    });
    show();
    button("Tạm dừng · Lưu và về tổng kết", menu, body);
  }
  function summary() {
    const session = state.session;
    if (!session) return menu();
    const body = frame("Xong một buổi đặt câu", "Bạn vừa tập nhớ và sử dụng chữ trong cả câu.");
    node("p", session.correct + "/" + session.queue.length + " lượt khớp mẫu.", body, "conversation-translation");
    session.failed.forEach(id => {
      const item = bank.find(item => item.id === id);
      node("p", "Cần ôn: " + item.vi, body);
    });
    node("p", "Câu còn quên sẽ đến lượt sau 10 phút. Câu nhớ đúng được hẹn sau 1, 3 rồi 7 ngày. Các mốc này là lịch luyện ban đầu.", body);
    node("p", "App đối chiếu với câu mẫu đã biên soạn. Một câu diễn đạt khác có thể vẫn đúng; các câu bạn lưu chưa được chấm ngữ pháp tự động.", body, "conversation-note");
    button("Về tổng kết", menu, body, true);
  }
  root.addEventListener("keydown", event => event.stopPropagation());
  window.Sentences = { open: menu };
})();
