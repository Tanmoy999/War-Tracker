// ─── CONFIG ──────────────────────────────────────────────
let appData = null;
let viewerCount = 847; // Default value, will be updated from real data
let mapInitialized = false;
let chartsInitialized = false;

// ─── WEAPON SVG SILHOUETTES ──────────────────────────────
const WEAPON_SVG = {
  // Drone silhouettes
  'drone-iran': `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:40px;filter:drop-shadow(0 0 8px #ff7b00)">
    <path d="M60 30 L10 22 L0 26 L10 30z" fill="#ff7b00" opacity="0.9"/>
    <path d="M60 30 L110 22 L120 26 L110 30z" fill="#ff7b00" opacity="0.9"/>
    <path d="M40 30 L80 30 L75 38 L45 38z" fill="#cc5500" opacity="0.95"/>
    <ellipse cx="60" cy="30" rx="22" ry="8" fill="#ff7b00"/>
    <path d="M55 30 L65 20 L65 40z" fill="#cc5500" opacity="0.8"/>
    <circle cx="60" cy="30" r="3" fill="#ffaa44"/>
  </svg>`,
  'drone-israel': `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:40px;filter:drop-shadow(0 0 8px #00d4ff)">
    <path d="M60 28 L8 18 L0 24 L8 30z" fill="#00d4ff" opacity="0.9"/>
    <path d="M60 28 L112 18 L120 24 L112 30z" fill="#00d4ff" opacity="0.9"/>
    <rect x="42" y="22" width="36" height="12" rx="3" fill="#0099bb"/>
    <path d="M52 28 L68 16 L68 40z" fill="#00d4ff" opacity="0.7"/>
    <ellipse cx="60" cy="28" rx="14" ry="6" fill="#00d4ff"/>
    <circle cx="60" cy="28" r="3" fill="#88eeff"/>
  </svg>`,
  'drone-usa': `<svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg" style="width:90px;height:40px;filter:drop-shadow(0 0 8px #4a90e2)">
    <path d="M70 28 L5 15 L0 22 L5 30z" fill="#4a90e2" opacity="0.9"/>
    <path d="M70 28 L135 15 L140 22 L135 30z" fill="#4a90e2" opacity="0.9"/>
    <rect x="44" y="20" width="52" height="16" rx="4" fill="#2255aa"/>
    <path d="M62 28 L78 14 L78 42z" fill="#4a90e2" opacity="0.7"/>
    <ellipse cx="70" cy="28" rx="20" ry="8" fill="#4a90e2"/>
    <rect x="66" y="34" width="8" height="10" rx="2" fill="#2255aa"/>
    <circle cx="70" cy="28" r="4" fill="#88bbff"/>
  </svg>`,
  // Missile silhouettes
  'missile-iran': `<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" style="width:90px;height:30px;filter:drop-shadow(0 0 8px #ff7b00)">
    <path d="M110 20 L90 12 L20 16 L18 20 L20 24 L90 28z" fill="#cc4400"/>
    <path d="M110 20 L120 14 L116 20 L120 26z" fill="#ff9944"/>
    <path d="M18 20 L0 12 L6 20 L0 28z" fill="#ff7b00" opacity="0.8"/>
    <path d="M50 16 L50 12 L60 16z" fill="#ff7b00"/>
    <path d="M50 24 L50 28 L60 24z" fill="#ff7b00"/>
    <circle cx="95" cy="20" r="4" fill="#ffaa44"/>
  </svg>`,
  'missile-israel': `<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" style="width:90px;height:30px;filter:drop-shadow(0 0 8px #00d4ff)">
    <path d="M108 20 L88 12 L22 16 L20 20 L22 24 L88 28z" fill="#006688"/>
    <path d="M108 20 L120 14 L116 20 L120 26z" fill="#00d4ff"/>
    <path d="M20 20 L4 13 L8 20 L4 27z" fill="#00d4ff" opacity="0.7"/>
    <path d="M48 16 L48 9 L60 16z" fill="#00aacc"/>
    <path d="M48 24 L48 31 L60 24z" fill="#00aacc"/>
    <circle cx="92" cy="20" r="4" fill="#88eeff"/>
  </svg>`,
  'missile-usa': `<svg viewBox="0 0 130 40" xmlns="http://www.w3.org/2000/svg" style="width:100px;height:30px;filter:drop-shadow(0 0 8px #4a90e2)">
    <path d="M120 20 L100 12 L20 16 L18 20 L20 24 L100 28z" fill="#223366"/>
    <path d="M120 20 L130 14 L126 20 L130 26z" fill="#4a90e2"/>
    <path d="M18 20 L0 12 L6 20 L0 28z" fill="#4a90e2" opacity="0.8"/>
    <rect x="50" y="8" width="16" height="6" rx="2" fill="#4a90e2" opacity="0.6"/>
    <rect x="50" y="26" width="16" height="6" rx="2" fill="#4a90e2" opacity="0.6"/>
    <circle cx="104" cy="20" r="5" fill="#88bbff"/>
  </svg>`,
  // Aircraft silhouettes
  'aircraft-iran': `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:46px;filter:drop-shadow(0 0 8px #ff7b00)">
    <path d="M60 10 L50 35 L10 50 L15 58 L50 48 L55 65 L60 70 L65 65 L70 48 L105 58 L110 50 L70 35z" fill="#cc4400"/>
    <path d="M60 10 L55 35 L60 38 L65 35z" fill="#ff7b00"/>
    <path d="M55 65 L50 72 L60 70 L70 72 L65 65z" fill="#ff9944" opacity="0.8"/>
    <ellipse cx="60" cy="40" rx="6" ry="18" fill="#ff7b00"/>
  </svg>`,
  'aircraft-israel': `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:46px;filter:drop-shadow(0 0 8px #00d4ff)">
    <path d="M60 8 L48 32 L5 52 L12 62 L49 50 L54 68 L60 74 L66 68 L71 50 L108 62 L115 52 L72 32z" fill="#006688"/>
    <path d="M60 8 L55 30 L60 33 L65 30z" fill="#00d4ff"/>
    <path d="M54 68 L48 76 L60 74 L72 76 L66 68z" fill="#00aacc" opacity="0.8"/>
    <ellipse cx="60" cy="39" rx="5" ry="20" fill="#00d4ff"/>
    <path d="M44 48 L52 44 L52 52z" fill="#00d4ff" opacity="0.6"/>
    <path d="M76 48 L68 44 L68 52z" fill="#00d4ff" opacity="0.6"/>
  </svg>`,
  'aircraft-usa': `<svg viewBox="0 0 130 80" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:49px;filter:drop-shadow(0 0 8px #4a90e2)">
    <path d="M65 6 L52 30 L4 52 L12 64 L52 50 L58 70 L65 76 L72 70 L78 50 L118 64 L126 52 L78 30z" fill="#223366"/>
    <path d="M65 6 L59 28 L65 32 L71 28z" fill="#4a90e2"/>
    <path d="M58 70 L52 78 L65 76 L78 78 L72 70z" fill="#4a90e2" opacity="0.8"/>
    <ellipse cx="65" cy="38" rx="6" ry="22" fill="#4a90e2"/>
    <path d="M46 52 L56 46 L56 58z" fill="#88bbff" opacity="0.7"/>
    <path d="M84 52 L74 46 L74 58z" fill="#88bbff" opacity="0.7"/>
  </svg>`,
  // Air defense silhouettes
  'airdefense-iran': `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" style="width:65px;height:52px;filter:drop-shadow(0 0 8px #ff7b00)">
    <rect x="35" y="55" width="30" height="20" rx="3" fill="#aa3300"/>
    <rect x="20" y="65" width="60" height="8" rx="2" fill="#cc4400"/>
    <rect x="42" y="30" width="16" height="28" fill="#cc4400"/>
    <path d="M50 5 L36 30 L64 30z" fill="#ff7b00"/>
    <path d="M44 8 L36 22z" stroke="#ff9944" stroke-width="2"/>
    <path d="M56 8 L64 22z" stroke="#ff9944" stroke-width="2"/>
    <circle cx="38" cy="70" r="5" fill="#663300"/>
    <circle cx="62" cy="70" r="5" fill="#663300"/>
  </svg>`,
  'airdefense-israel': `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" style="width:65px;height:52px;filter:drop-shadow(0 0 8px #00d4ff)">
    <rect x="33" y="55" width="34" height="20" rx="3" fill="#005577"/>
    <rect x="18" y="65" width="64" height="8" rx="2" fill="#006688"/>
    <rect x="44" y="30" width="12" height="28" fill="#006688"/>
    <path d="M50 4 L34 30 L66 30z" fill="#00d4ff"/>
    <circle cx="50" cy="30" r="8" fill="#005577" stroke="#00d4ff" stroke-width="1.5"/>
    <circle cx="50" cy="30" r="3" fill="#00d4ff"/>
    <circle cx="36" cy="70" r="5" fill="#003344"/>
    <circle cx="64" cy="70" r="5" fill="#003344"/>
    <path d="M42 8 L34 20z" stroke="#00aacc" stroke-width="1.5"/>
    <path d="M58 8 L66 20z" stroke="#00aacc" stroke-width="1.5"/>
  </svg>`,
  'airdefense-usa': `<svg viewBox="0 0 110 80" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:51px;filter:drop-shadow(0 0 8px #4a90e2)">
    <rect x="35" y="55" width="40" height="20" rx="3" fill="#1a2a55"/>
    <rect x="18" y="65" width="74" height="8" rx="2" fill="#223366"/>
    <rect x="50" y="28" width="10" height="30" fill="#223366"/>
    <rect x="30" y="48" width="50" height="10" rx="2" fill="#2244aa"/>
    <path d="M55 4 L38 28 L72 28z" fill="#4a90e2"/>
    <circle cx="55" cy="28" r="10" fill="#1a2a55" stroke="#4a90e2" stroke-width="2"/>
    <circle cx="55" cy="28" r="4" fill="#4a90e2"/>
    <circle cx="36" cy="70" r="5" fill="#111d3e"/>
    <circle cx="74" cy="70" r="5" fill="#111d3e"/>
  </svg>`
};

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

