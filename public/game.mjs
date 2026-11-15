import {nextAtmosphere} from './atmospheres.mjs';
import {building,architectureWidth,modelPieces} from './worlds.mjs';
export function tempo(height=0){const section=Math.floor((height%100)/25);return {speed:[2.85,4.25,2.2,4.7][section]+(height%25)*.008,label:['Akış','Hızlı tur','Nefes molası','Adrenalin'][section],section,next:(Math.floor(height/25)+1)*25}}
export function fresh(code,players,options={}){return {...options,atmosphere:options.atmosphere||nextAtmosphere(),code,players,blocks:[{x:0,z:0,w:3,d:3}],phase:'lobby',turn:0,epoch:0,rev:0,perfect:0,maxCombo:0,score:0,last:'',events:[],messages:[],recoveryCuts:[]}}
export function moving(g,now){const p=g.blocks.at(-1),axis=g.blocks.length%2?'x':'z',t=Math.max(0,now-g.epoch)/1000*tempo(g.blocks.length-1).speed;const b={...p,[axis]:p[axis]+4-Math.abs((t%16)-8)};if(g.mode==='worlds'){const ratio=architectureWidth(g.buildingId,g.blocks.length);b.w=Math.min(b.w,3*ratio);b.d=Math.min(b.d,3*ratio)}return b}
export function drop(g,now){
 const n=structuredClone(g),p=n.blocks.at(-1),b=moving(n,now),axis=n.blocks.length%2?'x':'z',size=axis==='x'?'w':'d',diff=b[axis]-p[axis],level=n.blocks.length;
 const event={id:n.rev+1,at:now,level,axis,actor:n.players[n.turn]?.id,kind:'cut',block:{...b},piece:null};
 const left=Math.max(p[axis]-p[size]/2,b[axis]-b[size]/2),right=Math.min(p[axis]+p[size]/2,b[axis]+b[size]/2);
 if(right<=left){n.phase='over';n.loser=n.players[n.turn]?.name;n.last='Birlikte '+(level-1)+' kata ulaştınız.';n.perfect=0;event.kind='miss';event.piece={...b}}else{
  const tolerance=Math.min(.14,b[size]*.12);
  if(Math.abs(diff)<=tolerance){b[axis]=p[axis];n.perfect++;n.maxCombo=Math.max(n.maxCombo||0,n.perfect);n.score=(n.score||0)+10*Math.min(n.perfect,5);n.last=n.perfect>1?'Mükemmel ×'+n.perfect:'Mükemmel!';event.kind='perfect';event.combo=n.perfect;
   // Every third consecutive perfect restores one previously lost slice.
   // Architectural taper is intentional and is never counted as a lost slice.
   if(n.perfect%3===0&&n.recoveryCuts?.length){
    const limit=n.mode==='worlds'?3*architectureWidth(n.buildingId,level):3;
    for(let i=n.recoveryCuts.length-1;i>=0;i--){const loss=n.recoveryCuts[i],amount=Math.min(loss.amount,Math.max(0,limit-b[loss.size]));if(amount<=.00001)continue;
     event.recovered={size:loss.size,amount,from:b[loss.size]};b[loss.size]+=amount;loss.amount-=amount;if(loss.amount<=.00001)n.recoveryCuts.splice(i,1);break;
    }
   }
  }
  else{const cut=b[size]-(right-left);if(cut>.00001){n.recoveryCuts??=[];n.recoveryCuts.push({size,amount:cut});const sign=Math.sign(diff);event.piece={...b,[size]:cut,[axis]:sign>0?right+cut/2:left-cut/2};b[size]=right-left;b[axis]=(left+right)/2}n.perfect=0;n.score=(n.score||0)+1;n.last='Güzel yerleştirme'}
  n.blocks.push(b);event.block={...b};n.turn=(n.turn+1)%n.players.length;n.epoch=now+260;
  if(n.mode==='worlds'){
   n.contributions??={};const who=event.actor;n.contributions[who]??={blocks:0,perfects:0};n.contributions[who].blocks++;if(event.kind==='perfect')n.contributions[who].perfects++;
   n.totalPerfects=(n.totalPerfects||0)+(event.kind==='perfect'?1:0);
   if(level>=n.targetFloors){n.phase='over';n.completed=true;n.finishedAt=now;n.last='BU YAPIYI BİRLİKTE İNŞA ETTİNİZ!'}
  }else if(n.blocks.length>=501){n.phase='over';n.last='İnanılmaz! 500 kata ulaştınız.'}
 }
 n.rev++;event.tempo=tempo(n.blocks.length-1);n.events=[...(n.events||[]),event].slice(-24);return n;
}

export function fitTowerView(blocks,width,height,buildingId=null){
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
 const all=[{x:0,z:0,w:3.65,d:3.65,level:-.4},...blocks.flatMap((b,i)=>buildingId?modelPieces(b,i,buildingId).map(q=>({...q,level:i*.42+(q.dy||0)})):[{...b,level:i*.42}])];
 for(const b of all)for(const x of [b.x-b.w/2,b.x+b.w/2])for(const z of [b.z-b.d/2,b.z+b.d/2])for(const y of [b.level,b.level+(b.h||.42)]){const px=(x-z)*.8,py=(x+z)*.38-y;minX=Math.min(minX,px);maxX=Math.max(maxX,px);minY=Math.min(minY,py);maxY=Math.max(maxY,py)}
 const top=155,bottom=Math.max(top+50,height-(width<760?(buildingId?315:230):85)),availableWidth=Math.max(120,width-(width<760?40:540));
 const unit=Math.min(72,availableWidth/Math.max(1,maxX-minX),(bottom-top)/Math.max(1,maxY-minY));
 return {unit,center:(width<760?width*.5:width*.46)-(minX+maxX)/2*unit,floor:(top+bottom)/2-(minY+maxY)/2*unit,bounds:{minX,maxX,minY,maxY},top,bottom};
}
