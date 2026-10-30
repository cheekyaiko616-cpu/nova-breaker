// ===== ドット絵の部品 =====
// 色の濃淡（5段階）、立体感、輪郭、歩きの動きをここで自動で付ける
const _rgb={};
function rgb(h){let c=_rgb[h];if(c)return c;const n=parseInt(h.slice(1),16);return _rgb[h]=[n>>16&255,n>>8&255,n&255]}
function hexc(r,g,b){return'#'+((1<<24)|(Math.round(r)<<16)|(Math.round(g)<<8)|Math.round(b)).toString(16).slice(1)}
function mixc(a,b,t){const A=rgb(a),B=rgb(b);return hexc(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t)}
const _ramp={};
// 0:いちばん暗い 1:影 2:ふつう 3:明るい 4:光の反射
function ramp(base){let r=_ramp[base];if(r)return r;return _ramp[base]=[mixc(base,'#140a28',.66),mixc(base,'#2a1a5a',.36),base,mixc(base,'#fff0c8',.34),mixc(base,'#ffffff',.74)]}

class PX{
 constructor(w,h){this.w=w;this.h=h;this.d=new Array(w*h).fill(null)}
 set(x,y,c){x=Math.floor(x);y=Math.floor(y);if(x>=0&&y>=0&&x<this.w&&y<this.h)this.d[y*this.w+x]=c}
 get(x,y){return x>=0&&y>=0&&x<this.w&&y<this.h?this.d[y*this.w+x]:null}
 rect(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)this.set(x+i,y+j,c)}
 // 角ばった物：左上が明るく、右下が暗い
 box(x,y,w,h,base){const R=ramp(base);for(let j=0;j<h;j++)for(let i=0;i<w;i++){let k=2;if(j===0||i===0)k=3;if(j===h-1||i===w-1)k=1;if(w>5&&i===w-2&&j>0)k=Math.min(k,1.5)|0||1;this.set(x+i,y+j,R[k])}}
 // 球のような立体の楕円
 ell(cx,cy,rx,ry,base,o){
  o=o||{};const R=ramp(base),lx=o.lx!=null?o.lx:-.55,ly=o.ly!=null?o.ly:-.65,lz=.5,ll=Math.hypot(lx,ly,lz),clip=o.clip;
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
   if(clip&&!clip(x,y))continue;
   const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry,q=nx*nx+ny*ny;if(q>1)continue;
   const l=(nx*lx+ny*ly+Math.sqrt(1-q)*lz)/ll;
   this.set(x,y,R[Math.max(o.min||0,l>.9?4:l>.62?3:l>.2?2:l>-.2?1:0)]);
  }
 }
 // 多角形（頂点の位置で明るさが変わる）
 poly(pts,base,o){
  o=o||{};const R=ramp(base);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const[x,y]of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
  const bw=x1-x0+1,bh=y1-y0+1;
  for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){
   let ins=false;const px=x+.5,py=y+.5;
   for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>py)!==(yj>py)&&px<(xj-xi)*(py-yi)/(yj-yi)+xi)ins=!ins}
   if(!ins)continue;
   const s=((px-x0)/bw)*.55+((py-y0)/bh)*.45;
   this.set(x,y,R[o.flat?2:s<.2?3:s<.7?2:1]);
  }
 }
 line(x0,y0,x1,y1,c,th){
  x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);th=th||1;
  const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
  for(;;){for(let a=0;a<th;a++)for(let b=0;b<th;b++)this.set(x0+a,y0+b,c);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}
 }
 // 別のPXを重ねる
 blit(o,ox,oy,flip){for(let y=0;y<o.h;y++)for(let x=0;x<o.w;x++){const c=o.d[y*o.w+x];if(c)this.set(ox+(flip?o.w-1-x:x),oy+y,c)}}
 // 2倍の細かさに拡大
 up2(){const n=new PX(this.w*2,this.h*2);for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){const c=this.d[y*this.w+x];if(c){n.set(x*2,y*2,c);n.set(x*2+1,y*2,c);n.set(x*2,y*2+1,c);n.set(x*2+1,y*2+1,c)}}return n}
}

// 輪郭を付けて画像にする（輪郭の色は隣の色を暗くしたもの）
function finishPX(px,o){
 o=o||{};const w=px.w+2,h=px.h+2,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');
 for(let y=0;y<px.h;y++)for(let x=0;x<px.w;x++){const c=px.d[y*px.w+x];if(c){g.fillStyle=c;g.fillRect(x+1,y+1,1,1)}}
 if(o.outline!==false)for(let y=-1;y<=px.h;y++)for(let x=-1;x<=px.w;x++){
  if(px.get(x,y))continue;
  const n=px.get(x-1,y)||px.get(x+1,y)||px.get(x,y-1)||px.get(x,y+1);
  if(n){g.fillStyle=o.outline||mixc(n,'#0a0612',.8);g.fillRect(x+1,y+1,1,1)}
 }
 return cv;
}

// スプライト（何コマかの画像のまとまり）
const SPRITES={};
function makeSprite(name,w,h,frames,draw,opts){
 const fr=[];for(let f=0;f<frames;f++){const px=new PX(w,h);draw(px,f);fr.push(finishPX(px,opts))}
 return SPRITES[name]={name,w:w+2,h:h+2,frames:fr,n:frames,flash:[]};
}
function flashOf(s,f){
 if(!s.flash[f]){const c=document.createElement('canvas');c.width=s.w;c.height=s.h;const g=c.getContext('2d');g.drawImage(s.frames[f],0,0);g.globalCompositeOperation='source-atop';g.fillStyle='#fff';g.fillRect(0,0,s.w,s.h);s.flash[f]=c}
 return s.flash[f];
}
// 中心を(x,y)に置いて描く
function drawSprite(s,f,x,y,sc,flip,flash,alpha,sx,sy){
 const img=flash?flashOf(s,f):s.frames[f],w=s.w*sc*(sx||1),h=s.h*sc*(sy||1),oa=ctx.globalAlpha;
 if(alpha!=null)ctx.globalAlpha=oa*alpha;
 if(flip){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(-1,1);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore()}
 else ctx.drawImage(img,Math.round(x-w/2),Math.round(y-h/2),w,h);
 ctx.globalAlpha=oa;
}
