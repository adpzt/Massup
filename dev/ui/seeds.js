// Seeds injected via addInitScript (runs before page scripts). Local-only data.
function adrienSeed(){
  // Stub Supabase client: no network at all (route guard also aborts the CDN). getUser -> no user => sync no-ops.
  var chain=function(){ var p=Promise.resolve({data:null,error:{message:'offline-stub'}}); var h={get:function(t,k){ if(k==='then') return p.then.bind(p); if(k==='catch') return p.catch.bind(p); return function(){ return new Proxy({},h); }; }}; return new Proxy({},h); };
  var stub={createClient:function(){ return {
    auth:{onAuthStateChange:function(){ return {data:{subscription:{unsubscribe:function(){}}}}; },
      getSession:function(){ return Promise.resolve({data:{session:{user:{id:'local-test'}}}}); },
      getUser:function(){ return Promise.resolve({data:{user:null}}); },
      signOut:function(){ return Promise.resolve({}); }},
    from:function(){ return chain(); }, rpc:function(){ return chain(); },
    channel:function(){ return {on:function(){return this;},subscribe:function(){return this;}}; }, removeChannel:function(){} }; }};
  Object.defineProperty(window,'supabase',{get:function(){return stub;},set:function(){},configurable:true});
  if(localStorage.getItem('massup_db')) return;
  function d(n){ var x=new Date(); x.setDate(x.getDate()-n); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); }
  var logs=[], bw=[], health={}, sleep={}, nut={};
  var cyc=['s1','s2','s3'];
  for(var i=42,k=0;i>=1;i--){
    if([1,3,5,6].indexOf(i%7)>=0){ logs.push({id:'L'+i,date:d(i),time:'18:30',sessions:[cyc[k++%3]],comment:'',feeling:3+(i%3),energy:3+(i%2),duration_min:70+(i%20)}); }
    if(i%3===0) bw.push({date:d(i),weight_kg:+(70.2+(42-i)*0.04).toFixed(1),note:''});
    health[d(i)]={steps:4000+((i*1373)%9000)};
    sleep[d(i)]={bed:(i%2?'23:':'00:')+String((i*7)%60).padStart(2,'0'),wake:'07:'+String((i*11)%60).padStart(2,'0')};
  }
  health[d(0)]={steps:6240};
  var db={logs:logs,bodyWeight:bw,health:health,sleepLog:sleep,profile:{name:'Adrien',height:178,goal:'masse',rev:1,savedAt:Date.now()},
    nutriA:{day:{},favs:[]}};
  localStorage.setItem('massup_db',JSON.stringify(db));
}
function melatiSeed(){
  if(localStorage.getItem('melati_db')) return;
  function d(n){ var x=new Date(); x.setDate(x.getDate()-n); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); }
  var logs=[], pes=[], health={}, eau={}, salsa={};
  var cyc=['A','B','C','H'];
  for(var i=40,k=0;i>=1;i--){
    if([1,3,5].indexOf(i%7)>=0){ logs.push({id:1700000000000+i,date:d(i),sid:cyc[k++%4],dur:55+(i%15),nv:2,
      exos:[{k:'hip_thrust',w:40,w0:40,n:4,lo:8,hi:12,sets:[10,10,9,8],feels:['ok','ok','dur','dur'],ws:[40,40,40,40]}],skip:[],recs:[],energy:4,feeling:4,note:''}); }
    if(i%7===0) pes.push({date:d(i),kg:+(66-(40-i)*0.05).toFixed(1)});
    health[d(i)]={steps:5000+((i*1789)%8000)};
    eau[d(i)]=1+(i%3);
    if(i%6===0) salsa[d(i)]=true;
  }
  localStorage.setItem('melati_db',JSON.stringify({v:3,weights:{},logs:logs,mobiDays:{},tests:[],pesees:pes,salsa:salsa,eau:eau,health:health,seed2308:true,seed2308b:true}));
}
module.exports={adrienSeed,melatiSeed};
