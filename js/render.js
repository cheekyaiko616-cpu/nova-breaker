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
 drawParticles();
 drawDn();
 ctx.restore();
 if(G.freeze>0){ctx.fillStyle='rgba(120,180,255,.14)';ctx.fillRect(0,0,W,H)}
 if(isSkill(p,'storm')){ctx.fillStyle=`rgba(20,20,60,${.25+Math.random()*.1})`;ctx.fillRect(0,0,W,H)}
 if(G.flash>0){ctx.fillStyle=`rgba(255,255,255,${Math.min(.6,G.flash)})`;ctx.fillRect(0,0,W,H)}
 drawBgFront(G.stage,cx,cy);
 if(G.rf>0){const g=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);g.addColorStop(0,'rgba(255,0,0,0)');g.addColorStop(1,`rgba(255,20,40,${Math.min(.7,G.rf*2)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 drawBossArrow();
 drawHUD();
}

// ----- 地面のもの -----
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
  if(def.spr)drawSprite(SPRITES[def.spr],0,it.x,it.y+by,it.k==='chest'?2.6:2.4);
  else{ctx.fillStyle='#ffe45a50';ctx.beginPath();ctx.arc(it.x,it.y+by,15,0,TAU);ctx.fill();ctx.fillStyle='#ffe45a';ctx.beginPath();ctx.arc(it.x,it.y+by,9,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(it.x-2,it.y+by-2,3,0,TAU);ctx.fill()}
 }
}

// ----- 敵 -----
function drawEnemy(e){
 const s=SPRITES[e.spr],k=e.k,w=s.w*e.sc*k,h=s.h*e.sc*k,z=e.z||0;
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(e.x,e.y+h*.45,w*.38,Math.max(4,w*.12),0,0,TAU);ctx.fill();
 if(e.elite||e.giant||e.mid){ctx.strokeStyle=e.elite?'#ffd84a':'#ff4a4a';ctx.globalAlpha=.55+.3*Math.sin(G.anim*6);ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(e.x,e.y+h*.45,w*.52,Math.max(6,w*.18),0,0,TAU);ctx.stroke();ctx.globalAlpha=1}
 let bob=0,sy=1;
 const fr=Math.floor(G.anim*(e.boss?7:9)+e.bob)%s.n;
 if(e.mid){ctx.globalAlpha=.35+.15*Math.sin(G.anim*6);ctx.fillStyle='#ff4a4a';ctx.beginPath();ctx.ellipse(e.x,e.y-z,w*.55,h*.55,0,0,TAU);ctx.fill();ctx.globalAlpha=1}
 drawSprite(s,fr,e.x,e.y+bob-z,e.sc*k,e.face<0,e.flash>0,e.ai==='ghost'?.72:1,e.flash>0?1.14:1,e.flash>0?.88:sy);
 if(e.boss||e.mid){ctx.fillStyle='#ffd84a';ctx.font='bold 22px system-ui';ctx.textAlign='center';ctx.fillText('♛',e.x,e.y-z-h/2-4)}
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
 if(p.weapons.some(w=>w.evo)){additive(true);glow(p.x,p.y-4,70+6*Math.sin(G.anim*5),'#ffd84a',.35);additive(false);ctx.globalAlpha=1}
 const blink=p.inv>0&&Math.floor(G.anim*20)%2===0;
 if(p.star>0){ctx.globalAlpha=.5;ctx.fillStyle=`hsl(${(G.anim*600)%360},100%,60%)`;ctx.beginPath();ctx.arc(p.x,p.y,34,0,TAU);ctx.fill();ctx.globalAlpha=1}
 const bob=p.moving?-Math.abs(Math.sin(G.anim*10))*3:0;
 drawSprite(SPRITES['c_'+p.ch.id],p.moving?Math.floor(G.anim*10)%4:0,p.x,p.y+bob-10,2.3,p.face<0,p.hf>0,blink?.35:1);
 const bw=50,r=p.hp/p.maxHp;ctx.fillStyle='#0b0b14';ctx.fillRect(p.x-bw/2-1,p.y+28,bw+2,7);ctx.fillStyle='#3a0a14';ctx.fillRect(p.x-bw/2,p.y+29,bw,5);
 ctx.fillStyle=r>.5?'#4ae07a':r>.25?'#e8b03a':'#ff4a4a';ctx.fillRect(p.x-bw/2,p.y+29,bw*Math.max(0,r),5);
}

// ----- 弾・エフェクト -----
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
 // 武器一覧（覚醒した武器は金色）
 let wx=14;const wy=H-66;
 for(const w of p.weapons){const d=WEP[w.id],ev=w.evo;ctx.fillStyle='#0b0b14cc';ctx.fillRect(wx,wy,56,56);ctx.strokeStyle=ev?'#ffe45a':d.c;ctx.lineWidth=ev?4:2;ctx.strokeRect(wx+1,wy+1,54,54);
  if(ev){additive(true);glow(wx+28,wy+28,46,'#ffd84a',.35+.15*Math.sin(G.anim*6));additive(false);ctx.globalAlpha=1}
  txt(d.ic,wx+28,wy+34,24,ev?'#fff2a0':d.c,'center');txt(ev?'★覚醒':(w.lv>=d.max?'MAX':'Lv'+w.lv),wx+28,wy+52,13,ev?'#ffe45a':'#fff','center');wx+=62}
 // パッシブ一覧
 let px2=14;const py2=H-112;
 for(const k in (p.pl||{})){const ps=PSBYK[k],lv=p.pl[k];ctx.fillStyle='#0b0b14cc';ctx.fillRect(px2,py2,38,38);ctx.strokeStyle='#8ae0a0';ctx.lineWidth=2;ctx.strokeRect(px2+1,py2+1,36,36);
  txt(ps.ic,px2+19,py2+23,19,'#c8ffd8','center');txt(lv>=PSMAX?'MAX':'Lv'+lv,px2+19,py2+36,11,'#fff','center');px2+=42}
 // 効果時間
 let ey=H-130;
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
