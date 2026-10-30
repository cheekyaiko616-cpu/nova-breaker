// ===== 描画 =====
function render(){
 const p=G.p;
 if(!p){const t=performance.now()/1000;drawBg(STAGES[0],t*40,t*15);return}
 const shx=G.shake>0?rand(-G.shake,G.shake):0,shy=G.shake>0?rand(-G.shake,G.shake):0;
 const cx=G.cam.x+shx,cy=G.cam.y+shy;
 drawBg(G.stage,cx,cy);
 ctx.save();ctx.translate(-cx,-cy);
 drawZones();drawPickups();
 G.en.sort((a,b)=>a.y-b.y);
 for(const e of G.en)drawEnemy(e);
 for(const w of p.weapons)if(w.id==='aura')WEP.aura.draw(p,w);
 drawPlayer(p);
 for(const w of p.weapons){const d=WEP[w.id].draw;if(d&&w.id!=='aura')d(p,w)}
 drawProj();drawEProj();drawFx();
 for(const q of G.pt){ctx.globalAlpha=Math.min(1,q.life*3);ctx.fillStyle=q.c;ctx.fillRect(q.x-q.r/2,q.y-q.r/2,q.r,q.r)}
 ctx.globalAlpha=1;
 drawDn();
 ctx.restore();
 if(G.freeze>0){ctx.fillStyle='rgba(120,180,255,.14)';ctx.fillRect(0,0,W,H)}
 if(isSkill(p,'storm')){ctx.fillStyle=`rgba(20,20,60,${.25+Math.random()*.1})`;ctx.fillRect(0,0,W,H)}
 if(G.flash>0){ctx.fillStyle=`rgba(255,255,255,${Math.min(.6,G.flash)})`;ctx.fillRect(0,0,W,H)}
 drawBossArrow();
 drawHUD();
}

// ----- 背景 -----
function drawBg(stg,cx,cy){
 const b=stg.bg;ctx.fillStyle=b[0];ctx.fillRect(0,0,W,H);
 const gs=64,x0=Math.floor(cx/gs),y0=Math.floor(cy/gs),nx=Math.ceil(W/gs)+1,ny=Math.ceil(H/gs)+1;
 for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++){
  const gx=x0+i,gy=y0+j,h=hash2(gx,gy),sx=Math.round(gx*gs-cx),sy=Math.round(gy*gs-cy);
  if(h<.3){ctx.fillStyle=b[1];ctx.fillRect(sx,sy,gs,gs)}
  if(h>.88)drawDeco(stg.deco,sx+Math.floor(hash2(gy,gx)*36)+6,sy+Math.floor(hash2(gx+7,gy)*36)+10,b);
  else if(h>.72){ctx.fillStyle=b[3];ctx.fillRect(sx+Math.floor(h*300)%56,sy+Math.floor(h*700)%56,6,6)}
 }
}
function drawDeco(k,x,y,b){
 ctx.fillStyle=b[2];
 switch(k){
  case 'grass':ctx.fillRect(x,y,4,10);ctx.fillRect(x+6,y-4,4,14);ctx.fillRect(x+12,y+2,4,8);break;
  case 'grave':ctx.fillRect(x+2,y-6,14,22);ctx.fillRect(x,y+14,18,4);ctx.fillStyle=b[0];ctx.fillRect(x+8,y-2,2,10);ctx.fillRect(x+5,y+1,8,2);break;
  case 'lava':ctx.fillStyle='#c84a1a';ctx.fillRect(x-2,y-2,24,12);ctx.fillStyle='#ff8a2a';ctx.fillRect(x,y,20,8);ctx.fillStyle='#ffd04a';ctx.fillRect(x+4,y+2,8,3);break;
  case 'ice':ctx.beginPath();ctx.moveTo(x+8,y-12);ctx.lineTo(x+16,y+10);ctx.lineTo(x,y+10);ctx.closePath();ctx.fill();ctx.fillStyle='#ffffff60';ctx.fillRect(x+7,y-4,2,10);break;
  case 'brick':ctx.fillRect(x,y,24,10);ctx.fillRect(x+12,y+12,24,10);ctx.fillRect(x-12,y+12,20,10);break;
  case 'void':ctx.fillStyle='#9a6aff';ctx.fillRect(x,y,3,3);ctx.fillStyle=b[2];ctx.fillRect(x+12,y+8,4,4);ctx.fillRect(x-6,y+14,3,3);break;
 }
}

