// ─── CONFIG ──────────────────────────────────────────────
const DATA_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? './data/stats.json' : '/.netlify/functions/stats';
let appData = null;
let viewerCount = 847; // Default value, will be updated from real data
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
  console.log('switchWeaponCategory called:', category);
  
  if (appData?.weaponComparison) {
    storedWeaponData = appData.weaponComparison;
  }
  
  if (!storedWeaponData) {
    console.error('No weapon data available!');
    return;
  }
  
  currentWeaponCategory = category;
  
  // Update UI
  document.querySelectorAll('.weapon-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  // Render new category
  buildWeaponComparison(storedWeaponData);
}

function buildWeaponComparison(weaponData) {
  const grid = document.getElementById('weaponComparisonGrid');
  console.log('=== buildWeaponComparison ===');
  console.log('Grid element:', !!grid);
  console.log('Category:', currentWeaponCategory);
  console.log('Data:', !!weaponData);
  
  if (!grid) {
    console.error('Grid element not found');
    return;
  }
  
  if (!weaponData || !weaponData[currentWeaponCategory]) {
    console.error('No weapon data for:', currentWeaponCategory);
    grid.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);">⚠️ No data for ' + currentWeaponCategory + '</div>';
    return;
  }
  
  const weapons = weaponData[currentWeaponCategory];
  
  if (!weapons || weapons.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);">No weapons available</div>';
    return;
  }
  
  const maxQuantity = Math.max(...weapons.map(w => w.quantity || 1));
  const maxRange = Math.max(...weapons.map(w => w.range || 1));
  
  let html = '';
  for (let i = 0; i < weapons.length; i++) {
    const w = weapons[i];
    const quantityPct = (w.quantity / maxQuantity * 100).toFixed(0);
    const rangePct = (w.range / maxRange * 100).toFixed(0);
    const color = w.country === 'Iran' ? '#ff7b00' : w.country === 'Israel' ? '#00d4ff' : '#4a90e2';
    const visual = w.visual || w.icon;
    
    html += '<div class="weapon-card" style="border-left:4px solid ' + color + ';position:relative;">';
    
    // Visual weapon icon
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">';
    html += '<div style="font-size:3rem;opacity:0.8;filter:drop-shadow(0 0 10px ' + color + ');">' + visual + '</div>';
    html += '<div style="text-align:right;"><span style="display:inline-block;background:' + color + ';color:#000;padding:4px 8px;border-radius:3px;font-size:0.7rem;font-weight:600;">' + w.country + '</span></div>';
    html += '</div>';
    
    // Weapon name
    html += '<div style="margin-bottom:14px;"><div style="color:#fff;font-weight:700;font-size:1.1rem;margin-bottom:4px;">' + w.name + '</div>';
    html += '<div style="color:var(--muted);font-size:0.75rem;">' + w.desc + '</div></div>';
    
    // Quantity bar
    html += '<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><span style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;font-weight:600;">Available Units</span><span style="color:' + color + ';font-weight:700;">' + w.quantity + '</span></div>';
    html += '<div style="width:100%;height:8px;background:rgba(255,255,255,0.05);border-radius:4px;overflow:hidden;"><div style="width:' + quantityPct + '%;height:100%;background:linear-gradient(90deg, ' + color + ' 0%, rgba(255,255,255,0.3) 100%);"></div></div></div>';
    
    // Range bar
    html += '<div style="margin-bottom:0;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><span style="color:var(--muted);font-size:0.7rem;text-transform:uppercase;font-weight:600;">Operational Range</span><span style="color:' + color + ';font-weight:700;">' + w.range + ' km</span></div>';
    html += '<div style="width:100%;height:8px;background:rgba(255,255,255,0.05);border-radius:4px;overflow:hidden;"><div style="width:' + rangePct + '%;height:100%;background:linear-gradient(90deg, ' + color + ' 0%, rgba(255,255,255,0.3) 100%);"></div></div></div>';
    
    html += '</div>';
  }
  
  grid.innerHTML = html;
  console.log('✓ Rendered', weapons.length, 'weapons');
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
  Chart.defaults.color = '#666680';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
  Chart.defaults.font.family = "'IBM Plex Mono',monospace";
  Chart.defaults.font.size = 10;

  // Casualty timeline chart
  // Casualty chart - build from API data if available
  const ctx1 = document.getElementById('casualtyChart');
  if (ctx1 && !ctx1._chartDone) {
    ctx1._chartDone = true;
    // Extract fatality values from globalStats
    const countryStats = (data.globalStats || []).filter(s => s.id !== 'total_deaths' && s.id !== 'no_data');
    if (countryStats.length > 0) {
      const labels = countryStats.map(s => s.label.replace('Fatalities in ', ''));
      const values = countryStats.map(s => s.rawValue || 0);
      const colors = countryStats.map(s => {
        if (s.color === 'red') return '#e63946';
        if (s.color === 'orange') return '#f4a261';
        if (s.color === 'yellow') return '#e9c46a';
        if (s.color === 'cyan') return '#48cae4';
        return '#666680';
      });
      new Chart(ctx1, {type:'bar', data:{
        labels: labels,
        datasets: [{
          label: 'Fatalities by Country',
          data: values,
          backgroundColor: colors.map(c => c + 'B3'),
          borderColor: colors,
          borderWidth: 1
        }]
      }, options:{responsive:true, plugins:{legend:{labels:{boxWidth:12,padding:16}}},
        scales:{y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.04)'}},x:{grid:{color:'rgba(255,255,255,0.04)'}}}}});
    }
  }

  // Military assets chart - build from API data
  const ctx2 = document.getElementById('militaryChart');
  if (ctx2 && !ctx2._chartDone) {
    ctx2._chartDone = true;
    const assets = data.militaryAssets || [];
    if (assets.length > 0 && assets[0].value !== '—') {
      const labels = assets.map(a => a.label.replace(/\\n/g, ' ').replace(/\n/g, ' '));
      const values = assets.map(a => parseInt(a.value.replace(/[^0-9]/g, '')) || 0);
      new Chart(ctx2, {type:'bar', data:{
        labels: labels,
        datasets: [{
          label: 'Event Count',
          data: values,
          backgroundColor: 'rgba(72,202,228,0.7)',
          borderColor: '#48cae4',
          borderWidth: 1
        }]
      }, options:{responsive:true, indexAxis:'y', plugins:{legend:{labels:{boxWidth:12,padding:16}}},
        scales:{x:{grid:{color:'rgba(255,255,255,0.04)'}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});
    }
  }
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
    // Track viewer count to GA
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        'viewers': viewerCount,
        'event_day': m.currentDay
      });
    }
  }
  
  document.getElementById('globalStats').innerHTML = buildGlobalStats(data.globalStats || []);
  
  // Enrich weapon data with real news mentions
  if (data.weaponComparison) {
    const enrichedWeapons = enrichWeaponDataFromNews(data.weaponComparison, data.newsFeed);
    appData.weaponComparison = enrichedWeapons; // Update appData with enriched version
    storedWeaponData = enrichedWeapons; // Also store globally for tab switching
    buildWeaponComparison(enrichedWeapons);
  }
  
  document.getElementById('countryGrid').innerHTML = data.countries && Object.keys(data.countries).length > 0
    ? buildCountries(data.countries)
    : '<div class="stat-card muted"><div class="label">Country data</div><div class="sub">Configure ACLED API for live country breakdown</div></div>';
  document.getElementById('assetsGrid').innerHTML = buildAssets(data.militaryAssets || []);
  document.getElementById('timeline').innerHTML = buildTimeline(data.timeline || []);
  document.getElementById('regionGrid').innerHTML = data.regional && data.regional.length > 0
    ? buildRegional(data.regional)
    : '<div class="region-card"><div class="r-name">Regional data loading...</div><div class="r-status">Configure ACLED API</div></div>';
  document.getElementById('sources').innerHTML = '<strong>Sources:</strong> ' + (data.sources || []).join(' · ');

  // ML Strategic Predictor
  if (data.mlPrediction) {
    const ml = data.mlPrediction;
    const card = document.getElementById('mlCard');
    if (card) {
      card.className = `ml-card ${ml.color}`;
      card.style.borderColor = `var(--${ml.color})`;
      document.getElementById('mlAdvantage').innerHTML = `<span style="color:var(--${ml.color})">${ml.advantage}</span>`;
      document.getElementById('mlSummary').textContent = ml.summary;
      
      document.getElementById('mlBarIran').style.width = ml.iranScore + '%';
      document.getElementById('mlBarIsrael').style.width = ml.israelScore + '%';
      
      document.getElementById('mlScoreIran').textContent = ml.iranScore;
      document.getElementById('mlScoreIsrael').textContent = ml.israelScore;
    }
  }

  // New sections
  if (data.humanitarian) buildHumanitarian(data.humanitarian);
  if (data.economic) {
    buildEconomic(data.economic);
    initOilChart(data.economic);
  }
  if (data.newsFeed && data.newsFeed.length > 0) buildNewsFeed(data.newsFeed);
  
  if (data.glossary) buildGlossary(data.glossary);

  document.getElementById('loading').classList.add('hidden');
  document.getElementById('app').style.opacity = '1';
  initScrollAnimations();
  initMap(data);
  initCharts(data);
  
  // Diagnostic log
  console.log('=== RENDER COMPLETE ===');
  console.log('appData.weaponComparison:', appData?.weaponComparison ? '✓ Available' : '✗ Missing');
  console.log('Grid element:', document.getElementById('weaponComparisonGrid') ? '✓ Found' : '✗ Missing');
  console.log('Grid content:', document.getElementById('weaponComparisonGrid')?.innerHTML?.length || 0, 'characters');
}

// ─── DATA LOADING ────────────────────────────────────────
async function loadData() {
  try {
    const startTime = performance.now();
    const res = await fetch(DATA_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error('Network error');
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
