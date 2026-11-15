// Retry only rejected architect credentials; room membership is independent.
export async function loadArchitect({identity,name,room,fetcher=fetch}){
 const send=async credentials=>{const response=await fetcher('/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identity:credentials,name,room})});return {response,data:await response.json()}};
 let result=await send(identity);
 if(result.response.status===401&&result.data.code==='ARCHITECT_SESSION_INVALID')result=await send(null);
 if(!result.response.ok)throw Error(result.data.error||'Koleksiyon yüklenemedi.');
 return result.data;
}
