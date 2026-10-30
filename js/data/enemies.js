// ===== 敵キャラクター =====
// ai: chase 追跡 / wave 蛇行 / ghost すり抜け / charge 突進 / ranged 射撃 / summon 召喚 / turret 全方位弾 / bomber 自爆
const ET={
 // 草原
 slime:{n:'スライム',spr:'e_slime',oh:10,pal:{a:'#4cc06a',b:'#2a7a40',c:'#b8f5c8',e:'#0b0b14'},hp:8,sp:62,sc:2.4,dmg:5,xp:1,ai:'chase'},
 bigslime:{n:'ビッグスライム',spr:'e_bigslime',oh:10,pal:{a:'#3aa0c0',b:'#1f6a88',c:'#aee8f8',e:'#0b0b14'},hp:40,sp:48,sc:3.8,dmg:9,xp:4,ai:'chase',split:'slime',splitN:3},
 bat:{n:'コウモリ',spr:'e_bat',oh:7,pal:{a:'#7a5ac8',e:'#ff4a6a'},hp:5,sp:135,sc:2.3,dmg:4,xp:1,ai:'wave'},
 goblin:{n:'ゴブリン',spr:'e_goblin',oh:16,pal:{s:'#7ac050',h:'#4a3a2a',e:'#c02020',t:'#8a5a2a',p:'#4a3a1a',o:'#1a1208'},hp:16,sp:82,sc:3,dmg:7,xp:2,ai:'chase'},
 wolf:{n:'ウルフ',spr:'e_wolf',oh:9,pal:{a:'#8a8a9a',b:'#5a5a6a',e:'#ffd84a'},hp:22,sp:95,sc:2.8,dmg:9,xp:3,ai:'charge'},
 // 墓地
 skeleton:{n:'スケルトン',spr:'e_skeleton',oh:16,pal:{s:'#e8e8d8',h:'#d0d0c0',e:'#1a0a0a',t:'#b8b8a8',p:'#9a9a8a',o:'#5a5a50'},hp:18,sp:70,sc:3,dmg:7,xp:2,ai:'chase'},
 ghost:{n:'ゴースト',spr:'e_ghost',oh:12,pal:{a:'#d8e0ff',b:'#9aa8d8',c:'#ffffff',e:'#1a1a3a'},hp:14,sp:88,sc:2.6,dmg:7,xp:2,ai:'ghost'},
 zombie:{n:'ゾンビ',spr:'e_zombie',oh:16,pal:{s:'#8aa880',h:'#3a3a2a',e:'#ff3a3a',t:'#4a5a6a',p:'#3a3a4a',o:'#1a1a1a'},hp:30,sp:48,sc:3.1,dmg:10,xp:3,ai:'chase'},
 archer:{n:'ボーンアーチャー',spr:'e_archer',oh:16,pal:{s:'#e8e8d8',h:'#3a6a2a',e:'#1a0a0a',t:'#4a7a3a',p:'#9a9a8a',o:'#5a5a50'},hp:14,sp:66,sc:3,dmg:8,xp:3,ai:'ranged',shot:'single',bsp:330,bc:'#ffe08a',rate:2.2},
 necro:{n:'ネクロマンサー',spr:'e_necro',oh:16,pal:{s:'#c0a8b8',h:'#2a1a3a',e:'#ff4aff',t:'#3a1a4a',p:'#2a0a3a',o:'#0a0a0a',x:'#4a2a6a'},hp:40,sp:52,sc:3.2,dmg:9,xp:6,ai:'summon',summon:'skeleton',rate:4.5},
 // 火山
 imp:{n:'インプ',spr:'e_imp',oh:16,pal:{s:'#e0604a',h:'#3a0a0a',e:'#ffe04a',t:'#8a2a1a',p:'#4a0a0a',o:'#1a0a0a',x:'#f0e0c0'},hp:18,sp:80,sc:2.8,dmg:8,xp:3,ai:'ranged',shot:'single',bsp:280,bc:'#ff8a3a',rate:2},
 firebat:{n:'ファイアバット',spr:'e_firebat',oh:7,pal:{a:'#e0502a',e:'#ffe04a'},hp:10,sp:160,sc:2.4,dmg:7,xp:2,ai:'wave'},
 bomber:{n:'ボムリン',spr:'e_bomber',oh:10,pal:{a:'#ff7a2a',b:'#b03a10',c:'#ffd08a',e:'#0b0b14'},hp:14,sp:118,sc:2.6,dmg:22,xp:2,ai:'bomber'},
 salamander:{n:'サラマンダー',spr:'e_salamander',oh:9,pal:{a:'#e05a2a',b:'#8a2a10',e:'#ffe04a'},hp:34,sp:100,sc:3,dmg:12,xp:4,ai:'charge'},
 magmagolem:{n:'マグマゴーレム',spr:'e_magmagolem',oh:13,pal:{a:'#5a2a2a',b:'#2a1010',c:'#ff7a2a',e:'#ffd84a'},hp:120,sp:40,sc:3.3,dmg:14,xp:10,ai:'chase',kbRes:1},
 // 氷窟
 iceslime:{n:'アイススライム',spr:'e_iceslime',oh:10,pal:{a:'#9ad8ff',b:'#4a8ac0',c:'#ffffff',e:'#0b0b14'},hp:26,sp:55,sc:3.4,dmg:9,xp:3,ai:'chase',split:'icemini',splitN:2},
 icemini:{n:'こおりスライム',spr:'e_icemini',oh:10,pal:{a:'#c8ecff',b:'#7ab0d8',c:'#ffffff',e:'#0b0b14'},hp:10,sp:80,sc:2,dmg:6,xp:1,ai:'chase'},
 icebat:{n:'アイスバット',spr:'e_icebat',oh:7,pal:{a:'#7ac8ff',e:'#ffffff'},hp:12,sp:150,sc:2.4,dmg:7,xp:2,ai:'wave'},
 yeti:{n:'イエティ',spr:'e_yeti',oh:13,pal:{a:'#e8f0ff',b:'#a8b8d8',c:'#ffffff',e:'#2a4a8a'},hp:150,sp:44,sc:3.4,dmg:16,xp:12,ai:'chase',kbRes:1},
 frostmage:{n:'フロストメイジ',spr:'e_frostmage',oh:16,pal:{s:'#ffe0d0',h:'#c8e8ff',e:'#2a4aff',t:'#3a6ab8',p:'#2a3a6a',o:'#1a1a2a',x:'#4a8ad8'},hp:30,sp:55,sc:3,dmg:10,xp:5,ai:'ranged',shot:'spread3',bsp:250,bc:'#9ae0ff',rate:2.6},
 icewolf:{n:'フロストウルフ',spr:'e_icewolf',oh:9,pal:{a:'#d8ecff',b:'#8ab0d8',e:'#2a6aff'},hp:40,sp:105,sc:3,dmg:12,xp:4,ai:'charge'},
 // 魔王城・深淵
 eye:{n:'イビルアイ',spr:'e_eye',oh:12,pal:{a:'#8a2a5a',e:'#2a0a1a'},hp:50,sp:32,sc:2.8,dmg:10,xp:6,ai:'turret',rate:3.2,bc:'#ff4aa0',bsp:200},
 knight:{n:'ダークナイト',spr:'e_knight',oh:16,pal:{s:'#6a6a7a',h:'#3a3a4a',e:'#ff2a2a',t:'#4a4a5a',p:'#2a2a3a',o:'#1a1a1a'},hp:80,sp:62,sc:3.4,dmg:14,xp:8,ai:'chase',kbRes:.7},
 demon:{n:'デーモン',spr:'e_demon',oh:16,pal:{s:'#8a3ab8',h:'#1a0a2a',e:'#ffe04a',t:'#4a1a6a',p:'#2a0a3a',o:'#0a0a0a',x:'#d0c0a0'},hp:60,sp:105,sc:3.4,dmg:14,xp:7,ai:'chase'},
 wraith:{n:'レイス',spr:'e_wraith',oh:12,pal:{a:'#5a3a8a',b:'#3a1a5a',c:'#9a7ad8',e:'#ff4aff'},hp:40,sp:125,sc:2.9,dmg:12,xp:5,ai:'ghost'},

 // ===== ボス =====
 // pats: 攻撃パターンの順番（ring 全方位弾 / aim3 狙い撃ち / summon 手下 / dash 突進 / spiral 渦巻き弾 / jump 飛びかかり）
 kingslime:{n:'キングスライム',spr:'e_kingslime',oh:10,pal:{a:'#4cc06a',b:'#2a7a40',c:'#b8f5c8',e:'#0b0b14'},hp:900,sp:62,sc:9,dmg:14,xp:0,boss:true,pats:['jump','summon','ring','jump','aim3'],summon:'slime',bc:'#7aff9a'},
 lich:{n:'リッチ',spr:'e_lich',oh:16,pal:{s:'#b0a0c0',h:'#1a0a2a',e:'#ff4aff',t:'#2a0a3a',p:'#1a0a2a',o:'#0a0a0a',x:'#3a1a5a'},hp:1500,sp:58,sc:6,dmg:16,xp:0,boss:true,pats:['ring','summon','spiral','aim3'],summon:'skeleton',bc:'#c87aff'},
 flamegolem:{n:'フレイムゴーレム',spr:'e_flamegolem',oh:13,pal:{a:'#8a2a1a',b:'#4a1008',c:'#ffb02a',e:'#fff04a'},hp:2300,sp:52,sc:6.5,dmg:20,xp:0,boss:true,pats:['dash','ring','aim3','spiral'],bc:'#ff7a2a'},
 fenrir:{n:'フェンリル',spr:'e_fenrir',oh:9,pal:{a:'#e8f4ff',b:'#9ac0e8',e:'#2a6aff'},hp:3000,sp:75,sc:7,dmg:22,xp:0,boss:true,pats:['dash','aim3','dash','summon','ring'],summon:'icewolf',bc:'#9ae0ff'},
 maou:{n:'魔王',spr:'e_maou',oh:16,pal:{s:'#a08090',h:'#1a0a2a',e:'#ff2020',t:'#4a0a2a',p:'#2a0a1a',o:'#0a0000',x:'#e0d0a0'},hp:4200,sp:62,sc:6.5,dmg:24,xp:0,boss:true,pats:['spiral','aim3','summon','ring','dash'],summon:'demon',bc:'#ff4a8a'},
 abyss:{n:'深淵の眼',spr:'e_abyss',oh:12,pal:{a:'#2a0a3a',e:'#ff2a2a'},hp:5600,sp:50,sc:8,dmg:26,xp:0,boss:true,pats:['spiral','ring','aim3','summon','spiral','dash'],summon:'wraith',bc:'#ff2a6a'},
};
