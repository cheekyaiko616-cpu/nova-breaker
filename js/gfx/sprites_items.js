// ===== アイテムの絵（16x16、1コマ）=====
const ITEM_ART={
 i_meat(px){px.ell(8,9,6.5,5.2,'#c8503a');px.rect(11,3,3,7,'#f4ecd8');px.ell(13,3,2.4,2.4,'#f4ecd8');px.rect(4,7,3,1,'#f0907a')},
 i_magnet(px){px.poly([[2,3],[6,3],[6,10],[10,10],[10,3],[14,3],[14,11],[8,16],[2,11]],'#e03a3a');px.rect(2,2,4,3,'#e8e8f0');px.rect(10,2,4,3,'#e8e8f0')},
 i_bomb(px){px.ell(8,10,6,6,'#2a2a3a');px.rect(6,3,4,2,'#7a7a9a');px.line(10,3,13,0,'#8a6a3a');px.rect(13,-1,2,2,'#ffe45a');px.rect(5,7,2,2,'#aaaacc')},
 i_clock(px){px.ell(8,8,7,7,'#f4ecd8');px.ell(8,8,5,5,'#ffffff');px.rect(8,4,1,5,'#2a2a3a');px.rect(8,8,3,1,'#2a2a3a');px.rect(7,0,3,2,'#6ab0ff')},
 i_star(px){const P=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?3.2:8;P.push([8+Math.cos(a)*r,8.5+Math.sin(a)*r])}px.poly(P,'#ffd84a');px.rect(7,6,2,2,'#fff8c0')},
 i_chest(px){px.box(1,6,14,9,'#a8661a');px.ell(8,6,7,4.5,'#d89a2a',{clip:(x,y)=>y<=6});px.rect(1,8,14,1,'#ffd84a');px.rect(7,7,3,4,'#ffd84a');px.rect(8,9,1,1,'#2a1a0a')},
};
for(const id in ITEM_ART)makeSprite(id,16,16,1,ITEM_ART[id]);
