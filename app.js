const $ = (s) => document.querySelector(s);
const asset = (name) => `assets/${name}`;
function getCarouselPosition(current, max, step, direction) {
  if (max <= 0) return 0;
  // Reach the actual edge before wrapping, including a partial final card.
  if (direction > 0) return current >= max - 1 ? 0 : Math.min(current + step, max);
  return current <= 1 ? max : Math.max(current - step, 0);
}
const promos = [["tving-poster-0.jpg", "TVING<br>CHOICE", "나의 유죄인간", "P001792187"], ["tving-poster-1.jpg", "ORIGINAL<br>STORY", "100일의 거짓말", "P001791340"], ["tving-poster-2.jpg", "ONLY<br>TVING", "내가 떨릴 수 있게", "P001791920"], ["tving-poster-3.jpg", "TIME TO<br>PLAY", "신인감독 김연경2", "P001792268"]];
const products = [["tving-free-0.jpg", "대탈출 : 더 스토리", "P001772883"], ["tving-free-1.jpg", "언더커버셰프", "P001786901"], ["tving-free-2.jpg", "식스센스: B사이드", "P001790867"], ["tving-free-3.jpg", "견우와 선녀", "P001772441"], ["tving-free-4.jpg", "우주를 줄게", "P001782227"], ["tving-free-5.jpg", "친애하는 X", "P001776344"]];
const ranks = [["tving-poster-0.jpg", "나의 유죄인간", "P001792187"], ["tving-poster-1.jpg", "100일의 거짓말", "P001791340"], ["tving-poster-2.jpg", "내가 떨릴 수 있게", "P001791920"], ["tving-poster-3.jpg", "신인감독 김연경2", "P001792268"], ["tving-poster-4.jpg", "냉장고를 부탁해 since 2014", "P001765388"], ["tving-poster-5.jpg", "심야괴담회 시즌6", "P001788561"], ["tving-poster-6.jpg", "나 혼자 산다", "P001782817"], ["tving-poster-7.jpg", "로또 1등도 출근합니다", "P001790587"], ["tving-poster-8.jpg", "놀면 뭐하니?", "P001781972"], ["tving-poster-9.jpg", "식스센스: B사이드", "P001790867"], ["tving-poster-10.jpg", "원수는 외야석에서♥", "P001791157"], ["tving-poster-11.jpg", "블리치 천년혈전 편 : 화진담(자막)", "P001789808"], ["tving-poster-12.jpg", "신병4 : 사보타주", "P001790586"], ["tving-poster-13.jpg", "우주떡집", "P001789273"], ["tving-poster-14.jpg", "언니네 산지직송3", "P001789236"], ["tving-poster-15.jpg", "맛따라 길따라 대명이따라", "P001792810"], ["tving-poster-16.jpg", "탐정들의 영업비밀", "P001752507"], ["tving-poster-17.jpg", "스트릿 월드 파이터 : 디렉터스 워", "P001789206"], ["tving-poster-18.jpg", "가족관계증명서", "P001789076"], ["tving-poster-19.jpg", "벌거벗은 세계사", "P001392765"]];
const stats = () => '<div class="stats"><img src="assets/e7c0a.svg" alt=""><span>TVING</span><img src="assets/f40f9.svg" alt=""><span>콘텐츠</span></div>';
const price = () => '<div class="price"><span>TVING</span>지금 만나보세요</div>';
let liked; let cart;
try { liked = JSON.parse(localStorage.getItem('tving-demo-likes') || '[]'); cart = JSON.parse(localStorage.getItem('tving-demo-watchlist') || '[]'); } catch { liked=[]; cart=[]; }
function save(){try{localStorage.setItem('tving-demo-likes',JSON.stringify(liked));localStorage.setItem('tving-demo-watchlist',JSON.stringify(cart));}catch{} $('#cart-count').hidden=!cart.length;$('#cart-count').textContent=cart.length;}
save();
const promoGenres=['드라마 · 로맨스','사극 · 로맨스','드라마 · 로맨스','스포츠 · 예능 · 배구'];
const promoDescriptions=['설렘과 긴장 사이, 마음을 흔드는 이야기.','거짓말 끝에서 마주하게 될 진심.','익숙한 일상에 찾아온 새로운 떨림.','전설은 끝나지 않았다.<br>이번엔 감독으로, 다시 코트 위에 선다.'];
$('#promotion-track').innerHTML = Array.from({length:5},()=>promos).flat().map(([img,title,text,code],i)=>{const index=i%4;const words=title.split('<br>');return `<article class="promo-card"><div class="promo-title">${words[0]}<br><span>${words[1]}</span></div><button class="open-product promo-poster" data-kind="promo" data-index="${index}" aria-label="${text} 자세히 보기"><img class="promo-image" src="${asset(img)}" alt="${text} 포스터"></button><div class="promo-body"><h3>${text}</h3><p class="promo-genre">${promoGenres[index]}</p><p class="promo-description">${promoDescriptions[index]}</p><div class="promo-actions"><button class="like" data-like="${index}" aria-label="${text} 찜하기" aria-pressed="${liked.includes(index)}"><img src="assets/e9305.svg" alt=""></button><a class="promo-play" href="https://www.tving.com/contents/${code}" target="_blank" rel="noopener noreferrer" aria-label="${text} 시청하기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 4 13 8-13 8Z"/></svg></a></div></div></article>`;}).join('');
const freeGenres=['미스터리 · 예능','요리 · 예능','추리 · 예능','판타지 · 로맨스','로맨스 · 드라마','스릴러 · 드라마'];
const freeHooks=['취향 저격 · 정주행 추천','셰프들의 숨 막히는 승부','반전 가득한 가짜 찾기','설렘 가득한 판타지 로맨스','마음을 채우는 이야기','눈을 뗄 수 없는 긴장감'];
$('#live-track').innerHTML = Array.from({length:5},()=>products).flat().map(([img,title,code],i)=>`<article class="live-card"><button class="live-poster open-product" data-kind="live" data-index="${i%6}" aria-label="${title} 자세히 보기"><img src="${asset(img)}" alt="${title} 포스터"><span class="free-badge">1화 무료</span></button><div class="live-card-body"><h3>${title}</h3><p class="live-genre">${freeGenres[i%6]}</p><p class="live-recommendation">${freeHooks[i%6]}</p><a class="live-play" href="https://www.tving.com/contents/${code}" target="_blank" rel="noopener noreferrer" aria-label="${title} 시청하기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg></a></div></article>`).join('');
const rankPageSize = 10;
const rankPageCount = Math.ceil(ranks.length / rankPageSize);
let rankPage = 0;
let rankLikes=[];
try{rankLikes=JSON.parse(localStorage.getItem('tving-rank-likes')||'[]');}catch{}
function renderRanks() {
  const start = rankPage * rankPageSize;
  $('#ranking-grid').innerHTML = ranks.slice(start, start + rankPageSize).map(([img, title], i) => {
    const index = start + i;
    return `<article class="rank-card"><img class="rank-image" src="${asset(img)}" alt="${title} 포스터"><div class="rank-info"><p class="rank-meta">인기 콘텐츠 · TOP ${index + 1}</p><h3>${title}</h3><p class="rank-summary">오늘 가장 주목받는 콘텐츠</p><div class="rank-actions"><a class="rank-watch" href="https://www.tving.com/contents/${ranks[index][2]}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></svg>지금 시청하기</a><button class="rank-save" data-rank-like="${index}" aria-pressed="${rankLikes.includes(index)}"><span aria-hidden="true">${rankLikes.includes(index)?'✓':'+'}</span> ${rankLikes.includes(index)?'찜한 콘텐츠':'찜하기'}</button></div></div></article>`;
  }).join('');
  $('#ranking-grid').setAttribute('aria-label', `티빙 인기 콘텐츠 ${rankPage + 1} / ${rankPageCount} 페이지`);
}
renderRanks();
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);}
function addCart(item){if(cart.some(x=>x[0]===item[0])){toast("이미 추가한 콘텐츠입니다.");return;}cart.push(item);save();toast('관심 콘텐츠에 추가했습니다.');}
const modal=$('#modal');
function show(content){$('#modal-body').innerHTML=content;if(!modal.open)modal.showModal();}
$('.close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
document.addEventListener('click',e=>{
  const rankLike=e.target.closest('[data-rank-like]');if(rankLike){const id=Number(rankLike.dataset.rankLike);rankLikes=rankLikes.includes(id)?rankLikes.filter(x=>x!==id):[...rankLikes,id];try{localStorage.setItem('tving-rank-likes',JSON.stringify(rankLikes));}catch{}renderRanks();return;}
  const like=e.target.closest('[data-like]');if(like){const id=Number(like.dataset.like);liked=liked.includes(id)?liked.filter(x=>x!==id):[...liked,id];document.querySelectorAll(`[data-like="${id}"]`).forEach(x=>x.setAttribute('aria-pressed',liked.includes(id)));save();return;}
  const download=e.target.closest('[data-download]');if(download){const p=promos[Number(download.dataset.download)];show(`<h2>${p[2]} 다운로드</h2><p>다운로드 가능 여부와 이용 방법은 티빙 공식 서비스에서 확인해 주세요.</p><p>이 페이지에서는 영상 파일을 직접 내려받을 수 없습니다.</p><a class="dialog-action" href="https://www.tving.com/contents/${p[3]}" target="_blank" rel="noopener noreferrer">티빙에서 확인하기 ↗</a>`);return;}
  const arrow=e.target.closest('[data-track]');if(arrow){const track=document.getElementById(arrow.dataset.track);if(!track.classList.contains('expanded')){moveLoopingTrack(track,Number(arrow.dataset.dir));return;}const card=track.firstElementChild;const step=card.getBoundingClientRect().width+(parseFloat(getComputedStyle(track).columnGap)||0);const next=getCarouselPosition(track.scrollLeft,track.scrollWidth-track.clientWidth,step,Number(arrow.dataset.dir));track.scrollTo({left:next,behavior:'smooth'});return;}
  const more=e.target.closest('[data-more]');if(more){const track=document.getElementById(more.dataset.more);track.classList.toggle('expanded');more.textContent=track.classList.contains('expanded')?'접기':'더보기';return;}
  const rank=e.target.closest('[data-rank]');if(rank){rankPage=(rankPage+Number(rank.dataset.rank)+rankPageCount)%rankPageCount;renderRanks();return;}
  const product=e.target.closest('.open-product');if(product){const index=Number(product.dataset.index);const source=product.dataset.kind==='promo'?promos:product.dataset.kind==='rank'?ranks:products;const p=source[index];const title=product.dataset.kind==='promo'?p[2]:p[1];show(`<img class="dialog-product" src="${asset(p[0])}" alt="${title}"><h2>${title}</h2>${price()}<p><a href="https://www.tving.com/contents/${product.dataset.kind==='promo'?p[3]:p[2]}" target="_blank" rel="noopener noreferrer">티빙에서 작품 보기 ↗</a></p><button class="dialog-action" id="detail-add">관심 콘텐츠에 추가</button>`);$('#detail-add').onclick=()=>addCart([p[0],title]);return;}
  const info=e.target.closest('[data-info]');if(info)show(`<h2>${info.dataset.info}</h2><p>티빙 콘텐츠를 소개하는 데모 페이지입니다. 서비스 이용과 정책의 자세한 내용은 티빙 공식 사이트에서 확인해 주세요.</p><p><a href="https://www.tving.com/help" target="_blank" rel="noopener noreferrer">티빙 고객센터 ↗</a></p>`);
});
$('#cart').onclick=()=>{show('<h2>관심 콘텐츠</h2>'+(cart.length?cart.map(([img,title],i)=>`<div class="result"><img src="${asset(img)}" alt=""><div>${title}<br>TVING에서 보기</div><button data-remove="${i}" aria-label="콘텐츠 삭제">×</button></div>`).join(''):'<p>관심 콘텐츠가 없습니다.</p>'));document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.remove),1);save();$('#cart').click();});};
$('#profile').onclick=()=>show(`<h2>마이페이지</h2><p>찜한 콘텐츠 ${liked.length}개</p>`+liked.map(i=>`<div class="result"><img src="${asset(promos[i][0])}" alt=""><span>${promos[i][2]}</span></div>`).join(''));
$('#search').onclick=()=>{show('<h2>콘텐츠 검색</h2><input id="search-input" type="search" placeholder="보고 싶은 콘텐츠를 검색하세요" aria-label="콘텐츠 검색어"><div id="search-results"></div>');const input=$('#search-input');input.oninput=()=>{const q=input.value.trim().toLowerCase();const matches=[...ranks,...products].filter(p=>p[1].toLowerCase().includes(q));$('#search-results').innerHTML=q?(matches.length?matches.map(([img,title])=>`<div class="result"><img src="${asset(img)}" alt=""><span>${title}</span></div>`).join(''):'<p>검색 결과가 없습니다.</p>'):'';};input.focus();};
$('#calendar').onclick=()=>show('<h2>콘텐츠 공개 일정</h2><p>티빙에서 작품별 공개 일정과 편성표를 확인하세요.</p><a class="dialog-action" href="https://www.tving.com/service/schedule-weekly?type=contents" target="_blank" rel="noopener noreferrer">티빙 공개 일정 보기 ↗</a>');
document.addEventListener('click',e=>{if(e.target.id==='go-live')modal.close();});
$('.top').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
const slides=['tving-hero-0.jpg','tving-hero-1.jpg','tving-hero-2.jpg'];
const descriptions=['원수는 외야석에서♥','냉장고를 부탁해 since 2014','식스센스: B사이드'];
let slide=0, paused=false, autoTimer, drag=null;
const hero=$('.hero');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function restartAutoplay(){
  clearTimeout(autoTimer);
  if(!paused&&!document.hidden&&!reducedMotion.matches&&!drag){
    autoTimer=setTimeout(()=>setSlide(slide+1),8000);
  }
}
function setSlide(index){
  slide=(index+slides.length)%slides.length;
  hero.dataset.slide=String(slide);
  $('#hero-image').src=asset(slides[slide]);
  $('#hero-image').alt=descriptions[slide];
  $('#hero-title').src=asset(slide===2?'tving-title-2-hd.png':`tving-title-${slide}.png`);
  $('#hero-title').alt=descriptions[slide];
  const heroCodes=['P001791157','P001765388','P001790867'];
  $('#hero-watch').href=`https://www.tving.com/contents/${heroCodes[slide]}`;
  $('#hero-watch').setAttribute('aria-label',`${descriptions[slide]} 보러가기`);
  document.querySelectorAll('[data-slide]').forEach(button=>{
    const active=Number(button.dataset.slide)===slide;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  restartAutoplay();
}
$('#hero-prev').onclick=()=>setSlide(slide-1);
$('#hero-next').onclick=()=>setSlide(slide+1);
document.querySelectorAll('[data-slide]').forEach(button=>button.onclick=()=>setSlide(Number(button.dataset.slide)));
$('#pause').onclick=()=>{
  paused=!paused;
  $('#pause').setAttribute('aria-label',paused?'슬라이드 재생':'슬라이드 일시정지');
  $('#pause').innerHTML=paused?'▶':'<img src="assets/c8a13.svg" alt="">';
  restartAutoplay();
};
hero.addEventListener('dragstart',event=>event.preventDefault());
hero.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0||event.target.closest('button,a'))return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY};
  clearTimeout(autoTimer);
  hero.setPointerCapture(event.pointerId);
  hero.classList.add('dragging');
});
hero.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  const dx=event.clientX-drag.x;
  const dy=event.clientY-drag.y;
  if(Math.abs(dx)>Math.abs(dy))hero.style.setProperty('--drag-offset',`${Math.max(-100,Math.min(100,dx*.3))}px`);
});
function endDrag(event){
  if(!drag||event.pointerId!==drag.id)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  drag=null;
  hero.classList.remove('dragging');
  hero.style.removeProperty('--drag-offset');
  if(hero.hasPointerCapture(event.pointerId))hero.releasePointerCapture(event.pointerId);
  const threshold=Math.max(35,Math.min(80,hero.clientWidth*.08));
  if(event.type==='pointerup'&&Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy)*1.2)setSlide(slide+(dx<0?1:-1));
  else restartAutoplay();
}
hero.addEventListener('pointerup',endDrag);
hero.addEventListener('pointercancel',endDrag);
hero.addEventListener('lostpointercapture',endDrag);
document.addEventListener('visibilitychange',restartAutoplay);
reducedMotion.addEventListener('change',restartAutoplay);
setSlide(0);
$('#countdown').textContent='PLAY NOW';

