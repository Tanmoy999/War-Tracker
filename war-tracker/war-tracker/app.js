// ─── CONFIG ──────────────────────────────────────────────
const DATA_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? './data/stats.json' : '/.netlify/functions/stats';
let appData = null;
let viewerCount = Math.floor(Math.random()*400) + 800;
let mapInitialized = false;
let chartsInitialized = false;

// ─── UTILS ───────────────────────────────────────────────
function fmt(d) {
  return new Date(d).toLocaleString('en-US', {
    month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function animateNumber(el, target) {
  const num = parseInt(target.replace(/[^0-9]/g,''));
  if (isNaN(num) || num === 0) { el.textContent = target; return; }
  const suffix = target.replace(/[0-9,]/g,'');
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const current = Math.floor(num * ease);
    el.textContent = current.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── THEME ───────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('ct_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ct_theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ─── SEARCH ──────────────────────────────────────────────
function openSearch() { document.getElementById('searchOverlay').classList.add('open'); document.getElementById('searchInput').focus(); }
function closeSearch() { document.getElementById('searchOverlay').classList.remove('open'); document.getElementById('searchInput').value=''; document.getElementById('searchResults').innerHTML=''; }

function handleSearch(query) {
  if (!appData || !query.trim()) { document.getElementById('searchResults').innerHTML='<div class="search-empty">Type to search events, countries, stats...</div>'; return; }
  const q = query.toLowerCase();
  const results = [];
  appData.globalStats.forEach(s => { if ((s.label+s.sub+s.value).toLowerCase().includes(q)) results.push({type:'Stat',title:s.label+' — '+s.value,anchor:'globalStats'}); });
  Object.values(appData.countries).forEach(c => { c.stats.forEach(s => { if ((c.name+s.key+s.value).toLowerCase().includes(q)) results.push({type:'Country',title:c.flag+' '+c.name+': '+s.key+' — '+s.value,anchor:'countryGrid'}); }); });
  appData.timeline.forEach(e => { if ((e.title+e.desc+e.date).toLowerCase().includes(q)) results.push({type:'Event',title:e.date+' — '+e.title,anchor:'timeline'}); });
  appData.regional.forEach(r => { if ((r.name+r.desc).toLowerCase().includes(q)) results.push({type:'Region',title:r.flag+' '+r.name+' — '+r.desc.substring(0,60),anchor:'regionGrid'}); });
  appData.militaryAssets.forEach(a => { if ((a.label+a.value).toLowerCase().includes(q)) results.push({type:'Asset',title:a.icon+' '+a.label.replace(/\n/g,' ')+' — '+a.value,anchor:'assetsGrid'}); });

  const el = document.getElementById('searchResults');
  if (!results.length) { el.innerHTML='<div class="search-empty">No results for "'+query+'"</div>'; return; }
  el.innerHTML = results.slice(0,10).map(r => `<div class="search-result" onclick="closeSearch();document.getElementById('${r.anchor}').scrollIntoView({behavior:'smooth',block:'start'})"><div class="sr-type">${r.type}</div><div class="sr-title">${r.title}</div></div>`).join('');
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); openSearch(); }
  if (e.key==='Escape') closeSearch();
});

// ─── SHARING ─────────────────────────────────────────────
function shareCard(label, value) {
  const text = `${label}: ${value} — Conflict Tracker (Iran·Israel·USA 2026)\n${window.location.href}`;
  if (navigator.share) { navigator.share({title:'Conflict Tracker',text,url:window.location.href}).catch(()=>{}); }
  else { navigator.clipboard.writeText(text).then(()=>showToast('📋 Copied to clipboard!')); }
}
function shareToTwitter() { window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('Live conflict tracker — Iran·Israel·USA 2026 '+window.location.href),'_blank'); }
function shareToReddit() { window.open('https://reddit.com/submit?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent('Live Conflict Tracker — Iran·Israel·USA 2026'),'_blank'); }
function shareToTelegram() { window.open('https://t.me/share/url?url='+encodeURIComponent(window.location.href)+'&text='+encodeURIComponent('Live conflict tracker — Iran·Israel·USA 2026'),'_blank'); }
function copyLink() { navigator.clipboard.writeText(window.location.href).then(()=>showToast('🔗 Link copied!')); }
function embedCard(statId) {
  const code = `<iframe src="${window.location.origin}/embed.html?stat=${statId}" width="280" height="180" frameborder="0"></iframe>`;
  navigator.clipboard.writeText(code).then(()=>showToast('📦 Embed code copied!'));
}

// ─── NOTIFICATIONS ───────────────────────────────────────
async function toggleNotifications() {
  const btn = document.getElementById('notifyBtn');
  if (!('Notification' in window)) { showToast('❌ Notifications not supported'); return; }
  if (Notification.permission === 'granted') { btn.classList.toggle('active'); showToast(btn.classList.contains('active')?'🔔 Notifications on':'🔕 Notifications off'); return; }
  const perm = await Notification.requestPermission();
  if (perm==='granted') { btn.classList.add('active'); showToast('🔔 Notifications enabled!'); }
  else showToast('❌ Notifications blocked');
}

// ─── VIEWERS ─────────────────────────────────────────────
function updateViewers() {
  viewerCount += Math.floor(Math.random()*11) - 5;
  viewerCount = Math.max(600, viewerCount);
  const el = document.getElementById('viewerCount');
  if (el) el.textContent = viewerCount.toLocaleString();
}
setInterval(updateViewers, 8000);

// ─── BUILD FUNCTIONS ─────────────────────────────────────
function buildGlobalStats(stats) {
  return stats.map((s,i) => `
    <div class="stat-card ${s.color}" style="animation-delay:${i*0.06}s" id="stat-${s.id}">
      <div class="card-actions">
        <button class="card-action-btn" onclick="event.stopPropagation();shareCard('${s.label.replace(/'/g,"\\'")}','${s.value}')" title="Share">🔗</button>
        <button class="card-action-btn" onclick="event.stopPropagation();embedCard('${s.id}')" title="Embed">📦</button>
      </div>
      <div class="label">${s.label}</div>
      <div class="number" data-target="${s.value}">${s.value}</div>
      <div class="sub">${s.sub}<br/><span>${s.source}</span></div>
    </div>`).join('');
}

function buildCountries(countries) {
  return Object.values(countries).map(c => `
    <div class="country-card">
      <div class="country-header">
        <div class="country-name">${c.flag} ${c.name}</div>
        <div class="country-role">${c.role}</div>
      </div>
      ${c.stats.map(s => `
        <div class="country-row">
          <span class="key">${s.key}</span>
          <span class="val ${s.color!=='normal'?s.color:''}">${s.value}</span>
        </div>`).join('')}
    </div>`).join('');
}

function buildAssets(assets) {
  return assets.map(a => `
    <div class="asset-card">
      <span class="asset-icon">${a.icon}</span>
      <div class="asset-num" data-target="${a.value}">${a.value}</div>
      <div class="asset-name">${a.label}</div>
    </div>`).join('');
}

function buildTimeline(events) {
  return events.map((e,i) => {
    const cat = categorizeEvent(e);
    return `
    <div class="event-row" data-category="${cat}">
      <div class="event-date">${e.date}${e.sublabel?'<br/>'+e.sublabel:''}</div>
      <div class="event-line-col">
        <div class="event-dot ${e.color}"></div>
        ${i<events.length-1?'<div class="event-line"></div>':''}
      </div>
      <div class="event-content" onclick="this.classList.toggle('expanded')">
        <div class="event-title">${e.title} <span style="font-size:0.6rem;color:var(--muted)">▾</span></div>
        <div class="event-desc">${e.desc}</div>
      </div>
    </div>`;
  }).join('');
}

function categorizeEvent(e) {
  const t = (e.title+e.desc).toLowerCase();
  if (t.includes('ceasefire')||t.includes('broker')||t.includes('iaea')||t.includes('diplomat')) return 'diplomacy';
  if (t.includes('killed')||t.includes('death')||t.includes('casualt')||t.includes('wounded')) return 'casualties';
  if (t.includes('strike')||t.includes('bomb')||t.includes('destroy')||t.includes('attack')||t.includes('operation')) return 'strikes';
  return 'all';
}

function filterTimeline(cat) {
  document.querySelectorAll('.timeline-filter').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.event-row').forEach(r => {
    r.classList.toggle('hidden', cat!=='all' && r.dataset.category!==cat && r.dataset.category!=='all');
  });
}

function buildRegional(regions) {
  return regions.map(r => `
    <div class="region-card">
      <div class="r-badge ${r.badge}">${r.status}</div>
      <div class="r-name">${r.flag} ${r.name}</div>
      <div class="r-status">${r.desc}</div>
    </div>`).join('');
}

// ─── MAP ─────────────────────────────────────────────────
function initMap(data) {
  if (typeof L === 'undefined' || mapInitialized) return;
  mapInitialized = true;
  const map = L.map('conflictMap',{zoomControl:true,scrollWheelZoom:true}).setView([30,48],4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'© CartoDB',maxZoom:18
  }).addTo(map);

  const markers = [
    {lat:35.69,lng:51.39,title:'Tehran',desc:'Capital — Supreme Leader compound destroyed. IRIB HQ struck.',color:'#e63946',size:14},
    {lat:32.65,lng:51.67,title:'Isfahan',desc:'Nuclear facility targeted by US bunker-busters.',color:'#e63946',size:12},
    {lat:34.64,lng:50.88,title:'Qom',desc:'Religious center — military infrastructure struck.',color:'#e63946',size:10},
    {lat:35.84,lng:50.94,title:'Karaj',desc:'Nuclear centrifuge production site targeted.',color:'#e63946',size:10},
    {lat:34.31,lng:47.07,title:'Kermanshah',desc:'Western Iran — missile launches and counter-strikes.',color:'#f4a261',size:9},
    {lat:32.65,lng:51.68,title:'Natanz',desc:'Primary uranium enrichment facility — destroyed by US.',color:'#e63946',size:12},
    {lat:32.09,lng:34.78,title:'Tel Aviv',desc:'Israel — missile defense active. Iron Dome intercepts.',color:'#48cae4',size:12},
    {lat:32.79,lng:34.99,title:'Haifa',desc:'Military base struck by Hezbollah rockets + drones.',color:'#f4a261',size:10},
    {lat:31.75,lng:34.99,title:'Beit Shemesh',desc:'9 killed in single ballistic missile strike.',color:'#e63946',size:10},
    {lat:25.12,lng:51.32,title:'Al Udeid, Qatar',desc:'US base hit by 2 ballistic missiles. 65+ intercepted.',color:'#e63946',size:11},
    {lat:26.23,lng:50.59,title:'Manama, Bahrain',desc:'US 5th Fleet HQ struck multiple times.',color:'#e63946',size:10},
    {lat:29.38,lng:47.98,title:'Kuwait City',desc:'US warplanes crashed. 3+ killed from shrapnel.',color:'#f4a261',size:9},
    {lat:36.19,lng:44.01,title:'Erbil, Iraq',desc:'Airport area struck. Iranian proxy groups active.',color:'#f4a261',size:9},
    {lat:33.89,lng:35.50,title:'Beirut, Lebanon',desc:'50+ killed, 335+ wounded from Israeli strikes.',color:'#e63946',size:10},
    {lat:24.71,lng:46.68,title:'Riyadh, Saudi Arabia',desc:'Eastern Province oil infrastructure targeted.',color:'#f4a261',size:9},
    {lat:31.95,lng:35.93,title:'Amman, Jordan',desc:'49 drones/missiles intercepted. No casualties.',color:'#48cae4',size:8},
  ];

  markers.forEach(m => {
    const icon = L.divIcon({
      className:'',
      html:`<div style="width:${m.size}px;height:${m.size}px;background:${m.color};border-radius:50%;box-shadow:0 0 ${m.size}px ${m.color}80;animation:blink 2s infinite;"></div>`,
      iconSize:[m.size,m.size],iconAnchor:[m.size/2,m.size/2]
    });
    L.marker([m.lat,m.lng],{icon}).addTo(map).bindPopup(`<strong style="color:${m.color}">${m.title}</strong><br/>${m.desc}`);
  });
}

