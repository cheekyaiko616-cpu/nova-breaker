// ===== 敵の出現 =====
// o: {elite 強化個体 / giant 巨大個体 / mid 中ボス / ai:'straight' 群れ}
function makeEnemy(type,x,y,o){
 o=o||{};const t=ET[type];if(!t)return null;
 const sc=G.sc,prog=Math.min(1,G.t/G.stage.dur);
 let hp=t.boss?t.hp:t.hp*sc.hpM*(1+prog*sc.grow),size=t.boss?t.sc:t.sc*sc.scM,dmg=t.dmg*sc.dmgM,xp=t.xp*sc.xpM,sp=t.sp;
 const e={id:nextId++,type,t,pal:t.pal,spr:t.spr,x,y,ai:o.ai||t.ai,flash:0,dead:false,kx:0,ky:0,hc:{},st:rand(.8,2.5),face:1,bob:Math.random()*6,cs:0,z:0,
  elite:false,giant:false,mid:false,boss:!!t.boss};
 if(t.boss){e.pats=t.pats;e.pi=0;e.atk=2.5;e.mode=null}
 if(o.mid){e.mid=true;hp=Math.min(hp*14,500*(1+G.si*.7));size*=1.9;dmg*=1.4;xp*=10;sp*=.85}
 else if(o.giant){e.giant=true;hp*=9;size*=1.75;dmg*=1.35;xp*=8;sp*=.8}
 else if(o.elite){e.elite=true;hp*=4;size*=1.35;dmg*=1.25;xp*=4;sp*=1.05}
 if(e.ai==='straight'){e.vx=o.vx;e.vy=o.vy;e.life=o.life||10}
 e.hp=e.maxHp=hp;e.sc=size;e.dmg=dmg;e.xp=xp;e.sp=sp;
 const s=SPRITES[t.spr];e.k=t.oh*1.15/s.h;e.r=Math.max(s.w*.8,s.h)*size*e.k*.34;
 G.en.push(e);return e;
}
function pickType(){
 let tot=0;const c=[];
 for(const[st,ty,w]of G.stage.pool)if(G.t>=st){tot+=w;c.push([ty,w])}
 let r=Math.random()*tot;for(const[ty,w]of c){r-=w;if(r<=0)return ty}
 return c[0][0];
}
function spawnPos(dist){const a=Math.random()*TAU,d=dist||rand(760,840);return[G.p.x+Math.cos(a)*d,G.p.y+Math.sin(a)*d]}
function spawnOne(){
 const sc=G.sc,r=Math.random(),o={},prog=Math.min(1,G.t/G.stage.dur);
 if(r<sc.giantP*(.5+prog))o.giant=true;
 else if(r<sc.giantP+sc.eliteP*(1+prog))o.elite=true;
 const[x,y]=spawnPos();makeEnemy(pickType(),x,y,o);
}
function updateSpawn(dt){
 if(G.pend>0)return;
 const stg=G.stage,prog=Math.min(1,G.t/stg.dur);
 while(G.evIdx<stg.events.length&&G.t>=stg.events[G.evIdx][0]){runEvent(stg.events[G.evIdx]);G.evIdx++}
 if(!G.midSpawned&&G.t>=stg.dur*.5){G.midSpawned=true;const[x,y]=spawnPos();makeEnemy(stg.pool[stg.pool.length-1][1],x,y,{mid:true});showBanner('強敵出現！','#ff8a5a')}
 if(!G.bossSpawned&&G.t>=stg.dur)spawnBoss();
 let target=Math.min(150,26+prog*(78+G.si*9));if(G.boss)target*=.45;
 G.spawnT-=dt;
 if(G.spawnT<=0){
  G.spawnT=Math.max(.08,.4-prog*(.28+G.si*.02));
  const alive=G.en.length;
  if(alive<target){const n=alive<target*.5?5:2+Math.floor(prog*2);for(let i=0;i<n;i++)spawnOne()}
 }
}
function runEvent(ev){
 const kind=ev[1],ty=ev[2],n=ev[3];
 if(kind==='swarm'){
  const a=Math.random()*TAU,cx=G.p.x+Math.cos(a)*820,cy=G.p.y+Math.sin(a)*820,ang=a+Math.PI,sp=ET[ty].sp*1.4+90;
  for(let i=0;i<n;i++)makeEnemy(ty,cx+rand(-130,130),cy+rand(-130,130),{ai:'straight',vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:11});
  showBanner('群れが来る！','#ffb05a');
 }else if(kind==='ring'){
  for(let i=0;i<n;i++){const a=i/n*TAU;makeEnemy(ty,G.p.x+Math.cos(a)*560,G.p.y+Math.sin(a)*560)}
  showBanner('包囲された！','#ff6a6a');
 }
}
function spawnBoss(){
 G.bossSpawned=true;const[x,y]=spawnPos(700);const b=makeEnemy(G.stage.boss,x,y);
 G.boss=b;G.shake=20;showBanner('BOSS: '+b.t.n,'#ff4a6a');
}
