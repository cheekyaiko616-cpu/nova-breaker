// ===== 敵の動き =====
function eShoot(e,a,sp,col,r,dm){G.ep.push({x:e.x,y:e.y-(e.z||0),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:r||7,dmg:e.dmg*(dm||.6),life:4.5,c:col})}

function updateEnemies(dt){
 const p=G.p,frz=G.freeze>0,slow=isSkill(p,'storm')?.5:1,damp=Math.max(0,1-dt*7);
 for(const e of G.en){
  if(e.dead)continue;
  e.flash=Math.max(0,e.flash-dt);
  e.x+=e.kx*dt;e.y+=e.ky*dt;e.kx*=damp;e.ky*=damp;
  if(e.ai==='straight'){
   if(!frz){e.x+=e.vx*dt*slow;e.y+=e.vy*dt*slow}
   e.face=e.vx<0?-1:1;e.life-=dt;if(e.life<=0){killE(e,true);continue}
  }
  if(frz)continue;
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,sp=e.sp*slow;
  if(e.ai!=='straight'&&Math.abs(dx)>3)e.face=dx<0?-1:1;
  if(e.boss)bossAI(e,dt,ux,uy,d,slow);
  else switch(e.ai){
   case 'chase':case 'ghost':e.x+=ux*sp*dt;e.y+=uy*sp*dt;break;
   case 'wave':{const w=Math.sin(G.t*4+e.id)*.9;e.x+=(ux-uy*w)*sp*dt;e.y+=(uy+ux*w)*sp*dt;break}
   case 'charge':
    if(e.cs===0){e.x+=ux*sp*dt;e.y+=uy*sp*dt;e.st-=dt;if(d<340&&e.st<=0){e.cs=1;e.ct=.55}}
    else if(e.cs===1){e.ct-=dt;e.flash=Math.sin(G.t*40)>0?.05:0;if(e.ct<=0){e.cs=2;e.ct=.6;e.vx=ux*sp*4.2;e.vy=uy*sp*4.2}}
    else{e.x+=e.vx*dt;e.y+=e.vy*dt;e.ct-=dt;if(e.ct<=0){e.cs=0;e.st=rand(1.8,2.8)}}
    break;
   case 'ranged':case 'summon':{
    const ideal=e.ai==='summon'?330:270;let m=0;if(d>ideal+50)m=1;else if(d<ideal-50)m=-1;
    const sd=(e.id%2?1:-1)*.5;e.x+=(ux*m-uy*sd)*sp*dt;e.y+=(uy*m+ux*sd)*sp*dt;e.st-=dt;
    if(e.st<=0&&d<650){
     e.st=(e.t.rate||2.2)*rand(.85,1.15);
     if(e.ai==='summon'){if(G.en.length<130)for(let i=0;i<2+(e.elite?2:0);i++)makeEnemy(e.t.summon,e.x+rand(-50,50),e.y+rand(-50,50));spawnPt(e.x,e.y,'#c87aff',10,.6)}
     else{const a=Math.atan2(dy,dx),bc=e.t.bc,bs=e.t.bsp;
      if(e.t.shot==='spread3'){for(let k=-1;k<=1;k++)eShoot(e,a+k*.25,bs,bc)}else eShoot(e,a,bs,bc);
      if(e.elite||e.giant||e.mid){eShoot(e,a+.15,bs,bc);eShoot(e,a-.15,bs,bc)}}
    }
    break}
   case 'turret':
    e.x+=ux*sp*dt;e.y+=uy*sp*dt;e.st-=dt;
    if(e.st<=0&&d<700){e.st=e.t.rate*rand(.85,1.15);const n=8,o=Math.random();for(let i=0;i<n;i++)eShoot(e,o+i/n*TAU,e.t.bsp,e.t.bc)}
    break;
   case 'bomber':
    if(e.fuse==null){e.x+=ux*sp*dt;e.y+=uy*sp*dt;if(d<e.r+70)e.fuse=.6}
    else{e.fuse-=dt;e.flash=Math.sin(G.t*50)>0?.05:0;
     if(e.fuse<=0){G.fx.push({k:'boom',x:e.x,y:e.y,r:110,life:.35,max:.35,c:'#ff8a3a'});G.shake=Math.min(16,G.shake+6);
      if(d2(e.x,e.y,p.x,p.y)<(110+p.r)**2)hurtP(e.dmg);killE(e,true);continue}}
    break;
  }
  // 体当たり
  if(!e.dead&&e.ai!=='bomber'&&(e.z||0)<30&&d<e.r+p.r*.9)hurtP(e.dmg);
  // 遠くに離れた敵は前方へ回り込ませる
  if(!e.boss&&e.ai!=='straight'&&d>1150){const a=Math.atan2(p.diry,p.dirx)+rand(-.9,.9);e.x=p.x+Math.cos(a)*790;e.y=p.y+Math.sin(a)*790;e.cs=0;e.fuse=null}
 }
 // 敵同士の押し合い
 const en=G.en,n=en.length;
 for(let i=0;i<n;i++){const a=en[i];if(a.dead||a.ai==='ghost'||a.ai==='straight')continue;
  for(let j=i+1;j<n;j++){const b=en[j];if(b.dead||b.ai==='ghost'||b.ai==='straight')continue;
   const dx=b.x-a.x,dy=b.y-a.y,md=(a.r+b.r)*.8;if(dx>md||dx<-md||dy>md||dy<-md)continue;
   const dd=dx*dx+dy*dy;if(dd>=md*md)continue;const d=Math.sqrt(dd)||.01,push=(md-d)*.5,nx=dx/d,ny=dy/d;
   if(a.boss){b.x+=nx*push*2;b.y+=ny*push*2}else if(b.boss){a.x-=nx*push*2;a.y-=ny*push*2}
   else{a.x-=nx*push;a.y-=ny*push;b.x+=nx*push;b.y+=ny*push}}}
 G.en=G.en.filter(e=>!e.dead);
}