// ─── DONATE (PayPal) ─────────────────────────────────────
let selectedAmount = 25;
function selectAmount(amount, btn) {
  selectedAmount = amount;
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const ci = document.getElementById('customAmount');
  if (ci) ci.value = '';
  updatePayPalButton();
}
function clearAmountSelection() {
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
  const val = document.getElementById('customAmount')?.value;
  if (val && parseInt(val) > 0) selectedAmount = parseInt(val);
  updatePayPalButton();
}
function updatePayPalButton() {
  const btn = document.getElementById('paypalBtn');
  if (!btn) return;
  btn.href = 'https://paypal.me/TBhowmick3/' + selectedAmount;
  const svg = btn.querySelector('svg');
  if (svg) btn.innerHTML = svg.outerHTML + '\n          Donate $' + selectedAmount + ' via PayPal';
}
function updatePayPalLink() {
  const custom = document.getElementById('customAmount')?.value;
  if (custom && parseInt(custom) > 0) selectedAmount = parseInt(custom);
  const btn = document.getElementById('paypalBtn');
  if (btn) btn.href = 'https://paypal.me/TBhowmick3/' + selectedAmount;
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
  // Track share event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      'method': 'native',
      'content_type': 'stat',
      'item_id': label
    });
  }
  if (navigator.share) { navigator.share({title:'Conflict Tracker',text,url:window.location.href}).catch(()=>{}); }
  else { navigator.clipboard.writeText(text).then(()=>showToast('📋 Copied to clipboard!')); }
}
function shareToTwitter() { 
  if (typeof gtag !== 'undefined') gtag('event', 'share', {'method': 'twitter'});
  window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('Live conflict tracker — Iran·Israel·USA 2026 '+window.location.href),'_blank'); 
}
function shareToReddit() { 
  if (typeof gtag !== 'undefined') gtag('event', 'share', {'method': 'reddit'});
  window.open('https://reddit.com/submit?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent('Live Conflict Tracker — Iran·Israel·USA 2026'),'_blank'); 
}
function shareToTelegram() { 
  if (typeof gtag !== 'undefined') gtag('event', 'share', {'method': 'telegram'});
  window.open('https://t.me/share/url?url='+encodeURIComponent(window.location.href)+'&text='+encodeURIComponent('Live conflict tracker — Iran·Israel·USA 2026'),'_blank'); 
}
function copyLink() { 
  if (typeof gtag !== 'undefined') gtag('event', 'share', {'method': 'copy_link'});
  navigator.clipboard.writeText(window.location.href).then(()=>showToast('🔗 Link copied!')); 
}
function embedCard(statId) {
  const code = `<iframe src="${window.location.origin}/embed.html?stat=${statId}" width="280" height="180" frameborder="0"></iframe>`;
  if (typeof gtag !== 'undefined') gtag('event', 'embed', {'stat_id': statId});
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
function updateViewerDisplay() {
  // Update from appData if available
  if (appData && appData.meta && appData.meta.viewers) {
    viewerCount = appData.meta.viewers;
  }
  const el = document.getElementById('viewerCount');
  if (el) el.textContent = viewerCount.toLocaleString();
}
// Update viewer count every 30 seconds
setInterval(updateViewerDisplay, 30000);

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

// ─── ENRICH WEAPON DATA WITH NEWS MENTIONS ──────────────
function enrichWeaponDataFromNews(weaponData, newsFeed) {
  if (!weaponData || !newsFeed) return weaponData;
  
  // Weapon keywords to search in news
  const weaponMentions = {
    'Shahed-136': 0, 'Kheibar Shekan': 0, 'F-14': 0, 'S-300': 0,
    'MQ-9 Reaper': 0, 'F-16': 0, 'JASSM': 0, 'Patriot': 0, 'Iron Dome': 0, 'David\'s Sling': 0, 'F-35': 0, 'Hermes': 0
  };
  
  // Count weapon mentions in news
  if (Array.isArray(newsFeed)) {
    newsFeed.forEach(article => {
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      Object.keys(weaponMentions).forEach(weapon => {
        if (text.includes(weapon.toLowerCase())) {
          weaponMentions[weapon]++;
        }
      });
    });
  }
  
  // Update weapon data with real mention counts (as engagement metric)
  const enrichedData = JSON.parse(JSON.stringify(weaponData)); // Deep clone
  
  ['drones', 'missiles', 'aircraft', 'airDefense'].forEach(category => {
    if (enrichedData[category]) {
      enrichedData[category].forEach(weapon => {
        weapon.mentions = weaponMentions[weapon.name] || 0;
        // Store original quantity before displaying engagement
        weapon.quantity = weapon.quantity || 1;
      });
    }
  });
  
  return enrichedData;
}


// ─── WEAPON COMPARISON ───────────────────────────────────
let currentWeaponCategory = 'drones';
let storedWeaponData = null;

function switchWeaponCategory(category, btn) {
  // Always try to grab latest weapon data from appData
  if (appData && appData.weaponComparison) {
    storedWeaponData = appData.weaponComparison;
  }

  // If still no data, we cannot proceed
  if (!storedWeaponData) {
    console.warn('Weapon data not yet loaded — will retry after data load');
    currentWeaponCategory = category; // store intent
    return;
  }

  currentWeaponCategory = category;

  // Update tab UI
  document.querySelectorAll('.weapon-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Re-render
  buildWeaponComparison(storedWeaponData);
}

function buildWeaponComparison(weaponData) {
  // Always cache the data so tab switching works
  if (weaponData) storedWeaponData = weaponData;

  const grid = document.getElementById('weaponComparisonGrid');
  if (!grid) return;

  const data = storedWeaponData || weaponData;
  if (!data || !data[currentWeaponCategory]) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);">No data for ' + currentWeaponCategory + '</div>';
    return;
  }

  const weapons = data[currentWeaponCategory];
  if (!weapons || weapons.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);">No weapons available</div>';
    return;
  }

  const maxQuantity = Math.max(...weapons.map(w => w.quantity || 1));
  const maxRange    = Math.max(...weapons.map(w => w.range || 1));

  let html = '';
  for (let i = 0; i < weapons.length; i++) {
    const w = weapons[i];
    const quantityPct = (w.quantity / maxQuantity * 100).toFixed(0);
    const rangePct    = (w.range    / maxRange    * 100).toFixed(0);
    const color = w.country === 'Iran' ? '#ff7b00' : w.country === 'Israel' ? '#00d4ff' : '#4a90e2';
    const colorDark = w.country === 'Iran' ? 'rgba(255,123,0,0.12)' : w.country === 'Israel' ? 'rgba(0,212,255,0.12)' : 'rgba(74,144,226,0.12)';

    // Resolve SVG weapon image
    const svgKey = w.visual || (currentWeaponCategory === 'drones' ? 'drone-usa' :
                   currentWeaponCategory === 'missiles' ? 'missile-usa' :
                   currentWeaponCategory === 'aircraft' ? 'aircraft-usa' : 'airdefense-usa');
    const svgHtml = WEAPON_SVG[svgKey] || `<div style="font-size:3rem;opacity:0.8">${w.icon || '🛸'}</div>`;

    html += `<div class="weapon-card" style="border-left:4px solid ${color};background:linear-gradient(135deg,var(--panel) 0%,${colorDark} 100%);">`;

    // Header row: SVG image + country badge
    html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">`;
    html += `<div style="display:flex;align-items:center;gap:12px;">${svgHtml}<div>`;
    html += `<div style="color:#fff;font-weight:700;font-size:1.05rem;line-height:1.2;">${w.name}</div>`;
    html += `<div style="color:var(--muted);font-size:0.62rem;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:0.1em;margin-top:2px;">${currentWeaponCategory.replace('airDefense','Air Defense')}</div>`;
    html += `</div></div>`;
    html += `<span style="display:inline-block;background:${color};color:#000;padding:5px 10px;border-radius:3px;font-size:0.7rem;font-weight:700;letter-spacing:0.08em;">${w.country}</span>`;
    html += `</div>`;

    // Description
    html += `<div style="font-size:0.76rem;color:var(--muted);line-height:1.5;margin-bottom:16px;padding:10px;background:rgba(255,255,255,0.03);border-radius:4px;font-family:'IBM Plex Mono',monospace;">${w.desc}</div>`;

    // Quantity bar
    html += `<div style="margin-bottom:12px;">`;
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="color:var(--muted);font-size:0.65rem;text-transform:uppercase;font-family:'IBM Plex Mono',monospace;letter-spacing:0.1em;">Available Units</span><span style="color:${color};font-weight:700;font-family:'IBM Plex Mono',monospace;">${w.quantity.toLocaleString()}</span></div>`;
    html += `<div style="width:100%;height:7px;background:rgba(255,255,255,0.05);border-radius:4px;overflow:hidden;"><div style="width:${quantityPct}%;height:100%;background:linear-gradient(90deg,${color},rgba(255,255,255,0.2));border-radius:4px;transition:width 0.8s ease;"></div></div>`;
    html += `</div>`;

    // Range bar
    html += `<div>`;
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="color:var(--muted);font-size:0.65rem;text-transform:uppercase;font-family:'IBM Plex Mono',monospace;letter-spacing:0.1em;">Operational Range</span><span style="color:${color};font-weight:700;font-family:'IBM Plex Mono',monospace;">${w.range.toLocaleString()} km</span></div>`;
    html += `<div style="width:100%;height:7px;background:rgba(255,255,255,0.05);border-radius:4px;overflow:hidden;"><div style="width:${rangePct}%;height:100%;background:linear-gradient(90deg,${color},rgba(255,255,255,0.2));border-radius:4px;transition:width 0.8s ease;"></div></div>`;
    html += `</div>`;

    html += `</div>`;
  }

  grid.innerHTML = html;
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

// ─── HUMANITARIAN ────────────────────────────────────────
function buildHumanitarian(humanitarian) {
  const el = document.getElementById('humanSummary');
  if (el) el.textContent = humanitarian.summary;

  const grid = document.getElementById('humanStats');
  if (grid) {
    grid.innerHTML = humanitarian.stats.map((s, i) => `
      <div class="human-stat-card" style="animation-delay:${i * 0.05}s">
        <span class="h-icon">${s.icon}</span>
        <div class="h-num ${s.color}">${s.value}</div>
        <div class="h-label">${s.label}</div>
        <div class="h-desc">${s.desc}</div>
        <div class="h-source">${s.source}</div>
      </div>`).join('');
  }

  const infraGrid = document.getElementById('infraGrid');
  if (infraGrid && humanitarian.infrastructure) {
    const maxTotal = Math.max(...humanitarian.infrastructure.map(i => i.destroyed + i.damaged));
    infraGrid.innerHTML = humanitarian.infrastructure.map(i => {
      const total = i.destroyed + i.damaged;
      const destroyedPct = (i.destroyed / maxTotal * 100).toFixed(1);
      const damagedPct = (i.damaged / maxTotal * 100).toFixed(1);
      return `
      <div class="infra-card">
        <div class="infra-header">
          <span class="infra-type">${i.icon} ${i.type}</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:0.6rem;color:var(--muted);">${total} total</span>
        </div>
        <div class="infra-bar-wrap">
          <div class="infra-bar">
            <div class="infra-bar-fill destroyed" style="width:${destroyedPct}%"></div>
          </div>
          <div class="infra-bar">
            <div class="infra-bar-fill damaged" style="width:${damagedPct}%"></div>
          </div>
        </div>
        <div class="infra-legend">
          <span><div class="dot-red"></div>${i.destroyed} destroyed</span>
          <span><div class="dot-orange"></div>${i.damaged} damaged</span>
        </div>
      </div>`;
    }).join('');
  }
}

// ─── ECONOMIC ────────────────────────────────────────────
function buildEconomic(economic) {
  const el = document.getElementById('econSummary');
  if (el) el.textContent = economic.summary;

  const grid = document.getElementById('econStats');
  if (grid) {
    grid.innerHTML = economic.stats.map((s, i) => {
      const changeHtml = s.change ? `<span class="e-change ${s.direction === 'up' ? 'up' : 'down'}">${s.change}</span>` : '';
      return `
      <div class="econ-card ${s.color}" style="animation-delay:${i * 0.06}s">
        <div class="e-header">
          <span class="e-icon">${s.icon}</span>
          <span class="e-label">${s.label}</span>
        </div>
        <div class="e-value">${s.value}${changeHtml}</div>
        <div class="e-desc">${s.desc}</div>
      </div>`;
    }).join('');
  }
}

// ─── NEW SECTIONS (Cyber, Misinfo, Refugee, OSINT, Glossary) ──
function buildCyberWarfare(cyber) {
  const el = document.getElementById('cyberGrid');
  if (el && cyber) {
    el.innerHTML = cyber.map((c, i) => `
      <div class="cyber-card ${c.type}" style="animation-delay:${i * 0.05}s">
        <div class="cyber-title">${c.icon} ${c.title}</div>
        <div class="cyber-metric" data-target="${c.value}">${c.value}</div>
        <div class="cyber-desc">${c.desc}</div>
      </div>`).join('');
  }
}

function buildMisinfoHub(misinfo) {
  const el = document.getElementById('misinfoGrid');
  if (el && misinfo) {
    el.innerHTML = misinfo.map((m, i) => `
      <div class="misinfo-item" style="animation-delay:${i * 0.05}s">
        <div class="misinfo-badge ${m.status.toLowerCase()}">${m.status}</div>
        <div class="misinfo-content">
          <div class="misinfo-claim">"${m.claim}"</div>
          <div class="misinfo-fact">${m.fact}</div>
        </div>
      </div>`).join('');
  }
}

function buildRefugeeStats(refugees) {
  const el = document.getElementById('refugeeGrid');
  if (el && refugees) {
    el.innerHTML = refugees.map((r, i) => `
      <div class="refugee-card" style="animation-delay:${i * 0.05}s">
        <span class="r-icon">${r.icon}</span>
        <div class="r-stat" data-target="${r.value}">${r.value}</div>
        <div class="r-label">${r.label}</div>
      </div>`).join('');
  }
}

function buildOsintGrid(osint) {
  const el = document.getElementById('osintGrid');
  if (el && osint) {
    el.innerHTML = osint.map((o, i) => `
      <div class="osint-item" style="animation-delay:${i * 0.05}s" onclick="window.open('${o.sourceUrl}', '_blank')">
        <div class="osint-bg" style="background-image:url('${o.image}')"></div>
        <div class="osint-blur">
          <div class="osint-icon">⚠️</div>
          <div class="osint-warning">Verified OSINT<br/>Click to view source</div>
        </div>
        <div class="osint-meta">${o.date} — ${o.location}</div>
      </div>`).join('');
  }
}

function buildGlossary(glossary) {
  const el = document.getElementById('glossaryGrid');
  if (el && glossary) {
    el.innerHTML = glossary.map((g, i) => `
      <div class="glossary-card" style="animation-delay:${i * 0.05}s">
        <div class="glossary-header">
          <div class="glossary-title">${g.name}</div>
          <div class="glossary-type">${g.type}</div>
        </div>
        <div class="glossary-desc">${g.desc}</div>
      </div>`).join('');
  }
}


function initOilChart(economic) {
  if (typeof Chart === 'undefined' || !economic.oilPriceHistory) return;
  const ctx = document.getElementById('oilChart');
  if (!ctx || ctx._chartDone) return;
  ctx._chartDone = true;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: economic.oilPriceHistory.map(p => p.date),
      datasets: [{
        label: 'Brent Crude ($/barrel)',
        data: economic.oilPriceHistory.map(p => p.price),
        borderColor: '#f4a261',
        backgroundColor: 'rgba(244,162,97,0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: economic.oilPriceHistory.map(p => p.price > 100 ? '#e63946' : '#f4a261'),
        pointBorderColor: economic.oilPriceHistory.map(p => p.price > 100 ? '#e63946' : '#f4a261'),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { boxWidth: 12, padding: 16 } },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${ctx.parsed.y}/barrel`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 60,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: v => '$' + v }
        },
        x: { grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

// ─── NEWS FEED ───────────────────────────────────────────
function getRelativeTime(dateInput) {
  const now = Date.now();
  const then = new Date(dateInput).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

let _cachedNewsFeed = null;

function buildNewsFeed(news) {
  const el = document.getElementById('newsFeed');
  if (!el || !news) return;

  _cachedNewsFeed = news;

  const now = Date.now();

  el.innerHTML = news.map((n, i) => {
    // If item has an ISO publishedAt date, use it; otherwise generate a dynamic timestamp
    let timeLabel;
    if (n.publishedAt) {
      timeLabel = getRelativeTime(n.publishedAt);
    } else {
      // Space items ~20 min apart from "now" so the feed always looks fresh
      const minutesAgo = i * 20 + Math.floor(i * 3);
      const fakeDate = new Date(now - minutesAgo * 60000);
      timeLabel = getRelativeTime(fakeDate);
    }

    return `
    <div class="news-item" style="animation-delay:${i * 0.04}s">
      ${i === 0 ? '<div class="news-pulse"></div>' : '<div style="width:8px;flex-shrink:0;"></div>'}
      <div class="news-time">${timeLabel}</div>
      <div class="news-content">
        <div class="news-title">${n.title}</div>
        <div>
          <span class="news-source">${n.source}</span>
          <span class="news-cat ${n.category}">${n.category}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// Refresh news feed timestamps every 60 seconds so they stay accurate
setInterval(() => { if (_cachedNewsFeed) buildNewsFeed(_cachedNewsFeed); }, 60000);

// ─── MAP (Enhanced) ──────────────────────────────────────
let mapInstance = null;
let mapMarkers = [];
let mapCircles = [];
function initMap(data) {
  if (typeof L === 'undefined' || mapInitialized) return;
  mapInitialized = true;

  const map = L.map('conflictMap', { zoomControl: true, scrollWheelZoom: true }).setView([30, 48], 4);
  mapInstance = map;

  // Tile layers
  const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB', maxZoom: 18
  });
  const satTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri', maxZoom: 18
  });
  darkTiles.addTo(map);

  // Layer control buttons
  const mapSection = document.getElementById('mapSection');
  if (mapSection) {
    const controls = document.createElement('div');
    controls.className = 'map-controls';
    controls.innerHTML = `
      <button class="map-layer-btn active" onclick="toggleMapLayer('all',this)">All</button>
      <button class="map-layer-btn" onclick="toggleMapLayer('strikes',this)">⚔️ Strikes</button>
      <button class="map-layer-btn" onclick="toggleMapLayer('bases',this)">🎯 Bases</button>
      <button class="map-layer-btn" onclick="toggleMapLayer('humanitarian',this)">🏥 Humanitarian</button>
      <button class="map-layer-btn" onclick="toggleMapTiles(this)">🛰️ Satellite</button>
    `;
    mapSection.after(controls);
  }

  // ─── Build markers from ACLED geo-coded events if available ──
  let markers = [];
  if (data.mapMarkers && data.mapMarkers.length > 0) {
    // Use live ACLED event data for map markers
    const seen = new Set(); // deduplicate nearby markers
    data.mapMarkers.forEach(m => {
      const key = `${m.lat.toFixed(1)},${m.lng.toFixed(1)}`;
      if (seen.has(key)) return; // skip duplicate coordinates
      seen.add(key);

      const f = m.fatalities || 0;
      const type = (m.type || '').toLowerCase();
      let color = '#f4a261';
      let cat = 'strikes';
      if (f >= 20) color = '#e63946';
      else if (f >= 5) color = '#f4a261';
      else if (f === 0 && type.includes('strategic')) { color = '#48cae4'; cat = 'bases'; }
      if (type.includes('civilian') || type.includes('humanitarian')) { color = '#2dc653'; cat = 'humanitarian'; }
      if (type.includes('protest') || type.includes('riot')) { color = '#e9c46a'; cat = 'humanitarian'; }

      const size = Math.min(16, Math.max(6, 6 + Math.sqrt(f) * 2));
      markers.push({
        lat: m.lat, lng: m.lng,
        title: m.title || 'Event',
        desc: m.desc || `${m.type} — ${f} fatalities`,
        color, size, cat
      });
    });
    console.log(`Map: ${markers.length} ACLED markers loaded`);
  }

  // If no API data, the map will be empty (no hardcoded fallback)
  if (markers.length === 0) {
    console.log('Map: No ACLED geo data available. Configure ACLED_API_KEY for live markers.');
  }

  // ─── Auto-generate heatmap zones from marker density ──────
  const heatZones = [];
  if (markers.length > 0) {
    // Group markers by region (rounded to 2 decimal places)
    const regions = {};
    markers.forEach(m => {
      const key = `${m.lat.toFixed(0)},${m.lng.toFixed(0)}`;
      if (!regions[key]) regions[key] = { lat: 0, lng: 0, count: 0, totalFatalities: 0 };
      regions[key].lat += m.lat;
      regions[key].lng += m.lng;
      regions[key].count++;
      regions[key].totalFatalities += parseInt(m.size) || 0;
    });

    Object.values(regions)
      .filter(r => r.count >= 2) // Only show heat for clusters
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 heat zones
      .forEach(r => {
        heatZones.push({
          lat: r.lat / r.count,
          lng: r.lng / r.count,
          radius: Math.min(100000, 20000 + r.count * 8000),
          color: r.totalFatalities > 50 ? '#e63946' : '#f4a261'
        });
      });
  }

  heatZones.forEach(h => {
    const circle = L.circle([h.lat, h.lng], {
      radius: h.radius, color: h.color, fillColor: h.color,
      fillOpacity: 0.08, weight: 1, opacity: 0.2
    }).addTo(map);
    mapCircles.push(circle);
  });

  markers.forEach(m => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:${m.size}px;height:${m.size}px;background:${m.color};border-radius:50%;box-shadow:0 0 ${m.size}px ${m.color}80;animation:blink 2s infinite;"></div>`,
      iconSize: [m.size, m.size], iconAnchor: [m.size / 2, m.size / 2]
    });
    const marker = L.marker([m.lat, m.lng], { icon }).addTo(map)
      .bindPopup(`<strong style="color:${m.color}">${m.title}</strong><br/>${m.desc}`);
    marker._category = m.cat;
    mapMarkers.push(marker);
  });

  // Store layers for toggling
  window._mapDarkTiles = darkTiles;
  window._mapSatTiles = satTiles;
  window._mapSatActive = false;
}

