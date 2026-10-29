import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const origin = process.env.VERIFY_URL || 'http://localhost:5173';
const tabs = await (await fetch('http://localhost:9222/json/list')).json();
const tab = tabs.find(t => t.type === 'page');
assert(tab, 'Start a dedicated Chrome with --remote-debugging-port=9222 first.');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let seq = 0;
const pending = new Map(), errors = [];
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id) { const p = pending.get(message.id); pending.delete(message.id); message.error ? p.reject(message.error) : p.resolve(message.result); }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
};
function send(method, params = {}) { return new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); }); }
async function evaluate(expression) { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails)); return result.result.value; }
const delay = ms => new Promise(r => setTimeout(r, ms));
async function load() {
  await send('Page.navigate', { url: origin });
  for (let i = 0; i < 60; i++) { await delay(100); if (await evaluate(`location.href.startsWith(${JSON.stringify(origin)}) && document.readyState==='complete' && !!document.querySelector('.rank-save')`)) break; }
  await evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))');
}
try {
  for (const [path,status,type] of [['/',200,'text/html'],['/styles.css',200,'text/css'],['/app.js',200,'text/javascript'],['/assets/tving-poster-14.png',200,'image/png'],['/.git/config',404],['/missing-page',404],['/%E0%A4%A',400]]) {
    const response=await fetch(origin+path);assert.equal(response.status,status,path);
    if(type)assert(response.headers.get('content-type')?.startsWith(type),path);
  }
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await load();
  // This script uses the dedicated verification browser's local storage.
  await evaluate(`localStorage.setItem('tving-demo-likes','null');localStorage.setItem('tving-demo-watchlist','{}');localStorage.setItem('tving-rank-likes','[null,999,0]')`);
  await load();
  for (const width of [1920, 1440, 1024, 768, 390, 360]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1080, deviceScaleFactor: 1, mobile: width < 700 });
    await delay(200);
    const metrics = await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),ranks:document.querySelectorAll('.rank-card').length})`);
    assert(metrics.scroll <= width + 1, `Horizontal overflow at ${width}: ${metrics.scroll}`);
    assert.deepEqual(metrics.broken, []); assert.equal(metrics.ranks, 8);
    console.log('viewport', width, 'OK');
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
  const interactions = await evaluate(`(()=>{
    const $=s=>document.querySelector(s);
    $('#hero-next').click();const hero=$('.hero').dataset.slide==='1'&&$('#hero-watch').href.endsWith('P001765388');
    $('#hero-prev').click();
    $('[data-rank="1"]').click();const page=$('.rank-meta').textContent.endsWith('3')&&document.querySelectorAll('.rank-card').length===8;
    const rank=$('[data-rank-like="2"]');rank.click();const favorite=$('[data-rank-like="2"]').getAttribute('aria-pressed')==='true';
    $('#profile').click();const profile=$('#modal-body').textContent.includes('내가 떨릴 수 있게');$('.close').click();
    $('[data-like="0"]').click();const likes=[...document.querySelectorAll('[data-like="0"]')].every(b=>b.getAttribute('aria-pressed')==='true');
    $('#search').click();const input=$('#search-input');input.value='식스센스';input.dispatchEvent(new Event('input'));const search=document.querySelectorAll('#search-results .result').length===1;$('.close').click();
    const expanded=[];for(const id of ['promotion-track','live-track']){const more=$('[data-more="'+id+'"]');more.click();expanded.push([...document.getElementById(id).children].filter(c=>!c.hidden).length);more.click();}
    return {hero,page,favorite,profile,likes,search,expanded};
  })()`);
  for (const key of ['hero','page','favorite','profile','likes','search']) assert(interactions[key], key);
  assert.deepEqual(interactions.expanded, [10,6]);
  console.log('interactions', interactions);
  await evaluate('setSlide(0);window.scrollTo(0,0)');await delay(200);
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:900,y:300});
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:900,y:300,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:300,button:'left',buttons:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:700,y:300,button:'left',clickCount:1});
  assert.equal(await evaluate("document.querySelector('.hero').dataset.slide"),'1','Hero drag');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await delay(500);
  const before = await evaluate(`[$('#promotion-track').scrollLeft,$('#live-track').scrollLeft]`);
  await delay(4500);
  const after = await evaluate(`[$('#promotion-track').scrollLeft,$('#live-track').scrollLeft]`);
  console.log('autoplay positions', {before,after});
  assert(Math.abs(after[0]-before[0])>10, 'Recommendation autoplay');
  const freePeriod=await evaluate(`loopMetrics($('#live-track')).period`);
  const freeDelta=((after[1]-before[1])%freePeriod+freePeriod)%freePeriod;
  assert(Math.min(freeDelta,freePeriod-freeDelta)<2, 'Free-episode carousel must not autoplay');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate(`document.querySelector('#ranking').scrollIntoView()`);await delay(250);
  await writeFile('/tmp/tving-verified-desktop.png', Buffer.from((await send('Page.captureScreenshot', { format:'png' })).data,'base64'));
  await send('Emulation.setDeviceMetricsOverride', { width:390,height:844,deviceScaleFactor:1,mobile:true });await delay(250);
  await evaluate('window.scrollTo(0,0)');await delay(250);
  await writeFile('/tmp/tving-verified-mobile.png', Buffer.from((await send('Page.captureScreenshot', { format:'png' })).data,'base64'));
  assert.deepEqual(errors, []);
  console.log('PASS: responsive layouts, all posters, malformed storage, hero links, ranks 1–20, favorites, profile, search, expansion, autoplay and runtime errors.');
} finally { ws.close(); }
