// ===== ドット絵スプライト（文字の地図 → 画像にしてキャッシュ） =====
// 文字: . 透明 / k 輪郭 / w 白 / それ以外はパレットの色
const SPR={};
function defSpr(n,rows){const w=Math.max(...rows.map(r=>r.length));SPR[n]={w,h:rows.length,rows:rows.map(r=>r.padEnd(w,'.'))}}
const OUTLINE='#0b0b14';
const sprCache=new Map();let palSeq=0;
function sprCanvas(n,pal,flash){
 if(!pal._id)Object.defineProperty(pal,'_id',{value:++palSeq});
 const key=n+'|'+pal._id+(flash?'f':'');let c=sprCache.get(key);if(c)return c;
 const s=SPR[n];c=document.createElement('canvas');c.width=s.w;c.height=s.h;const g=c.getContext('2d');
 for(let y=0;y<s.h;y++){const row=s.rows[y];for(let x=0;x<s.w;x++){
  const ch=row[x];if(ch==='.')continue;
  let col=ch==='k'?(pal.k||OUTLINE):ch==='w'?'#ffffff':(pal[ch]||'#ff00ff');
  if(flash)col=ch==='k'?'#ffb0b0':'#ffffff';
  g.fillStyle=col;g.fillRect(x,y,1,1);
 }}
 sprCache.set(key,c);return c;
}
function drawSpr(n,pal,x,y,sc,flip,flash,alpha,sy){
 const s=SPR[n],c=sprCanvas(n,pal,flash),w=s.w*sc,h=s.h*sc*(sy||1);
 const oa=ctx.globalAlpha;if(alpha!=null)ctx.globalAlpha=oa*alpha;
 if(flip){ctx.save();ctx.translate(x,y);ctx.scale(-1,1);ctx.drawImage(c,-w/2,-h/2,w,h);ctx.restore()}
 else ctx.drawImage(c,x-w/2,y-h/2,w,h);
 ctx.globalAlpha=oa;
}

// 人型（髪型で見た目を変える） s肌 h髪 e目 t服 p足 o靴 x帽子/角
const HUMAN=["....kkkk....","...khhhhk...","..khhhhhhk..","..khhhhhhk..","..ksessesk..","..kssssssk..","...kssssk...","..kttttttk..",".ksttttttsk.",".ksttttttsk.","..kttttttk..","..kppppppk..","..kpk..kpk..","..kok..kok.."];
function humanRows(sty){
 let r=HUMAN.slice();const set=(i,c,ch)=>{r[i]=r[i].slice(0,c)+ch+r[i].slice(c+1)};
 if(sty==='long'){for(let i=3;i<=8;i++){set(i,0,'k');set(i,1,'h');set(i,10,'h');set(i,11,'k')}}
 else if(sty==='spiky'){r[0]="..kk.kk.kk..";r[1]="..khkhhkhk..";r[2]=".khhhhhhhhk."}
 else if(sty==='hat'){r=["......kk....",".....kxxk...","....kxxxxk..","...kxxxxxxk.",".kkxxxxxxxxk","kxxxxxxxxxxk"].concat(r.slice(3))}
 else if(sty==='horn'){r=[".kx......xk.","..kx....xk.."].concat(r)}
 return r;
}
for(const s of['short','long','spiky','hat','horn'])defSpr('h_'+s,humanRows(s));

// スライム a本体 b影 c光 e目
defSpr('slime',["....kkkk....","..kkaaaakk..",".kaacaaaaak.",".kacaaaaaak.","kaaaaaaaaaak","kaaeaaaaeaak","kaaeaaaaeaak","kaaaaaaaaaak",".kbbbbbbbbk.","..kkkkkkkk.."]);
// コウモリ
defSpr('bat',["k....k..k....k","kk...kaak...kk","kak.kaaaak.kak","kaakaeaaeakaak","kaaaaaaaaaaaak",".kak.kaak.kak.","..k...kk...k.."]);
// ゴースト
defSpr('ghost',["...kkkkkk...","..kaaaaaak..",".kacaaaaaak.",".kaeeaaeeak.",".kaeeaaeeak.",".kaaaaaaaak.",".kaaakkaaak.",".kaaaaaaaak.",".kaaaaaaaak.",".kabaabaabk.",".kakkakkakk.","..k..k..k..."]);
// 目玉
defSpr('eye',["....kkkk....","..kkaaaakk..",".kaaaaaaaak.",".kaawwwwaak.","kaawwwwwwaak","kaawweewwaak","kaawweewwaak","kaawwwwwwaak",".kaawwwwaak.",".kaaaaaaaak.","..kkaaaakk..","....kkkk...."]);
// オオカミ（右向き）
defSpr('wolf',["...........k.k..","..........kakak.","k.........kaaaak","kk.kkkkkkkaaeaak",".kkaaaaaaaaaaaak","..kaaaaaaaaaakk.","..kabbbbbbbbak..","..kak..kak.kak..","..kk...kk..kk..."]);
// ゴーレム
defSpr('golem',["....kkkkkk....","...kaaaaaak...","...kaeaaeak...","...kaaaaaak...",".kkkbbbbbbkkk.","kaakaaaaaakaak","kaakacaacakaak","kaakaaaaaakaak","kaakaaaaaakaak",".kk.kbbbbk.kk.","....kaakaak...","...kaak.kaak..","...kkkk.kkkk.."]);
// 王冠
defSpr('crown',["k..kk..k","kakaakak","kaaaaaak","kkkkkkkk"]);
const CROWN_PAL={a:'#ffd84a'};

// アイテム
defSpr('i_meat',[".....kkk.","....kwwwk","..kkkwwk.",".kaaakk..","kaacaak..","kaaaaak..",".kaaak...","..kkk...."]);
defSpr('i_magnet',["kwk..kwk","kak..kak","kak..kak","kak..kak","kaakkaak",".kaaaak.","..kkkk.."]);
defSpr('i_bomb',[".....kw.","....k...","..kkkk..",".kaaaak.","kacaaaak","kaaaaaak",".kaaaak.","..kkkk.."]);
defSpr('i_clock',["..kkkk..",".kwwwwk.","kwwkwwwk","kwwkwwwk","kwwkkkwk","kwwwwwwk",".kwwwwk.","..kkkk.."]);
defSpr('i_star',["...kk...","..kaak..","kkkaakkk","kaaaaaak",".kaaaak.","..kaak..",".kakkak.",".kk..kk."]);
defSpr('i_chest',[".kkkkkkkk.","kaaaaaaaak","kaaaaaaaak","kkkkwwkkkk","kbbbwwbbbk","kbbbbbbbbk","kkkkkkkkkk"]);
