// ===== レベルアップ =====
const PSMAX=5;
const PASSIVES=[
 {k:'dmg',n:'攻撃力',ic:'攻',b:.1,d:v=>`攻撃力 +${Math.round(v*100)}%`,f:(p,v)=>p.dmg*=1+v},
 {k:'cd',n:'攻撃速度',ic:'速',b:.06,d:v=>`攻撃の間隔 -${Math.round(v*100)}%`,f:(p,v)=>p.cdMul*=1-v},
 {k:'area',n:'攻撃範囲',ic:'広',b:.1,d:v=>`攻撃範囲 +${Math.round(v*100)}%`,f:(p,v)=>p.area*=1+v},
 {k:'sp',n:'移動速度',ic:'足',b:.08,d:v=>`移動速度 +${Math.round(v*100)}%`,f:(p,v)=>p.sp*=1+v},
 {k:'hp',n:'最大HP',ic:'命',b:20,d:v=>`最大HP +${Math.round(v)}`,f:(p,v)=>{p.maxHp+=Math.round(v);p.hp+=Math.round(v)}},
 {k:'pr',n:'回収範囲',ic:'磁',b:.25,d:v=>`回収範囲 +${Math.round(v*100)}%`,f:(p,v)=>p.pr*=1+v},
 {k:'armor',n:'防御',ic:'防',b:1,d:v=>`受けるダメージ -${Math.round(v)}`,f:(p,v)=>p.armor+=Math.round(v)},
 {k:'regen',n:'自然回復',ic:'再',b:.4,d:v=>`毎秒 ${v.toFixed(1)} HP回復`,f:(p,v)=>p.regen+=v},
 {k:'sg',n:'スキル充填',ic:'技',b:.15,d:v=>`ゲージの溜まり +${Math.round(v*100)}%`,f:(p,v)=>p.sgMul*=1+v},
];
const PSBYK={};for(const x of PASSIVES)PSBYK[x.k]=x;
const HEAL_CARD={n:'おにぎり',ic:'癒',d:'HPを40%回復'};

function levelUp(){
 const p=G.p;stickEnd();
 p.xp-=p.xpNext;p.level++;p.xpNext=xpNeed(p.level);
 ringFx(p.x,p.y,420,'#7fe8ff',.6,10);ringFx(p.x,p.y,260,'#ffffff',.45,6);spawnPt(p.x,p.y,'#9ae8ff',30,1.4);
 ST='levelup';hideBanner();showLevelUp();
}
function buildChoices(){
 const p=G.p,pool=[];p.pl=p.pl||{};
 // 覚醒できる武器があれば必ず候補に出す
 for(const w of p.weapons)if(canEvolve(p,w)){const d=WEP[w.id];pool.push({w:1000,kind:'evo',wp:w,d,title:EVO[w.id].n,desc:EVO[w.id].d,ic:d.ic,c:'#ffe45a',tag:'★ 覚醒 ★'})}
 for(const w of p.weapons){const d=WEP[w.id];if(w.lv<d.max)pool.push({w:d.main?4:3,kind:'wup',wp:w,d,title:`${d.n} Lv${w.lv+1}`,desc:d.lv(w.lv+1),ic:d.ic,c:d.c,tag:'UPGRADE'})}
 if(p.weapons.length<MAX_WEAPONS){const own=new Set(p.weapons.map(w=>w.id));
  for(const id of shuffle(SUBS.filter(i=>!own.has(i))).slice(0,3)){const d=WEP[id];pool.push({w:2.2,kind:'wnew',id,d,title:d.n,desc:d.d,ic:d.ic,c:d.c,tag:'NEW WEAPON'})}}
 for(const ps of PASSIVES){const cur=p.pl[ps.k]||0;if(cur>=PSMAX)continue;
  const mate=p.weapons.find(w=>EVO[w.id]&&EVO[w.id].ps===ps.k&&!w.evo);
  let desc=ps.d(ps.b);if(mate)desc+=`<br><span class="evh">${WEP[mate.id].n}の覚醒に必要</span>`;
  pool.push({w:(mate&&mate.lv>=WEP[mate.id].max-2?3.5:1.3)*(cur?1.4:1),kind:'stat',ps,v:ps.b,title:`${ps.n} Lv${cur+1}`,desc,ic:ps.ic,c:'#8ae0a0',tag:cur?`PASSIVE Lv${cur}→${cur+1}`:'PASSIVE'})}
 pool.push({w:.5,kind:'heal',title:HEAL_CARD.n,desc:HEAL_CARD.d,ic:HEAL_CARD.ic,c:'#ff9ac0',tag:'RECOVER'});
 const out=[];
 while(out.length<3&&pool.length){let tot=pool.reduce((s,o)=>s+o.w,0),r=Math.random()*tot,i=0;for(;i<pool.length;i++){r-=pool[i].w;if(r<=0)break}out.push(pool.splice(Math.min(i,pool.length-1),1)[0])}
 return out;
}
function showLevelUp(){
 const p=G.p,ch=buildChoices();
 ui.innerHTML=`<div class="s"><h2>LEVEL UP!  Lv ${p.level}</h2><div class="sub">強化を1つ選んでください</div><div class="cards">${ch.map((o,i)=>`
  <div class="card${o.kind==='evo'?' evo':''}" data-i="${i}" style="--c:${o.c}"><div class="cr">${o.tag}</div><div class="ci">${o.ic}</div><div class="cn">${o.title}</div><div class="cd">${o.desc}</div></div>`).join('')}</div></div>`;
 ui.querySelectorAll('.card').forEach(el=>{el.onclick=()=>{
  const o=ch[+el.dataset.i];
  if(o.kind==='wup')o.wp.lv++;else if(o.kind==='wnew')p.weapons.push({id:o.id,lv:1,t:0,a:0});
  else if(o.kind==='evo'){ui.innerHTML='';ST='playing';LMT=performance.now();evolveWeapon(p,o.wp);if(p.xp>=p.xpNext)levelUp();return}
  else if(o.kind==='heal')p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.4);
  else{p.pl[o.ps.k]=(p.pl[o.ps.k]||0)+1;o.ps.f(p,o.v)}
  if(p.xp>=p.xpNext){levelUp();return}
  ui.innerHTML='';ST='playing';LMT=performance.now();
 }});
}