// ----- 地面のもの -----
function drawZones(){for(const z of G.zones){const a=Math.min(1,z.life/z.max*2);ctx.globalAlpha=.3*a;ctx.fillStyle='#5ab0ff';ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,TAU);ctx.fill();ctx.globalAlpha=.6*a;ctx.strokeStyle='#bfe4ff';ctx.lineWidth=2;ctx.stroke()}ctx.globalAlpha=1}
function drawPickups(){
 for(const o of G.or){
  if(o.kind==='xp'){const c=o.v>=20?'#ff4a6a':o.v>=5?'#5cff8a':'#4ad8ff',s=o.v>=20?9:o.v>=5?7:5;
   ctx.fillStyle='#0b0b14';ctx.beginPath();ctx.moveTo(o.x,o.y-s-2);ctx.lineTo(o.x+s+2,o.y);ctx.lineTo(o.x,o.y+s+2);ctx.lineTo(o.x-s-2,o.y);ctx.fill();
   ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(o.x,o.y-s);ctx.lineTo(o.x+s,o.y);ctx.lineTo(o.x,o.y+s);ctx.lineTo(o.x-s,o.y);ctx.fill();
   ctx.fillStyle='#ffffffa0';ctx.fillRect(o.x-2,o.y-s+3,2,3);
  }else{ctx.fillStyle='#0b0b14';ctx.fillRect(o.x-7,o.y-7,14,14);ctx.fillStyle='#ffc84a';ctx.fillRect(o.x-5,o.y-5,10,10);ctx.fillStyle='#fff2a0';ctx.fillRect(o.x-3,o.y-3,3,3)}
 }
 for(const it of G.items){
  const def=ITEMS[it.k],by=Math.sin(it.t*4)*4;
  ctx.fillStyle='rgba(255,255,200,.18)';ctx.beginPath();ctx.arc(it.x,it.y+by,24,0,TAU);ctx.fill();
  if(def.spr)drawSpr(def.spr,def.pal,it.x,it.y+by,it.k==='chest'?4:3.6);
  else{ctx.fillStyle='#ffe45a50';ctx.beginPath();ctx.arc(it.x,it.y+by,15,0,TAU);ctx.fill();ctx.fillStyle='#ffe45a';ctx.beginPath();ctx.arc(it.x,it.y+by,9,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(it.x-2,it.y+by-2,3,0,TAU);ctx.fill()}
 }
}

// ----- 敵 -----
function drawEnemy(e){
 const s=SPR[e.spr],w=s.w*e.sc,h=s.h*e.sc,z=e.z||0;
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(e.x,e.y+h*.45,w*.38,Math.max(4,w*.12),0,0,TAU);ctx.fill();
 if(e.elite||e.giant||e.mid){ctx.strokeStyle=e.elite?'#ffd84a':'#ff4a4a';ctx.globalAlpha=.55+.3*Math.sin(G.anim*6);ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(e.x,e.y+h*.45,w*.52,Math.max(6,w*.18),0,0,TAU);ctx.stroke();ctx.globalAlpha=1}
 let bob=0,sy=1;
 if(e.spr==='slime')sy=1+Math.sin(G.anim*8+e.bob)*.08;else bob=-Math.abs(Math.sin(G.anim*8+e.bob))*e.sc*.8;
 drawSpr(e.spr,e.pal,e.x,e.y+bob-z,e.sc,e.face<0,e.flash>0,e.ai==='ghost'?.72:1,sy);
 if(e.boss||e.mid)drawSpr('crown',CROWN_PAL,e.x,e.y-z-h/2-e.sc*2.5,Math.max(3,e.sc*.7));
 else if(e.elite){ctx.fillStyle='#ffd84a';ctx.font='bold 18px system-ui';ctx.textAlign='center';ctx.fillText('★',e.x,e.y-h/2-6)}
 if(!e.boss&&e.hp<e.maxHp&&(e.elite||e.giant||e.mid||e.maxHp>=80)){const bw=Math.max(30,w*.7);ctx.fillStyle='#3a0a14';ctx.fillRect(e.x-bw/2,e.y-h/2-z-12,bw,5);ctx.fillStyle='#ff4a4a';ctx.fillRect(e.x-bw/2,e.y-h/2-z-12,bw*Math.max(0,e.hp/e.maxHp),5)}
}

// ----- プレイヤー -----
function drawPlayer(p){
 const sk=p.skill;
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(p.x,p.y+21,15,5,0,0,TAU);ctx.fill();
 if(sk){
  if(sk.id==='whirl'){const R=170*p.area;ctx.globalAlpha=.18;ctx.fillStyle='#ffb05a';ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.fill();ctx.globalAlpha=.8;ctx.strokeStyle='#ffe0a0';ctx.lineWidth=6;for(let i=0;i<3;i++){const a=sk.a+i*TAU/3;ctx.beginPath();ctx.arc(p.x,p.y,R*.85,a,a+1.1);ctx.stroke()}ctx.globalAlpha=1}
  else if(sk.id==='sanct'){ctx.globalAlpha=.25+.1*Math.sin(G.anim*8);ctx.fillStyle='#c8e0ff';ctx.beginPath();ctx.arc(p.x,p.y,48,0,TAU);ctx.fill();ctx.globalAlpha=.9;ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha=1}
  else if(sk.id==='overdrive'){ctx.globalAlpha=.35+.2*Math.sin(G.anim*20);ctx.strokeStyle='#7fd1ff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x,p.y,40,0,TAU);ctx.stroke();ctx.globalAlpha=1}
  else if(sk.id==='judge'){const len=950,ca=Math.cos(sk.a),sa=Math.sin(sk.a);ctx.globalAlpha=.5;ctx.strokeStyle='#5ce0ff';ctx.lineWidth=84;ctx.beginPath();ctx.moveTo(p.x,p.y-6);ctx.lineTo(p.x+ca*len,p.y-6+sa*len);ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle='#ffffff';ctx.lineWidth=26;ctx.stroke()}
 }
 const blink=p.inv>0&&Math.floor(G.anim*20)%2===0;
 if(p.star>0){ctx.globalAlpha=.5;ctx.fillStyle=`hsl(${(G.anim*600)%360},100%,60%)`;ctx.beginPath();ctx.arc(p.x,p.y,34,0,TAU);ctx.fill();ctx.globalAlpha=1}
 const bob=p.moving?-Math.abs(Math.sin(G.anim*10))*3:0;
 drawSpr('h_'+p.ch.sty,p.ch.pal,p.x,p.y+bob,3.2,p.face<0,p.hf>0,blink?.35:1);
 const bw=50,r=p.hp/p.maxHp;ctx.fillStyle='#0b0b14';ctx.fillRect(p.x-bw/2-1,p.y+28,bw+2,7);ctx.fillStyle='#3a0a14';ctx.fillRect(p.x-bw/2,p.y+29,bw,5);
 ctx.fillStyle=r>.5?'#4ae07a':r>.25?'#e8b03a':'#ff4a4a';ctx.fillRect(p.x-bw/2,p.y+29,bw*Math.max(0,r),5);
}

// ----- 弾・エフェクト -----
function drawProj(){
 for(const b of G.pr){
  const a=Math.atan2(b.vy,b.vx);
  switch(b.kind){
   case 'bolt':ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle=b.col+'60';ctx.fillRect(-16,-6,30,12);ctx.fillStyle=b.col;ctx.fillRect(-12,-4,24,8);ctx.fillStyle='#fff';ctx.fillRect(-6,-2,14,4);ctx.restore();break;
   case 'knife':ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle='#0b0b14';ctx.fillRect(-12,-3,26,6);ctx.fillStyle='#e8eeff';ctx.fillRect(-2,-2,15,4);ctx.fillStyle='#8a5a2a';ctx.fillRect(-11,-2,9,4);ctx.restore();break;
   case 'axe':ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.t*12);const s=b.r;ctx.fillStyle='#6a4a2a';ctx.fillRect(-2,-s,4,s*2);ctx.fillStyle='#0b0b14';ctx.fillRect(1,-s,s*.9+2,s*.9+2);ctx.fillStyle='#d8dce8';ctx.fillRect(2,-s+1,s*.9,s*.9);ctx.restore();break;
   case 'boomerang':ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.t*15);ctx.strokeStyle='#0b0b14';ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,0,b.r,0,Math.PI*1.3);ctx.stroke();ctx.strokeStyle=b.col;ctx.lineWidth=5;ctx.stroke();ctx.restore();break;
   case 'homing':case 'missile':ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle=b.col+'50';ctx.beginPath();ctx.arc(-6,0,9,0,TAU);ctx.fill();ctx.fillStyle=b.col;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-6);ctx.lineTo(-3,0);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.restore();break;
   default:ctx.fillStyle=b.col;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,b.r*.45,0,TAU);ctx.fill();
  }
 }
}
function drawEProj(){
 for(const b of G.ep){ctx.fillStyle=b.c+'60';ctx.beginPath();ctx.arc(b.x,b.y,b.r+4,0,TAU);ctx.fill();ctx.fillStyle=b.c;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,b.r*.45,0,TAU);ctx.fill()}
}
function drawFx(){
 for(const f of G.fx){
  const a=f.life/f.max;ctx.globalAlpha=a;
  switch(f.k){
   case 'arc':ctx.fillStyle=f.c+'70';ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.arc(f.x,f.y,f.r,f.a-f.w,f.a+f.w);ctx.closePath();ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(f.x,f.y,f.r*.92,f.a-f.w,f.a+f.w);ctx.stroke();break;
   case 'laser':ctx.strokeStyle=f.c;ctx.lineWidth=f.w*2;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(2,f.w*.6);ctx.stroke();break;
   case 'zap':{ctx.strokeStyle=f.c;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f.x1,f.y1);const n=6;for(let i=1;i<n;i++){const t=i/n;ctx.lineTo(f.x1+(f.x2-f.x1)*t+rand(-10,10),f.y1+(f.y2-f.y1)*t+rand(-10,10))}ctx.lineTo(f.x2,f.y2);ctx.stroke();break}
   case 'bolt':{ctx.strokeStyle='#ffe45a';ctx.lineWidth=5;ctx.beginPath();let py=f.y-260;ctx.moveTo(f.x,py);while(py<f.y){py+=26;ctx.lineTo(f.x+rand(-14,14),py)}ctx.lineTo(f.x,f.y);ctx.stroke();ctx.fillStyle='#fff6a0';ctx.beginPath();ctx.arc(f.x,f.y,18*a,0,TAU);ctx.fill();break}
   case 'ring':ctx.strokeStyle=f.c;ctx.lineWidth=8;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(1-a*.7),0,TAU);ctx.stroke();break;
   case 'boom':ctx.fillStyle=f.c+'90';ctx.beginPath();ctx.arc(f.x,f.y,f.r*(1.1-a*.4),0,TAU);ctx.fill();ctx.fillStyle='#fff2a0';ctx.beginPath();ctx.arc(f.x,f.y,f.r*.5*a,0,TAU);ctx.fill();break;
  }
 }
 ctx.globalAlpha=1;
}
function drawDn(){
 ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#0b0b14';
 for(const n of G.dn){ctx.globalAlpha=Math.min(1,n.life*2.5);ctx.font=typeof n.v==='number'?'bold 22px system-ui':'bold 24px system-ui';ctx.strokeText(n.v,n.x,n.y);ctx.fillStyle=n.c;ctx.fillText(n.v,n.x,n.y)}
 ctx.globalAlpha=1;
}
function drawBossArrow(){
 const b=G.boss,p=G.p;if(!b||b.dead)return;
 const sx=b.x-G.cam.x,sy=b.y-G.cam.y;if(sx>0&&sx<W&&sy>0&&sy<H)return;
 const a=Math.atan2(b.y-p.y,b.x-p.x),x=clamp(W/2+Math.cos(a)*W,50,W-50),y=clamp(H/2+Math.sin(a)*H,90,H-50);
 ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#ff3a5a';ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(-12,-16);ctx.lineTo(-12,16);ctx.closePath();ctx.fill();ctx.restore();
}