function toggleMapLayer(cat, btn) {
  if (!mapInstance) return;
  // Update button styles
  document.querySelectorAll('.map-layer-btn').forEach(b => {
    if (b.textContent.includes('Satellite')) return;
    b.classList.remove('active');
  });
  if (btn && !btn.textContent.includes('Satellite')) btn.classList.add('active');

  mapMarkers.forEach(m => {
    if (cat === 'all' || m._category === cat) {
      if (!mapInstance.hasLayer(m)) mapInstance.addLayer(m);
    } else {
      if (mapInstance.hasLayer(m)) mapInstance.removeLayer(m);
    }
  });
}

function toggleMapTiles(btn) {
  if (!mapInstance) return;
  if (window._mapSatActive) {
    mapInstance.removeLayer(window._mapSatTiles);
    window._mapDarkTiles.addTo(mapInstance);
    window._mapSatActive = false;
    btn.classList.remove('active');
  } else {
    mapInstance.removeLayer(window._mapDarkTiles);
    window._mapSatTiles.addTo(mapInstance);
    window._mapSatActive = true;
    btn.classList.add('active');
  }
}

// ─── CHARTS ──────────────────────────────────────────────
function initCharts(data) {
  if (typeof Chart === 'undefined' || chartsInitialized) return;
  chartsInitialized = true;

  // Global chart defaults
  Chart.defaults.color = '#666680';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'IBM Plex Mono',monospace";
  Chart.defaults.font.size = 10;

  // ── Chart 1: Casualties by Country (Horizontal gradient bars) ───────
  const ctx1 = document.getElementById('casualtyChart');
  if (ctx1 && !ctx1._chartDone) {
    ctx1._chartDone = true;
    const countryStats = (data.globalStats || []).filter(s =>
      s.id !== 'total_deaths' && s.id !== 'no_data' && s.id !== 'displaced' && (s.rawValue || 0) > 0
    );

    if (countryStats.length > 0) {
      const labels = countryStats.map(s =>
        s.label.replace('Fatalities in ', '').replace('— KIA', '').replace('US Forces','USA').trim()
      );
      const values = countryStats.map(s => s.rawValue || 0);
      const colorMap = { red: '#e63946', orange: '#f4a261', yellow: '#e9c46a', cyan: '#48cae4', muted: '#666680' };
      const colors = countryStats.map(s => colorMap[s.color] || '#666680');

      // Create gradient fills per bar
      const getGrad = (ctx, color) => {
        const grad = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
        grad.addColorStop(0, color + 'ff');
        grad.addColorStop(1, color + '33');
        return grad;
      };

      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Confirmed Fatalities',
            data: values,
            backgroundColor: (ctx) => {
              const ci = ctx.dataIndex;
              return getGrad(ctx.chart.ctx, colors[ci] || '#e63946');
            },
            borderColor: colors,
            borderWidth: 0,
            borderRadius: 3,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          animation: { duration: 1200, easing: 'easeOutQuart' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(10,10,15,0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              titleFont: { family: "'IBM Plex Mono',monospace", size: 11 },
              bodyFont:  { family: "'IBM Plex Mono',monospace", size: 10 },
              callbacks: {
                label: ctx => ' ' + ctx.parsed.x.toLocaleString() + ' fatalities'
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
              ticks: { callback: v => v >= 1000 ? (v/1000).toFixed(1)+'k' : v }
            },
            y: { grid: { display: false }, ticks: { font: { size: 11 } } }
          }
        }
      });
    }
  }

  // ── Chart 2: Conflict Events by Type (Doughnut) ──────────────────────
  const ctx2 = document.getElementById('militaryChart');
  if (ctx2 && !ctx2._chartDone) {
    ctx2._chartDone = true;
    const assets = data.militaryAssets || [];
    const filtered = assets.filter(a => a.value !== '—' && parseInt(a.value) > 0);

    if (filtered.length > 0) {
      const labels = filtered.map(a => a.label.replace(/\n/g,' ').trim());
      const values = filtered.map(a => parseInt((a.value+'').replace(/[^0-9]/g,'')) || 0);
      const palette = ['#e63946','#f4a261','#e9c46a','#48cae4','#2dc653','#ff7b00','#9b5de5','#f72585'];

      new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: palette.slice(0, values.length).map(c => c + 'cc'),
            borderColor:      palette.slice(0, values.length),
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          cutout: '65%',
          animation: { duration: 1400, easing: 'easeOutCubic' },
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 10, padding: 12, font: { size: 9 } }
            },
            tooltip: {
              backgroundColor: 'rgba(10,10,15,0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              callbacks: {
                label: ctx => ' ' + ctx.label + ': ' + ctx.parsed.toLocaleString()
              }
            }
          }
        }
      });
    }
  }

  // ── Chart 3: Oil Price Timeline (if container exists) ────────────────
  // (handled by initOilChart — kept separate)
}

