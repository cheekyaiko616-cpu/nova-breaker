// ===== 光・火花・パーティクルの部品 =====
const _gl={};
function glowImg(c){
 if(_gl[c])return _gl[c];const s=64,cv=document.createElement('canvas');cv.width=cv.height=s;const g=cv.getContext('2d');
 const gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'#ffffff');gr.addColorStop(.18,c);gr.addColorStop(.5,c+'55');gr.addColorStop(1,c+'00');
 g.fillStyle=gr;g.fillRect(0,0,s,s);return _gl[c]=cv;
}
// 加算で光らせる（使う前後で additive(true/false) を切り替える）
function additive(on){ctx.globalCompositeOperation=on?'lighter':'source-over'}
function glow(x,y,r,c,a){ctx.globalAlpha=a==null?1:a;ctx.drawImage(glowImg(c),x-r,y-r,r*2,r*2)}

// 粒（g:光る / ln:線）
function spawnPt(x,y,col,n,sp,o){
 if(G.pt.length>520)return;o=o||{};
 for(let i=0;i<n;i++){const a=o.a!=null?o.a+rand(-(o.sp||.5),o.sp||.5):Math.random()*TAU,s=rand(40,220)*sp,l=rand(.25,.55)*(o.life||1);
  G.pt.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:l,max:l,r:o.r||rand(2,4.5),c:col,g:o.g!=null?o.g:1,ln:o.ln||0,fr:o.fr||.92,grav:o.grav||0})}
}
// 火花（細い線が飛ぶ）
function sparks(x,y,col,n,a,spread){spawnPt(x,y,col,n,2.2,{ln:1,a:a,sp:spread||Math.PI,r:2.2,life:.55,fr:.88})}
function ringFx(x,y,r,c,life,w){G.fx.push({k:'ring',x,y,r,life:life||.4,max:life||.4,c,w:w||8})}
// 当たった時の演出
function hitFx(e,dmg,sx,sy){
 const a=Math.atan2(e.y-sy,e.x-sx),big=dmg>=G.p.dmg*3;
 sparks(e.x,e.y-e.r*.3,big?'#ffd84a':'#fff3c0',big?7:3,a,.9);
 if(G.fx.length<120)G.fx.push({k:'hit',x:e.x,y:e.y-e.r*.2,a:a+rand(-.5,.5),life:.14,max:.14,s:big?1.5:1});
}
// 倒した時の演出
function deathFx(e){
 const c=e.pal.a||e.pal.t||'#fff',s=e.boss?1:Math.min(1,.5+e.r/60);
 ringFx(e.x,e.y,(e.boss?260:34+e.r*1.1),'#ffffff',e.boss?.6:.25,e.boss?10:4);
 spawnPt(e.x,e.y,c,e.boss?70:9+Math.round(e.r/6),e.boss?1.6:.9);
 spawnPt(e.x,e.y,'#ffffff',e.boss?20:4,1.2,{r:2});
 G.fx.push({k:'boom',x:e.x,y:e.y,r:e.boss?150:22+e.r*.8,life:.28,max:.28,c:c});
}
