// ===== タイトル画面 =====
function showTitle(){
 ST='title';G.p=null;hud.classList.remove('on');stickEnd();
 const cleared=Object.keys(S.cleared).length;
 ui.innerHTML=`<div class="s"><h1>NOVA BREAKER</h1><div class="sub">ドット弾幕サバイバー</div><div class="gold">${S.gold} G</div>
 <div class="row"><button class="btn big" id="bs">出撃</button><button class="btn g" id="bg">ガチャ</button></div>
 <div class="sub">画面のどこでもドラッグで移動 ・ 攻撃は自動 ・ ゲージが溜まったらスキル</div>
 <div class="sub">クリアしたステージ ${cleared} / ${STAGES.length} ・ キャラ ${S.unlocked.length} / ${Object.keys(CHARS).length}</div></div>`;
 document.getElementById('bs').onclick=showStages;
 document.getElementById('bg').onclick=showGacha;
}