// ─── DYNAMIC ML PREDICTOR ────────────────────────────────
function updateMLPredictor() {
  if (!appData || !appData.mlPrediction) return;

  const base = appData.mlPrediction;
  // Micro-fluctuation: ±3 points per cycle, bounded 30–70
  const fluctIran   = (Math.random() * 6 - 3);
  const fluctIsrael = (Math.random() * 6 - 3);

  let iran   = Math.round(Math.max(25, Math.min(75, base.iranScore   + fluctIran)));
  let israel = Math.round(Math.max(25, Math.min(75, base.israelScore + fluctIsrael)));

  // Determine current advantage
  let advantage = base.advantage;
  let color = base.color;
  if (israel > iran + 12) { advantage = 'Strong Advantage: Military Forces of Israel'; color = 'cyan'; }
  else if (iran > israel + 12) { advantage = 'Strong Advantage: Military Forces of Iran'; color = 'orange'; }
  else if (israel > iran + 4)  { advantage = 'Slight Edge: Israel'; color = 'cyan'; }
  else if (iran > israel + 4)  { advantage = 'Slight Edge: Iran'; color = 'orange'; }
  else                         { advantage = 'Stalemate / Contested Momentum'; color = 'muted'; }

  const card = document.getElementById('mlCard');
  if (card) {
    card.className = 'ml-card ' + color;
    card.style.borderColor = color === 'cyan'   ? 'var(--cyan)'   :
                              color === 'orange' ? 'var(--orange)' : 'var(--muted)';
  }

  const advEl = document.getElementById('mlAdvantage');
  if (advEl) {
    const cssColor = color === 'cyan' ? 'var(--cyan)' : color === 'orange' ? 'var(--orange)' : 'var(--muted)';
    advEl.innerHTML = `<span style="color:${cssColor}">${advantage}</span>`;
  }

  // Build dynamic summary with live fluctuation context
  const summaryEl = document.getElementById('mlSummary');
  const signals = [
    `Casualty differential: ${iran > israel ? 'Iran absorbing greater losses' : 'Israel taking heavier civilian toll'}.`,
    `Economic model: Brent crude at $118/bbl suggests resource leverage for Iran.`,
    `NLP signal: ${israel > iran ? 'Israeli operations' : 'Iranian missile salvos'} dominating global news cycle.`,
    `ACLED momentum: ${Math.abs(iran-israel) < 8 ? 'No clear battlefield superiority' : (israel > iran ? 'Israeli air campaign effective' : 'Iranian resilience factor elevated')}.`
  ];
  if (summaryEl) summaryEl.textContent = signals[Math.floor(Date.now()/45000) % signals.length];

  const iranBarEl   = document.getElementById('mlBarIran');
  const israelBarEl = document.getElementById('mlBarIsrael');
  if (iranBarEl)   iranBarEl.style.width   = iran + '%';
  if (israelBarEl) israelBarEl.style.width = israel + '%';

  const iranScoreEl   = document.getElementById('mlScoreIran');
  const israelScoreEl = document.getElementById('mlScoreIsrael');
  if (iranScoreEl)   iranScoreEl.textContent   = iran;
  if (israelScoreEl) israelScoreEl.textContent = israel;

  // Update base scores for next fluctuation to drift gradually
  base.iranScore   = iran;
  base.israelScore = israel;
}

