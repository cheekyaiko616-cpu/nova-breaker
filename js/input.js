// ===== 入力（キーボード・画面どこでもドラッグ・スキル/ポーズボタン） =====
const K={};
addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();K[k]=true;
 if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
 if(ST==='playing'&&(k===' '||k==='e'))useSkill();
 else if(k==='escape'||k==='p'){if(ST==='playing')pauseGame();else if(ST==='paused')resumeGame()}
});
addEventListener('keyup',e=>{K[e.key.toLowerCase()]=false});

// 触れた場所が操作の中心になるスティック
const stk=document.getElementById('stk'),stkb=document.getElementById('stkb'),SR=50;
let tch=null;
function stickShow(on){stk.style.display=on?'block':'none'}
function stickMove(x,y){
 let dx=x-tch.ox,dy=y-tch.oy,d=Math.hypot(dx,dy);
 if(d>SR){const k=(d-SR)/d;tch.ox+=dx*k;tch.oy+=dy*k;dx=x-tch.ox;dy=y-tch.oy;d=SR}
 G.tv=d<6?null:{x:dx/SR,y:dy/SR};
 stk.style.left=tch.ox+'px';stk.style.top=tch.oy+'px';stkb.style.transform=`translate(${dx}px,${dy}px)`;
}
function stickStart(id,x,y){tch={id,ox:x,oy:y};stickShow(true);stickMove(x,y)}
function stickEnd(){tch=null;G.tv=null;stickShow(false)}
const isBtn=t=>t&&t.closest&&t.closest('#hud button');
document.addEventListener('touchstart',e=>{if(ST!=='playing'||isBtn(e.target))return;e.preventDefault();if(tch)return;const t=e.changedTouches[0];stickStart(t.identifier,t.clientX,t.clientY)},{passive:false});
document.addEventListener('touchmove',e=>{if(ST==='playing')e.preventDefault();if(!tch)return;for(const t of e.changedTouches)if(t.identifier===tch.id){stickMove(t.clientX,t.clientY);break}},{passive:false});
for(const ev of['touchend','touchcancel'])document.addEventListener(ev,e=>{if(!tch)return;for(const t of e.changedTouches)if(t.identifier===tch.id){stickEnd();break}},{passive:false});
document.addEventListener('mousedown',e=>{if(ST!=='playing'||isBtn(e.target)||tch)return;stickStart('m',e.clientX,e.clientY)});
document.addEventListener('mousemove',e=>{if(tch&&tch.id==='m')stickMove(e.clientX,e.clientY)});
document.addEventListener('mouseup',()=>{if(tch&&tch.id==='m')stickEnd()});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&ST==='playing')pauseGame()});

// ボタン（指で押したときにスティックが出ないようにする）
const skillBtn=document.getElementById('skillBtn'),pauseBtn=document.getElementById('pauseBtn'),skillTxt=document.getElementById('skillTxt');
function bindTap(el,fn){el.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();fn()},{passive:false});el.addEventListener('click',e=>{e.stopPropagation();fn()})}
bindTap(skillBtn,()=>useSkill());
bindTap(pauseBtn,()=>pauseGame());
