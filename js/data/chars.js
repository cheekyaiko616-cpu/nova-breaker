// ===== プレイアブルキャラクター =====
// wep: 専用武器 / skill: ゲージ満タンで使える固有スキル / sg: ゲージの溜まりやすさ
const CHARS={
 ao:{c:'#5ab0ff',n:'アオイ',type:'バランス型',range:'中距離',pal:{s:'#ffdac0',h:'#5ab0ff',e:'#1a2a5a',t:'#3a6ad8',p:'#24305a',o:'#14141e'},sty:'long',
  wep:'blaster',hp:100,sp:220,dmg:10,sg:1,
  skill:{id:'overdrive',n:'オーバードライブ',d:'6秒間、すべての武器の攻撃速度が3倍・威力1.5倍'}},
 rn:{c:'#ff9a3a',n:'レン',type:'近接アタッカー',range:'近距離',pal:{s:'#f0c8a0',h:'#ff9a3a',e:'#4a2a0a',t:'#d04a3a',p:'#3a2a1a',o:'#1a0a0a'},sty:'spiky',
  wep:'slash',hp:125,sp:240,dmg:12,sg:1.1,
  skill:{id:'whirl',n:'旋風斬',d:'4秒間無敵。回転斬りで周囲の敵を切り刻み、移動も速くなる'}},
 ms:{c:'#d8e4ff',n:'ミサキ',type:'守護騎士',range:'近距離・周囲',pal:{s:'#ffdac0',h:'#f4f4ff',e:'#5a5aff',t:'#a0c0ff',p:'#4a4a8a',o:'#2a2a4a'},sty:'long',
  wep:'shield',hp:155,sp:205,dmg:10,sg:.9,
  skill:{id:'sanct',n:'サンクチュアリ',d:'HPを40%回復し6秒間無敵。衝撃波で周りの敵を吹き飛ばす'}},
 kt:{c:'#4ae0c8',n:'カイト',type:'スナイパー',range:'遠距離・貫通',pal:{s:'#e0b890',h:'#3a3a5a',e:'#8a2a2a',t:'#2a5a5a',p:'#1a2a2a',o:'#0a0a0a'},sty:'short',
  wep:'snipe',hp:85,sp:225,dmg:12,sg:1,
  skill:{id:'judge',n:'ジャッジメント',d:'巨大レーザーで自分の周り360°をなぎ払う'}},
 yk:{c:'#ff9ad0',n:'ユキ',type:'雷術士',range:'中距離・連鎖',pal:{s:'#ffe8d8',h:'#ffc0e0',e:'#8a4a8a',t:'#e0a0d0',p:'#6a3a5a',o:'#2a1a2a'},sty:'long',
  wep:'chain',hp:85,sp:235,dmg:11,sg:1.1,
  skill:{id:'storm',n:'サンダーストーム',d:'4秒間、画面中の敵に雷が降り注ぎ、敵の動きも遅くなる'}},
 sm:{c:'#b98aff',n:'ソウマ',type:'召喚士',range:'全方位・追尾',pal:{s:'#e8c0a0',h:'#2a2a2a',e:'#aa4a2a',t:'#4a2a4a',p:'#2a1a2a',o:'#0a0a0a',x:'#5a2a7a'},sty:'hat',
  wep:'familiar',hp:105,sp:215,dmg:10,sg:1,
  skill:{id:'legion',n:'レギオン',d:'10秒間、使い魔を4体追加し、攻撃も速くなる'}},
};

for(const k in CHARS)CHARS[k].id=k;
