# Vercel Deployment & Domain Setup (drelix.org)

Step-by-step guide to deploy the Drelix site to Vercel and connect your domain via Cloudflare.

---

## Prerequisites

- [ ] Code pushed to GitHub, GitLab, or Bitbucket
- [ ] Vercel account ([vercel.com/signup](https://vercel.com/signup))
- [ ] Domain **drelix.org** (registrar + Cloudflare configured)
- [ ] Convex project created (if using catalog/admin)

---

## Part 1: Deploy to Vercel

### Step 1.1 – Import the project

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository**
   - Click **“Import Git Repository”**
   - Select your repo (e.g. `your-username/drelix` or the actual repo name)
   - If it’s not listed, click **“Import Third-Party Git Repository”** and paste the repo URL
3. Click **Import**

### Step 1.2 – Configure the project

1. **Project Name**
   - Default is fine (e.g. `drelix`) or set something like `drelix-org`

2. **Framework Preset**
   - Should auto-detect **Next.js**. Leave as is.

3. **Root Directory**
   - Leave as **`.`** (repo root)

4. **Build and Output Settings**
   - Leave defaults:
     - Build Command: `next build` (or empty to use default)
     - Output Directory: (Next.js default)
     - Install Command: `npm install`

5. **Environment Variables** (important)

   Click **“Environment Variables”** and add:

   | Name                     | Value                                                                          | Environment         |
   | ------------------------ | ------------------------------------------------------------------------------ | ------------------- |
   | `NEXT_PUBLIC_SITE_URL`   | `https://drelix.org`                                                           | Production, Preview |
   | `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL                                                     | Production, Preview |
   | `ADMIN_PASSWORD`         | Strong password for admin login                                                | Production, Preview |
   | `JWT_SECRET`             | Random secret for session signing (recommended; run `openssl rand -base64 32`) | Production, Preview |
   - **NEXT_PUBLIC_SITE_URL**
     - Must be `https://drelix.org` (no trailing slash).
     - Used for canonicals, sitemap, Open Graph, JSON-LD.

   - **NEXT_PUBLIC_CONVEX_URL**
     - From [dashboard.convex.dev](https://dashboard.convex.dev) → your app → Settings → Deployment URL.
     - Only needed if you use the catalog/admin.

   - **ADMIN_PASSWORD**
     - Required for admin login. Use a strong, unique password.

   - **JWT_SECRET**
     - Recommended. Used to sign admin session JWTs (more secure than using ADMIN_PASSWORD). Generate with: `openssl rand -base64 32`. If unset, ADMIN_PASSWORD is used as fallback.

   Leave **Environment** as **Production** (and **Preview** if you want preview deployments to work the same).

6. Click **Deploy**

### Step 1.3 – First deployment

- Vercel will clone the repo, install deps, and run `next build`.
- First deploy usually takes 1–2 minutes.
- When it’s done you get a URL like:  
  **`https://drelix-xxxxx.vercel.app`** (or whatever project name you used).

### Step 1.4 – Check the deployment

1. Open the **Vercel** URL from the dashboard.
2. Confirm:
   - Homepage loads
   - `/products` works
   - `/products/gloves` (or any category) works
   - `/sitemap.xml` shows URLs with **`https://drelix.org`** (once domain is set; until then they may show the `.vercel.app` URL if `NEXT_PUBLIC_SITE_URL` is only set for Production and you’re on the default domain)
3. After you add the custom domain (below), **production** traffic will use `https://drelix.org`, and canonicals/sitemap will be correct.

---

## Part 2: Add custom domain (drelix.org)

### Step 2.1 – Add domain in Vercel

1. In the Vercel dashboard, open your project.
2. Go to **Settings → Domains**.
3. In **“Add domain”**, type: **`drelix.org`**
4. Click **Add**.
5. Vercel will show you what to configure in DNS.

You’ll see one of these:

- **Option A – Recommended: CNAME (Vercel as subdomain)**
  - For **`www.drelix.org`** Vercel typically asks for:
    - **Name:** `www`
    - **Target / Value:** `cname.vercel-dns.com` (or the exact value Vercel shows)
  - For **root domain `drelix.org`** Vercel usually recommends either:
    - An **A record** to Vercel’s IP, or
    - **CNAME flattening** (e.g. at Cloudflare: CNAME `drelix.org` → `cname.vercel-dns.com`).

- **Option B – A record**
  - Vercel may give you an IP (e.g. `76.76.21.21`) for an A record on `drelix.org`.

**Write down exactly what Vercel shows** (record type, name, value) so you can match it in Cloudflare.

### Step 2.2 – Configure DNS in Cloudflare

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Select the zone for **drelix.org**.
3. Go to **DNS → Records**.

**Recommended setup:**

**A) Root domain – `drelix.org`**

- If Vercel says to use an **A record**:
  - **Type:** A
  - **Name:** `@`
  - **IPv4 address:** (the IP Vercel gave you, e.g. `76.76.21.21`)
  - **Proxy status:** **Proxied** (orange cloud) is fine with Cloudflare.
  - **TTL:** Auto.

- If Vercel says to use **CNAME for root** (CNAME flattening):
  - **Type:** CNAME
  - **Name:** `@`
  - **Target:** `cname.vercel-dns.com` (or the exact value from Vercel).
  - **Proxy status:** Proxied (orange) is OK.
  - Save.

**B) www – `www.drelix.org`**

- **Type:** CNAME
- **Name:** `www`
- **Target:** `cname.vercel-dns.com` (or the value Vercel shows for `www`)
- **Proxy status:** Proxied (orange).
- Save.

**Summary:**

| Type         | Name  | Content / Target                    | Proxy      |
| ------------ | ----- | ----------------------------------- | ---------- |
| A (or CNAME) | `@`   | Vercel IP or `cname.vercel-dns.com` | Proxied ✅ |
| CNAME        | `www` | `cname.vercel-dns.com`              | Proxied ✅ |

### Step 2.3 – Point both root and www to Vercel (in Vercel)

1. In Vercel **Settings → Domains**, add:
   - **`drelix.org`**
   - **`www.drelix.org`**
2. For **`drelix.org`**, click the three dots → **Set as Primary** (so the main site is `https://drelix.org`).
3. Optional: enable **“Redirect www to non-www”** (or vice versa) so one canonical host is used everywhere. Recommended: **Redirect `www` → `drelix.org`** so canonicals stay as `https://drelix.org`.

### Step 2.4 – Wait for DNS and SSL

1. **DNS propagation**
   - Usually 5–30 minutes with Cloudflare.
   - In Vercel **Domains**, each domain will show **Valid Configuration** when DNS is correct.

2. **SSL**
   - Vercel will issue a certificate for `drelix.org` (and `www` if added).
   - Status in Vercel will change to something like **Certificate Ready** when done.

3. **If it stays “Invalid”**
   - Double-check the record type, name, and target in Cloudflare.
   - Ensure no typo in `drelix.org` in Vercel.
   - Turn Cloudflare proxy **off** temporarily (grey cloud) to rule out proxy issues, then turn it back on.

---

## Part 3: Verify deployment and SEO

### 3.1 – Live checks

- [ ] **https://drelix.org** – loads and shows your site.
- [ ] **https://www.drelix.org** – either redirects to `https://drelix.org` or loads the same (depending on redirect setting).
- [ ] **https://drelix.org/sitemap.xml** – lists URLs and that they use **`https://drelix.org`** (no `.vercel.app`).
- [ ] **https://drelix.org/robots.txt** – shows your rules and `Sitemap: https://drelix.org/sitemap.xml`.
- [ ] **View page source** on homepage – `<link rel="canonical" href="https://drelix.org" />` and JSON-LD `url`/`@id` use `https://drelix.org`.

### 3.2 – Environment variable reminder

Production must use:

```bash
NEXT_PUBLIC_SITE_URL=https://drelix.org
```

If you ever see canonicals or sitemap still using `https://drelix-xxx.vercel.app`, check **Vercel → Project → Settings → Environment Variables** and that **Production** has `NEXT_PUBLIC_SITE_URL=https://drelix.org`. Then trigger a new deploy (e.g. **Deployments → … → Redeploy**).

---

## Part 4: Optional – Cloudflare + Vercel

You’re already using Cloudflare for **drelix.org**. That’s fine:

- **Proxy (orange cloud):** Traffic goes Cloudflare → Vercel. DDoS/Bot Fight Mode/AI Labyrinth apply at Cloudflare.
- **SSL:** Cloudflare can use “Full (strict)” to Vercel; Vercel provides a valid cert.
- **Caching:** You can use Cloudflare cache; for dynamic Next.js, default settings are often enough. You can tune later.

No extra steps required for a basic “domain works + SSL” setup.

---

## Part 5: After go-live checklist

1. **Google Search Console**
   - Add property **`https://drelix.org`**.
   - Submit sitemap: **`https://drelix.org/sitemap.xml`**.

2. **Cloudflare**
   - **Block AI Bots:** ON (if you want to block AI crawlers).
   - **Robots.txt:** Content Signals Policy.
   - **Bot Fight Mode:** ON; monitor GSC crawl stats.

3. **Convex** (if used)
   - Ensure production Convex URL is in `NEXT_PUBLIC_CONVEX_URL` and that Convex allows your Vercel domain if you use auth/origins.

---

## Quick reference

| Step | Where                       | What                                                      |
| ---- | --------------------------- | --------------------------------------------------------- |
| 1    | Vercel → New Project        | Import repo, set env vars, Deploy                         |
| 2    | Vercel → Settings → Domains | Add `drelix.org` and `www.drelix.org`                     |
| 3    | Cloudflare → DNS            | A (or CNAME) for `@`, CNAME for `www` → Vercel            |
| 4    | Vercel → Domains            | Set primary, optional redirect www → root                 |
| 5    | Browser                     | Check https://drelix.org, sitemap, robots.txt, canonicals |
| 6    | GSC                         | Add property, submit sitemap                              |

---

## Troubleshooting

**“Invalid configuration” on domain**

- Re-check DNS in Cloudflare (type, name, value).
- Wait up to 1 hour.
- Try with Cloudflare proxy **off** to confirm it’s not a proxy issue.

**Site works on .vercel.app but not on drelix.org**

- DNS not propagated yet, or wrong record.
- Confirm in Vercel Domains that it says **Valid Configuration**.

**Canonicals or sitemap still show .vercel.app**

- `NEXT_PUBLIC_SITE_URL` must be `https://drelix.org` for **Production**.
- Redeploy after changing env vars.

**SSL certificate pending**

- Wait 5–15 minutes after DNS is valid.
- Ensure no firewall or DNS rule is blocking Vercel’s validation.

---

_Last updated for domain **drelix.org** and Vercel + Cloudflare setup._
