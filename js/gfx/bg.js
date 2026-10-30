// ===== ステージ背景（ドット絵の地面・飾り・舞う粒・周辺の暗がり） =====
const BG={};
function rng(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
// 32x32の地面タイル（4種）。2倍に拡大して使う
function makeTiles(stg,key){
 const b=stg.bg,out=[];
 for(let v=0;v<4;v++){
  const px=new PX(32,32),r=rng(key*131+v*17+7);
  px.rect(0,0,32,32,b[0]);
  // 濃淡のむら
  for(let i=0;i<9;i++){const cx=r()*32,cy=r()*32,rx=3+r()*7,ry=2+r()*5;for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if(x*x/(rx*rx)+y*y/(ry*ry)<=1)for(const ox of[0,32,-32])for(const oy of[0,32,-32])px.set(cx+x+ox,cy+y+oy,i%3?b[1]:mixc(b[0],b[2],.12))}
  // 細かい点
  for(let i=0;i<26;i++)px.set(r()*32,r()*32,i%4?b[3]:mixc(b[3],'#ffffff',.18));
  // ステージごとの模様
  const d=stg.deco;
  if(d==='grass')for(let i=0;i<6;i++){const x=r()*30|0,y=r()*28|0;px.set(x,y+2,b[2]);px.set(x,y+1,mixc(b[2],'#ffffff',.2));px.set(x+1,y+2,b[2])}
  else if(d==='grave')for(let i=0;i<3;i++){const x=r()*26|0,y=r()*30|0;px.rect(x,y,3+r()*4|0,1,mixc(b[0],'#000000',.3))}
  else if(d==='lava'){for(let i=0;i<2;i++){let x=r()*32,y=r()*32;for(let k=0;k<9;k++){px.set(x,y,'#ff7a2a');px.set(x+1,y,'#8a2a14');x+=r()*3-1;y+=r()*2.2}}}
  else if(d==='ice')for(let i=0;i<3;i++){const x=r()*28|0,y=r()*30|0;px.line(x,y,x+3,y+1,mixc(b[2],'#ffffff',.3))}
  else if(d==='brick'){px.rect(0,0,32,1,mixc(b[0],'#000',.45));px.rect(0,16,32,1,mixc(b[0],'#000',.45));px.rect(v%2?10:22,0,1,16,mixc(b[0],'#000',.45));px.rect(v%2?22:10,16,1,16,mixc(b[0],'#000',.45));px.rect(1,1,30,1,mixc(b[0],'#fff',.05));px.rect(1,17,30,1,mixc(b[0],'#fff',.05))}
  else if(d==='void')for(let i=0;i<2;i++){const x=r()*28|0,y=r()*28|0;px.set(x,y,'#9a6aff');px.set(x+1,y,b[2])}
  const cv=document.createElement('canvas');cv.width=cv.height=32;const g=cv.getContext('2d');
  for(let y=0;y<32;y++)for(let x=0;x<32;x++){const c=px.d[y*32+x];if(c){g.fillStyle=c;g.fillRect(x,y,1,1)}}
  out.push(cv);
 }
 return out;
}
// 飾り（地面にあるもの）3種
const PROP_ART={
 grass:[
  px=>{px.ell(8,7,7,6,'#2f7a3a');px.ell(6,5,3,2.4,'#58b05a',{min:3});px.rect(7,12,2,3,'#5a3a1a')}, // 木の茂み
  px=>{px.rect(3,6,1,6,'#3a8a3a');px.rect(6,3,1,9,'#4aa04a');px.rect(9,7,1,5,'#3a8a3a');for(const[x,y,c]of[[3,5,'#ff6a8a'],[6,2,'#ffe45a'],[9,6,'#ffffff']])px.rect(x-1,y,3,3,c),px.set(x,y+1,'#ffb02a')},
  px=>{px.ell(8,9,5,3.6,'#8a8a96');px.ell(6,8,2,1.5,'#b8b8c4',{min:3})}],
 grave:[
  px=>{px.box(3,2,10,12,'#8a869a');px.ell(8,3,5,3,'#8a869a');px.rect(7,4,2,6,'#3a384a');px.rect(5,6,6,2,'#3a384a');px.rect(1,13,14,2,'#4a4658')},
  px=>{px.rect(7,2,2,13,'#4a3a3a');px.line(8,6,3,2,'#4a3a3a');px.line(8,8,13,3,'#4a3a3a');px.line(8,10,4,8,'#4a3a3a')},
  px=>{px.ell(6,9,3.5,3,'#e0dcc8');px.rect(5,10,1,1,'#14101e');px.rect(8,10,1,1,'#14101e');px.rect(8,12,6,1,'#e0dcc8');px.rect(11,10,1,3,'#e0dcc8')}],
 lava:[
  px=>{px.ell(8,8,7,5,'#c84a1a');px.ell(8,8,5,3.4,'#ff8a2a');px.ell(7,7,2.4,1.6,'#ffd84a')},
  px=>{px.poly([[2,14],[5,4],[9,9],[12,2],[15,14]],'#3a2220');px.line(5,6,6,12,'#ff7a2a')},
  px=>{px.ell(8,10,5,4,'#4a2a26');px.rect(6,9,3,1,'#ff7a2a')}],
 ice:[
  px=>{px.poly([[2,15],[6,3],[8,15]],'#bfe8ff');px.poly([[7,15],[11,0],[14,15]],'#8ac8f0');px.rect(10,4,1,8,'#ffffff')},
  px=>{px.ell(8,10,6,4,'#e8f4ff');px.ell(6,9,2.6,1.8,'#ffffff',{min:3})},
  px=>{px.rect(3,8,10,2,'#9ac8e8');px.rect(7,3,2,12,'#9ac8e8');px.line(4,5,12,13,'#bfe8ff');px.line(12,5,4,13,'#bfe8ff')}],
 brick:[
  px=>{px.box(4,2,8,13,'#6a3050');px.rect(3,2,10,2,'#8a4a6a');px.rect(3,13,10,2,'#8a4a6a')},
  px=>{px.rect(7,0,2,6,'#3a2a3a');px.rect(5,5,6,3,'#ff9a3a');px.rect(6,4,4,2,'#ffe45a')},
  px=>{px.poly([[1,14],[4,8],[8,10],[11,5],[15,14]],'#5a3048');px.set(6,9,'#7a4a68')}],
 void:[
  px=>{px.poly([[8,0],[13,8],[8,16],[3,8]],'#8a4aff');px.poly([[8,0],[8,16],[3,8]],'#b98aff');px.rect(7,6,2,2,'#fff')},
  px=>{px.ell(8,8,6,6,'#1a1030');px.ell(8,8,6,6,'#5a2a9a',{clip:(x,y)=>(x+y)%2===0&&(x-8)*(x-8)+(y-8)*(y-8)>30});px.set(8,8,'#fff')},
  px=>{px.ell(8,9,4,3,'#3a2a5a');px.line(4,9,1,5,'#8a4aff');px.line(12,9,15,5,'#8a4aff')}],
};
function buildBg(si){
 if(BG[si])return BG[si];const stg=STAGES[si],o=BG[si]={tiles:makeTiles(stg,si+1),props:[]};
 (PROP_ART[stg.deco]||[]).forEach((f,i)=>{const px=new PX(16,16);f(px);o.props.push(finishPX(px))});
 // 舞う粒（ステージごとの色）
 const pc={grass:['#ffffa0','#b8ff9a'],grave:['#b8b8ff','#ffffff'],lava:['#ff9a3a','#ffd84a'],ice:['#ffffff','#bfe8ff'],brick:['#ffb870','#8a6a6a'],void:['#c8a0ff','#7a4aff']}[stg.deco]||['#fff','#fff'];
 o.pc=pc;o.mote=Array.from({length:42},(_,i)=>({x:Math.random()*W,y:Math.random()*H,z:.3+Math.random()*.9,ph:Math.random()*6.28,c:pc[i%2]}));
 return o;
}
let _vig=null;
function vignette(){
 if(_vig)return _vig;const c=document.createElement('canvas');c.width=W/4;c.height=H/4;const g=c.getContext('2d');
 const gr=g.createRadialGradient(c.width/2,c.height/2,c.height*.45,c.width/2,c.height/2,c.width*.62);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.62)');g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);return _vig=c;
}
function drawBg(stg,cx,cy){
 const si=STAGES.indexOf(stg),B=buildBg(si),gs=64,x0=Math.floor(cx/gs),y0=Math.floor(cy/gs),nx=Math.ceil(W/gs)+1,ny=Math.ceil(H/gs)+1;
 ctx.imageSmoothingEnabled=false;
 for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++){
  const gx=x0+i,gy=y0+j,h=hash2(gx,gy),sx=Math.round(gx*gs-cx),sy=Math.round(gy*gs-cy);
  ctx.drawImage(B.tiles[Math.floor(h*4)%4],sx,sy,gs,gs);
 }
 for(let i=-1;i<=nx;i++)for(let j=-1;j<=ny;j++){
  const gx=x0+i,gy=y0+j,h=hash2(gx*3+1,gy*5+2);
  if(h>.74){const k=Math.floor(hash2(gy,gx)*3),im=B.props[k];if(!im)continue;const sx=Math.round(gx*gs-cx+hash2(gx+9,gy)*40),sy=Math.round(gy*gs-cy+hash2(gx,gy+9)*40),sc=2+(h>.93?1:0);
   ctx.globalAlpha=.3;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx+im.width*sc/2,sy+im.height*sc-4,im.width*sc*.34,5,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
   ctx.drawImage(im,sx,sy,im.width*sc,im.height*sc)}
 }
}
// 画面の手前に舞う粒と暗がり（最後に描く）
function drawBgFront(stg,cx,cy){
 const B=buildBg(STAGES.indexOf(stg)),t=G.anim||performance.now()/1000,d=stg.deco;
 additive(true);
 for(const m of B.mote){
  let x=m.x,y=m.y;
  if(d==='ice'){y=(m.y+t*60*m.z)%H;x=(m.x+Math.sin(t+m.ph)*30)%W}
  else if(d==='lava'){y=H-((H-m.y)+t*70*m.z)%H;x=(m.x+Math.sin(t*2+m.ph)*18)%W}
  else{x=(m.x+Math.sin(t*.6+m.ph)*50+t*8*m.z)%W;y=(m.y+Math.cos(t*.5+m.ph)*35)%H}
  x=((x-cx*.35*m.z)%W+W)%W;y=((y-cy*.35*m.z)%H+H)%H;
  const a=(.35+.35*Math.sin(t*2+m.ph))*(.5+m.z*.5);glow(x,y,6+m.z*7,m.c,a);
 }
 additive(false);ctx.globalAlpha=1;
 ctx.drawImage(vignette(),0,0,W,H);
}
