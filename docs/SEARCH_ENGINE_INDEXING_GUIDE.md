# OMKARA — Search Engine Indexing & Verification Guide
> **Target Search Engines:** Google, Brave, Bing, DuckDuckGo  
> **Canonical Domain:** `https://omkara-store.pages.dev` (or your custom domain)

---

## 1. Summary of Indexing Assets Configured

Your storefront now contains full indexing and discovery assets:
- **`robots.txt`** (`/robots.txt`): Allows all search crawlers (`Googlebot`, `Bingbot`, `Bravebot`, `DuckDuckBot`) and references the sitemap.
- **`sitemap.xml`** (`/sitemap.xml`): XML sitemap listing canonical routes, priorities, and image metadata.
- **`site.webmanifest`** (`/site.webmanifest`): PWA manifest providing mobile-readiness signals to search engine algorithms.
- **Canonical Tag**: `<link rel="canonical" href="https://omkara-store.pages.dev/" />` to prevent duplicate index penalties.
- **Enhanced Robots Directives**: Allows large image snippets (`max-image-preview:large`) for rich search cards.
- **Local SEO & Geo Tags**: Targeted to **Bikaner, Rajasthan** (`geo.region`, `geo.placename`, `geo.position`, `ICBM`).
- **Structured Data (JSON-LD)**: Schema.org graph combining `WebSite`, `FastFoodRestaurant` / `LocalBusiness`, and `Menu`.
- **Pre-rendered Semantic Fallback**: Allows bots that do not run JavaScript (or index static HTML first, like Bravebot) to immediately index all headings, food categories, and contact info.

---

## 2. Google Search (Googlebot)

Google uses **Google Search Console** (GSC) to monitor, crawl, and index your website.

### Step 2.1: Add Property in Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Choose **URL prefix**: Enter `https://omkara-store.pages.dev` (or your custom domain).
4. For verification:
   - Select **HTML tag**.
   - Copy the verification code (e.g., `google-site-verification=abcdef123456...`).
   - Open `storefront/index.html` and replace `google-site-verification-token` with your code:
     ```html
     <meta name="google-site-verification" content="abcdef123456..." />
     ```
   - Deploy/publish the site and click **Verify** in Google Search Console.

### Step 2.2: Submit the XML Sitemap
1. In Google Search Console, navigate to **Indexing** > **Sitemaps** in the left sidebar.
2. Under "Add a new sitemap", enter: `sitemap.xml`.
3. Click **Submit**.
4. Status will change to "Success", and Google will queue your URLs and images for indexing.

### Step 2.3: Request Instant Indexing
1. In the top search bar ("Inspect any URL in..."), paste: `https://omkara-store.pages.dev/`.
2. Wait for the URL inspection check.
3. Click **Request Indexing**. This places your homepage at the front of Google's crawling queue.

---

## 3. Bing Webmaster Tools (Powers Bing & DuckDuckGo)

DuckDuckGo **does not have a separate webmaster console**; it uses **Bing's Web Index** as its primary search index. Getting verified and indexed on Bing automatically indexes you on DuckDuckGo!

### Step 3.1: Add Site to Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Sign in with your Microsoft, Google, or GitHub account.
3. You can either:
   - **Import directly from Google Search Console** (1-click verification if you already set up Google Search Console), or:
   - Add your site manually: `https://omkara-store.pages.dev`.

### Step 3.2: Verify Ownership via HTML Meta Tag (if adding manually)
1. Select the **HTML Meta Tag** method.
2. Copy the token string from `<meta name="msvalidate.01" content="YOUR_TOKEN" />`.
3. Update `storefront/index.html`:
   ```html
   <meta name="msvalidate.01" content="YOUR_TOKEN" />
   ```
4. Deploy and click **Verify** in Bing Webmaster Tools.

### Step 3.3: Submit Sitemap
1. Go to **Sitemaps** in Bing Webmaster Tools.
2. Click **Submit sitemap**.
3. Enter: `https://omkara-store.pages.dev/sitemap.xml`.
4. Click **Submit**.

### Step 3.4: Use URL Submission for Instant Indexing
1. In the sidebar, click **URL Submission**.
2. Submit `https://omkara-store.pages.dev/`.
3. Bing will crawl the page within minutes.

---

## 4. DuckDuckGo

DuckDuckGo crawls and indexes through three channels:
1. **Bing Index**: By completing Step 3 (Bing Webmaster Tools), DuckDuckGo will index your site automatically.
2. **DuckDuckBot**: DuckDuckGo's direct crawler follows `robots.txt` and `sitemap.xml`. In `robots.txt`, we have explicitly authorized:
   ```txt
   User-agent: DuckDuckBot
   Allow: /
   ```
3. **Structured Data Instant Answers**: DuckDuckGo uses the `FastFoodRestaurant` and `Menu` Schema.org JSON-LD tags we configured to construct entity cards.

---

## 5. Brave Search (Bravebot)

Brave Search operates an **independent web index** built by **Bravebot** (`Mozilla/5.0 (compatible; Bravebot/1.0)`).

### Step 5.1: Bravebot Crawl Authorization
Bravebot checks `robots.txt`. We added explicit allowance:
```txt
User-agent: Bravebot
Allow: /
```

### Step 5.2: Submit to Brave Search
1. Visit the [Brave Search Webmaster Portal](https://search.brave.com/help/webmaster) or submit your website directly via [Brave Search Index Submission](https://search.brave.com/).
2. Conduct a query on [Brave Search](https://search.brave.com/) for `site:omkara-store.pages.dev`.
3. If not yet appearing, use Brave's feedback / URL submission link ("Tell us about a missing site") to request immediate inclusion.
4. Because we included static crawlable HTML inside `<div id="app">`, Bravebot can index the entire brand story, product categories, and Bikaner address without executing JavaScript.

---

## 6. Verification & Rich Snippet Testing Tools

Before or after submitting, verify your markup with these free testing tools:

| Tool | Purpose | URL |
|---|---|---|
| **Google Rich Results Test** | Test Schema.org JSON-LD and preview Google search snippets | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| **Schema Markup Validator** | Validate official Schema.org syntax for Restaurant, Menu, WebSite | [validator.schema.org](https://validator.schema.org/) |
| **Bing URL Inspection** | Check Bingbot crawl status, mobile friendliness & indexing blockers | Accessible inside Bing Webmaster Tools |
| **Open Graph Debugger** | Test how your preview card appears on WhatsApp, Facebook, LinkedIn | [opengraph.xyz](https://www.opengraph.xyz/) |

---

## 7. Connecting a Custom Domain (e.g., `omkarafoods.com`)

If you attach a custom domain in Firebase Hosting / Cloudflare Pages:
1. Update `storefront/index.html`:
   - Replace `https://omkara-store.pages.dev/` with `https://yourdomain.com/` in:
     - `<link rel="canonical" ... />`
     - `<meta property="og:url" ... />`
     - `<meta property="og:image" ... />`
     - `<meta name="twitter:url" ... />`
     - `<meta name="twitter:image" ... />`
     - Schema.org JSON-LD `@id` and `url` attributes.
2. Update `storefront/public/robots.txt`:
   - Change `Sitemap: https://yourdomain.com/sitemap.xml`.
3. Update `storefront/public/sitemap.xml`:
   - Replace `https://omkara-store.pages.dev/` with `https://yourdomain.com/`.
4. Re-run `npm run build` and deploy.
