// ===== プレイアブルキャラの絵 =====
// 持ち物（front）で武器の見た目を出す。右手は (18,26) あたり
const CHAR_ART={
 ao:{skin:'#ffe0c8',hair:'#4aa0ff',hs:'long',eye:'#2a60d8',top:'#3a6ad8',trim:'#ffd84a',pants:'#2a3a6a',boots:'#20243a',cape:'#2a4aa0',pads:'#9ac0ff',
  chest(px,b){px.rect(11,19+b,4,5,'#dff0ff');px.rect(12,20+b,2,2,'#4aa0ff')},
  front(px,f,b,sw){const y=24+b-sw;px.poly([[18,y],[26,y],[26,y+3],[20,y+4],[18,y+3]],'#8a98b8');px.rect(24,y+1,2,2,'#7ff8ff');px.rect(18,y+3,2,3,'#3a4a6a')}},
 rn:{skin:'#f0c8a0',hair:'#ff9a3a',hs:'spiky',eye:'#c04a1a',top:'#d04a3a',trim:'#ffd84a',pants:'#3a2a1a',boots:'#1a0a0a',pads:'#8a2a1a',
  chest(px,b){px.rect(12,19+b,2,6,'#ffe0b0');px.rect(9,19+b,2,2,'#ffd84a')},
  face(px,b){px.rect(7,9+b,13,2,'#f8f8f8');px.set(20,10+b,'#f8f8f8');px.set(21,11+b,'#f8f8f8')},
  front(px,f,b,sw){const y=22+b-sw;px.poly([[19,y+2],[25,y-18],[27,y-17],[22,y+3]],'#d8e4f4');px.line(24,y-17,25,y-16,'#ffffff');px.rect(17,y+1,6,2,'#ffd84a');px.rect(19,y+3,2,5,'#6a3a1a')}},
 ms:{skin:'#ffe6d6',hair:'#f4f4ff',hs:'long',eye:'#5a5aff',top:'#a8c4ff',trim:'#ffffff',pants:'#4a4a8a',boots:'#2a2a4a',pads:'#e8f0ff',
  chest(px,b){px.rect(11,19+b,4,6,'#e8f0ff');px.rect(12,20+b,2,3,'#ffd84a')},
  face(px,b){px.rect(9,6+b,9,1,'#ffd84a');px.set(13,5+b,'#5a8aff');px.set(13,6+b,'#5a8aff')},
  front(px,f,b,sw){const y=21+b+sw;px.poly([[0,y],[8,y],[8,y+8],[4,y+14],[0,y+8]],'#4a7aff');px.poly([[1,y+1],[7,y+1],[7,y+8],[4,y+12],[1,y+8]],'#8ab0ff');px.rect(3,y+3,2,5,'#ffd84a');px.rect(2,y+5,4,2,'#ffd84a')}},
 kt:{skin:'#e0b890',hair:'#3a3a5a',hs:'short',eye:'#c03030',top:'#2a5a5a',trim:'#4ae0c8',pants:'#1a2a2a',boots:'#0a0a0a',cape:'#1a3a3a',pads:'#3a7a7a',
  face(px,b){px.rect(7,9+b,13,3,'#2a2a3a');px.rect(8,10+b,4,2,'#4ae0c8');px.rect(15,10+b,4,2,'#4ae0c8');px.rect(8,10+b,1,1,'#fff');px.rect(15,10+b,1,1,'#fff')},
  front(px,f,b,sw){const y=24+b-sw;px.poly([[3,y+1],[26,y-3],[26,y],[3,y+4]],'#5a5a6a');px.rect(10,y-4,6,2,'#4ae0c8');px.rect(1,y,5,6,'#6a4a2a');px.rect(24,y-3,2,3,'#9ad8ff')}},
 yk:{skin:'#ffe8d8',hair:'#ffb8e0',hs:'twin',eye:'#8a4a8a',top:'#e8a8d8',trim:'#ffffff',pants:'#c888b8',boots:'#6a3a5a',sleeve:'#fff0f8',
  back(px,f,b){px.poly([[7,26+b],[19,26+b],[23,34],[3,34]],'#e8a8d8');px.rect(3,33,20,1,'#fff')},
  chest(px,b){px.rect(11,19+b,4,3,'#fff');px.set(13,21+b,'#ff6aa8')},
  face(px,b){px.rect(5,8+b,3,3,'#ff6aa8');px.rect(18,8+b,3,3,'#ff6aa8')},
  front(px,f,b,sw){const y=26+b-sw;px.rect(20,y-20,2,28,'#a87a4a');px.ell(21,y-23,4.5,4.5,'#ffe45a');px.rect(19,y-22,1,1,'#fff');px.rect(18,y-18,6,2,'#d8a84a')}},
 sm:{skin:'#e8c0a0',hair:'#3a3a4a',hs:'hat',hat:'#6a3a9a',hatBand:'#b98aff',eye:'#d85a2a',top:'#4a2a5a',trim:'#b98aff',pants:'#2a1a3a',boots:'#120a1a',cape:'#2e1a40',
  chest(px,b){px.rect(11,19+b,4,6,'#7a4a9a');px.set(13,21+b,'#ffe45a');px.set(12,22+b,'#ffe45a');px.set(14,22+b,'#ffe45a')},
  front(px,f,b,sw){const y=20+b-sw*2;px.box(0,y,7,9,'#7a3a9a');px.rect(1,y+1,5,1,'#e8d8ff');px.rect(3,y+3,2,3,'#ffe45a');px.set(0,y+9,'#b98aff')}},
};
for(const id in CHAR_ART)makeSprite('c_'+id,DW,DH,4,(px,f)=>doll(px,f,CHAR_ART[id]));
