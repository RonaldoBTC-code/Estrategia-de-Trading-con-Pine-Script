const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../cb-swing-pro-dashboard.html'),'utf8');
const code=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean).join('\n').replace(/initChart\(\);\s*boot\('BTC'\);/,'');
const results=[];
function env(){
  const element={innerHTML:'',textContent:'',className:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},querySelector(){return element},prepend(){},children:[]};
  const timers=[];const sockets=[];
  class Socket{constructor(){sockets.push(this)}close(){if(this.onclose)this.onclose()}}
  const c=vm.createContext({console,Date,Math,AbortController,setInterval:()=>1,clearInterval(){},setTimeout:f=>{timers.push(f);return timers.length},clearTimeout(){},WebSocket:Socket,document:{getElementById:()=>element,querySelector:()=>element,querySelectorAll:()=>[]},window:{addEventListener(){}},fetch:async()=>{throw Error('Network disabled')}});
  vm.runInContext(code,c);const ev=s=>vm.runInContext(s,c);
  ev('paintFull=()=>{};renderPipe=()=>{};renderMetrics=()=>{};drawEquity=()=>{};setPrice=()=>{};clearPosLines=()=>{};drawPosLines=()=>{};logEv=()=>{};candleS={setMarkers(){}};');
  return {c,ev,timers,sockets};
}
async function test(name,f){try{await f();results.push({name,status:'PASS'})}catch(e){results.push({name,status:'FAIL',detail:e.stack});process.exitCode=1}}
(async()=>{
 await test('RSI Wilder, warmup y extremos',()=>{const {ev}=env();const seq=[100,101,100,101,100,101,100,101,100,101,100,101,100,101,100,110];const actual=ev(`rsiArr(${JSON.stringify(seq)},14)[15]`);assert(Math.abs(actual-71.73913043478261)<1e-10);assert(ev('Number.isNaN(rsiArr([1,2,3],14)[2])'));assert.equal(ev('rsiArr(Array(16).fill(1),14)[15]'),50);assert.equal(ev('rsiArr(Array.from({length:16},(_,i)=>i),14)[15]'),100);assert.equal(ev('rsiArr(Array.from({length:16},(_,i)=>16-i),14)[15]'),0)});
 await test('Cooldown avanza después de 1000 barras; duplicados no avanzan',()=>{const {ev}=env();ev('onBarClose=()=>{};');for(let i=0;i<1050;i++){ev(`pushClosedBar({time:${i*60},open:100,high:101,low:99,close:100,volume:1000})`);if(i===619)ev('lastEntryBar=barNumber');}assert.equal(ev('barNumber-lastEntryBar'),430);assert.equal(ev('candles.length'),620);const n=ev('barNumber');ev('pushClosedBar({...candles.at(-1)});pushClosedBar({...candles.at(-1),time:0})');assert.equal(ev('barNumber'),n)});
 await test('Roundtrip mismo precio resta comisión y deslizamiento',()=>{const {ev}=env();ev('pos={entry:100.02,dir:1,realized:0};realize(100,1,"exit")');assert(Math.abs(ev('equity')-9999.8)<1e-8)});
 await test('Respuesta BTC tardía no contamina ETH; REST abierta excluida',async()=>{const {c,ev}=env();const pending=[];c.fetch=url=>new Promise(resolve=>pending.push({url,resolve}));ev('runSeed=s=>{window.seed={symbol:P.sym,price:s[0].close,count:s.length}};connectWS=()=>{}');const a=ev('boot("BTC")'),b=ev('boot("ETH")');const response=p=>({ok:true,json:async()=>[[1000,p,p,p,p,10,2000],[Date.now(),p,p,p,p,10,Date.now()+60000]]});pending[1].resolve(response(3000));await b;pending[0].resolve(response(60000));await a;assert.equal(ev('window.seed.symbol'),'ETHUSDT');assert.equal(ev('window.seed.price'),3000);assert.equal(ev('window.seed.count'),1)});
 await test('WebSocket cierre reconecta y generaciones antiguas se descartan',async()=>{const {ev,sockets,timers,c}=env();ev('fetchController=new AbortController();connectWS()');const old=sockets[0];old.onopen();old.onclose();assert.equal(timers.length,1);ev('generation++;');await timers[0]();assert.equal(sockets.length,1);old.onmessage({data:JSON.stringify({k:{s:'BTCUSDT',t:1000,o:1,h:1,l:1,c:1,v:1,x:true}})});assert.equal(ev('candles.length'),0)});
 await test('WebSocket duplica cierre una sola vez y recupera hueco por REST',async()=>{const {ev,sockets,timers,c}=env();ev('fetchController=new AbortController();onBarClose=()=>{};connectWS()');const socket=sockets[0];const t=Math.floor(Date.now()/60000)*60-60;const msg=time=>({data:JSON.stringify({k:{s:'BTCUSDT',t:time*1000,o:100,h:101,l:99,c:100,v:10,x:true}})});socket.onmessage(msg(t-60));socket.onmessage(msg(t-60));assert.equal(ev('barNumber'),0);socket.onmessage(msg(t+60));assert.equal(ev('barNumber'),0);c.fetch=async()=>({ok:true,json:async()=>[[t*1000,100,101,99,100,10,t*1000+59999]]});await timers[0]();assert.equal(ev('barNumber'),1);assert.equal(sockets.length,2)});
 await test('Simulación reproducible y aislada de equity anterior',()=>{const {ev}=env();ev('runSeed=s=>{window.seed=JSON.stringify(s.map(({time,...x})=>x))};equity=500;trades=[{pnl:-9500}];seedSim();window.a=window.seed;seedSim()');assert.equal(ev('window.a===window.seed'),true);assert.equal(ev('equity'),10000);assert.equal(ev('trades.length'),0)});
 await test('Trailing nunca afloja en long/short',()=>{for(const dir of [1,-1]){const {ev}=env();ev(`candles=[{time:60,open:100,high:110,low:90,close:100,volume:1}];pos={dir:${dir},entry:100,risk:10,qty:1,rem:1,tps:${dir===1?"[200,300,400]":"[0,-100,-200]"},tp1:true,tp2:true,stop:${dir===1?80:120},realized:0};onBarClose({c:candles[0],i:0,atr:100,e20:100,macdH:0,enterL:false,enterS:false})`);assert(dir===1?ev('pos.stop')>=80:ev('pos.stop')<=120)}});
 const pine=fs.readFileSync(path.join(__dirname,'../cb-swing-pro-v15.pine'),'utf8');
 await test('Modelo de fórmula Pine extraída: riesgo, pointvalue y redondeo',()=>{
  const body=pine.match(/f_qty\(_dist\) =>\n([\s\S]*?)\nqty_long/)[1].trim().split('\n').map(s=>s.trim());
  const translated=body.map((s,i)=>i===body.length-1?'return '+s+';':'const '+s+';').join('\n');
  const qty=new Function('equity','eff_risk','i_expo','i_lev','close','_dist','strategy','syminfo','math','f_safe_div',translated);
  for(const lev of [1,5]){const result=qty(10000,1,25,lev,100,10,{convert_to_symbol:v=>v},{pointvalue:1,mincontract:1},Math,(n,d)=>d?n/d:0);assert.equal(result*10,100);}
  const futures=qty(10000,1,25,5,100,10,{convert_to_symbol:v=>v},{pointvalue:5,mincontract:1},Math,(n,d)=>d?n/d:0);assert.equal(futures,2);
 });
 await test('Pine revisión estática: geometría congelada, HTF, contratos y parciales',()=>{assert(pine.includes('lookahead=barmerge.lookahead_on'));assert(pine.includes('timeframe.in_seconds(eff_htf) <= tf_sec'));assert(pine.includes('strategy.convert_to_symbol(cash)'));assert(!pine.includes('cash * i_lev'));assert(pine.includes('i_tp1_pct + i_tp2_pct >= 100'));assert(pine.includes('qty=q1'));assert(pine.includes('processed_closed'));assert(pine.includes('math.max(active_stop, candidate)'));assert(pine.includes('sm := 0.0'));assert(pine.includes("_a=='ORO'?(_d?5:6)"));assert(!pine.includes('v14.0'));});
 console.log(JSON.stringify(results,null,2));
 if(process.argv.includes('--record'))fs.writeFileSync(path.join(__dirname,'../docs/audits/2026-10-02/regression-results.json'),JSON.stringify(results,null,2)+'\n');
})();
