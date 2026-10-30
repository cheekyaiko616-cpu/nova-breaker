// ===== 固有スキル（敵を倒すとゲージが溜まり、満タンで発動） =====
function useSkill(){
 const p=G.p;if(!p||ST!=='playing'||p.sg<100||p.skill)return;
 p.sg=0;const id=p.ch.skill.id,sk={id,t:0,dur:1,tick:0};
 switch(id){
  case 'overdrive':sk.dur=6;for(const w of p.weapons)w.t=0;break;
  case 'whirl':sk.dur=4;break;
  case 'sanct':sk.dur=6;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.4);hitCircle(p.x,p.y,320,pD(p)*6,520);G.fx.push({k:'ring',x:p.x,y:p.y,r:320,life:.5,max:.5,c:'#c8e0ff'});break;
  case 'judge':sk.dur=1.8;sk.a=p.ang||0;break;
  case 'storm':sk.dur=4;break;
  case 'legion':sk.dur=10;break;
 }
 p.skill=sk;G.shake=10;G.flash=.25;
 showBanner(p.ch.skill.n+'！',p.ch.c);
}
function updateSkill(p,dt){
 const s=p.skill;if(!s)return;
 s.t+=dt;s.tick-=dt;
 if(s.id==='whirl'){s.a=(s.a||0)+dt*14;if(s.tick<=0){s.tick=.12;hitCircle(p.x,p.y,170*p.area,pD(p)*1.7,200)}}
 else if(s.id==='judge'){s.a+=dt*TAU/1.6;if(s.tick<=0){s.tick=.06;beam(p.x,p.y-6,s.a,950,42,pD(p)*3,'#9af0ff',true)}}
 else if(s.id==='storm'){if(s.tick<=0){s.tick=.09;const cs=G.en.filter(e=>!e.dead&&onScreen(e));if(cs.length){const e=pick(cs);hitCircle(e.x,e.y,50,pD(p)*4,80);G.fx.push({k:'bolt',x:e.x,y:e.y,life:.25,max:.25});spawnPt(e.x,e.y,'#ffe45a',6,.5)}}}
 if(s.t>=s.dur)p.skill=null;
}
