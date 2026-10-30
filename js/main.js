// ===== 起動とメインループ =====
function loop(t){
 requestAnimationFrame(loop);
 const dt=Math.min(.05,Math.max(0,(t-LMT)/1000));LMT=t;
 if(ST==='playing')update(dt);
 render();
 if(ST==='playing')updateSkillBtn();
}
showTitle();
LMT=performance.now();
requestAnimationFrame(loop);
