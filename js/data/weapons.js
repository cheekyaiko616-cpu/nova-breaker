// ===== 武器 =====
// main:1 はキャラ専用武器（レベルアップで新規入手は出ない）
const isSkill=(p,id)=>p.skill&&p.skill.id===id;
const pD=p=>p.dmg*(isSkill(p,'overdrive')?1.5:1);
const pCD=(p,b)=>b*p.cdMul*(isSkill(p,'overdrive')?.33:1);
function cool(w,dt){w.t-=dt;return w.t<=0}

const WEP={
 // ---------- キャラ専用 ----------
 blaster:{n:'ブラスター',c:'#7fd1ff',ic:'光',main:1,max:8,d:'近くの敵に光弾を連射',
  lv:l=>`${1+Math.floor(l/3)}発 ・ 威力${100+25*(l-1)}%${l>=5?' ・ 貫通':''}`,
  tick(p,w,dt){if(!cool(w,dt))return;const t=nearestE(p.x,p.y,560);if(!t){w.t=.05;return}
   w.t=pCD(p,Math.max(.2,.5-.035*w.lv));const a=Math.atan2(t.y-p.y,t.x-p.x),n=1+Math.floor(w.lv/3);
   for(let i=0;i<n;i++)addP({x:p.x,y:p.y-8,a:a+(i-(n-1)/2)*.12,sp:800,r:7,dmg:pD(p)*(1+.25*(w.lv-1)),pi:w.lv>=5?1:0,col:'#7fd1ff',kind:'bolt',life:.75,kb:60})}},
 slash:{n:'ツインブレード',c:'#ffb05a',ic:'刃',main:1,max:8,d:'目の前を広く斬り払う（近距離・高威力）',
  lv:l=>`範囲${110+8*l} ・ 威力${150+30*(l-1)}%${l>=4?' ・ 後ろも斬る':''}`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(.3,.6-.03*w.lv));const R=(110+8*w.lv)*p.area,t=nearestE(p.x,p.y,R+140);
   const a=t?Math.atan2(t.y-p.y,t.x-p.x):Math.atan2(p.diry,p.dirx),half=1.1+.04*w.lv,dirs=w.lv>=4?[a,a+Math.PI]:[a];
   for(const da of dirs){hitSector(p.x,p.y,R,da,half,pD(p)*(1.5+.3*(w.lv-1)),260);G.fx.push({k:'arc',x:p.x,y:p.y,r:R,a:da,w:half,life:.26,max:.26,c:'#ffa84a'});sparks(p.x+Math.cos(da)*R*.8,p.y+Math.sin(da)*R*.8,'#ffe0a0',6,da,.8)}}},
 shield:{n:'ガーディアン',c:'#c8d8ff',ic:'盾',main:1,max:8,d:'自分の周りを盾が回り、敵を弾き飛ばす',
  lv:l=>`${2+Math.floor((l-1)/2)}枚 ・ 威力${90+25*(l-1)}%`,
  tick(p,w,dt){w.a+=dt*3.4;const n=2+Math.floor((w.lv-1)/2),R=(82+3*w.lv)*p.area,dmg=pD(p)*(.9+.25*(w.lv-1));
   for(let i=0;i<n;i++){const a=w.a+i/n*TAU;hitCircleCD(p.x+Math.cos(a)*R,p.y+Math.sin(a)*R,(18+w.lv)*p.area,dmg,340,'sh',.35)}},
  draw(p,w){const n=2+Math.floor((w.lv-1)/2),R=(82+3*w.lv)*p.area,s=(18+w.lv)*p.area;
   additive(true);ctx.globalAlpha=.18;ctx.strokeStyle='#c8d8ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.stroke();additive(false);
   for(let i=0;i<n;i++){const a=w.a+i/n*TAU,x=p.x+Math.cos(a)*R,y=p.y+Math.sin(a)*R;
    additive(true);for(let k=1;k<=5;k++){const a2=a-k*.1;glow(p.x+Math.cos(a2)*R,p.y+Math.sin(a2)*R,s*(1.1-k*.12),'#8ab0ff',.45-k*.07)}glow(x,y,s*2.2,'#c8d8ff',.6);additive(false);
    ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);ctx.globalAlpha=1;
    ctx.fillStyle='#0b0b14';ctx.beginPath();ctx.moveTo(-s*.85,-s*.7);ctx.lineTo(s*.85,-s*.7);ctx.lineTo(s*.85,s*.3);ctx.lineTo(0,s*1.15);ctx.lineTo(-s*.85,s*.3);ctx.closePath();ctx.fill();
    ctx.fillStyle='#4a78ff';ctx.beginPath();ctx.moveTo(-s*.7,-s*.58);ctx.lineTo(s*.7,-s*.58);ctx.lineTo(s*.7,s*.25);ctx.lineTo(0,s*.98);ctx.lineTo(-s*.7,s*.25);ctx.closePath();ctx.fill();
    ctx.fillStyle='#bcd4ff';ctx.beginPath();ctx.moveTo(-s*.7,-s*.58);ctx.lineTo(0,-s*.58);ctx.lineTo(0,s*.98);ctx.lineTo(-s*.7,s*.25);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffd84a';ctx.fillRect(-s*.12,-s*.45,s*.24,s*1.0);ctx.fillRect(-s*.4,-s*.1,s*.8,s*.24);ctx.restore()}}},
 snipe:{n:'スナイプレーザー',c:'#5ce0ff',ic:'狙',main:1,max:8,d:'画面の端まで届く貫通レーザーで強い敵を狙う',
  lv:l=>`射程1100 ・ 威力${230+45*(l-1)}%${l>=3?' ・ '+(1+(l>=3)+(l>=6))+'本':''}`,
  tick(p,w,dt){if(!cool(w,dt))return;const cs=G.en.filter(e=>!e.dead&&d2(p.x,p.y,e.x,e.y)<1100*1100).sort((a,b)=>b.hp-a.hp);
   if(!cs.length){w.t=.05;return}w.t=pCD(p,Math.max(.45,.9-.05*w.lv));const n=1+(w.lv>=3?1:0)+(w.lv>=6?1:0)+(w.lv>=11?1:0);
   for(let i=0;i<n&&i<cs.length;i++){const t=cs[i],a=Math.atan2(t.y-p.y,t.x-p.x);beam(p.x,p.y-6,a,1150,(10+2*w.lv)*p.area,pD(p)*(2.3+.45*(w.lv-1)),'#5ce0ff')}}},
 chain:{n:'チェインボルト',c:'#ffe45a',ic:'雷',main:1,max:8,d:'雷が敵から敵へ次々と連鎖する',
  lv:l=>`連鎖${3+Math.floor(l/2)}体 ・ 威力${115+28*(l-1)}%`,
  tick(p,w,dt){if(!cool(w,dt))return;let t=nearestE(p.x,p.y,440);if(!t){w.t=.05;return}w.t=pCD(p,Math.max(.4,.9-.06*w.lv));
   let dmg=pD(p)*(1.15+.28*(w.lv-1)),px=p.x,py=p.y-10;const hit=new Set(),n=3+Math.floor(w.lv/2);
   for(let i=0;i<n&&t;i++){hit.add(t.id);G.fx.push({k:'zap',x1:px,y1:py,x2:t.x,y2:t.y,life:.16,max:.16,c:'#ffe45a'});px=t.x;py=t.y;dmgE(t,dmg,40,px,py);dmg*=.92;t=nearestWhere(px,py,250,e=>!hit.has(e.id))}}},
 familiar:{n:'使い魔',c:'#9aff7a',ic:'魔',main:1,max:8,d:'周りを飛ぶ使い魔が追尾弾を撃つ',
  lv:l=>`${1+Math.floor((l+1)/3)}体 ・ 威力${100+25*(l-1)}%`,
  tick(p,w,dt){w.a+=dt*2;const leg=isSkill(p,'legion'),n=1+Math.floor((w.lv+1)/3)+(leg?4:0);w.fs=w.fs||[];
   while(w.fs.length<n)w.fs.push({t:Math.random()*.4,x:p.x,y:p.y});w.fs.length=n;
   const cd=pCD(p,Math.max(.45,1.05-.06*w.lv))*(leg?.55:1);
   for(let i=0;i<n;i++){const f=w.fs[i],a=w.a+i/n*TAU;f.x=p.x+Math.cos(a)*(leg?75:55);f.y=p.y-14+Math.sin(a)*(leg?45:32);f.t-=dt;
    if(f.t<=0){const t=nearestE(f.x,f.y,650);if(t){f.t=cd;addP({x:f.x,y:f.y,a:Math.atan2(t.y-f.y,t.x-f.x)+rand(-.4,.4),sp:430,r:7,dmg:pD(p)*(1+.25*(w.lv-1)),col:'#9aff7a',kind:'homing',life:1.6,kb:40})}else f.t=.1}}},
  draw(p,w){if(!w.fs)return;for(const f of w.fs){const t=G.anim*8+f.x*.01,by=Math.sin(t)*3;
   additive(true);glow(f.x,f.y+by,32,'#7aff9a',.7);additive(false);ctx.globalAlpha=1;
   ctx.fillStyle='#0b0b14';ctx.beginPath();ctx.arc(f.x,f.y+by,11,0,TAU);ctx.fill();ctx.fillStyle='#9aff7a';ctx.beginPath();ctx.arc(f.x,f.y+by,9,0,TAU);ctx.fill();ctx.fillStyle='#d8ffc8';ctx.beginPath();ctx.arc(f.x-2,f.y+by-3,4.5,0,TAU);ctx.fill();
   ctx.fillStyle='#0b0b14';ctx.fillRect(f.x-5,f.y+by-1,3,4);ctx.fillRect(f.x+2,f.y+by-1,3,4);
   const wf=Math.sin(t*2)*4;ctx.fillStyle='#e8fff0cc';ctx.beginPath();ctx.ellipse(f.x-13,f.y+by-5,8,4+wf*.3,-.5,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(f.x+13,f.y+by-5,8,4+wf*.3,.5,0,TAU);ctx.fill()}}},

 // ---------- 共通（レベルアップで入手） ----------
 knife:{n:'ナイフ',c:'#e0e8ff',ic:'ナ',max:8,d:'移動している方向へ高速のナイフ',
  lv:l=>`${1+Math.floor(l/2)}本 ・ 貫通${Math.floor(l/4)}`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(.22,.7-.05*w.lv));const a=Math.atan2(p.diry,p.dirx),n=1+Math.floor(w.lv/2);
   for(let i=0;i<n;i++){const off=(i-(n-1)/2)*14;addP({x:p.x-Math.sin(a)*off,y:p.y-8+Math.cos(a)*off,a,sp:950,r:6,dmg:pD(p)*(.7+.18*w.lv),pi:Math.floor(w.lv/4),col:'#e0e8ff',kind:'knife',life:.6,kb:30})}}},
 axe:{n:'アックス',c:'#ff8a5a',ic:'斧',max:8,d:'上に投げる重い斧。敵を貫通する',
  lv:l=>`${1+Math.floor(l/3)}本 ・ 威力${175+35*l}%`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(.7,1.6-.1*w.lv));const n=1+Math.floor(w.lv/3);
   for(let i=0;i<n;i++)addP({x:p.x,y:p.y-10,vx:rand(-240,240),vy:-rand(640,780),grav:1400,r:15*p.area,dmg:pD(p)*(1.75+.35*w.lv),pi:99,col:'#ff8a5a',kind:'axe',life:2,kb:120})}},
 boomerang:{n:'ブーメラン',c:'#ffc04a',ic:'ブ',max:8,d:'敵を貫いて戻ってくる',
  lv:l=>`${1+Math.floor(l/3)}個 ・ 威力${140+35*l}%`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(.8,1.7-.1*w.lv));const t=nearestE(p.x,p.y,600),a=t?Math.atan2(t.y-p.y,t.x-p.x):Math.atan2(p.diry,p.dirx),n=1+Math.floor(w.lv/3);
   for(let i=0;i<n;i++)addP({x:p.x,y:p.y,a:a+(i-(n-1)/2)*.35,sp:620,r:13*p.area,dmg:pD(p)*(1.4+.35*w.lv),pi:99,col:'#ffc04a',kind:'boomerang',life:3,kb:80})}},
 aura:{n:'オーラ',c:'#ff5aa0',ic:'気',max:8,d:'自分の周りの敵に継続ダメージ',
  lv:l=>`半径${60+9*l} ・ 威力${35+12*l}%`,
  tick(p,w,dt){hitCircleCD(p.x,p.y,(60+9*w.lv)*p.area,pD(p)*(.35+.12*w.lv),60,'au',.5)},
  draw(p,w){const R=(60+9*w.lv)*p.area,t=G.anim;
   ctx.globalAlpha=.16+Math.sin(t*3)*.04;ctx.fillStyle='#ff3a8a';ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.fill();
   additive(true);for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;ctx.globalAlpha=.7*(1-ph);ctx.strokeStyle='#ff7ab8';ctx.lineWidth=4*(1-ph)+1;ctx.beginPath();ctx.arc(p.x,p.y,R*(.35+ph*.65),0,TAU);ctx.stroke()}
   ctx.globalAlpha=.8;ctx.strokeStyle='#ffb0d8';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,R,0,TAU);ctx.stroke();
   for(let i=0;i<8;i++){const a=t*1.5+i*TAU/8,rr=R*(.8+.2*Math.sin(t*4+i));glow(p.x+Math.cos(a)*rr,p.y+Math.sin(a)*rr,14,'#ff6aa8',.8)}additive(false);ctx.globalAlpha=1}},
 holy:{n:'聖水',c:'#5ab0ff',ic:'水',max:8,d:'敵の足元にダメージを与える水たまりを作る',
  lv:l=>`${1+Math.floor(l/3)}か所 ・ 半径${50+5*l}`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(1.6,3.2-.15*w.lv));const n=1+Math.floor(w.lv/3);
   for(let i=0;i<n;i++){const cs=G.en.filter(e=>!e.dead&&d2(p.x,p.y,e.x,e.y)<380*380),t=cs.length?pick(cs):null;
    const x=t?t.x:p.x+rand(-200,200),y=t?t.y:p.y+rand(-150,150),life=2+.2*w.lv;
    G.zones.push({x,y,r:(50+5*w.lv)*p.area,life,max:life,dmg:pD(p)*(.45+.12*w.lv)})}}},
 thunder:{n:'サンダー',c:'#ffdd44',ic:'轟',max:8,d:'ランダムな敵に落雷',
  lv:l=>`${1+Math.floor((l-1)/2)}発 ・ 威力${160+40*l}%`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(.7,1.5-.09*w.lv));const n=1+Math.floor((w.lv-1)/2),dmg=pD(p)*(1.6+.4*w.lv);
   const cs=G.en.filter(e=>!e.dead&&d2(p.x,p.y,e.x,e.y)<520*520);
   for(let i=0;i<n&&cs.length;i++){const e=cs.splice(Math.floor(Math.random()*cs.length),1)[0];hitCircle(e.x,e.y,62*p.area,dmg,90);G.fx.push({k:'bolt',x:e.x,y:e.y,life:.3,max:.3});ringFx(e.x,e.y,90*p.area,'#ffe45a',.35,6);sparks(e.x,e.y,'#fff3a0',10);spawnPt(e.x,e.y,'#ffdd44',8,.7);G.shake=Math.min(8,G.shake+2)}}},
 orb:{n:'ホーリーオーブ',c:'#b06aff',ic:'珠',max:8,d:'大きな円を描いて回る光の玉',
  lv:l=>`${1+Math.floor((l-1)/2)}個 ・ 威力${100+30*l}%`,
  tick(p,w,dt){w.a+=dt*2.3;const n=1+Math.floor((w.lv-1)/2),R=(125+5*w.lv)*p.area,dmg=pD(p)*(1+.3*w.lv);
   for(let i=0;i<n;i++){const a=w.a+i/n*TAU;hitCircleCD(p.x+Math.cos(a)*R,p.y+Math.sin(a)*R,16*p.area,dmg,150,'ob',.45)}},
  draw(p,w){const n=1+Math.floor((w.lv-1)/2),R=(125+5*w.lv)*p.area;additive(true);
   for(let i=0;i<n;i++){const a=w.a+i/n*TAU,x=p.x+Math.cos(a)*R,y=p.y+Math.sin(a)*R;
    for(let k=1;k<=8;k++){const a2=a-k*.075;glow(p.x+Math.cos(a2)*R,p.y+Math.sin(a2)*R,(24-k*2)*p.area,'#9a5aff',.5-k*.05)}
    glow(x,y,46*p.area,'#b06aff',.8);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,9*p.area,0,TAU);ctx.fill()}
   additive(false);ctx.globalAlpha=1}},
 missile:{n:'ミサイル',c:'#5aff8a',ic:'弾',max:8,d:'敵を追いかけるミサイル',
  lv:l=>`${1+Math.floor((l-1)/2)}発 ・ 威力${130+35*l}%`,
  tick(p,w,dt){if(!cool(w,dt))return;w.t=pCD(p,Math.max(.6,1.35-.08*w.lv));const n=1+Math.floor((w.lv-1)/2);
   for(let i=0;i<n;i++)addP({x:p.x,y:p.y,a:Math.random()*TAU,sp:240,r:8,dmg:pD(p)*(1.3+.35*w.lv),col:'#5aff8a',kind:'missile',life:2.2,kb:70})}},
 spread:{n:'ショットガン',c:'#ff9a5a',ic:'散',max:8,d:'近くの敵へ扇状に散弾',
  lv:l=>`${3+l}発 ・ 威力${55+12*l}%`,
  tick(p,w,dt){if(!cool(w,dt))return;const t=nearestE(p.x,p.y,430);if(!t){w.t=.05;return}w.t=pCD(p,Math.max(.45,1-.06*w.lv));
   const a=Math.atan2(t.y-p.y,t.x-p.x),n=3+w.lv;for(let i=0;i<n;i++)addP({x:p.x,y:p.y-6,a:a+(i/(n-1)-.5)*.9,sp:rand(620,720),r:6,dmg:pD(p)*(.55+.12*w.lv),col:'#ff9a5a',kind:'pellet',life:.5,kb:90})}},
};
const SUBS=['knife','axe','boomerang','aura','holy','thunder','orb','missile','spread'];
const MAX_WEAPONS=5;
