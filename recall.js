// Writing recall schedule, kept in the normal backup/restore state.
(function(global) {
  const MINUTE = 60000;
  const intervals = [6 * 60 * MINUTE, 24 * 60 * MINUTE, 3 * 24 * 60 * MINUTE, 7 * 24 * 60 * MINUTE];
  function records(state) { return state.writingRecall ||= {}; }
  global.WritingRecall = {
    enroll(state, card, now = Date.now()) {
      if (!card || !/^[\u4e00-\u9fff]{1,4}$/.test(card.hanzi)) return false;
      const map = records(state);
      if (map[card.hanzi]) return false;
      map[card.hanzi] = {card: {...card}, stage: 0, dueAt: now + 10 * MINUTE, gap: 3, seen: []};
      return true;
    },
    encounter(state, word) {
      for (const r of Object.values(records(state))) {
        if (r.gap && word !== r.card.hanzi && !r.seen.includes(word)) r.seen.push(word);
      }
    },
    due(state, now = Date.now()) {
      return Object.values(records(state)).filter(r => now >= r.dueAt || (r.gap && r.seen.length >= r.gap)).sort((a,b) => a.dueAt - b.dueAt);
    },
    finish(state, word, passed, now = Date.now()) {
      const r = records(state)[word]; if (!r) return;
      r.seen = [];
      if (passed) {
        r.dueAt = now + intervals[Math.min(r.stage, intervals.length - 1)];
        r.stage += 1; r.gap = null; r.lastPassedAt = now;
      } else {
        r.dueAt = now + 10 * MINUTE; r.gap = 3;
      }
    },
    defer(state, word, now = Date.now()) {
      const r = records(state)[word]; if (!r) return;
      r.dueAt = now + 10 * MINUTE; r.gap = null; r.seen = [];
    },
    count(state) { return Object.keys(records(state)).length; }
  };
})(window);
