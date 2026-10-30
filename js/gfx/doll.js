// ===== 人型キャラの描き方（髪型・服・持ち物を変えて、キャラも敵も作る） =====
// 画像の大きさは 26x37。足は4コマで歩く
const DW=26,DH=37;
function dollHairBack(px,P,bob){
 if(P.hs==='long')px.box(6,9+bob,14,17,P.hair);
 else if(P.hs==='twin'){px.box(3,10+bob,4,14,P.hair);px.box(19,10+bob,4,14,P.hair)}
 else if(P.hs==='hood'){px.poly([[4,18+bob],[22,18+bob],[20,29+bob],[6,29+bob]],P.hood)}
}
function dollHairFront(px,P,bob){
 const hs=P.hs,H=P.hair,hy=12+bob;
 const dome=(ry,yl)=>px.ell(13,10+bob,7.3,ry,H,{clip:(x,y)=>y<=yl+bob});
 if(hs==='long'||hs==='twin'||hs==='short'||hs==='spiky'||hs==='hat'){
  dome(5.4,10);
  const bang=hs==='spiky'?[[7,11],[8,11],[18,11],[19,11],[9,10],[17,10]]:hs==='short'?[[6,11],[7,11],[19,11],[20,11],[7,12],[19,12]]:[[6,11],[7,11],[8,11],[10,11],[11,11],[15,11],[17,11],[18,11],[19,11],[20,11],[6,12],[7,12],[19,12],[20,12],[6,13],[20,13]];
  for(const[x,y]of bang)px.set(x,y+bob,ramp(H)[2]);
  for(const[x,y]of bang)if(y===11&&x%2)px.set(x,y+bob,ramp(H)[3]);
 }
 if(hs==='spiky'){
  px.poly([[6,9+bob],[8,3+bob],[11,8+bob]],H);px.poly([[9,7+bob],[12,0+bob],[15,7+bob]],H);px.poly([[14,8+bob],[18,2+bob],[20,9+bob]],H);px.poly([[18,10+bob],[23,6+bob],[20,12+bob]],H);px.poly([[3,11+bob],[8,7+bob],[7,12+bob]],H);
 }
 if(hs==='hat'){
  px.ell(13,8+bob,10.5,2.4,P.hat);
  px.poly([[8,8+bob],[18,8+bob],[17,3+bob],[13,-1+bob+1],[11,2+bob]],P.hat);
  px.poly([[13,0+bob],[19,2+bob],[17,5+bob],[15,3+bob]],P.hat,{flat:1});
  px.rect(9,6+bob,9,2,P.hatBand||P.trim);px.set(13,6+bob,'#ffe45a');px.set(13,7+bob,'#ffe45a');
 }
 if(hs==='hood'){
  px.ell(13,10+bob,8,7.2,P.hood,{clip:(x,y)=>y<=10+bob||x<7||x>19});
  for(let y=9;y<=17;y++){px.set(7,y+bob,ramp(P.hood)[1]);px.set(19,y+bob,ramp(P.hood)[1])}
 }
 if(hs==='helm'){
  px.ell(13,10+bob,7.8,6.5,P.hair,{clip:(x,y)=>y<=12+bob});
  px.rect(7,12+bob,12,1,ramp(P.hair)[1]);px.rect(10,12+bob,6,2,'#0a0612');px.rect(12,8+bob,2,5,ramp(P.hair)[3]);
  if(P.plume)px.poly([[12,4+bob],[14,4+bob],[19,7+bob],[17,12+bob],[15,6+bob]],P.plume);
 }
 if(hs==='horn'){
  dome(5.2,10);
  px.poly([[6,8+bob],[3,1+bob],[9,6+bob]],P.horn||'#e8dcc0');px.poly([[20,8+bob],[23,1+bob],[17,6+bob]],P.horn||'#e8dcc0');
 }
}
function doll(px,f,P){
 const ph=f%4,bob=(ph===1||ph===3)?-1:0,sw=[0,1,0,-1][ph],LL=[7,6,5,6][ph],RL=[5,6,7,6][ph];
 if(P.back)P.back(px,f,bob);
 if(P.cape){const s=[0,1,0,-1][ph];px.poly([[8,19+bob],[18,19+bob],[22+s,35+bob],[4+s,35+bob]],P.cape)}
 if(P.wings){const s=[0,-1,0,-1][ph];px.poly([[8,19+bob],[0,8+bob+s],[1,22+bob],[8,26+bob]],P.wings);px.poly([[18,19+bob],[26,8+bob+s],[25,22+bob],[18,26+bob]],P.wings)}
 dollHairBack(px,P,bob);
 // 足
 const legs=(x,len)=>{const yb=28+len;px.box(x,27,3,yb-27-2,P.pants);px.box(x-1,yb-3,4,3,P.boots)};
 legs(9,LL);legs(14,RL);
 // 体
 px.box(8,18+bob,10,10,P.top);
 px.rect(8,25+bob,10,1,P.trim);px.set(13,25+bob,'#ffe45a');
 if(P.chest)P.chest(px,bob);
 px.set(12,18+bob,P.skin);px.set(13,18+bob,P.skin);px.set(12,19+bob,ramp(P.skin)[1]);px.set(13,19+bob,ramp(P.skin)[1]);
 // 腕
 const sl=P.sleeve||P.top;
 px.box(6,19+bob+sw,2,7,sl);px.rect(6,26+bob+sw,2,2,P.skin);
 px.box(18,19+bob-sw,2,7,sl);px.rect(18,26+bob-sw,2,2,P.skin);
 if(P.pads){px.ell(7,19+bob,3,2.4,P.pads);px.ell(19,19+bob,3,2.4,P.pads)}
 // 頭
 if(P.ears)for(const s of[-1,1]){const x=13+s*6.5;px.poly([[x,10+bob],[x+s*4,7+bob],[x+s*1,14+bob]],P.skin)}
 px.ell(13,12+bob,6.7,6.4,P.skin,{min:2,ly:-.5,lx:-.4});px.rect(9,17+bob,8,1,ramp(P.skin)[1]);
 if(P.hs!=='hood'||P.faceShow!==false){
  // 目
  if(!P.noEyes){
   const iris=P.eye,lash=P.lash||'#1a1030';
   for(const ex of[9,15]){
    px.set(ex,11+bob,lash);px.set(ex+1,11+bob,lash);
    px.set(ex,12+bob,'#ffffff');px.set(ex+1,12+bob,iris);
    px.set(ex,13+bob,iris);px.set(ex+1,13+bob,ramp(iris)[1]);
    if(P.glow){px.set(ex,12+bob,P.glow);px.set(ex+1,12+bob,P.glow)}
   }
  }
  if(P.mouth!==false)px.set(13,16+bob,ramp(P.skin)[0]),px.set(12,16+bob,ramp(P.skin)[1]),px.set(14,16+bob,ramp(P.skin)[1]);
  if(P.blush!==false){px.set(8,15+bob,mixc(P.skin,'#ff5a7a',.45));px.set(18,15+bob,mixc(P.skin,'#ff5a7a',.45))}
 }
 if(P.face)P.face(px,bob);
 dollHairFront(px,P,bob);
 if(P.front)P.front(px,f,bob,sw);
}
