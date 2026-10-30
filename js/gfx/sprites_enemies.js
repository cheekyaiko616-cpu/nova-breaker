// ===== 敵の絵 =====
// スライム・コウモリ・ゴースト・オオカミ・ゴーレム・目玉は専用の描き方、人型は doll を使う

// ---- スライム（ぷるぷる4コマ）----
function drawSlime(px,f,P){
 const ry=[7.5,6.4,7.8,8.6][f],rx=[9.6,10.6,9.4,8.6][f],cy=17-ry,B=P.a;
 if(P.spikes)for(let i=0;i<5;i++){const x=5+i*3;px.poly([[x,cy-ry+2],[x+1.5,cy-ry-3-(i%2)*2],[x+3,cy-ry+2]],mixc(B,'#ffffff',.55))}
 px.ell(11.5,cy,rx,ry,B,{clip:(x,y)=>y<=17});
 px.rect(3,17,17,1,ramp(B)[0]);
 if(P.core)px.ell(11.5,cy+1,3,3,P.core,{min:3});
 // つや
 px.rect(6,cy-ry+2,3,1,'#ffffff');px.rect(5,cy-ry+3,1,2,'#ffffff');
 // 目
 const ey=cy-1;for(const ex of[7.5,13.5]){px.rect(ex,ey,3,4,'#ffffff');px.rect(ex+1,ey+1,2,3,P.e||'#14101e');px.set(ex+1,ey+1,'#ffffff')}
 px.rect(10,ey+5,3,1,ramp(B)[0]);
 if(P.fuse){px.line(11,cy-ry+1,13,cy-ry-3,'#6a4a2a');const s=f%2?'#ffe45a':'#ff8a2a';px.rect(12,cy-ry-5,3,3,s);px.set(13,cy-ry-6,'#fff')}
 if(P.crown){px.poly([[6,cy-ry+1],[17,cy-ry+1],[17,cy-ry-4],[14,cy-ry-1],[11.5,cy-ry-5],[9,cy-ry-1],[6,cy-ry-4]],'#ffd84a');px.set(11,cy-ry-2,'#ff4a6a')}
}
// ---- コウモリ（羽ばたき4コマ）----
function drawBat(px,f,P){
 const ty=[0,5,11,5][f],my=[4,8,12,8][f],B=P.a;
 for(const s of[-1,1]){const X=x=>13+s*x;
  px.poly([[X(3),8],[X(12),ty],[X(13),ty+4],[X(10),my+2],[X(8),my+4],[X(6),my+3],[X(3),13]],mixc(B,'#000000',.15));
  px.line(X(3),9,X(12),ty+1,ramp(B)[3]);px.line(X(3),10,X(9),my+2,ramp(B)[1]);
 }
 px.ell(13,10,4,5,B);
 px.poly([[9,6],[10,1],[12,5]],B);px.poly([[17,6],[16,1],[14,5]],B);
 px.rect(10,8,2,2,P.e||'#ff4a6a');px.rect(15,8,2,2,P.e||'#ff4a6a');px.set(10,8,'#fff');px.set(15,8,'#fff');
 px.set(12,12,'#fff');px.set(14,12,'#fff');
}
// ---- ゴースト ----
function drawGhost(px,f,P){
 const B=P.a,R=ramp(B);
 px.ell(10.5,9,8.4,8.4,B,{clip:(x,y)=>y<=10});
 for(let x=2;x<=18;x++){const bot=20+Math.round(2*Math.sin(x*.95+f*1.57));for(let y=10;y<=bot;y++)px.set(x,y,x<=5?R[3]:x<=12?R[2]:R[1])}
 for(const s of[-1,1])px.ell(10.5+s*9.5,14+(f%2),2,3.2,B);
 if(P.hood){px.poly([[10.5,-1],[3,9],[18,9]],R[1]);px.ell(10.5,9,8.4,8.4,R[1],{clip:(x,y)=>y<=8});px.rect(6,9,10,6,'#0a0612')}
 const ey=P.hood?10:8;for(const ex of[6.5,12.5]){px.rect(ex,ey,3,4,'#0a0612');px.rect(ex,ey+1,2,2,P.e||'#bff')}
 if(!P.hood)px.rect(9,ey+6,3,3,'#0a0612');
}
// ---- 目玉 ----
function drawEye(px,f,P){
 const B=P.a,cx=13,cy=12;
 for(let i=0;i<5;i++){const x=6+i*3.5;for(let y=0;y<9;y++)px.set(x+Math.round(Math.sin(y*.9+f*1.6+i)*1.2),cy+7+y,i%2?ramp(B)[1]:ramp(B)[2])}
 px.ell(cx,cy,10,10,P.sclera||'#f4e4ea');
 for(const[x,y]of[[7,9],[8,8],[6,13],[7,14],[19,10],[20,11],[18,17],[17,18]])px.set(x,y,'#e05a6a');
 px.ell(cx,cy+1,5.5,5.5,B,{min:1});px.ell(cx,cy+1,2.5,3.6,'#0a0612',{min:0});
 px.rect(cx-4,cy-3,2,2,'#ffffff');px.set(cx+3,cy+3,'#ffffff');
 if(P.lids){px.rect(4,cy-10,20,4,ramp(B)[1])}
}
// ---- オオカミ（右向き・走り4コマ）----
function drawWolf(px,f,P){
 const B=P.a,R=ramp(B),L=[[0,4,-3,-1],[2,2,-1,-3],[4,0,1,-5],[2,2,-1,-3]][f];
 // 後ろ足・前足
 const leg=(x,o,dark)=>{px.box(x+o*.5,15,3,5,dark?R[1]:B);px.rect(x+o*.5,19,4,2,R[0])};
 leg(8,L[0]*.5,1);leg(22,L[1]*.5,1);
 px.poly([[3,10],[0,5+(f%2)*2],[2,4],[6,9]],B);
 px.ell(15,11,10.5,5.2,B);px.ell(15,14,8,2.4,R[3]);
 px.ell(25,8,5,4.4,B);px.poly([[26,7],[33,10],[32,13],[24,12]],B);px.rect(31,10,2,2,'#14101e');
 px.poly([[22,5],[22,0],[26,4]],B);px.poly([[24,5],[27,1],[28,5]],R[1]);
 px.rect(26,7,2,2,P.e||'#ffd84a');px.set(26,7,'#fff');
 px.rect(28,12,4,1,'#fff');
 leg(11,L[2]*.5,0);leg(19,L[3]*.5,0);
 if(P.spikes)for(let i=0;i<5;i++)px.poly([[8+i*3,6],[9.5+i*3,0+(i%2)*2],[11+i*3,6]],mixc(B,'#aaddff',.5));
 if(P.fire)for(let i=0;i<5;i++)px.rect(9+i*3,5+(i+f)%3-3,2,3,i%2?'#ff8a2a':'#ffe45a');
}
// ---- ゴーレム ----
function drawGolem(px,f,P){
 const B=P.a,R=ramp(B),sw=[0,1,0,-1][f],bob=(f%2)?-1:0,G=P.glow||'#ff8a2a';
 px.box(7,22,6,8,B);px.box(15,22,6,8,B);px.rect(7,28,6,2,R[0]);px.rect(15,28,6,2,R[0]);
 px.box(0,9+bob+sw,6,15,B);px.box(22,9+bob-sw,6,15,B);px.box(-1,21+bob+sw,8,6,R[2]);px.box(21,21+bob-sw,8,6,R[2]);
 px.box(5,8+bob,18,15,B);
 px.box(9,0+bob,10,9,B);
 px.rect(10,3+bob,3,2,G);px.rect(15,3+bob,3,2,G);px.rect(11,6+bob,6,1,R[0]);
 for(const[x1,y1,x2,y2]of[[8,12,12,17],[17,11,15,19],[11,19,16,21]])px.line(x1,y1+bob,x2,y2+bob,G);
 px.rect(12,14+bob,4,3,G);px.rect(13,15+bob,2,1,'#ffffff');
 px.rect(5,8+bob,4,3,R[3]);px.rect(19,8+bob,4,3,R[3]);
 if(P.ice)for(const[x,y]of[[8,6],[19,5],[3,9],[24,8]])px.poly([[x,y+3+bob],[x+1.5,y-4+bob],[x+3,y+3+bob]],'#dff6ff');
}
// ---- 人型の敵 ----
const ENEMY_DOLL={
 goblin:{skin:'#7ac050',hs:'none',ears:true,eye:'#ffe45a',top:'#8a5a2a',trim:'#4a3a1a',pants:'#5a4a2a',boots:'#2a1a0a',mouth:false,
  face(px,b){px.rect(12,14+b,2,2,ramp('#7ac050')[1]);px.rect(11,16+b,4,1,'#fff')},
  front(px,f,b,sw){const y=24+b-sw;px.rect(19,y-6,3,10,'#6a4a2a');px.ell(20.5,y-7,3.4,3.4,'#8a6a3a')}},
 skeleton:{skin:'#ece8d8',hs:'none',eye:'#14101e',noEyes:true,top:'#d8d4c0',trim:'#a8a490',pants:'#c8c4b0',boots:'#a8a490',sleeve:'#e0dcc8',mouth:false,blush:false,
  chest(px,b){for(let y=20;y<=25;y+=2)px.rect(9,y+b,8,1,'#8a8672');px.rect(12,19+b,2,7,'#a8a490')},
  face(px,b){px.rect(9,11+b,3,4,'#14101e');px.rect(15,11+b,3,4,'#14101e');px.rect(10,12+b,1,1,'#ff4a4a');px.rect(16,12+b,1,1,'#ff4a4a');px.rect(12,15+b,2,2,'#14101e');for(let x=10;x<=16;x+=2)px.rect(x,17+b,1,1,'#14101e')},
  front(px,f,b,sw){const y=24+b-sw;px.poly([[19,y+2],[25,y-12],[26,y-11],[21,y+3]],'#a8b0b8');px.rect(18,y+1,5,2,'#6a4a2a')}},
 archer:{skin:'#ece8d8',hs:'hood',hood:'#3a6a2a',eye:'#14101e',noEyes:true,top:'#4a7a3a',trim:'#2a4a1a',pants:'#3a5a2a',boots:'#1a2a0a',mouth:false,blush:false,
  face(px,b){px.rect(9,12+b,3,3,'#14101e');px.rect(15,12+b,3,3,'#14101e');px.rect(10,13+b,1,1,'#ff4a4a');px.rect(16,13+b,1,1,'#ff4a4a')},
  front(px,f,b,sw){const y=24+b-sw;for(let i=-8;i<=8;i++)px.set(22+Math.round(-i*i/22),y+i,'#8a5a2a');px.line(22,y-8,22,y+8,'#e8e8e8')}},
 zombie:{skin:'#8aa880',hair:'#3a3a2a',hs:'short',eye:'#ff3a3a',top:'#5a6a7a',trim:'#3a2a2a',pants:'#3a3a4a',boots:'#1a1a1a',blush:false,
  face(px,b){px.line(8,15+b,18,15+b,'#4a5a44');for(const x of[9,11,13,15,17])px.set(x,14+b,'#4a5a44')},
  front(px,f,b,sw){px.rect(20,24+b-sw,5,2,'#8aa880')}},
 necro:{skin:'#c0a8b8',hs:'hood',hood:'#2a1040',eye:'#ff4aff',glow:'#ff4aff',top:'#3a1858',trim:'#b04aff',pants:'#2a0a3a',boots:'#0a0a0a',cape:'#2a1040',blush:false,mouth:false,
  front(px,f,b,sw){const y=26+b-sw;px.rect(20,y-22,2,30,'#5a4a3a');px.ell(21,y-24,4,4.4,'#e8e4d4');px.rect(19,y-25,2,2,'#14101e');px.rect(22,y-25,2,2,'#14101e');px.rect(20,y-21,3,1,'#14101e')}},
 imp:{skin:'#e0604a',hair:'#3a0a0a',hs:'horn',horn:'#f0e0c0',eye:'#ffe04a',top:'#8a2a1a',trim:'#ffb02a',pants:'#5a1a0a',boots:'#2a0a0a',wings:'#a02a2a',ears:true,mouth:false,
  front(px,f,b,sw){const y=26+b-sw;px.line(19,y,24,y-9,'#4a2a1a');px.poly([[22,y-12],[26,y-12],[24,y-6]],'#ff4a2a')}},
 knight:{skin:'#8a8a9a',hair:'#6a6a7e',hs:'helm',plume:'#d83a3a',eye:'#ff2a2a',noEyes:true,top:'#5a5a6e',trim:'#c8a84a',pants:'#3a3a4a',boots:'#22222e',pads:'#8a8aa0',mouth:false,blush:false,
  face(px,b){px.rect(9,12+b,9,2,'#0a0612');px.rect(10,12+b,2,1,'#ff2a2a');px.rect(15,12+b,2,1,'#ff2a2a')},
  chest(px,b){px.rect(12,19+b,2,6,'#c8a84a');px.rect(10,22+b,6,1,'#c8a84a')},
  front(px,f,b,sw){const y=21+b+sw;px.poly([[0,y],[8,y],[8,y+9],[4,y+15],[0,y+9]],'#3a3a4a');px.poly([[1,y+1],[7,y+1],[7,y+8],[4,y+13],[1,y+8]],'#6a6a82');px.rect(3,y+3,2,6,'#d83a3a');
   px.poly([[19,y+4],[25,y-14],[27,y-13],[22,y+5]],'#c8d0dc');px.rect(18,y+3,6,2,'#c8a84a')}},
 demon:{skin:'#8a3ab8',hair:'#1a0a2a',hs:'horn',horn:'#e0d0a0',eye:'#ffe04a',top:'#4a1a6a',trim:'#ff4a4a',pants:'#2a0a3a',boots:'#0a0a0a',wings:'#3a1a5a',mouth:false,pads:'#6a2a8a',
  face(px,b){px.rect(10,15+b,6,1,'#fff');px.set(11,16+b,'#fff');px.set(14,16+b,'#fff')},
  front(px,f,b,sw){const y=24+b-sw;px.poly([[19,y+4],[23,y-8],[26,y-9],[25,y+1]],'#ff4a2a');px.rect(17,y+3,6,2,'#2a0a3a')}},
 frostmage:{skin:'#ffe0d0',hair:'#c8e8ff',hs:'hat',hat:'#4a8ad8',hatBand:'#dff6ff',eye:'#2a4aff',top:'#3a6ab8',trim:'#dff6ff',pants:'#2a3a6a',boots:'#14203a',cape:'#2a4a88',
  front(px,f,b,sw){const y=26+b-sw;px.rect(20,y-16,2,24,'#8ab0d8');px.poly([[18,y-16],[21,y-26],[24,y-16],[21,y-12]],'#bff4ff');px.rect(20,y-22,1,6,'#fff')}},
};
// 敵の人型は「none」の髪型を許す（何も描かない）
for(const id in ENEMY_DOLL)makeSprite('e_'+id,DW,DH,4,(px,f)=>doll(px,f,ENEMY_DOLL[id]));

