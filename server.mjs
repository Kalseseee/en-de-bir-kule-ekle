import {nextAtmosphere} from './public/atmospheres.mjs';
import {normalizeAppearance} from './public/appearance.mjs';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,renameSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fresh,drop} from './public/game.mjs';
import {building,worldOptions} from './public/worlds.mjs';
import {createWorldStore} from './world-store.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
export function createGameServer({persist=true,now=()=>Date.now(),dataDirectory=null}={}){
 const rooms=new Map(),listeners=new Map(),chatLimits=new Map(),dataDir=dataDirectory||process.env.DATA_DIR||path.join(root,'data'),file=path.join(dataDir,'rooms.json');
 if(persist){mkdirSync(dataDir,{recursive:true});if(existsSync(file))for(const [code,room]of JSON.parse(readFileSync(file,'utf8')))if(room.updated>now()-86400000)rooms.set(code,room)}
 const worldStore=createWorldStore({persist,dataDir,now});
 const newRound=g=>{const options=g.mode==='worlds'?worldOptions(g.buildingId):{};const next=fresh(g.code,g.players,{...options,atmosphere:nextAtmosphere(g.atmosphere)});next.votes={};next.settings=normalizeAppearance(g.settings);next.settingsVersion=g.settingsVersion||0;next.startedAt=now()+1200;return next};
 let dirty=false;function flush(){worldStore.flush();if(persist&&dirty){writeFileSync(file+'.tmp',JSON.stringify([...rooms]));renameSync(file+'.tmp',file);dirty=false}}
 const persistence=setInterval(flush,1000);persistence.unref();
 const safe=g=>({...g,settings:normalizeAppearance(g.settings),settingsVersion:g.settingsVersion||0,players:g.players.map(({token,...p})=>p),serverTime:now(),...(g.mode==='worlds'?worldStore.summary(g):{})});
 const broadcast=code=>{const g=rooms.get(code)?.game;for(const res of listeners.get(code)||[])res.write('data: '+JSON.stringify(g?safe(g):{closed:true})+'\n\n')};
 const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
 async function body(req){let data='';for await(const b of req){data+=b;if(Buffer.byteLength(data)>4096)fail('İstek çok büyük.',413)}try{return JSON.parse(data)}catch{fail('Geçersiz istek.')}}
 const server=http.createServer(async(req,res)=>{const json=(data,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};try{
 const url=new URL(req.url,'http://localhost');if(url.pathname==='/health'){res.writeHead(200);res.end('ok');return}if(url.pathname==='/api/time')return json({serverTime:now()});
 if(url.pathname==='/api/profile'){if(req.method!=='POST')fail('Geçersiz yöntem.',405);if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)fail('Geçersiz kaynak.',403);const b=await body(req),result=worldStore.profile(b.identity,b.name);const room=rooms.get(b.room?.code),member=room?.game.players.find(p=>typeof b.room?.token==='string'&&p.token===b.room.token);if(member&&member.profileId!==result.profile.id&&(room.game.phase==='lobby'||!member.profileId||!worldStore.hasProfile(member.profileId))){member.profileId=result.profile.id;room.game.rev++;room.updated=now();dirty=true;broadcast(b.room.code)}return json(result)}
 if(url.pathname==='/api/events'){if(req.method!=='GET')fail('Geçersiz yöntem.',405);const code=url.searchParams.get('code')?.toUpperCase(),room=rooms.get(code);if(!room||room.updated<now()-86400000)fail('Oda bulunamadı.',404);const set=listeners.get(code)||new Set();if(set.size>=30)fail('Oda bağlantı sınırına ulaştı.',429);res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 1500\n\ndata: '+JSON.stringify(safe(room.game))+'\n\n');set.add(res);listeners.set(code,set);const heartbeat=setInterval(()=>res.write(': ping\n\n'),15000);heartbeat.unref();res.on('close',()=>{clearInterval(heartbeat);set.delete(res);if(!set.size)listeners.delete(code)});return}
 if(url.pathname==='/api/game'){for(const [code,r]of rooms)if(r.updated<now()-86400000){rooms.delete(code);broadcast(code);dirty=true}if(req.method==='GET'){const room=rooms.get(url.searchParams.get('code')?.toUpperCase());if(!room)fail('Oda bulunamadı veya süresi doldu.',404);return json(safe(room.game))}if(req.method!=='POST')fail('Geçersiz yöntem.',405);if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)fail('Geçersiz kaynak.',403);const b=await body(req),name=String(b.name||'').trim().slice(0,18);
 if(b.action==='create'){if(!name)fail('Önce bir oyuncu adı gir.');if(rooms.size>=2000)fail('Şu an çok fazla oda var.',503);let code;do{code=Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join('')}while(rooms.has(code));const profile=worldStore.authenticate(b.identity);if(b.mode==='worlds'&&!profile)fail('Önce mimar oturumu aç.',401);if(b.mode==='worlds'&&!worldStore.canBuild(b.buildingId,b.identity))fail('Bu yapı henüz kilitli.',403);const player={id:crypto.randomUUID(),token:crypto.randomUUID(),name,...(profile?{profileId:profile.id}:{})},g=fresh(code,[player],b.mode==='worlds'?worldOptions(b.buildingId):{});g.votes={};g.settings=normalizeAppearance(b.settings,true);g.settingsVersion=0;rooms.set(code,{game:g,updated:now()});dirty=true;return json({game:safe(g),player})}
 const code=String(b.code||'').toUpperCase(),room=rooms.get(code);if(!room)fail('Oda bulunamadı.',404);let g=structuredClone(room.game),player;const who=g.players.findIndex(p=>typeof b.token==='string'&&p.token===b.token);
 if(b.action==='join'){if(!name)fail('Bir oyuncu adı gir.');if(g.phase!=='lobby')fail('Bu odada oyun başladı.',409);if(g.players.length>=(g.mode==='worlds'?2:6))fail('Oda dolu (en fazla 6 kişi).',409);const profile=worldStore.authenticate(b.identity);if(g.mode==='worlds'&&!profile)fail('Önce mimar oturumu aç.',401);player={id:crypto.randomUUID(),token:crypto.randomUUID(),name,...(profile?{profileId:profile.id}:{})};g.players.push(player);g.rev++}else{
 if(who<0)fail('Bu odada oyuncu değilsin.',403);
 if(b.action==='appearance'){if(who!==0)fail('Odanın temasını yalnızca oda sahibi değiştirebilir.',403);g.settings=normalizeAppearance(b.settings,true);g.settingsVersion=(g.settingsVersion||0)+1}
 else if(b.action==='returnLobby'){g.phase='lobby';g.votes={};g.rev++}
 else if(b.action==='classicMode'){if(g.phase!=='lobby')fail('Önce bekleme odasına dön.');if(who!==0)fail('Oyun modunu oda sahibi seçer.',403);const rev=g.rev,messages=g.messages||[],settings=g.settings,settingsVersion=g.settingsVersion,atmosphere=g.atmosphere;g=fresh(g.code,g.players);Object.assign(g,{rev:rev+1,messages,settings,settingsVersion,atmosphere,votes:{}})}
 else if(b.action==='worldLobby'){if(g.mode!=='worlds'||g.phase!=='over')fail('Önce inşaatı tamamla veya turu bitir.');if(who!==0)fail('Yeni yapıyı oda sahibi seçer.',403);g.phase='lobby';g.votes={};g.rev++}
 else if(b.action==='selectBuilding'){if(g.phase!=='lobby')fail('Yapı seçimi bekleme odasında yapılır.');if(g.mode!=='worlds'){if(who!==0)fail('Oyun modunu oda sahibi seçer.',403);if(g.players.length!==2)fail('Dünya Mimarları için odada tam 2 oyuncu olmalı.');}const identity=worldStore.authenticate(b.identity);if(!identity||identity.id!==g.players[who].profileId||!worldStore.canBuild(b.buildingId,b.identity))fail('Bu yapı henüz kilitli.',403);g.votes??={};g.votes[g.players[who].id]=b.buildingId;const agree=g.players.every(p=>g.votes[p.id]===b.buildingId);if(who===0||agree){Object.assign(g,worldOptions(b.buildingId));g.votes={}}g.rev++}
 else if(b.action==='chat'){const text=String(b.text||'').trim().slice(0,240);if(!text)fail('Boş mesaj gönderilemez.');const key=g.players[who].id;if(now()-(chatLimits.get(key)||-Infinity)<700)fail('Biraz yavaş, mesajın sırada.',429);chatLimits.set(key,now());g.messages=[...(g.messages||[]),{id:crypto.randomUUID(),name:g.players[who].name,playerId:key,text,at:now()}].slice(-80)}
 else if(b.action==='leave'){const leaver=g.players[who];chatLimits.delete(leaver.id);if(g.phase==='playing'){g.phase='over';g.last=leaver.name+' odadan ayrıldı. Yeni bir tur başlatabilirsiniz.'}g.players.splice(who,1);g.turn=0;g.rev++;if(!g.players.length){rooms.delete(code);dirty=true;broadcast(code);return json({left:true})}}
 else if(b.action==='restart'){if(g.phase==='lobby')fail('Önce oyunu başlat.');if(b.rev!==g.rev)return json({error:'Tur zaten yenilendi.',game:safe(g)},409);if(g.players.length<2)fail('Yeniden başlatmak için en az 2 kişi gerekli.');const rev=g.rev,messages=g.messages||[];g=newRound(g);g.rev=rev+1;g.messages=messages;g.phase='playing';g.epoch=now()+1200}
 else if(b.action==='start'){if(who!==0)fail('Oyunu oda sahibi başlatabilir.',403);if(g.players.length<2)fail('En az 2 oyuncu gerekli.');if(g.phase==='playing')fail('Oyun zaten başladı.',409);const rev=g.rev,messages=g.messages||[];g=newRound(g);g.rev=rev+1;g.messages=messages;g.phase='playing';g.epoch=now()+1200}
 else if(b.action==='drop'){if(g.phase!=='playing'||who!==g.turn||b.rev!==g.rev)return json({error:'Sıranı bekle.',game:safe(g)},409);const t=Number(b.time);if(!Number.isFinite(t)||Math.abs(t-now())>900||t<g.epoch)return json({error:'Bağlantı gecikti, tekrar dene.',game:safe(g)},409);g=drop(g,t);worldStore.record(g)}else fail('Geçersiz işlem.')}
 rooms.set(code,{game:g,updated:now()});dirty=true;broadcast(code);return json({game:safe(g),player})}
 if(req.method!=='GET'&&req.method!=='HEAD')fail('Geçersiz yöntem.',405);const allowed={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/ui.css':'ui.css','/app.mjs':'app.mjs','/renderer.mjs':'renderer.mjs','/game.mjs':'game.mjs','/worlds.mjs':'worlds.mjs','/environment.mjs':'environment.mjs','/world-ui.mjs':'world-ui.mjs','/appearance.mjs':'appearance.mjs','/atmospheres.mjs':'atmospheres.mjs','/profile-session.mjs':'profile-session.mjs'};const name=allowed[url.pathname];if(!name)fail('Sayfa bulunamadı.',404);const mime=name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript';res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"});res.end(req.method==='HEAD'?undefined:readFileSync(path.join(root,'public',name)))
 }catch(e){json({error:e.status?e.message:'Sunucuya bağlanılamadı. Tekrar dene.',...(e.code==='ARCHITECT_SESSION_INVALID'?{code:e.code}:{})},e.status||500)}});
 server.on('close',()=>{clearInterval(persistence);flush()});server.closeStreams=()=>{for(const set of listeners.values())for(const res of set)res.end()};return server
}

