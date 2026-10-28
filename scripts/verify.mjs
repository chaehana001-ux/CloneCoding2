import { writeFile } from 'node:fs/promises';
const tabs=await (await fetch('http://localhost:9222/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map();const errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params);};
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://localhost:5173'});
await new Promise(r=>setTimeout(r,1500));
await evaluate('document.querySelector("#pause").click()');
console.log('desktop',await evaluate('JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})'));
await writeFile('/tmp/live-evil-desktop.png',Buffer.from((await send('Page.captureScreenshot',{captureBeyondViewport:true,clip:{x:0,y:0,width:1920,height:3986,scale:.5}})).data,'base64'));
console.log('interactions',await evaluate(`(()=>{document.querySelector('[data-like="0"]').click();const liked=document.querySelector('[data-like="0"]').getAttribute('aria-pressed');document.querySelector('[data-add="0"]').click();const count=document.querySelector('#cart-count').textContent;document.querySelector('#cart').click();const cart=document.querySelector('dialog').open;document.querySelector('.close').click();document.querySelector('#search').click();const input=document.querySelector('#search-input');input.value='선글라스';input.dispatchEvent(new Event('input'));const results=document.querySelectorAll('#search-results .result').length;document.querySelector('.close').click();return JSON.stringify({liked,count,cart,results});})()`));
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await new Promise(r=>setTimeout(r,300));
console.log('mobile',await evaluate('JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.naturalWidth).length})'));
await writeFile('/tmp/live-evil-mobile.png',Buffer.from((await send('Page.captureScreenshot',{captureBeyondViewport:true,clip:{x:0,y:0,width:390,height:Math.min(await evaluate('document.documentElement.scrollHeight'),6000),scale:1}})).data,'base64'));
console.log('errors',JSON.stringify(errors));
await evaluate('localStorage.clear()');ws.close();