const SLIMES={slime:{a:'#4cc06a'},bigslime:{a:'#3aa0c0',core:'#ffe45a'},bomber:{a:'#ff7a2a',fuse:1,e:'#14101e'},iceslime:{a:'#9ad8ff',spikes:1,core:'#ffffff'},icemini:{a:'#c8ecff'}};
for(const id in SLIMES)makeSprite('e_'+id,24,20,4,(px,f)=>drawSlime(px,f,SLIMES[id]));
const BATS={bat:{a:'#7a5ac8'},firebat:{a:'#e0502a',e:'#ffe04a'},icebat:{a:'#7ac8ff',e:'#ffffff'}};
for(const id in BATS)makeSprite('e_'+id,26,18,4,(px,f)=>drawBat(px,f,BATS[id]));
const GHOSTS={ghost:{a:'#d8e0ff',e:'#8aa8ff'},wraith:{a:'#6a4a9a',hood:1,e:'#ff4aff'}};
for(const id in GHOSTS)makeSprite('e_'+id,22,26,4,(px,f)=>drawGhost(px,f,GHOSTS[id]));
makeSprite('e_eye',26,30,4,(px,f)=>drawEye(px,f,{a:'#b02a6a'}));
const WOLVES={wolf:{a:'#8a8a9a'},icewolf:{a:'#dcecff',e:'#2a6aff'},salamander:{a:'#e05a2a',e:'#ffe04a',fire:1}};
for(const id in WOLVES)makeSprite('e_'+id,36,22,4,(px,f)=>drawWolf(px,f,WOLVES[id]));
const GOLEMS={magmagolem:{a:'#5a3a3a',glow:'#ff8a2a'},yeti:{a:'#e0ecff',glow:'#6ab0ff',ice:1}};
for(const id in GOLEMS)makeSprite('e_'+id,30,32,4,(px,f)=>drawGolem(px,f,GOLEMS[id]));

