// ===== 戦闘の共通処理（当たり判定・ダメージ・ドロップ） =====
function nearestE(x,y,maxD){let best=null,bd=maxD?maxD*maxD:Infinity;for(const e of G.en){if(e.dead)continue;const d=d2(x,y,e.x,e.y);if(d<bd){bd=d;best=e}}return best}
function nearestWhere(x,y,maxD,f){let best=null,bd=maxD*maxD;for(const e of G.en){if(e.dead||!f(e))continue;const d=d2(x,y,e.x,e.y);if(d<bd){bd=d;best=e}}return best}
function onScreen(e,m){m=m||0;return Math.abs(e.x-G.p.x)<W/2+m&&Math.abs(e.y-G.p.y)<H/2+m}
function spawnPt(x,y,col,n,sp){if(G.pt.length>300)return;for(let i=0;i<n;i++){const a=Math.random()*TAU,s=rand(40,200)*sp;G.pt.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.2,.5),r:rand(2,4),c:col})}}
function addDn(x,y,v,col){if(G.dn.length>45)return;G.dn.push({x:x+rand(-8,8),y:y-10,v:typeof v==='number'?Math.round(v):v,life:.7,c:col||'#fff'})}

// 自分の弾
function addP(o){
 const b={x:o.x,y:o.y,vx:o.vx!=null?o.vx:Math.cos(o.a)*o.sp,vy:o.vy!=null?o.vy:Math.sin(o.a)*o.sp,r:o.r,dmg:o.dmg,pi:o.pi||0,col:o.col,kind:o.kind,life:o.life||2,kb:o.kb||0,grav:o.grav||0,hit:new Set(),t:0,dead:false};
 G.pr.push(b);return b;
}

// 範囲攻撃
function hitCircle(x,y,r,dmg,kb){for(const e of G.en){if(e.dead)continue;if(d2(x,y,e.x,e.y)<(r+e.r)**2)dmgE(e,dmg,kb,x,y)}}
function hitCircleCD(x,y,r,dmg,kb,key,cd){for(const e of G.en){if(e.dead)continue;if(d2(x,y,e.x,e.y)<(r+e.r)**2){const lt=e.hc[key];if(lt!=null&&G.t-lt<cd)continue;e.hc[key]=G.t;dmgE(e,dmg,kb,x,y)}}}
function hitSector(x,y,R,a,half,dmg,kb){for(const e of G.en){if(e.dead)continue;const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy);if(d>R+e.r)continue;let da=Math.atan2(dy,dx)-a;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;if(Math.abs(da)<=half+Math.atan2(e.r,Math.max(d,1)))dmgE(e,dmg,kb,x,y)}}
function beam(x,y,a,len,wid,dmg,col,noFx){
 const ca=Math.cos(a),sa=Math.sin(a);
 for(const e of G.en){if(e.dead)continue;const rx=e.x-x,ry=e.y-y,pr=rx*ca+ry*sa,pp=Math.abs(-rx*sa+ry*ca);if(pr>-e.r&&pr<len+e.r&&pp<wid+e.r)dmgE(e,dmg,50,x,y)}
 if(!noFx)G.fx.push({k:'laser',x1:x,y1:y,x2:x+ca*len,y2:y+sa*len,w:wid,life:.2,max:.2,c:col});
}

