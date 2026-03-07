# ⚔️ Conflict Tracker — Iran · Israel · USA · 2026

> A live, data-driven war statistics portal. Update stats from a browser-based admin panel — changes deploy globally in ~30 seconds.

---

## 🗂 Project Structure

```
war-tracker/
├── index.html          ← Main public dashboard
├── data/
│   └── stats.json      ← ALL data lives here (edit this to update the site)
├── admin/
│   └── index.html      ← Admin panel (password-protected)
├── netlify.toml        ← Netlify deployment config
├── vercel.json         ← Vercel deployment config
├── _headers            ← Cloudflare Pages config
└── README.md
```

---

## 🚀 Deployment (3 Options)

### Option A — Netlify (Recommended, Free)
1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import from GitHub"
3. Set **publish directory** to `/` (root)
4. Leave build command blank
5. Deploy — your site is live!

### Option B — Vercel (Free)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your repo
4. Framework: **Other**
5. Root directory: `/`
6. Deploy

### Option C — Cloudflare Pages (Best for global scale, Free)
1. Push to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Create application → Connect to Git
4. Build settings: leave blank
5. Deploy — automatically served from 300+ global edge locations

---

## 🔄 Keeping Data Updated

### Method 1: Admin Panel (Easiest)
1. Navigate to `https://your-site.com/admin/`
2. Default password: `admin123` (change immediately in Settings → Admin Password)
3. Edit any section (casualties, timeline, regional, etc.)
4. Go to **Deploy → GitHub Deploy**:
   - Enter your GitHub repo name (e.g. `yourname/war-tracker`)
   - Create a GitHub Personal Access Token at: `github.com/settings/tokens/new`
     - Scopes needed: `repo` (Full control of private repositories)
   - Paste token in the field → Save Config
5. Press **PUBLISH** — site updates in ~30 seconds

### Method 2: Edit JSON Directly
Edit `data/stats.json` in your GitHub repo browser UI or locally, commit, and it auto-deploys.

### Method 3: API / Automation
Use GitHub Actions or a cron job to POST updated JSON to the GitHub Contents API:

```bash
# Update stats.json via GitHub API
curl -X PUT \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/YOUR_USER/war-tracker/contents/data/stats.json \
  -d '{
    "message": "Auto-update stats",
    "content": "'$(base64 -w0 data/stats.json)'",
    "sha": "CURRENT_FILE_SHA"
  }'
```

---

## 🔐 Security

### Protecting the Admin Panel
The admin panel has password protection built-in. For production, add an extra layer:

**Netlify Identity (recommended):**
1. Netlify dashboard → Site settings → Identity → Enable
2. Add invite-only users
3. Add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[build]
  command = ""

[[redirects]]
  from = "/admin/*"
  to = "/.netlify/identity"
  status = 401
  force = false
  conditions = {Role = ["admin"]}
```

**Cloudflare Access (enterprise-grade, free tier):**
1. Cloudflare Zero Trust → Access → Applications
2. Protect the `/admin` path with email OTP or SSO

---

## 📊 Data Schema

All data lives in `data/stats.json`. Key fields:

| Field | Description |
|-------|-------------|
| `meta.lastUpdated` | ISO timestamp shown on dashboard |
| `meta.currentDay` | "Day N of active conflict" counter |
| `meta.alertTicker` | Scrolling red alert bar text |
| `globalStats[]` | The 6 top-level casualty cards |
| `countries.iran/israel/usa` | Per-country stat rows |
| `militaryAssets[]` | Asset cards (ships, missiles, etc.) |
| `timeline[]` | Chronological events |
| `regional[]` | Country spillover cards |

---

## 🌐 Scaling

This is a fully static site — it scales to millions of hits with zero backend cost:

- **Cloudflare Pages**: 500 builds/month free, unlimited requests, 300+ edge nodes globally
- **Netlify**: 300 build minutes/month free, global CDN
- **Vercel**: 100GB bandwidth/month free

The `data/stats.json` file is served with a 30-second cache — updates propagate to all users within ~30 seconds of publishing.

---

## 📝 Sources

- Al Jazeera
- Wikipedia — 2026 Iran Conflict
- Hengaw Organization for Human Rights
- CENTCOM
- Israeli Ministry of Health  
- Iranian Red Crescent Society
- Lebanese Health Ministry

---

> ⚠️ Data compiled from public sources. Casualty figures are contested. Numbers change rapidly during active conflict. This portal is informational only.
