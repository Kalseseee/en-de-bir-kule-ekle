import {existsSync,readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {building,unlocked,BUILDINGS} from './public/worlds.mjs';
export function createWorldStore({persist=true,dataDir,now=()=>Date.now()}){
 const file=path.join(dataDir,'architects.json');let profiles=new Map(),teams=new Map(),dirty=false;
 if(persist){mkdirSync(dataDir,{recursive:true});if(existsSync(file)){const data=JSON.parse(readFileSync(file,'utf8'));profiles=new Map(data.profiles||[]);teams=new Map(data.teams||[])}}
 const publicProfile=p=>({id:p.id,name:p.name,collection:p.collection,xp:p.xp,badges:p.badges});
 const authenticate=identity=>{const p=profiles.get(identity?.id);return p&&p.token===identity?.token?p:null};
 function profile(identity,name='Mimar'){if(identity?.id){const p=authenticate(identity);if(!p)throw Object.assign(Error('Mimar oturumu geçersiz.'),{status:401,code:'ARCHITECT_SESSION_INVALID'});return {profile:publicProfile(p)}}const p={id:crypto.randomUUID(),token:crypto.randomUUID(),name:String(name||'Mimar').slice(0,18),collection:{},xp:0,badges:[]};profiles.set(p.id,p);dirty=true;return {profile:publicProfile(p),identity:{id:p.id,token:p.token}}}
 function canBuild(id,identity){const p=authenticate(identity);return !!p&&unlocked(id,p.collection)}
 function teamKey(g){return [...new Set(g.players.map(p=>p.profileId).filter(Boolean))].sort().join(':')}
 function summary(g){const key=teamKey(g);return {teamCollection:teams.get(key)?.collection||{},teamKey:key}}
 function record(g){const spec=building(g.buildingId);if(g.mode!=='worlds'||!spec)return;const height=g.blocks.length-1,ids=[...new Set(g.players.map(p=>p.profileId).filter(Boolean))],key=teamKey(g),completed=!!g.completed,newReward=completed&&!g.rewardApplied;
 const beforeUnlocks=new Set(ids.flatMap(id=>BUILDINGS.filter(b=>unlocked(b.id,profiles.get(id)?.collection||{})).map(b=>id+':'+b.id)));
 const update=(collection)=>{const r=collection[spec.id]||{maxFloors:0,percent:0,completed:false,completions:0,bestScore:0,bestMs:null};r.maxFloors=Math.max(r.maxFloors,height);r.percent=Math.min(100,Math.round(r.maxFloors/spec.floors*100));r.bestScore=Math.max(r.bestScore,g.score||0);if(newReward){r.completed=true;r.completions++;const elapsed=Math.max(0,(g.finishedAt||now())-(g.startedAt||g.epoch));r.bestMs=r.bestMs===null?elapsed:Math.min(elapsed,r.bestMs);r.lastBuilders=g.players.map(p=>p.name);r.lastContributions=g.contributions;r.completedAt=now()}collection[spec.id]=r};
 for(const id of ids){const p=profiles.get(id);if(!p)continue;update(p.collection);if(newReward){if(!p.badges.includes(spec.id))p.badges.push(spec.id)}}
 if(key){const team=teams.get(key)||{ids,collection:{}};update(team.collection);teams.set(key,team)}
 if(newReward){g.rewardApplied=true;g.reward={badge:spec.name+' Mimarı',unlocked:BUILDINGS.filter(b=>ids.some(id=>unlocked(b.id,profiles.get(id)?.collection||{})&&!beforeUnlocks.has(id+':'+b.id))).map(b=>b.name)};g.teamResult={names:g.players.map(p=>p.name),contributions:g.contributions,elapsedMs:Math.max(0,g.finishedAt-g.startedAt)}}dirty=true;
 }
 function flush(){if(persist&&dirty){writeFileSync(file+'.tmp',JSON.stringify({profiles:[...profiles],teams:[...teams]}));renameSync(file+'.tmp',file);dirty=false}}
 return {profile,authenticate,canBuild,summary,record,flush,hasProfile:id=>profiles.has(id)};
}
