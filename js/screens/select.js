// ===== ステージ選択・キャラ選択 =====
const stageOpen=i=>i===0||!!S.cleared[i-1];

function showStages(){
 ST='stages';hud.classList.remove('on');
 ui.innerHTML=`<div class="s"><h2>ステージ選択</h2><div class="sg">${STAGES.map((s,i)=>{
  const open=stageOpen(i),b=S.best[i];
  return `<div class="st ${open?'':'l'}" data-i="${i}" style="--c:${s.bg[2]};--b:${s.bg[1]}">
   <div class="sts">STAGE ${i+1}</div><div class="stn">${open?s.n:'？？？'}</div>
   <div class="sts">${open?s.desc:'前のステージをクリアで解放'}</div>
   <div class="stc">${S.cleared[i]?'★ CLEAR':''}${b?` <span class="sts">最高Lv${b.lv}</span>`:''}</div></div>`}).join('')}</div>
  <button class="btn" id="bb">戻る</button></div>`;
 ui.querySelectorAll('.st').forEach(el=>{el.onclick=()=>{const i=+el.dataset.i;if(stageOpen(i))showChar(i)}});
 document.getElementById('bb').onclick=showTitle;
}

function drawMini(cvs,ch){
 const g=cvs.getContext('2d'),s=SPR['h_'+ch.sty],img=sprCanvas('h_'+ch.sty,ch.pal,false),sc=Math.floor(Math.min(cvs.width/s.w,cvs.height/s.h)*.85);
 g.imageSmoothingEnabled=false;g.clearRect(0,0,cvs.width,cvs.height);g.drawImage(img,(cvs.width-s.w*sc)/2,(cvs.height-s.h*sc)/2,s.w*sc,s.h*sc);
}

function showChar(si){
 ST='charselect';
 let sel=S.unlocked.includes(S.lastChar)?S.lastChar:S.unlocked[0];
 const ids=Object.keys(CHARS);
 ui.innerHTML=`<div class="s"><h2>キャラクター選択 <span class="sub">STAGE ${si+1} ${STAGES[si].n}</span></h2>
  <div class="cs"><div class="cl">${ids.map(id=>{const ch=CHARS[id],ok=S.unlocked.includes(id);
   return `<div class="cc ${ok?'':'l'}" data-id="${id}" style="--c:${ch.c}"><canvas class="cp" width="96" height="96" data-id="${id}"></canvas>
    <div class="ccn">${ok?ch.n:'？？？'}</div><div class="cct">${ok?ch.type:'ガチャで解放'}</div></div>`}).join('')}</div>
  <div class="cdp" id="det"></div></div>
  <div class="row"><button class="btn" id="bb">戻る</button><button class="btn big" id="go">出撃！</button></div></div>`;
 ui.querySelectorAll('canvas.cp').forEach(c=>{const ch=CHARS[c.dataset.id];drawMini(c,S.unlocked.includes(c.dataset.id)?ch:{sty:ch.sty,pal:{s:'#333',h:'#333',e:'#333',t:'#333',p:'#333',o:'#333',x:'#333'}})});
 const det=document.getElementById('det');
 const showDet=()=>{
  const ch=CHARS[sel],w=WEP[ch.wep];
  ui.querySelectorAll('.cc').forEach(el=>el.classList.toggle('sel',el.dataset.id===sel));
  det.style.setProperty('--c',ch.c);
  det.innerHTML=`<h3>${ch.n}</h3><div><span class="tag">${ch.type}</span><span class="tag">射程: ${ch.range}</span></div>
   <div><span class="kv">専用武器</span><br><b style="color:${w.c}">${w.n}</b> … ${w.d}</div>
   <div><span class="kv">固有スキル</span><br><span class="sk">${ch.skill.n}</span> … ${ch.skill.d}</div>
   <div class="kv">HP ${ch.hp} ・ 速さ ${ch.sp} ・ 攻撃 ${ch.dmg} ・ ゲージ効率 ${Math.round(ch.sg*100)}%</div>`;
 };
 showDet();
 ui.querySelectorAll('.cc').forEach(el=>{el.onclick=()=>{if(S.unlocked.includes(el.dataset.id)){sel=el.dataset.id;showDet()}}});
 document.getElementById('bb').onclick=showStages;
 document.getElementById('go').onclick=()=>startStage(si,sel);
}
