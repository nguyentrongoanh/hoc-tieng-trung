const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ctx = {window: {}};
vm.createContext(ctx);
for (const file of ['decks.js', 'hsk1.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
const {lessons, progress} = ctx.window.HSK1;
assert.equal(lessons.length, 10);
const cards = lessons.flatMap(d => d.cards);
assert.equal(cards.length, 150);
assert.equal(new Set(cards.map(c => c.hanzi)).size, 150);
for (const lesson of lessons) assert.equal(lesson.cards.length, 15);
for (const card of cards) for (const key of ['hanzi','pinyin','meaning','example','examplePinyin','exampleMeaning']) assert(card[key]?.trim(), `${card.hanzi}: missing ${key}`);
const state = {srs: {
 old: {'我|wǒ': {nextReviewAt: 10}, '你|nǐ': {nextReviewAt: 0}},
 other: {'我|wo3': {nextReviewAt: 20}, '机场|jī chǎng': {nextReviewAt: 10}}
}};
const records = {
 'mastery_exam_v1:hsk1_basic': {'["我","tôi","wǒ"]': true},
 'mastery_exam_v1:hsk1_v2_01': {'["我","tôi","wo3"]': true, '["你","bạn","nǐ"]': false, 'invalid': true}
};
assert.equal(progress(state, k => records[k]).reviewed, 1);
assert.equal(progress(state, k => records[k]).passed, 1);
assert.equal(progress({}, () => {throw Error('blocked storage')}).passed, 0);
assert.equal(progress({}, () => ({})).total, 150);
console.log('PASS: 150 unique complete cards, 10x15 lessons, duplicate/variant exclusion, review vs mastery, blocked storage');