// A single viewport index follows the section at the center of the screen.
const indexedSections = [
  { element: $('#promotion'), label: 'TVING' },
  { element: $('#live'), label: 'PLAY' },
  { element: $('#ranking'), label: 'RANKING' }
];
const sectionIndex = $('#section-index');
let indexFrame = 0;
function updateSectionIndex() {
  indexFrame = 0;
  const midpoint = window.innerHeight / 2;
  const active = indexedSections.find(({ element }) => {
    const rect = element.getBoundingClientRect();
    return rect.top <= midpoint && rect.bottom > midpoint;
  });
  sectionIndex.hidden = !active;
  if (active && $('#section-index-label').textContent !== active.label) {
    $('#section-index-label').textContent = active.label;
  }
}
function scheduleIndexUpdate() {
  if (!indexFrame) indexFrame = requestAnimationFrame(updateSectionIndex);
}
window.addEventListener('scroll', scheduleIndexUpdate, { passive: true });
window.addEventListener('resize', scheduleIndexUpdate);
new ResizeObserver(scheduleIndexUpdate).observe(document.querySelector('main'));
updateSectionIndex();

// Repeat complete card groups so both directions have identical content at the seam.
const loopingTracks = [
  { track: $('#promotion-track'), count: promos.length },
  { track: $('#live-track'), count: products.length }
];
function loopMetrics(track) {
  const entry = loopingTracks.find(item => item.track === track);
  const first = track.firstElementChild;
  const step = first.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  return { step, period: step * entry.count };
}
function jumpTrack(track, left) {
  track.scrollTo({ left, behavior: 'instant' });
}
function normalizeLoop(track) {
  if (track.classList.contains('expanded')) return;
  const { period } = loopMetrics(track);
  const left = track.scrollLeft;
  if (period && (left < period || left >= period * 3)) {
    jumpTrack(track, period * 2 + ((left % period) + period) % period);
  }
}
function moveLoopingTrack(track, direction) {
  if (track.classList.contains('expanded')) return;
  normalizeLoop(track);
  const { step } = loopMetrics(track);
  track.scrollTo({ left: track.scrollLeft + step * direction, behavior: 'smooth' });
}
for (const { track } of loopingTracks) {
  let settleTimer;
  const initialize = () => {
    if (!track.classList.contains('expanded')) jumpTrack(track, loopMetrics(track).period * 2);
  };
  initialize();
  track.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => normalizeLoop(track), 150);
  }, { passive: true });
  track.addEventListener('scrollend', () => normalizeLoop(track));
  new ResizeObserver(initialize).observe(track);
  if (track.id === 'promotion-track') {
    setInterval(() => {
      if (!document.hidden && !reducedMotion.matches) moveLoopingTrack(track, 1);
    }, 4000);
  }
}
