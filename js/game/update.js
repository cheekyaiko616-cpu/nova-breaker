// ===== ゲームの進行（開始・毎フレームの更新） =====
const xpNeed=l=>Math.round(4+l*3.2+Math.pow(l,1.6)*.6);

function startStage(si,cid){
 resetG();
 const ch=CHARS[cid];
 G.si=si;G.stage=STAGES[si];G.sc=stScale(si);
 const maxHp=Math.round(ch.hp+permV('hp'));
 G.p={cid,ch,x:0,y:0,r:16,hp:maxHp,maxHp,sp:ch.sp*(1+permV('speed')),dmg:ch.dmg*(1+permV('damage')),
  cdMul:1-Math.min(.4,permV('cooldown')),area:1,pr:95*(1+permV('magnet')),greed:1+permV('greed'),armor:0,regen:0,sgMul:1,
  level:1,xp:0,xpNext:xpNeed(1),inv:1.5,hf:0,star:0,sg:0,skill:null,face:1,dirx:1,diry:0,ang:0,moving:false,
  weapons:[{id:ch.wep,lv:1,t:0,a:0}]};
 S.lastChar=cid;saveNow();
 ST='playing';ui.innerHTML='';hud.classList.add('on');updateSkillBtn(true);LMT=performance.now();
 showBanner(`STAGE ${si+1}  ${G.stage.n}`,'#cfe0ff');
}

function update(dt){
 const p=G.p;if(!p)return;
 G.t+=dt;G.anim+=dt;
 G.shake=Math.max(0,G.shake-dt*30);G.flash=Math.max(0,G.flash-dt);G.freeze=Math.max(0,G.freeze-dt);
 updatePlayer(dt);
 for(const w of p.weapons)WEP[w.id].tick(p,w,dt);
 updateSkill(p,dt);
 updateSpawn(dt);updateEnemies(dt);updateProj(dt);updateEProj(dt);updateZones(dt);updateOrbs(dt);updateItems(dt);
 for(const f of G.fx)f.life-=dt;G.fx=G.fx.filter(f=>f.life>0);
 for(const q of G.pt){q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.92;q.vy*=.92}G.pt=G.pt.filter(q=>q.life>0);
 for(const n of G.dn){n.life-=dt;n.y-=40*dt}G.dn=G.dn.filter(n=>n.life>0);
 if(G.pend>0){G.pend-=dt;if(G.pend<=0){finishRun(true);return}}
 if(p.hp<=0){p.hp=0;finishRun(false);return}
 if(p.xp>=p.xpNext&&G.pend<=0)levelUp();
}

function updatePlayer(dt){
 const p=G.p;let mx=0,my=0;
 if(K.w||K.arrowup)my-=1;if(K.s||K.arrowdown)my+=1;if(K.a||K.arrowleft)mx-=1;if(K.d||K.arrowright)mx+=1;
 const ml=Math.hypot(mx,my);
 if(ml>0){mx/=ml;my/=ml}else if(G.tv){mx=G.tv.x;my=G.tv.y;const l=Math.hypot(mx,my);if(l>1){mx/=l;my/=l}}
 const mv=Math.hypot(mx,my);p.moving=mv>.1;
 if(p.moving){p.dirx=mx/mv;p.diry=my/mv;if(Math.abs(mx)>.15)p.face=mx<0?-1:1}
 const spd=p.sp*(isSkill(p,'whirl')?1.3:1)*(p.star>0?1.25:1);
 p.x+=mx*spd*dt;p.y+=my*spd*dt;
 p.inv=Math.max(0,p.inv-dt);p.hf=Math.max(0,p.hf-dt);p.star=Math.max(0,p.star-dt);
 if(p.regen>0)p.hp=Math.min(p.maxHp,p.hp+p.regen*dt);
 const t=nearestE(p.x,p.y,700);if(t){p.ang=Math.atan2(t.y-p.y,t.x-p.x);if(!p.moving)p.face=t.x<p.x?-1:1}
 if(p.star>0)hitCircleCD(p.x,p.y,p.r+14,p.dmg*3,300,'star',.3);
 G.cam.x=p.x-W/2;G.cam.y=p.y-H/2;
}

