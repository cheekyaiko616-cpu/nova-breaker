"use strict";
// ===== 基本設定・共通関数・セーブデータ =====
const W=1280,H=720,TAU=Math.PI*2;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const ui=document.getElementById('ui'),banner=document.getElementById('banner'),hud=document.getElementById('hud');
ctx.imageSmoothingEnabled=false;

const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const d2=(ax,ay,bx,by)=>(ax-bx)**2+(ay-by)**2;
const chance=p=>Math.random()<p;
const hash2=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
const fmtTime=t=>{t=Math.max(0,Math.ceil(t));return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

// セーブデータ
const SK='nb3';
const S={gold:0,unlocked:['ao'],perms:{},cleared:{},best:{},lastChar:'ao'};
try{const o=JSON.parse(localStorage.getItem(SK)||'null');if(o&&typeof o==='object')Object.assign(S,o)}catch(e){}
function saveNow(){try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){}}

// レアリティ
const RAR=[{n:'COMMON',c:'#9aa4b8',w:50,m:1},{n:'UNCOMMON',c:'#5ce08a',w:28,m:1.5},{n:'RARE',c:'#4aa8ff',w:14,m:2},{n:'EPIC',c:'#b06aff',w:6,m:2.7},{n:'LEGENDARY',c:'#ffc23a',w:2,m:3.6}];
function rollRar(){let t=RAR.reduce((s,r)=>s+r.w,0),v=Math.random()*t;for(let i=0;i<RAR.length;i++){v-=RAR[i].w;if(v<=0)return i}return 0}

// ガチャで上がる恒久強化
const PERMS={damage:{n:'攻撃力',p:.04},hp:{n:'最大HP',p:8},speed:{n:'移動速度',p:.03},cooldown:{n:'攻撃速度',p:.02},magnet:{n:'回収範囲',p:.06},greed:{n:'獲得ゴールド',p:.05}};
const permV=k=>(S.perms[k]||0)*PERMS[k].p;

// ゲームの状態
let ST='title',LMT=0,nextId=1;
const G={};
function resetG(){
 Object.assign(G,{p:null,en:[],pr:[],ep:[],or:[],items:[],zones:[],fx:[],pt:[],dn:[],cam:{x:-W/2,y:-H/2},
  stage:null,sc:null,si:0,t:0,kills:0,goldRun:0,boss:null,bossSpawned:false,midSpawned:false,spawnT:0,evIdx:0,
  freeze:0,shake:0,pend:0,tv:null,anim:0,flash:0});
}
resetG();

function hideBanner(){clearTimeout(showBanner._t);banner.classList.remove('show')}
function showBanner(txt,col){
 banner.textContent=txt;banner.style.color=col||'#fff';banner.classList.add('show');
 clearTimeout(showBanner._t);showBanner._t=setTimeout(()=>banner.classList.remove('show'),1600);
}