// ===== ボスの行動 =====
function bossAI(e,dt,ux,uy,d,slow){
 const p=G.p,bc=e.t.bc,lv=G.si;
 if(e.mode){
  e.mt-=dt;
  if(e.mode==='windup'){e.flash=Math.sin(G.t*40)>0?.05:0;if(e.mt<=0){e.mode='dash';e.mt=.75;const a=Math.atan2(p.y-e.y,p.x-e.x);e.vx=Math.cos(a)*560;e.vy=Math.sin(a)*560}}
  else if(e.mode==='dash'){e.x+=e.vx*dt*slow;e.y+=e.vy*dt*slow;if(chance(dt*18))eShoot(e,Math.atan2(e.vy,e.vx)+Math.PI+rand(-.6,.6),120,bc,7,.4);if(e.mt<=0)e.mode=null}
  else if(e.mode==='spiral'){e.sa+=dt*2.6;e.sT-=dt;if(e.sT<=0){e.sT=.1;for(let k=0;k<3;k++)eShoot(e,e.sa+k*TAU/3,210,bc,8,.45)}if(e.mt<=0)e.mode=null}
  else if(e.mode==='jump'){
   const pr=1-Math.max(0,e.mt)/e.jd;e.x=e.jx0+(e.jx1-e.jx0)*pr;e.y=e.jy0+(e.jy1-e.jy0)*pr;e.z=Math.sin(pr*Math.PI)*160;
   if(e.mt<=0){e.z=0;e.mode=null;G.shake=18;G.fx.push({k:'ring',x:e.x,y:e.y,r:200,life:.4,max:.4,c:bc});
    if(d2(e.x,e.y,p.x,p.y)<(e.r+90)**2)hurtP(e.dmg*1.2);const n=12+lv*2;for(let i=0;i<n;i++)eShoot(e,i/n*TAU,190,bc,8,.45)}
  }
  return;
 }
 const sp=e.sp*slow;
 if(d>200){e.x+=ux*sp*dt;e.y+=uy*sp*dt}else{e.x+=-uy*sp*.6*dt;e.y+=ux*sp*.6*dt}
 e.atk-=dt;
 if(e.atk<=0){
  e.atk=Math.max(1.3,2.5-lv*.15);const pat=e.pats[e.pi++%e.pats.length],a=Math.atan2(p.y-e.y,p.x-e.x);
  switch(pat){
   case 'ring':{const n=14+lv*2,o=Math.random();for(let i=0;i<n;i++)eShoot(e,o+i/n*TAU,200,bc,8,.45);break}
   case 'aim3':{const n=3+Math.floor(lv/2)*2;for(let k=0;k<n;k++)eShoot(e,a+(k-(n-1)/2)*.2,320,bc,7,.5);break}
   case 'summon':{if(G.en.length<130){const n=4+lv;for(let i=0;i<n;i++){const aa=i/n*TAU;makeEnemy(e.t.summon,e.x+Math.cos(aa)*90,e.y+Math.sin(aa)*90)}}break}
   case 'dash':e.mode='windup';e.mt=.6;break;
   case 'spiral':e.mode='spiral';e.mt=2.2;e.sa=a;e.sT=0;break;
   case 'jump':e.mode='jump';e.jd=e.mt=.9;e.jx0=e.x;e.jy0=e.y;e.jx1=p.x;e.jy1=p.y;break;
  }
 }
}