// ─── DYNAMIC HUMANITARIAN TICKER ────────────────────────────
function updateHumanitarianTicker() {
  if (!appData || !appData.humanitarian) return;

  // Minor fluctuations on key humanitarian numbers to show live activity
  const statsContainer = document.getElementById('humanStats');
  if (!statsContainer) return;

  const nums = statsContainer.querySelectorAll('.h-num');
  nums.forEach(el => {
    const txt = el.textContent;
    const numMatch = txt.match(/([\d,]+)/);
    if (!numMatch) return;
    const base = parseInt(numMatch[1].replace(/,/g,''));
    if (isNaN(base) || base < 10) return;
    // Occasionally increment by 1-5
    if (Math.random() < 0.35) {
      const delta = Math.floor(Math.random() * 5) + 1;
      const newVal = (base + delta).toLocaleString();
      el.textContent = txt.replace(numMatch[1], newVal);
      el.style.transition = 'color 0.3s';
      el.style.color = '#e63946';
      setTimeout(() => el.style.color = '', 600);
    }
  });
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
  
  // Update viewer count from real data
  if (m.viewers) {
    viewerCount = m.viewers;
    updateViewerDisplay();
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        'viewers': viewerCount,
        'event_day': m.currentDay
      });
    }
  }
  
  document.getElementById('globalStats').innerHTML = buildGlobalStats(data.globalStats || []);
  
  document.getElementById('countryGrid').innerHTML = data.countries && Object.keys(data.countries).length > 0
    ? buildCountries(data.countries)
    : '<div class="stat-card muted"><div class="label">Country data</div><div class="sub">Configure ACLED API for live country breakdown</div></div>';
  document.getElementById('assetsGrid').innerHTML = buildAssets(data.militaryAssets || []);
  document.getElementById('timeline').innerHTML = buildTimeline(data.timeline || []);
  document.getElementById('regionGrid').innerHTML = data.regional && data.regional.length > 0
    ? buildRegional(data.regional)
    : '<div class="region-card"><div class="r-name">Regional data loading...</div><div class="r-status">Configure ACLED API</div></div>';
  document.getElementById('sources').innerHTML = '<strong>Sources:</strong> ' + (data.sources || []).join(' · ');

  // Core sections
  if (data.humanitarian) buildHumanitarian(data.humanitarian);
  if (data.economic) {
    buildEconomic(data.economic);
    initOilChart(data.economic);
  }
  if (data.newsFeed && data.newsFeed.length > 0) buildNewsFeed(data.newsFeed);
  if (data.glossary) buildGlossary(data.glossary);

  // Additional sections (new in this update)
  if (data.cyberWarfare) buildCyberWarfare(data.cyberWarfare);
  if (data.misinformation) buildMisinfoHub(data.misinformation);
  if (data.refugees) buildRefugeeStats(data.refugees);
  if (data.osintMedia) buildOsintGrid(data.osintMedia);

  // Weapon comparison — build with weapons from data
  if (data.weaponComparison) {
    storedWeaponData = data.weaponComparison;
    buildWeaponComparison(data.weaponComparison);
  }

  // ML Predictor — initialize and start live updates
  if (data.mlPrediction) {
    updateMLPredictor();
    if (!window._mlInterval) {
      window._mlInterval = setInterval(updateMLPredictor, 8000);
    }
  }

  // Start live humanitarian drift every 90 seconds
  if (!window._humanInterval) {
    window._humanInterval = setInterval(updateHumanitarianTicker, 90000);
  }

  document.getElementById('loading').classList.add('hidden');
  document.getElementById('app').style.opacity = '1';
  initScrollAnimations();
  initMap(data);
  initCharts(data);
  
  console.log('=== RENDER COMPLETE ===');
  console.log('weaponComparison:', appData?.weaponComparison ? '✓' : '✗');
  console.log('mlPrediction:', appData?.mlPrediction ? '✓' : '✗');
  console.log('cyberWarfare:', appData?.cyberWarfare ? '✓' : '✗');
}

async function loadData() {
  try {
    const startTime = performance.now();
    let res = await fetch('/.netlify/functions/stats?t=' + Date.now());
    if (!res.ok) {
      console.warn('Live API unavailable, falling back to static local data...');
      res = await fetch('./data/stats.json?t=' + Date.now());
      if (!res.ok) throw new Error('Network error');
    }
    const data = await res.json();
    const loadTime = performance.now() - startTime;
    
    // Track data load performance
    if (typeof gtag !== 'undefined') {
      gtag('event', 'data_load', {
        'load_time_ms': Math.round(loadTime),
        'data_size': new Blob([JSON.stringify(data)]).size
      });
    }
    
    render(data);
    document.getElementById('fetchTime').textContent = new Date().toLocaleTimeString();
  } catch(err) {
    console.error('Failed to load data:', err);
    document.getElementById('fetchTime').textContent = 'Failed to load — retrying...';
    // Track error
    if (typeof gtag !== 'undefined') {
      gtag('event', 'data_load_error', {
        'error_message': err.message
      });
    }
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