// ----- 画面上の情報 -----
function txt(s,x,y,size,col,align){ctx.font=`bold ${size}px system-ui`;ctx.textAlign=align||'left';ctx.lineWidth=5;ctx.strokeStyle='#0b0b14';ctx.strokeText(s,x,y);ctx.fillStyle=col||'#fff';ctx.fillText(s,x,y)}
function drawHUD(){
 const p=G.p;
 // 経験値バー
 ctx.fillStyle='#0a0e1ae0';ctx.fillRect(0,0,W,18);ctx.fillStyle='#4ad8ff';ctx.fillRect(0,0,W*Math.min(1,p.xp/p.xpNext),18);
 // HP
 txt(`Lv ${p.level}`,16,52,28,'#cfeaff');
 const hr=p.hp/p.maxHp;ctx.fillStyle='#0b0b14';ctx.fillRect(14,62,264,22);ctx.fillStyle='#3a0a14';ctx.fillRect(16,64,260,18);
 ctx.fillStyle=hr>.5?'#4ae07a':hr>.25?'#e8b03a':'#ff4a4a';ctx.fillRect(16,64,260*Math.max(0,hr),18);
 txt(`${Math.ceil(p.hp)} / ${p.maxHp}`,146,80,17,'#fff','center');
 // タイマー
 const left=G.stage.dur-G.t;
 if(!G.bossSpawned)txt(fmtTime(left),W/2,58,38,left<20?'#ff8a8a':'#ffffff','center');
 else txt(G.boss?'BOSS':'CLEAR',W/2,58,36,'#ff6a8a','center');
 txt(`STAGE ${G.si+1}  ${G.stage.n}`,W/2,84,18,'#aab8d8','center');
 // ゴールド・撃破数
 txt(`${G.goldRun} G`,W-100,48,24,'#ffc84a','right');
 txt(`撃破 ${G.kills}`,W-100,78,20,'#d8e0f0','right');
 // ボスHP
 if(G.boss&&!G.boss.dead){const b=G.boss,bw=560,x=W/2-bw/2,y=96;ctx.fillStyle='#0b0b14';ctx.fillRect(x-2,y-2,bw+4,20);ctx.fillStyle='#3a0a14';ctx.fillRect(x,y,bw,16);ctx.fillStyle='#ff3a5a';ctx.fillRect(x,y,bw*Math.max(0,b.hp/b.maxHp),16);txt(b.t.n,W/2,y+36,20,'#ffb0c0','center')}
 // 武器一覧
 let wx=14;const wy=H-66;
 for(const w of p.weapons){const d=WEP[w.id];ctx.fillStyle='#0b0b14cc';ctx.fillRect(wx,wy,56,56);ctx.strokeStyle=d.c;ctx.lineWidth=2;ctx.strokeRect(wx+1,wy+1,54,54);
  txt(d.ic,wx+28,wy+34,24,d.c,'center');txt(w.lv>=d.max?'MAX':'Lv'+w.lv,wx+28,wy+52,13,'#fff','center');wx+=62}
 // 効果時間
 let ey=H-84;
 if(G.freeze>0){txt(`時計 ${G.freeze.toFixed(1)}`,16,ey,20,'#9ae0ff');ey-=26}
 if(p.star>0){txt(`スター ${p.star.toFixed(1)}`,16,ey,20,'#ffe45a');ey-=26}
 if(p.skill){txt(`${p.ch.skill.n} ${Math.max(0,p.skill.dur-p.skill.t).toFixed(1)}`,16,ey,20,p.ch.c)}
}

// スキルボタンの表示更新
let lastSgKey='';
function updateSkillBtn(force){
 const p=G.p;if(!p)return;
 const g=Math.floor(p.sg),act=!!p.skill,key=g+(act?'a':'');if(!force&&key===lastSgKey)return;lastSgKey=key;
 skillBtn.style.setProperty('--g',act?100:g);skillBtn.style.setProperty('--sc',p.ch.c);
 skillBtn.classList.toggle('ready',g>=100&&!act);
 skillTxt.innerHTML=act?'発動中':g>=100?`SKILL<small>${p.ch.skill.n}</small>`:`${g}%<small>SKILL</small>`;
}
