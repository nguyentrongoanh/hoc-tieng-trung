const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const src = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const native = src.slice(src.indexOf('  let speechGeneration'), src.indexOf('  // Init voice'));
const timers = [], utterances = [], status = {textContent: ''};
let failures = 0;
const ctx = {console, Date, Error, state: {}, googleAudio: {pause(){},currentTime:0},
 $: () => status, stopExampleAudio(){}, zhVoice: {}, pickZhVoice(){},
 SpeechSynthesisUtterance: function(text){this.text=text},
 synth: {cancel(){}, resume(){}, speak(u){utterances.push(u)}},
 setTimeout(fn){timers.push(fn);return timers.length}, clearTimeout(){}, setInterval(){},clearInterval(){}};
vm.createContext(ctx); vm.runInContext(native, ctx);
ctx.failed = () => failures++;
vm.runInContext('speakWeb("你好", failed); stopSpeak();', ctx);
utterances[0].onerror({error:'interrupted'});timers[0]();
assert.equal(failures, 0, 'canceled speech must not start a fallback');
vm.runInContext('speakWeb("谢谢", failed);', ctx); const u = utterances[1];u.onerror({error:'network'});timers[1]();
assert.equal(failures, 1, 'failed speech settles exactly once');
// Exercise the bundled clip path with delayed metadata and seek completion.
let player, plays = 0;
class Audio {
 constructor(){player=this;this.events={};this.currentTime=0;}
 addEventListener(n, fn){this.events[n]=fn} pause(){} load(){} play(){plays++;return Promise.resolve()}
}
const example = src.slice(src.indexOf('  let examplePlayer'), src.indexOf('  // Render example sentence'));
Object.assign(ctx,{Audio,window:{EXAMPLE_AUDIO:{test:{src:'local.mp3',start:2,end:4}}},speakExampleBtn:{disabled:false}});
vm.runInContext(example,ctx); // stopSpeak resolves the newly declared stopExampleAudio.
vm.runInContext('speakExample("test")',ctx);
assert.equal(plays,0);player.events.loadedmetadata();assert.equal(player.currentTime,2);assert.equal(plays,0);player.events.seeked();assert.equal(plays,1);
console.log('PASS: no stale fallback, once-only failure, bundled audio waits for seek before playing');