export async function startGameServer({port=3000,host='0.0.0.0',autoPort=true,persist=true}={}){
 const server=createGameServer({persist});
 for(let attempt=0;attempt<20;attempt++){
  const selected=port===0?0:port+attempt;
  if(selected>65535)break;
  try{
   await new Promise((resolve,reject)=>{const fail=error=>{server.off('listening',ready);reject(error)},ready=()=>{server.off('error',fail);resolve()};server.once('error',fail);server.once('listening',ready);server.listen(selected,host)});
   const actual=server.address().port;return {server,port:actual,url:'http://localhost:'+actual};
  }catch(error){if(error.code!=='EADDRINUSE'||!autoPort){server.emit('close');throw error}}
 }
 server.emit('close');throw new Error('Uygun port bulunamadi. Eski oyun penceresini kapatip tekrar deneyin.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const requested=Number(process.env.PORT)||3000;
 startGameServer({port:requested,autoPort:!process.env.PORT}).then(({server,port,url})=>{
  if(port!==requested)console.log(requested+' portu dolu. Bos port secildi: '+port);
  console.log('Oyun hazir: '+url);console.log('Oynarken bu pencereyi acik tutun. Cikmak icin Ctrl+C.');
  if(process.env.KULE_OPEN_BROWSER==='1'&&process.platform==='win32'){const child=spawn('explorer.exe',[url],{windowsHide:true,stdio:'ignore'});child.on('error',()=>console.log('Tarayicida bu adresi acin: '+url));child.unref()}
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.closeStreams();server.close(()=>process.exit(0))});
 }).catch(error=>{console.error('Oyun baslatilamadi: '+error.message);process.exitCode=1});
}
