// ===== ガチャ（恒久強化・キャラ解放） =====
const GACHA_COST=150;
function showGacha(){
 ST='gacha';
 ui.innerHTML=`<div class="s"><h2>GACHA</h2><div class="gold" id="gg">${S.gold} G</div>
  <div class="row"><button class="btn g" id="bp">1回引く (${GACHA_COST}G)</button><button class="btn" id="bb">戻る</button></div>
  <div class="gr" id="res"><div class="sub">恒久強化・新キャラを入手</div></div>
  <div class="sub" id="pm"></div></div>`;
 const refresh=()=>{document.getElementById('gg').textContent=`${S.gold} G`;document.getElementById('bp').disabled=S.gold<GACHA_COST;
  document.getElementById('pm').textContent='恒久強化: '+Object.keys(PERMS).map(k=>`${PERMS[k].n}+${S.perms[k]||0}`).join(' ・ ')};
 refresh();
 document.getElementById('bb').onclick=showTitle;
 document.getElementById('bp').onclick=()=>{
  if(S.gold<GACHA_COST)return;S.gold-=GACHA_COST;
  const locked=Object.keys(CHARS).filter(id=>!S.unlocked.includes(id));let r;
  if(locked.length&&Math.random()<.25){const id=pick(locked);S.unlocked.push(id);r={c:'#ffc23a',t:'NEW CHARA',n:CHARS[id].n,d:'新キャラ解放！'}}
  else{const ri=rollRar(),k=pick(Object.keys(PERMS)),amt=1+ri;S.perms[k]=(S.perms[k]||0)+amt;r={c:RAR[ri].c,t:RAR[ri].n,n:PERMS[k].n,d:`+${amt}`}}
  saveNow();
  document.getElementById('res').innerHTML=`<div class="gc" style="--c:${r.c}"><div class="gcn">${r.t}</div><div class="gct">${r.n}</div><div class="gct">${r.d}</div></div>`;
  refresh();
 };
}