// 敵へのダメージ
function dmgE(e,dmg,kb,sx,sy){
 if(e.dead)return;
 e.hp-=dmg;e.flash=.08;
 addDn(e.x,e.y-e.r,dmg,dmg>=G.p.dmg*4?'#ffd84a':'#ffffff');
 if(kb&&!e.boss){const res=e.t.kbRes||0;if(res<1){const ox=sx!=null?sx:G.p.x,oy=sy!=null?sy:G.p.y,dx=e.x-ox,dy=e.y-oy,d=Math.hypot(dx,dy)||1,f=kb*(1-res)*(e.giant||e.mid?.3:1);e.kx+=dx/d*f;e.ky+=dy/d*f}}
 if(e.hp<=0)killE(e);
}
function killE(e,noDrop){
 if(e.dead)return;e.dead=true;
 spawnPt(e.x,e.y,e.pal.a||e.pal.t||'#fff',e.boss?60:8,e.boss?1.2:.6);
 if(noDrop)return;
 G.kills++;
 const p=G.p;
 if(e.boss){
  G.boss=null;G.shake=24;G.flash=.6;
  for(const o of G.en)if(!o.dead&&o!==e){spawnPt(o.x,o.y,'#ffffff',4,.4);o.dead=true}
  G.ep=[];for(const o of G.or)o.mag=true;
  G.pend=2.2;showBanner('BOSS撃破！','#ffd84a');return;
 }
 const big=e.elite||e.giant||e.mid;
 p.sg=Math.min(100,p.sg+(big?12:1)*p.ch.sg*p.sgMul);
 dropGem(e.x,e.y,e.xp);
 if(chance(big?1:.16))dropGold(e.x,e.y,big?6+G.si*3:1+Math.floor(G.si/2));
 if(e.giant||e.mid||(e.elite&&chance(.6)))addItem('chest',e.x+rand(-10,10),e.y+rand(-10,10));
 rollItem(e.x,e.y,big?8:1);
 if(e.t.split)for(let i=0;i<e.t.splitN;i++){const ne=makeEnemy(e.t.split,e.x+rand(-20,20),e.y+rand(-20,20));if(ne){ne.kx=rand(-220,220);ne.ky=rand(-220,220)}}
}

// 自分へのダメージ
function hurtP(dmg){
 const p=G.p;if(p.inv>0||p.star>0||isSkill(p,'whirl')||isSkill(p,'sanct'))return;
 const v=Math.max(1,dmg-p.armor);p.hp-=v;p.inv=.6;p.hf=.2;G.shake=Math.min(14,G.shake+6);
 spawnPt(p.x,p.y,'#ff5566',8,.5);addDn(p.x,p.y-34,v,'#ff5a6a');
}

// ドロップ
function dropGem(x,y,v){
 if(G.or.length>=300){const o=pick(G.or);if(o.kind==='xp'){o.v+=v;return}}
 G.or.push({kind:'xp',x,y,v,vx:rand(-60,60),vy:rand(-60,60),mag:false});
}
function dropGold(x,y,v){G.or.push({kind:'gold',x,y,v,vx:rand(-90,90),vy:rand(-90,90),mag:false})}
function addItem(k,x,y){if(G.items.length>=40&&k!=='chest')return;G.items.push({k,x,y,t:Math.random()*6,mag:false})}
function rollItem(x,y,m){let r=Math.random();for(const[k,pr]of ITEM_RATE){r-=pr*m;if(r<0){addItem(k,x,y);return}}}

function applyItem(k){
 const p=G.p;
 switch(k){
  case 'food':p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.3);break;
  case 'magnet':for(const o of G.or)o.mag=true;for(const it of G.items)if(it.k!=='magnet')it.mag=true;G.flash=.15;break;
  case 'bomb':G.flash=.5;G.shake=20;G.fx.push({k:'ring',x:p.x,y:p.y,r:700,life:.45,max:.45,c:'#ffffff'});
   for(const e of G.en){if(e.dead||!onScreen(e,60))continue;dmgE(e,e.boss?e.maxHp*.04:(e.giant||e.mid)?e.maxHp*.3:e.hp+1,0)}break;
  case 'clock':G.freeze=6;G.ep=[];break;
  case 'star':p.star=6;break;
  case 'orb':p.sg=Math.min(100,p.sg+35);break;
  case 'chest':openChest();return;
 }
 addDn(p.x,p.y-56,ITEMS[k].n,'#ffe08a');
}
function openChest(){
 const p=G.p,n=chance(.15)?3:1,got=[];
 for(let i=0;i<n;i++){const c=p.weapons.filter(w=>w.lv<WEP[w.id].max);if(!c.length)break;const w=pick(c);w.lv++;got.push(`${WEP[w.id].n} Lv${w.lv}`)}
 const g=20+G.si*10;G.goldRun+=g;
 if(!got.length)p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.3);
 showBanner(got.length?'宝箱！ '+got.join(' / '):`宝箱！ +${g}G`,'#ffd84a');
}
