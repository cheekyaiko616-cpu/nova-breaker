// ===== ステージ =====
// pool: [出現し始める秒, 敵の種類, 出やすさ] / events: [秒, 種類, 敵, 数] / dur: ボスが出るまでの秒数
const STAGES=[
 {n:'みどりの草原',desc:'スライムやゴブリンが住む草原',bg:['#1b3a20','#1f4224','#3a6a32','#2a5228'],deco:'grass',dur:180,
  pool:[[0,'slime',6],[0,'bat',3],[30,'goblin',4],[70,'wolf',2.5],[110,'bigslime',2]],
  events:[[45,'swarm','bat',16],[100,'ring','slime',22],[150,'swarm','wolf',8]],boss:'kingslime'},
 {n:'さまよう墓地',desc:'骸骨と亡霊がさまよう夜の墓地',bg:['#1c1a26','#22202e','#4a4658','#2e2a3a'],deco:'grave',dur:200,
  pool:[[0,'skeleton',5],[0,'ghost',3],[0,'bat',2],[25,'zombie',4],[60,'archer',3],[100,'necro',1.4]],
  events:[[50,'swarm','bat',20],[110,'ring','zombie',20],[160,'swarm','ghost',14]],boss:'lich'},
 {n:'灼熱の火山',desc:'自爆する魔物と炎の魔物の住みか',bg:['#2a1210','#341612','#7a2a14','#4a1a12'],deco:'lava',dur:210,
  pool:[[0,'imp',4],[0,'firebat',4],[20,'bomber',3],[60,'salamander',3],[100,'magmagolem',1.5]],
  events:[[50,'swarm','firebat',22],[120,'ring','bomber',16],[170,'swarm','salamander',10]],boss:'flamegolem'},
 {n:'凍てつく氷窟',desc:'分裂するスライムと氷の狼が潜む洞窟',bg:['#16263a','#1a2c44','#6a9ac8','#24405e'],deco:'ice',dur:220,
  pool:[[0,'icemini',4],[0,'icebat',3],[20,'iceslime',3],[40,'frostmage',3],[70,'icewolf',3],[110,'yeti',1.5]],
  events:[[50,'swarm','icebat',24],[120,'ring','icewolf',14],[180,'swarm','icebat',30]],boss:'fenrir'},
 {n:'魔王城',desc:'魔王に仕える精鋭が守る城',bg:['#1e0e1a','#26121f','#5a1a3a','#3a1428'],deco:'brick',dur:240,
  pool:[[0,'imp',4],[0,'skeleton',3],[0,'bat',2],[40,'knight',2.5],[45,'eye',2],[70,'demon',3],[100,'wraith',3],[140,'necro',1]],
  events:[[60,'swarm','wraith',16],[130,'ring','knight',16],[200,'swarm','demon',14]],boss:'maou'},
 {n:'深淵',desc:'あらゆる魔物が強化されて現れる最果て',bg:['#08060e','#0c0a16','#3a1a5a','#1a1030'],deco:'void',dur:240,
  pool:[[0,'firebat',3],[0,'ghost',3],[0,'imp',2],[50,'wraith',3],[55,'eye',2],[70,'demon',3],[80,'frostmage',2],[100,'magmagolem',1.2],[120,'yeti',1.2],[140,'knight',2]],
  events:[[60,'swarm','firebat',30],[140,'ring','demon',18],[200,'swarm','wraith',24]],boss:'abyss'},
];
// 上のステージほど敵が硬く・強く・大きくなり、強化個体や巨大個体が増える
// hpM: 開始時の硬さ / grow: ボス直前までにどれだけ硬くなるか
function stScale(si){return{hpM:1+si*.12,grow:.9+si*.25,dmgM:1+si*.12,scM:1+si*.07,xpM:1+si*.15,eliteP:.004+si*.006,giantP:si>=2?.0015*si:0}}
