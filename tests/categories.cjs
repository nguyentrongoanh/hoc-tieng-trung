const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
class El {
 constructor(){this.children=[];this.value='';} set innerHTML(x){this.children=[]} appendChild(x){x.parent=this;this.children.push(x)}
 replaceChildren(...xs){this.children=[];xs.forEach(x=>this.appendChild(x))} cloneNode(){let x=new El;Object.assign(x,{value:this.value,textContent:this.textContent,label:this.label});this.children.forEach(c=>x.appendChild(c.cloneNode()));return x} remove(){this.parent.children=this.parent.children.filter(x=>x!==this)}
}
const els={deckCategory:new El,manageDeckSelect:new El};const ctx={window:{},document:{createElement:()=>new El},$:id=>els[id],CUSTOM_DECK_ID:'my_custom',deckSelect:new El,state:{deckId:'hsk1_v2_01',customCards:[],importedDecks:{import1:{name:'Imported',cards:[]}}}};
vm.createContext(ctx);const root=path.join(__dirname,'..');for(const file of ['decks.js','hsk1.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const s=fs.readFileSync(path.join(root,'app.js'),'utf8');vm.runInContext(s.slice(s.indexOf('  function populateDeckSelect()'),s.indexOf('  function updateModeButtons()')),ctx);
const options=el=>el.children.flatMap(g=>g.children.map(x=>x.value));
ctx.populateDeckSelect();assert.equal(options(ctx.deckSelect).length,10);assert(options(ctx.deckSelect).every(x=>x.startsWith('hsk1_v2_')));
ctx.state.deckId='daily_verbs';ctx.populateDeckSelect();assert(!options(ctx.deckSelect).some(x=>x.startsWith('hsk1_v2_')));assert.equal(els.deckCategory.value,'topic');
ctx.state.deckId='import1';ctx.populateDeckSelect();assert.deepEqual(options(ctx.deckSelect),['my_custom','import1']);assert(options(els.manageDeckSelect).includes('hsk1_v2_01'));assert(options(els.manageDeckSelect).includes('daily_verbs'));
console.log('PASS: HSK/topic/custom filters, imported decks, full manager list');
