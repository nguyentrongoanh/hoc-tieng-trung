// Thuật toán SM-2 đã được đơn giản hoá (giống Anki).
// Rating: 1=Again (quên), 2=Hard, 3=Good, 4=Easy.
// Mỗi thẻ SRS state: { ease, interval (ngày), reps, lapses, nextReviewAt }
(function (global) {
  const DAY = 24 * 3600 * 1000;
  const MIN = 60 * 1000;
  const DEFAULT_EASE = 2.5;

  function defaultState() {
    return {
      ease: DEFAULT_EASE,
      interval: 0,       // ngày (0 = new)
      reps: 0,
      lapses: 0,
      nextReviewAt: 0,   // ms epoch; 0 = chưa ôn bao giờ
    };
  }

  // Trả về state mới sau khi rate.
  function rate(prev, rating, now = Date.now()) {
    const s = { ...defaultState(), ...(prev || {}) };
    let ease = s.ease;
    let interval = s.interval;
    let reps = s.reps;
    let lapses = s.lapses;
    let intervalMs;

    if (rating === 1) {
      // Quên: reset reps, schedule lại sau 10 phút
      reps = 0;
      lapses += 1;
      ease = Math.max(1.3, ease - 0.2);
      interval = 0;
      intervalMs = 10 * MIN;
    } else {
      // Nhớ: tính interval mới
      if (reps === 0) {
        interval = rating === 4 ? 4 : 1;
      } else if (reps === 1) {
        interval = rating === 4 ? 7 : rating === 2 ? 3 : 4;
      } else {
        const factor = rating === 2 ? 1.2 : rating === 3 ? ease : ease * 1.3;
        interval = Math.max(1, Math.round(interval * factor));
      }
      reps += 1;

      if (rating === 2) ease = Math.max(1.3, ease - 0.15);
      else if (rating === 4) ease = ease + 0.15;

      intervalMs = interval * DAY;
    }

    return {
      ease: +ease.toFixed(3),
      interval,
      reps,
      lapses,
      nextReviewAt: now + intervalMs,
    };
  }

  // Preview interval cho từng nút rating (hiển thị dưới label).
  function previewAll(prev) {
    return {
      1: "10m",
      2: formatInterval(rate(prev, 2).interval, 10 * MIN),
      3: formatInterval(rate(prev, 3).interval, 10 * MIN),
      4: formatInterval(rate(prev, 4).interval, 10 * MIN),
    };
  }

  function formatInterval(days, lessThanDayMs) {
    if (days <= 0) return Math.round(lessThanDayMs / MIN) + "m";
    if (days < 30) return days + "d";
    if (days < 365) return Math.round(days / 30) + "mo";
    return (days / 365).toFixed(1) + "y";
  }

  function isDue(state, now = Date.now()) {
    if (!state || !state.nextReviewAt) return true; // new card
    return state.nextReviewAt <= now;
  }

  function isNew(state) {
    // `reps === 0` cùng `nextReviewAt` rỗng → thẻ chưa từng học.
    // (Dấu ngoặc để tránh nhầm lẫn thứ tự ưu tiên giữa || và &&.)
    return !state || (state.reps === 0 && (!state.nextReviewAt || state.nextReviewAt === 0));
  }

  function isMature(state) {
    return state && state.interval >= 21;
  }

  // Tạo queue học: due reviews trước, sau đó new cards.
  // deckCards: [{hanzi, pinyin, ...}]
  // srsMap: { "<cardKey>": state }
  // Trả về: [{ index, card, srs, status: 'review'|'new' }]
  function buildQueue(deckCards, srsMap, now = Date.now(), maxNew = 20) {
    const reviews = [];
    const news = [];
    deckCards.forEach((c, i) => {
      const key = cardKey(c);
      const s = srsMap[key];
      if (isNew(s)) news.push({ index: i, card: c, srs: null, status: "new" });
      else if (isDue(s, now)) reviews.push({ index: i, card: c, srs: s, status: "review" });
    });
    return [...reviews, ...news.slice(0, maxNew)];
  }

  function cardKey(c) {
    return c.hanzi + "|" + (c.pinyin || "");
  }

  function countsFor(deckCards, srsMap, now = Date.now()) {
    let due = 0, newCount = 0, mature = 0, learning = 0;
    deckCards.forEach((c) => {
      const s = srsMap[cardKey(c)];
      if (isNew(s)) newCount++;
      else {
        if (isDue(s, now)) due++;
        if (isMature(s)) mature++;
        else learning++;
      }
    });
    return { due, new: newCount, mature, learning, total: deckCards.length };
  }

  // Review log helpers
  function todayKey(ts = Date.now()) {
    const d = new Date(ts);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function reviewsByDay(log, days = 90) {
    const map = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[todayKey(d.getTime())] = 0;
    }
    log.forEach((r) => {
      const k = todayKey(r.t);
      if (k in map) map[k]++;
    });
    return map;
  }

  function reviewsToday(log, now = Date.now()) {
    const k = todayKey(now);
    return log.filter((r) => todayKey(r.t) === k).length;
  }

  function retentionRate(log, daysBack = 14) {
    const cutoff = Date.now() - daysBack * DAY;
    const recent = log.filter((r) => r.t >= cutoff);
    if (recent.length === 0) return null;
    const good = recent.filter((r) => r.rating >= 3).length;
    return good / recent.length;
  }

  // Số ngày liên tiếp có ôn tập (chuỗi streak). Nếu hôm nay chưa ôn, tính từ hôm qua.
  function streak(log, now = Date.now()) {
    const days = new Set(log.map((r) => todayKey(r.t)));
    let n = 0;
    const d = new Date(now);
    if (!days.has(todayKey(d.getTime()))) d.setDate(d.getDate() - 1);
    while (days.has(todayKey(d.getTime()))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  global.SRS = {
    defaultState,
    rate,
    previewAll,
    isDue,
    isNew,
    isMature,
    buildQueue,
    countsFor,
    cardKey,
    todayKey,
    reviewsByDay,
    reviewsToday,
    retentionRate,
    streak,
  };
})(window);
