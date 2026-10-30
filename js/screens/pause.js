// ===== 一時停止 =====
function pauseGame(){
 if(ST!=='playing')return;
 stickEnd();hideBanner();ST='paused';hud.classList.remove('on');
 const p=G.p;
 ui.innerHTML=`<div class="s"><h2>PAUSE</h2><div class="sub">STAGE ${G.si+1} ${G.stage.n} ・ 経過 ${fmtTime(G.t)} ・ Lv ${p.level}</div>
  <div class="wl">${p.weapons.map(w=>`<span style="--c:${WEP[w.id].c}">${WEP[w.id].n} Lv${w.lv}</span>`).join('')}</div>
  <div class="sub">スキル: ${p.ch.skill.n} … ${p.ch.skill.d}</div>
  <div class="row"><button class="btn big" id="bc">再開</button><button class="btn" id="bq">リタイア</button></div></div>`;
 document.getElementById('bc').onclick=resumeGame;
 document.getElementById('bq').onclick=()=>finishRun(false,true);
}
function resumeGame(){
 if(ST!=='paused')return;
 ST='playing';ui.innerHTML='';hud.classList.add('on');updateSkillBtn(true);LMT=performance.now();
}