// ─── CHARTS ──────────────────────────────────────────────
function initCharts(data) {
  if (typeof Chart === 'undefined' || chartsInitialized) return;
  chartsInitialized = true;
  Chart.defaults.color = '#666680';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
  Chart.defaults.font.family = "'IBM Plex Mono',monospace";
  Chart.defaults.font.size = 10;

  // Casualty timeline chart
  const ctx1 = document.getElementById('casualtyChart');
  if (ctx1) new Chart(ctx1,{type:'line',data:{
    labels:['Jun 13','Jun 18','Jun 22','Jun 24','Feb 28','Mar 1','Mar 2','Mar 3','Mar 4'],
    datasets:[{label:'Iran Deaths',data:[120,480,890,1190,1350,1555,2045,2200,2400],borderColor:'#e63946',backgroundColor:'rgba(230,57,70,0.1)',fill:true,tension:0.3,pointRadius:4},
      {label:'Israel Deaths',data:[0,5,12,28,28,28,28,28,28],borderColor:'#e9c46a',backgroundColor:'rgba(233,196,106,0.1)',fill:true,tension:0.3,pointRadius:4},
      {label:'US Deaths',data:[0,0,0,0,0,2,6,6,6],borderColor:'#48cae4',backgroundColor:'rgba(72,202,228,0.1)',fill:true,tension:0.3,pointRadius:4}]
  },options:{responsive:true,plugins:{legend:{labels:{boxWidth:12,padding:16}}},scales:{y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.04)'}},x:{grid:{color:'rgba(255,255,255,0.04)'}}}}});

  // Military comparison bar chart
  const ctx2 = document.getElementById('militaryChart');
  if (ctx2) new Chart(ctx2,{type:'bar',data:{
    labels:['Missiles Fired','Drones Deployed','Munitions Dropped','Ships Destroyed','Jets Used','Cities Targeted'],
    datasets:[{label:'Iran',data:[550,1000,0,0,0,0],backgroundColor:'rgba(230,57,70,0.7)'},
      {label:'Israel/US',data:[0,0,1200,17,200,163],backgroundColor:'rgba(72,202,228,0.7)'}]
  },options:{responsive:true,indexAxis:'y',plugins:{legend:{labels:{boxWidth:12,padding:16}}},scales:{x:{grid:{color:'rgba(255,255,255,0.04)'}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});
}

// ─── SCROLL ANIMATIONS ──────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.number[data-target], .asset-num[data-target]').forEach(el => {
          animateNumber(el, el.dataset.target);
        });
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.2});
  document.querySelectorAll('.stat-grid, .assets-grid').forEach(g => observer.observe(g));
}

// ─── RENDER ──────────────────────────────────────────────
function render(data) {
  appData = data;
  const m = data.meta;
  document.getElementById('ticker').textContent = m.alertTicker;
  document.getElementById('lastUpdated').textContent = 'Last updated: ' + fmt(m.lastUpdated);
  document.getElementById('conflictStart').textContent = 'Phase 2 start: ' + m.phase2Start;
  document.getElementById('operationNames').textContent = m.operationNames[0];
  document.getElementById('conflictDay').textContent = `⬛ DAY ${m.currentDay} OF ACTIVE CONFLICT`;
  document.getElementById('footerDate').textContent = new Date(m.lastUpdated).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  document.getElementById('globalStats').innerHTML = buildGlobalStats(data.globalStats);
  document.getElementById('countryGrid').innerHTML = buildCountries(data.countries);
  document.getElementById('assetsGrid').innerHTML = buildAssets(data.militaryAssets);
  document.getElementById('timeline').innerHTML = buildTimeline(data.timeline);
  document.getElementById('regionGrid').innerHTML = buildRegional(data.regional);
  document.getElementById('sources').innerHTML = '<strong>Sources:</strong> ' + data.sources.join(' · ');
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('app').style.opacity = '1';
  initScrollAnimations();
  initMap(data);
  initCharts(data);
}

// ─── DATA LOADING ────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch(DATA_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    render(data);
    document.getElementById('fetchTime').textContent = new Date().toLocaleTimeString();
  } catch(err) {
    console.error('Failed to load data:', err);
    document.getElementById('fetchTime').textContent = 'Failed to load — retrying...';
  }
}

// ─── INIT ────────────────────────────────────────────────
initTheme();
loadData();
setInterval(loadData, 60000);

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
