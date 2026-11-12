// Independent mastery exam for the selected deck.
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'mastery';
  document.body.append(dialog);
  let cards, pending, deck, record, current, writer, timer, deadline;
  let phase = '', generation = 0;
  const key = c => JSON.stringify([c.hanzi,c.meaning,c.pinyin]);
  function screen(title, description) {
    clearTimeout(timer);
    generation++;
    writer?.cancelQuiz();
    writer = null;
    dialog.replaceChildren();
    node('h2', title);
    node('p', description);
  }
  function node(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    dialog.append(el);
    return el;
  }
  function button(label, action) {
    const b = node('button', label);
    b.onclick = action;
    return b;
  }
  function shuffled(items) {
    const result = [...items];
    for (let i=result.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  }
  function normalize(s) {
    return s.toLowerCase().normalize('NFC').replace(/u:|v/g,'ü')
      .replace(/([a-zü]+)([1-5])/g,(_,word,tone)=>{
        const index = word.includes('a') ? word.indexOf('a') : word.includes('e') ? word.indexOf('e') :
          word.includes('ou') ? word.indexOf('o') : word.search(/[aeiouü](?!.*[aeiouü])/);
        if(index<0 || tone==='5') return word;
        return word.slice(0,index+1)+['','\u0304','\u0301','\u030c','\u0300'][tone]+word.slice(index+1);
      }).normalize('NFC').replace(/[\s'’.,!?，。！？-]/g,'');
  }
  function menu() {
    phase='menu';
    const passed=cards.filter(c=>record[key(c)]).length;
    screen('Kiểm tra đã thuộc',deck.name+' · '+passed+'/'+cards.length+' thẻ đạt');
    node('p','Chọn đúng nghĩa dưới 5 giây. Viết đủ từng chữ, tối đa 4 nét sai trong cả thẻ, không gợi ý. Gõ đúng pinyin dưới 5 giây (nǐ hoặc ni3), nhấn Enter để nộp.');
    pending=cards.filter(c=>!record[key(c)]);
    if(pending.length) button('Kiểm tra thẻ chưa đạt',next);
    if(passed) button('Kiểm tra lại cả bộ',()=>{pending=cards.slice();next();});
    button('Đóng',()=>dialog.close());
  }
  function next() {
    current=pending.shift();
    if(!current) return menu();
    phase='ready';
    screen('Sẵn sàng?', 'Còn '+(pending.length+1)+' thẻ trong lượt này.');
    button('Bắt đầu · 5 giây',meaning);
    button('Về tổng kết',menu);
  }
  function clock() {
    deadline=performance.now()+5000;
    timer=setTimeout(()=>finish(false,'Hết 5 giây.'),5000);
  }
  function meaning() {
    phase='meaning';
    screen(current.hanzi,'Chọn nghĩa đúng · dưới 5 giây');
    const others=[...new Set(QuizData.allCards().filter(c=>c.hanzi!==current.hanzi).map(c=>c.meaning))].filter(m=>m && m!==current.meaning);
    for(const m of shuffled([current.meaning,...shuffled(others).slice(0,3)])) button(m,()=>{
      if(performance.now()>=deadline || m!==current.meaning) return finish(false,'Chưa đạt phần chọn nghĩa.');
      write([...current.hanzi].filter(ch=>/\p{Script=Han}/u.test(ch)),0,0);
    });
    clock();
  }
  function write(chars,index,errors) {
    phase='write';
    screen('Viết từ trí nhớ',current.meaning+' · chữ '+(index+1)+'/'+chars.length);
    const count=node('p','Nét sai: '+errors+'/4');
    const target=node('div','');
    const token=generation;
    const unavailable=()=>{
      if(token!==generation) return;
      phase='error';screen('Chưa tải được dữ liệu nét','Kiểm tra kết nối rồi thử lại.');
      button('Thử lại',()=>write(chars,index,errors));button('Về tổng kết',menu);
    };
    if(!window.HanziWriter) return unavailable();
    writer=HanziWriter.create(target,chars[index],{width:220,height:220,showOutline:false,showCharacter:false,onLoadCharDataError:unavailable});
    writer.quiz({showHintAfterMisses:Infinity,highlightOnComplete:false,onMistake:()=>{
      if(token!==generation) return;
      count.textContent='Nét sai: '+(++errors)+'/4';
      if(errors>=5) finish(false,'Đã sai 5 nét.');
    },onComplete:()=>{
      if(token!==generation) return;
      if(index+1<chars.length) return write(chars,index+1,errors);
      phase='ready';screen('Chuẩn bị gõ pinyin','Bấm bắt đầu khi bạn sẵn sàng.');
      button('Bắt đầu · 5 giây',pinyin);
    }});
  }
  function pinyin() {
    phase='pinyin';screen(current.hanzi,'Gõ pinyin có thanh rồi nộp.');
    const input=node('input','');input.setAttribute('aria-label','Pinyin');input.autocomplete='off';input.spellcheck=false;
    function submit() {
      const ok=performance.now()<deadline && normalize(input.value)===normalize(current.pinyin);
      finish(ok,ok?'Đạt cả ba tiêu chí.':'Chưa đạt phần pinyin.');
    }
    input.onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();submit();}};
    button('Nộp',submit);input.focus();clock();
  }
  function finish(ok,msg) {
    phase='result';screen(ok?'Đã thuộc':'Cần ôn lại',msg);
    node('p',current.hanzi+' · '+current.pinyin+' · '+current.meaning);
    record[key(current)]=ok;
    try {localStorage.setItem(deck.storage,JSON.stringify(record));} catch {node('p','Không lưu được kết quả trên thiết bị.');}
    button('Tiếp tục',next);button('Về tổng kết',menu);
  }
  dialog.onclose=()=>{clearTimeout(timer);generation++;writer?.cancelQuiz();writer=null;};
  dialog.addEventListener('keydown',e=>e.stopPropagation());
  document.addEventListener('visibilitychange',()=>{if(document.hidden && dialog.open && ['meaning','pinyin'].includes(phase)) finish(false,'Lượt tính giờ bị gián đoạn.');});
  document.getElementById('masteryBtn').onclick=()=>{
    const select=document.getElementById('deckSelect');
    deck={name:select.selectedOptions[0].textContent,storage:'mastery_exam_v1:'+select.value};
    cards=[...new Map(QuizData.currentDeckCards().filter(c=>c.meaning && c.pinyin && /\p{Script=Han}/u.test(c.hanzi)).map(c=>[key(c),c])).values()];
    try {record=JSON.parse(localStorage.getItem(deck.storage))||{};} catch {record={};}
    menu();dialog.showModal();
  };
})();