// ---- ボス（細かい絵で大きく）----
function bossDoll(P,pre,post){return(px,f)=>{pre&&pre(px,f);const d=new PX(DW,DH);doll(d,f,P);px.blit(d.up2(),2,14);post&&post(px,f)}}
const BOSS_ART={
 lich:{P:{skin:'#c0b0d0',hs:'hood',hood:'#2a1040',eye:'#ff4aff',glow:'#ff4aff',top:'#3a1858',trim:'#d08aff',pants:'#2a0a3a',boots:'#0a0a0a',blush:false,mouth:false,pads:'#5a2a8a'},
  pre(px,f){const s=[0,2,0,-2][f];px.poly([[14,40],[42,40],[52+s,96],[0+s,96]],'#2a1040');px.poly([[14,40],[42,40],[44,60],[12,60]],'#3a1858')},
  post(px,f){const b=(f%2)?-2:0;px.poly([[14,10+b],[17,0+b],[22,7+b],[28,-1+b],[34,7+b],[39,0+b],[42,10+b]],'#ffd84a');px.rect(26,6+b,4,3,'#ff4aff');
   px.rect(48,2,3,70,'#5a4a3a');px.ell(49,2,7,8,'#e8e4d4');px.rect(45,1,3,4,'#14101e');px.rect(50,1,3,4,'#14101e');px.rect(47,8,4,2,'#14101e');px.ell(49,2,10,10,'#b04aff',{clip:(x,y)=>(x+y)%7===0})}},
 maou:{P:{skin:'#a08090',hair:'#1a0a2a',hs:'horn',horn:'#e8d8a8',eye:'#ff2020',glow:'#ff2020',top:'#4a0a2a',trim:'#ffd84a',pants:'#2a0a1a',boots:'#0a0000',blush:false,mouth:false,pads:'#8a1a3a'},
  pre(px,f){const s=[0,3,0,3][f];px.poly([[18,34],[0,6+s],[2,52],[16,60]],'#3a0a2a');px.poly([[40,34],[58,6+s],[56,52],[42,60]],'#3a0a2a');px.poly([[18,34],[4,12+s],[10,46],[18,54]],'#6a1a3a');px.poly([[40,34],[54,12+s],[48,46],[40,54]],'#6a1a3a');px.poly([[14,40],[44,40],[56,96],[2,96]],'#7a0a2a')},
  post(px,f){const y=44-(f%2)*2;px.poly([[44,y+10],[52,y-30],[55,y-29],[50,y+12]],'#d0d8e8');px.rect(42,y+9,10,3,'#ffd84a');px.rect(45,y+12,3,8,'#4a2a1a');px.set(53,y-29,'#fff')}},
};
for(const id in BOSS_ART){const B=BOSS_ART[id];makeSprite('e_'+id,58,104,4,bossDoll(B.P,B.pre,B.post))}
makeSprite('e_kingslime',44,36,4,(px,f)=>{
 const ry=[13,11,14,15.5][f],rx=[19,21,18.5,17][f],cy=33-ry,B='#4cc06a';
 px.ell(22,cy,rx,ry,B,{clip:(x,y)=>y<=33});px.rect(4,33,36,2,ramp(B)[0]);
 for(const[x,y,c]of[[12,cy+2,'#ffd84a'],[28,cy+4,'#ff6a8a'],[20,cy+7,'#8ad8ff'],[31,cy-2,'#ffd84a']]){px.ell(x,y,2.5,2.5,c,{min:2})}
 px.rect(11,cy-ry+3,6,2,'#ffffff');px.rect(9,cy-ry+5,2,4,'#ffffff');
 for(const ex of[13,25]){px.rect(ex,cy-5,6,8,'#ffffff');px.rect(ex+2,cy-4,4,7,'#14101e');px.rect(ex+2,cy-4,2,2,'#ffffff')}
 px.rect(17,cy+6,8,2,ramp(B)[0]);px.rect(18,cy+7,6,1,'#ff6a8a');
 px.poly([[9,cy-ry+3],[34,cy-ry+3],[34,cy-ry-8],[28,cy-ry-3],[21.5,cy-ry-10],[15,cy-ry-3],[9,cy-ry-8]],'#ffd84a');px.rect(20,cy-ry-4,3,3,'#ff4a6a');px.rect(12,cy-ry-1,2,2,'#8ad8ff');px.rect(30,cy-ry-1,2,2,'#8ad8ff');
});
makeSprite('e_flamegolem',60,66,4,(px,f)=>{
 const d=new PX(30,32);drawGolem(d,f,{a:'#8a3a2a',glow:'#ffb02a'});const u=d.up2();px.blit(u,0,6);
 for(let i=0;i<9;i++){const x=14+i*4,h=7+((i*5+f*3)%7);px.poly([[x,26],[x+2,26-h],[x+4,26]],i%2?'#ff8a2a':'#ffd84a',{flat:1})}
});
makeSprite('e_fenrir',72,52,4,(px,f)=>{
 const d=new PX(36,22);drawWolf(d,f,{a:'#e8f4ff',e:'#2a6aff',spikes:1});px.blit(d.up2(),0,6);
 for(let i=0;i<6;i++){const x=16+i*7;px.poly([[x,18],[x+3,2+(i%2)*4],[x+6,18]],'#bff4ff',{flat:1})}
});
makeSprite('e_abyss',56,60,4,(px,f)=>{
 const B='#4a1a8a';
 for(let i=0;i<9;i++){const x=6+i*5;for(let y=0;y<24;y++)px.set(x+Math.round(Math.sin(y*.5+f*1.6+i*1.3)*3),32+y,i%2?ramp(B)[1]:ramp(B)[2])}
 px.ell(28,28,24,24,'#2a0a3a');
 px.ell(28,28,20,20,'#f4e4ea');for(const[x,y]of[[12,20],[14,18],[44,24],[42,22],[18,42],[38,44],[10,30],[46,34]]){px.line(x,y,28+(x-28)*.5,28+(y-28)*.5,'#d04a6a')}
 px.ell(28,29,11,11,'#8a1ab0',{min:1});px.ell(28,29,6,9,'#0a0612',{min:0});px.rect(20,21,4,4,'#fff');px.rect(33,35,2,2,'#fff');
 for(const[x,y]of[[8,8],[48,10],[6,40],[50,42]]){px.ell(x,y,4,4,'#f4e4ea');px.ell(x,y,2,2.5,'#ff2a6a');px.set(x-1,y-1,'#fff')}
});
