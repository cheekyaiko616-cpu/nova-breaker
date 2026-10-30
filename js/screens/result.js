// ===== ステージの結果（クリア／ゲームオーバー） =====
// ステージはクリアごとに区切り。クリアすると次のステージが解放される
function finishRun(clear,retire){
 stickEnd();hideBanner();hud.classList.remove('on');
 const si=G.si,p=G.p;let bonus=0,msg='';
 if(clear){
  const first=!S.cleared[si];bonus=(100+si*80)*(first?2:1);S.cleared[si]=true;
  if(first&&si+1<STAGES.length)msg=`STAGE ${si+2}「${STAGES[si+1].n}」が解放されました！`;
  else if(first)msg='全ステージ制覇！おめでとう！';
 }
 const earned=G.goldRun+bonus;S.gold+=earned;
 const b=S.best[si]||{lv:0,kills:0};S.best[si]={lv:Math.max(b.lv,p.level),kills:Math.max(b.kills,G.kills)};
 saveNow();ST='result';
 ui.innerHTML=`<div class="s">${clear?'<h1 class="c">STAGE CLEAR!</h1>':`<h1 class="d">${retire?'RETIRE':'GAME OVER'}</h1>`}
  <div class="sub">STAGE ${si+1} ${G.stage.n}</div>
  <div class="stats"><div><span>経過</span><span>${fmtTime(G.t)}</span></div><div><span>撃破</span><span>${G.kills}</span></div><div><span>Lv</span><span>${p.level}</span></div>
   <div><span>拾ったゴールド</span><span>${G.goldRun}G</span></div>${clear?`<div><span>クリア報酬</span><span>+${bonus}G</span></div>`:''}</div>
  ${msg?`<div class="gold" style="font-size:2.2cqw">${msg}</div>`:''}
  <div class="sub">所持ゴールド ${S.gold} G</div>
  <div class="row"><button class="btn big" id="bn">ステージ選択へ</button>${clear?'':'<button class="btn" id="br">もう一度</button>'}<button class="btn" id="bh">タイトル</button></div></div>`;
 document.getElementById('bn').onclick=showStages;
 document.getElementById('bh').onclick=showTitle;
 const br=document.getElementById('br');if(br)br.onclick=()=>startStage(si,p.cid);
}
