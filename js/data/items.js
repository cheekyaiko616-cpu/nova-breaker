// ===== 敵が落とすアイテム =====
const ITEMS={
 food:{n:'肉',d:'HPを30%回復',spr:'i_meat',pal:{a:'#c8503a',c:'#f0907a'}},
 magnet:{n:'マグネット',d:'落ちているものを全部回収',spr:'i_magnet',pal:{a:'#e03a3a'}},
 bomb:{n:'ボム',d:'画面内の敵に大ダメージ',spr:'i_bomb',pal:{a:'#2a2a3a',c:'#7a7a9a'}},
 clock:{n:'時計',d:'敵の動きを6秒止める',spr:'i_clock',pal:{}},
 star:{n:'スター',d:'6秒間無敵・体当たりで攻撃',spr:'i_star',pal:{a:'#ffd84a'}},
 orb:{n:'スキルの欠片',d:'スキルゲージ+35%',spr:null},
 chest:{n:'宝箱',d:'武器がレベルアップ',spr:'i_chest',pal:{a:'#d89a2a',b:'#8a5a1a'}},
};
// 通常の敵が倒れたときの出やすさ（強化個体は8倍）
const ITEM_RATE=[['food',.012],['orb',.012],['magnet',.005],['bomb',.003],['clock',.0025],['star',.002]];
