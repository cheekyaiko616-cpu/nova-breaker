// ===== 覚醒（武器をMAXまで育て、組み合わせのパッシブをLv3以上にすると進化する） =====
const EVO_NEED_PS=3;
const EVO={
 blaster:{n:'ノヴァ・ブラスター',ps:'cd',d:'光弾が一気に増え、すべてを貫く'},
 slash:{n:'ムーンブレイカー',ps:'dmg',d:'斬撃が巨大化し、四方へ斬り裂く'},
 shield:{n:'ガーディアン・ハロー',ps:'armor',d:'光の盾が大きく増え、触れた敵を粉砕'},
 snipe:{n:'ジャッジメントレイ',ps:'area',d:'極太のレーザーが4本、敵を撃ち抜く'},
 chain:{n:'ライトニング・ストーム',ps:'sg',d:'雷が画面中を駆け巡る'},
 familiar:{n:'使い魔の大群',ps:'regen',d:'使い魔が大量に増え、弾幕を張る'},
 knife:{n:'ナイフ・テンペスト',ps:'sp',d:'ナイフが嵐のように降り注ぐ'},
 axe:{n:'ギガント・アックス',ps:'dmg',d:'巨大な斧が次々と降ってくる'},
 boomerang:{n:'ヘルサイクロン',ps:'pr',d:'巨大ブーメランが大量に飛び交う'},
 aura:{n:'クリムゾン・フィールド',ps:'hp',d:'真紅の領域が広がり、敵を焼き尽くす'},
 holy:{n:'聖なる大海',ps:'area',d:'聖水が広がり、敵を飲み込む'},
 thunder:{n:'神の怒り',ps:'cd',d:'無数の落雷が大地を揺らす'},
 orb:{n:'ギャラクシー・オーブ',ps:'pr',d:'光の玉が増え、星のように巡る'},
 missile:{n:'ミサイルレイン',ps:'sg',d:'ミサイルが雨のように降り注ぐ'},
 spread:{n:'ドラゴンブレス',ps:'hp',d:'炎の散弾が壁のように広がる'},
};
// 覚醒中は「武器レベル+5・攻撃力と範囲アップ・弾が貫通」の状態で動かす
const EVO_LV=5,EVO_DMG=1.45,EVO_AREA=1.3;
for(const id in EVO){
 const d=WEP[id],t0=d.tick,dr=d.draw;
 d.evn=EVO[id].n;
 d.tick=(p,w,dt)=>{
  if(!w.evo)return t0(p,w,dt);
  const l=w.lv,od=p.dmg,oa=p.area;w.lv=l+EVO_LV;p.dmg*=EVO_DMG;p.area*=EVO_AREA;G.evoNow=true;
  try{t0(p,w,dt)}finally{w.lv=l;p.dmg=od;p.area=oa;G.evoNow=false}
 };
 if(dr)d.draw=(p,w)=>{
  if(!w.evo)return dr(p,w);
  const l=w.lv,oa=p.area;w.lv=l+EVO_LV;p.area*=EVO_AREA;
  try{dr(p,w)}finally{w.lv=l;p.area=oa}
 };
}
function canEvolve(p,w){const e=EVO[w.id];return !!e&&!w.evo&&w.lv>=WEP[w.id].max&&((p.pl&&p.pl[e.ps])||0)>=EVO_NEED_PS}
function evolveWeapon(p,w){
 w.evo=true;G.flash=.7;G.shake=16;
 ringFx(p.x,p.y,520,'#ffe45a',.7,12);ringFx(p.x,p.y,320,'#ffffff',.5,8);spawnPt(p.x,p.y,'#ffe45a',50,1.6);sparks(p.x,p.y,'#fff',24);
 showBanner('★ 覚醒！ '+EVO[w.id].n+' ★','#ffe45a');
}