function updateProj(dt){
 for(const b of G.pr){
  if(b.dead)continue;b.life-=dt;b.t+=dt;
  if(b.kind==='homing'||b.kind==='missile'){
   const t=nearestE(b.x,b.y,700);
   if(t){const des=Math.atan2(t.y-b.y,t.x-b.x),cur=Math.atan2(b.vy,b.vx);let df=des-cur;while(df>Math.PI)df-=TAU;while(df<-Math.PI)df+=TAU;
    const na=cur+clamp(df,-7*dt,7*dt),sp=Math.min(Math.hypot(b.vx,b.vy)+700*dt,820);b.vx=Math.cos(na)*sp;b.vy=Math.sin(na)*sp}
  }else if(b.kind==='axe')b.vy+=b.grav*dt;
  else if(b.kind==='boomerang'&&b.t>.45){
   if(!b.ret){b.ret=true;b.hit.clear()}
   const dx=G.p.x-b.x,dy=G.p.y-b.y,d=Math.hypot(dx,dy)||1;b.vx+=dx/d*2200*dt;b.vy+=dy/d*2200*dt;
   const sp=Math.hypot(b.vx,b.vy);if(sp>640){b.vx=b.vx/sp*640;b.vy=b.vy/sp*640}
   if(d<30){b.dead=true;continue}
  }
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.life<=0){b.dead=true;continue}
  for(const e of G.en){
   if(e.dead||b.hit.has(e.id))continue;const rr=e.r+b.r;
   if(d2(e.x,e.y,b.x,b.y)<rr*rr){dmgE(e,b.dmg,b.kb,b.x-b.vx*.02,b.y-b.vy*.02);b.hit.add(e.id);if(b.pi>0)b.pi--;else{b.dead=true;spawnPt(b.x,b.y,b.col,3,.3);break}}
  }
 }
 G.pr=G.pr.filter(b=>!b.dead);
}
function updateEProj(dt){
 const p=G.p,frz=G.freeze>0;
 for(const b of G.ep){
  if(!frz){b.x+=b.vx*dt;b.y+=b.vy*dt}b.life-=dt;
  if(b.life<=0){b.dead=true;continue}
  if(d2(b.x,b.y,p.x,p.y)<(p.r*.7+b.r)**2){hurtP(b.dmg);b.dead=true}
 }
 G.ep=G.ep.filter(b=>!b.dead);
}
function updateZones(dt){for(const z of G.zones){z.life-=dt;hitCircleCD(z.x,z.y,z.r,z.dmg,0,'hz',.3)}G.zones=G.zones.filter(z=>z.life>0)}
function updateOrbs(dt){
 const p=G.p,pr2=p.pr*p.pr;
 for(const o of G.or){
  const dx=p.x-o.x,dy=p.y-o.y,dd=dx*dx+dy*dy;
  if(o.mag||dd<pr2){const d=Math.sqrt(dd)||1,sp=o.mag?950:640;o.vx=dx/d*sp;o.vy=dy/d*sp}else{o.vx*=.9;o.vy*=.9}
  o.x+=o.vx*dt;o.y+=o.vy*dt;
  if(dd<(p.r+14)**2){if(o.kind==='xp')p.xp+=o.v;else G.goldRun+=Math.max(1,Math.round(o.v*p.greed));o.dead=true}
 }
 G.or=G.or.filter(o=>!o.dead);
}
function updateItems(dt){
 const p=G.p;
 for(const it of G.items){
  if(it.dead)continue;it.t+=dt;
  const dx=p.x-it.x,dy=p.y-it.y,dd=dx*dx+dy*dy;
  if(it.mag){const d=Math.sqrt(dd)||1;it.x+=dx/d*850*dt;it.y+=dy/d*850*dt}
  if(dd<(p.r+26)**2){it.dead=true;applyItem(it.k)}
 }
 G.items=G.items.filter(i=>!i.dead);
}
