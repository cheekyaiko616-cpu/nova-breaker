// ===== 弾・攻撃エフェクト・粒の描画 =====
function drawZones(){
 for(const z of G.zones){
  const a=Math.min(1,z.life/z.max*2),t=G.anim;
  ctx.globalAlpha=.28*a;ctx.fillStyle='#2a7ad8';ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,TAU);ctx.fill();
  ctx.globalAlpha=.55*a;ctx.strokeStyle='#bfe4ff';ctx.lineWidth=3;ctx.setLineDash([14,10]);ctx.lineDashOffset=-t*40;ctx.beginPath();ctx.arc(z.x,z.y,z.r*.96,0,TAU);ctx.stroke();ctx.setLineDash([]);
  additive(true);
  for(let i=0;i<3;i++){const ph=((t*.9+i/3)%1);ctx.globalAlpha=.5*a*(1-ph);ctx.strokeStyle='#7ac8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.x,z.y,z.r*ph,0,TAU);ctx.stroke()}
  for(let i=0;i<5;i++){const ph=((t*.7+i*.21)%1),ang=i*2.4+z.x;glow(z.x+Math.cos(ang)*z.r*.7*(i%2?.6:1),z.y+Math.sin(ang)*z.r*.5-ph*40,10,'#9ad8ff',.8*a*(1-ph))}
  additive(false);
 }
 ctx.globalAlpha=1;
}
function drawProj(){
 for(const b of G.pr){
  const a=Math.atan2(b.vy,b.vx),tr=b.tr;
  // 尾
  if(tr&&tr.length>3){additive(true);ctx.lineCap='round';
   for(let i=2;i<tr.length;i+=2){const k=i/tr.length;ctx.globalAlpha=.55*k;ctx.strokeStyle=b.col;ctx.lineWidth=Math.max(2,b.r*1.5*k);ctx.beginPath();ctx.moveTo(tr[i-2],tr[i-1]);ctx.lineTo(tr[i],tr[i+1]);ctx.stroke()}
   ctx.lineCap='butt';additive(false)}
  switch(b.kind){
   case 'bolt':additive(true);glow(b.x,b.y,b.r*4.2,b.col,.9);ctx.globalAlpha=1;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(0,0,15,4.5,0,0,TAU);ctx.fill();ctx.restore();additive(false);break;
   case 'knife':ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle='#8a5a2a';ctx.fillRect(-14,-2.5,9,5);ctx.fillStyle='#ffd84a';ctx.fillRect(-6,-4,3,8);
    ctx.fillStyle='#f4f8ff';ctx.beginPath();ctx.moveTo(-3,-4);ctx.lineTo(16,0);ctx.lineTo(-3,4);ctx.closePath();ctx.fill();ctx.fillStyle='#9ab0d8';ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(16,0);ctx.lineTo(-3,4);ctx.fill();ctx.restore();
    additive(true);glow(b.x+Math.cos(a)*8,b.y+Math.sin(a)*8,16,'#bcd0ff',.5);additive(false);break;
   case 'axe':{const s=b.r;additive(true);glow(b.x,b.y,s*2.4,'#ff7a3a',.55);additive(false);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.t*12);
    ctx.fillStyle='#6a4a2a';ctx.fillRect(-2.5,-s*1.1,5,s*2.2);ctx.fillStyle='#0b0b14';ctx.beginPath();ctx.moveTo(1,-s*1.15);ctx.quadraticCurveTo(s*1.5,-s*.9,s*1.2,s*.2);ctx.lineTo(1,-s*.1);ctx.closePath();ctx.fill();
    ctx.fillStyle='#d8dce8';ctx.beginPath();ctx.moveTo(2,-s);ctx.quadraticCurveTo(s*1.3,-s*.8,s*1.05,s*.1);ctx.lineTo(2,-s*.2);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(3,-s*.8,3,s*.5);ctx.restore();break}
   case 'boomerang':additive(true);glow(b.x,b.y,b.r*3,'#ffb030',.6);additive(false);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.t*15);
    ctx.strokeStyle='#0b0b14';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,0,b.r,.2,Math.PI*1.35);ctx.stroke();ctx.strokeStyle='#ffc04a';ctx.lineWidth=7;ctx.stroke();ctx.strokeStyle='#fff2b0';ctx.lineWidth=2.5;ctx.stroke();ctx.lineCap='butt';ctx.restore();break;
   case 'homing':case 'missile':additive(true);glow(b.x-Math.cos(a)*8,b.y-Math.sin(a)*8,16,'#ff9a3a',.8);glow(b.x,b.y,b.r*3,b.col,.8);additive(false);
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle='#0b0b14';ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-8,-7);ctx.lineTo(-4,0);ctx.lineTo(-8,7);ctx.closePath();ctx.fill();
    ctx.fillStyle=b.col;ctx.beginPath();ctx.moveTo(11,0);ctx.lineTo(-6,-5);ctx.lineTo(-3,0);ctx.lineTo(-6,5);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(0,-1.5,8,3);ctx.restore();break;
   default:additive(true);glow(b.x,b.y,b.r*3.4,b.col,.85);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,b.r*.6,0,TAU);ctx.fill();additive(false);
  }
 }
 ctx.globalAlpha=1;
}
function drawEProj(){
 additive(true);
 for(const b of G.ep){glow(b.x,b.y,b.r*3.3,b.c,.85);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,b.r*.55,0,TAU);ctx.fill()}
 additive(false);ctx.globalAlpha=1;
}
function drawFx(){
 for(const f of G.fx){
  const a=Math.max(0,f.life/f.max),inv=1-a;ctx.globalAlpha=a;
  switch(f.k){
   case 'arc':{ // 三日月の斬撃
    additive(true);const R=f.r,r2=R*.45,aa=f.a,w=f.w*(1.05-a*.2),sw=aa-w+inv*w*.5;
    ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(f.x,f.y,R,aa-w,aa+w);ctx.arc(f.x-Math.cos(aa)*R*.28,f.y-Math.sin(aa)*R*.28,R*.82,aa+w,aa-w,true);ctx.closePath();ctx.fill();
    ctx.globalAlpha=Math.min(1,a*1.6);ctx.strokeStyle='#fff';ctx.lineWidth=7*a+2;ctx.lineCap='round';ctx.beginPath();ctx.arc(f.x,f.y,R*.97,aa-w*.95,aa+w*.95);ctx.stroke();ctx.lineCap='butt';
    ctx.globalAlpha=a;glow(f.x+Math.cos(aa)*R*.9,f.y+Math.sin(aa)*R*.9,R*.4,f.c,.7);additive(false);break}
   case 'laser':{additive(true);const w=f.w*(.5+a*.7);ctx.lineCap='round';
    ctx.globalAlpha=a*.5;ctx.strokeStyle=f.c;ctx.lineWidth=w*3.2;ctx.beginPath();ctx.moveTo(f.x1,f.y1);ctx.lineTo(f.x2,f.y2);ctx.stroke();
    ctx.globalAlpha=a*.9;ctx.lineWidth=w*1.6;ctx.stroke();ctx.globalAlpha=a;ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(3,w*.7);ctx.stroke();ctx.lineCap='butt';
    glow(f.x1,f.y1,w*3,f.c,a);additive(false);break}
   case 'zap':{additive(true);const n=7;const pts=[[f.x1,f.y1]];for(let i=1;i<n;i++){const t=i/n;pts.push([f.x1+(f.x2-f.x1)*t+rand(-14,14),f.y1+(f.y2-f.y1)*t+rand(-14,14)])}pts.push([f.x2,f.y2]);
    for(const[w,c,al]of[[11,f.c,.4],[5,f.c,.9],[2,'#fff',1]]){ctx.globalAlpha=al*a;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
    glow(f.x2,f.y2,34,f.c,a);additive(false);break}
   case 'bolt':{additive(true);let py=f.y-300,px=f.x+rand(-20,20);const pts=[[px,py]];while(py<f.y-10){py+=30;px+=rand(-22,22);pts.push([px,py])}pts.push([f.x,f.y]);
    for(const[w,c,al]of[[16,'#ffd84a',.35],[7,'#fff0a0',.9],[3,'#fff',1]]){ctx.globalAlpha=al*a;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
    ctx.globalAlpha=a;glow(f.x,f.y,70*(1.2-a*.3),'#ffe45a',1);ctx.strokeStyle='#fff2a0';ctx.lineWidth=4;ctx.globalAlpha=a*.8;ctx.beginPath();ctx.ellipse(f.x,f.y,50*inv+14,20*inv+6,0,0,TAU);ctx.stroke();additive(false);break}
   case 'ring':additive(true);ctx.strokeStyle=f.c;ctx.lineWidth=(f.w||8)*a+1;ctx.globalAlpha=a;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.15+inv*.85),0,TAU);ctx.stroke();ctx.globalAlpha=a*.4;ctx.lineWidth=(f.w||8)*a*2.5;ctx.stroke();additive(false);break;
   case 'boom':additive(true);glow(f.x,f.y,f.r*(1.4-a*.3),f.c,a);glow(f.x,f.y,f.r*.7*a+4,'#ffffff',a);additive(false);break;
   case 'hit':ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.a);ctx.globalAlpha=a;ctx.fillStyle='#fff';ctx.beginPath();const L=(26+inv*18)*f.s;ctx.moveTo(-L,0);ctx.quadraticCurveTo(0,-5*f.s*a-1,L,0);ctx.quadraticCurveTo(0,5*f.s*a+1,-L,0);ctx.fill();ctx.restore();break;
  }
 }
 ctx.globalAlpha=1;
}
function drawParticles(){
 additive(true);ctx.lineCap='round';
 for(const q of G.pt){
  const a=Math.min(1,q.life/q.max*1.6);ctx.globalAlpha=a;
  if(q.ln){ctx.strokeStyle=q.c;ctx.lineWidth=q.r*a+.6;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-q.vx*.045,q.y-q.vy*.045);ctx.stroke()}
  else if(q.g){glow(q.x,q.y,q.r*3.2*(.5+a*.5),q.c,a)}
  else{ctx.fillStyle=q.c;ctx.fillRect(q.x-q.r/2,q.y-q.r/2,q.r,q.r)}
 }
 additive(false);ctx.lineCap='butt';ctx.globalAlpha=1;
}
