# SEO Optimization Design — Baking Intelligence Converter

**Date:** 2026-06-23
**Approach:** Approach A — all static in `public/index.html`, no new dependencies
**Scope:** All in-code items from the SEO plan; external items (custom domain, Search Console registration, OG image asset) are explicitly out of scope per the user's scoping decisions.

---

## Goal

Make the Baking Intelligence Converter discoverable and rank-worthy on Google for terms like "baking measurement converter", "grams to cups", "ingredient converter", by addressing the in-code items in the SEO plan without altering the app's visual design or adding new dependencies. The intent is to ship the highest-value SEO wins with the smallest blast radius.

## Out of scope (record so we don't drift later)

- Custom domain migration from `bakingintelligence-converter.vercel.app` to e.g. `bakingconverter.com`
- Google Search Console registration and sitemap submission
- Designing / generating an `og-image.png` asset
- Per-ingredient sub-pages like `/ingredient/flour` (and the routing setup that would entail)
- SSR / prerendering (e.g. react-snap)
- Backlinks, content marketing, or off-page SEO

Each of these is still valid follow-up work — they're deferred, not rejected.

---

## Section 1 — Metadata in `public/index.html`

All of the following are added to the existing `<head>` of `public/index.html`. They render on every request to the SPA regardless of which tab the user opens.

### Tags to add

| Tag | Value |
|------|-------|
| `<title>` | `Baking Measurement Converter | Grams to Cups Ingredient Tool` |
| `<meta name="title">` | same as title |
| `<meta name="description">` | `Accurately convert baking measurements for 180+ ingredients. Switch between grams, cups, ounces, and more with our density-aware converter. Perfect for home and professional bakers.` |
| `<meta property="og:type">` | `website` |
| `<meta property="og:url">` | `https://bakingintelligence-converter.vercel.app/` |
| `<meta property="og:title">` | `Baking Measurement Converter | Grams to Cups Ingredient Tool` |
| `<meta property="og:description">` | `Accurately convert baking measurements for 180+ ingredients. Density-aware and precise.` |
| `<meta property="twitter:card">` | `summary_large_image` |
| `<meta property="twitter:url">` | `https://bakingintelligence-converter.vercel.app/` |
| `<meta property="twitter:title">` | `Baking Measurement Converter | Grams to Cups Ingredient Tool` |
| `<meta property="twitter:description">` | `Accurately convert baking measurements for 180+ ingredients. Density-aware and precise.` |
| `<link rel="canonical">` | `https://bakingintelligence-converter.vercel.app/` |

### JSON-LD

A single `<script type="application/ld+json">` block declaring the app as a `SoftwareApplication`. Content (matches the plan verbatim):

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Baking Intelligence Converter",
  "operatingSystem": "Web",
  "applicationCategory": "UtilitiesApplication",
  "description": "A density-aware baking measurement converter for 180+ ingredients, supporting grams, cups, ounces, and more.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Tags explicitly *not* added (per user)

- `og:image` (no asset exists yet)
- `twitter:image` (no asset exists yet)
- `<meta name="robots">` is *not* set to `noindex` — explicitly *not* added. The plan's concern was to make sure no `noindex` exists; we'll verify absence.

### Existing tags left untouched

`charset`, `viewport`, `theme-color`, the two icon links, `manifest`, favicon references. Adding the new meta tags before them but after `<title>` so the head retains a sensible order.

---

## Section 2 — Heading Structure

Three coordinated changes in `src/App.js`, supported by one CSS class in `src/App.css`.

### 1. Visually-hidden H1

Rendered once per app, before the dynamic label inside the existing `<header>`:

```jsx
<h1 className="bc-visually-hidden">Baking Measurement & Ingredient Converter</h1>
<h2 className="bc-title-main">{tab === "temperature" ? "Temperature" : "Ingredients"}</h2>
```

The visible label demotes from `<h1>` to `<h2>` since the H1 has been promoted out of it.

### 2. Tab-specific H2 sections

Each tab now has a proper H2 hierarchy:

- **convert**: existing `<h3>How it works</h3>` becomes `<h2>How to use the Baking Converter</h2>` (slight rename to match plan wording)
- **convert**: new `<h2>Common Ingredient Conversion Charts</h2>` above the static chart (Section 3)
- **temperature**: existing `<h3>Oven Temperature Guide</h3>` becomes `<h2>Oven Temperature Guide</h2>`
- **books / custom**: no heading change beyond the global H1 / dynamic H2 already covered

### 3. CSS — visually-hidden pattern

Added in `src/App.css`:

```css
.bc-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

Standard accessible name pattern — stays in the DOM, hidden from sighted users, readable by crawlers and screen readers.

---

## Section 3 — Static Conversion Charts

A new `src/ConversionCharts.js` rendered at the bottom of the convert tab. It's a semantic `<table>` with both imperial and metric columns (per follow-up clarification).

### Heading and intro

```jsx
<section aria-labelledby="conversion-charts-heading">
  <h2 id="conversion-charts-heading">Common Ingredient Conversion Charts</h2>
  <p>
    Use these quick-reference baking measurement charts to convert cups to grams
    and ounces for the most-searched baking ingredients. Every value reflects
    the density of the ingredient — not a one-size-fits-all approximation —
    so your baking measurements stay precise.
 </p>
  <table></table>
</section>
```

### Table data

Rows are hard-coded so the values render in the initial HTML (no waiting on JS hydration, which matters for crawl indexing):

| Ingredient | 1 US cup (g) | 1 US cup (oz) | 240 ml (g) |
|---|---|---|---|
| All-Purpose Flour | 120 | 4.2 | 122 |
| Granulated Sugar | 200 | 7.1 | 203 |
| Brown Sugar (packed) | 220 | 7.8 | 224 |
| Butter | 227 | 8.0 | 230 |
| Powdered / Icing Sugar | 120 | 4.2 | 122 |
| Whole Wheat Flour | 130 | 4.6 | 132 |
| Honey | 340 | 12.0 | 345 |
| Cocoa Powder | 85 | 3.0 | 86 |
| Rolled Oats (old-fashioned) | 90 | 3.2 | 91 |
| Heavy / Whipping Cream | 238 | 8.4 | 241 |

Metric column derived by simple scaling against the grams-per-cup values already in `INGREDIENT_GROUPS`: `g_per_ml = gpc / 236.588`, then `240 ml = 240 × g_per_ml`. Ounces from grams via the existing `28.3495 g/oz` constant. These will be computed at module load time in JS once, but baked into the JSX as static numbers so the table rows are still in the static HTML.

### Accessibility & styling

- `<caption className="bc-visually-hidden">Baking ingredient density chart for cups, ounces, and milliliters</caption>`
- `<th scope="col">` for the four columns
- `border-collapse`, alternating row colours via existing CSS variables (`--surface`, `--border`) so the chart fits every theme without per-theme overrides.

### File responsibilities

- `src/ConversionCharts.js` — exports a default React component with the markup above. Stateless, no props.
- Wired into `src/App.js` by adding `import ConversionCharts from "./ConversionCharts";` and placing `<ConversionCharts />` below `<EbooksSection />` inside the convert-tab branch.

---

## Section 4 — Sitemap, robots.txt, internal linking

### New file: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bakingintelligence-converter.vercel.app/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
 </url>
</urlset>
```

### Modify: `public/robots.txt`

Append a `Sitemap:` line:

```
User-agent: *
Disallow:

Sitemap: https://bakingintelligence-converter.vercel.app/sitemap.xml
```

### Internal linking polish

Two small text/link improvements in `src/App.js`:

1. `EbooksSection` currently renders the hint as `<p>See full collection in Ebooks tab</p>` with no link target. Two coordinated edits:
   - Lift the tab-switching capability into `EbooksSection` by adding an `onSwitchToBooks` prop: `function EbooksSection({ onSwitchToBooks }) { ... }`.
   - In `BakingConverter`, pass `<EbooksSection onSwitchToBooks={() => setTab("books")} />`.
   - Replace the `<p>` with `<a role="button" onClick={onSwitchToBooks}>` whose anchor text is **Browse our recipe eBooks library** (keyword-rich, per the plan's internal-linking guidance).
   - Apply the existing `.bc-ebooks-hint-more` class plus a subtle hover state if one isn't already defined; if it is, reuse it.
   - Prevent default click behaviour and prevent page jump using `e.preventDefault()`.
2. `EbookCard` already uses `<a>` with rich text in the card body — no change needed beyond verifying the existing alt text on each `<img>` follows the book title, which it does.

---

## Files affected — summary

| Action | File | Purpose |
|---|---|---|
| Modify | `public/index.html` | metadata, JSON-LD, canonical |
| Modify | `public/robots.txt` | add Sitemap reference |
| Modify | `src/App.js` | hidden H1, `<h1>`→`<h2>` swap, H3→H2 upgrades, mount charts, ebooks link polish |
| Modify | `src/App.css` | `.bc-visually-hidden` class |
| Create | `public/sitemap.xml` | sitemap for Google |
| Create | `src/ConversionCharts.js` | static table component |

## Files *not* touched

- `public/manifest.json` (no change needed)
- `public/favicon.png`, `public/logo192.png`, public images (no change)
- `src/App.test.js` (no test logic references the heading/metadata we're changing)
- anything under `node_modules/`

---

## Verification

Each item is a real check the implementer (or reviewer) should perform before saying "done":

1. `npm run build` exits 0 with no warnings about missing assets.
2. `npm test` exits 0 (existing test suite passes; expected to be unaffected).
3. `npm start` boots; in the dev tools, inspect the rendered HTML — confirm:
   - `<title>` matches the new string.
   - `<meta name="description">` matches.
   - All four OG tags and four Twitter tags are present.
   - `<link rel="canonical">` is present.
   - The JSON-LD `<script type="application/ld+json">` is in `<head>` and parses as valid JSON.
   - There is **no** `<meta name="robots" content="noindex">` anywhere in `<head>` (this was the plan's crawlability concern — the absence is the success criterion).
   - The hidden H1 "Baking Measurement & Ingredient Converter" is in the DOM (search the DOM for it).
   - The two new H2s ("How to use the Baking Converter", "Common Ingredient Conversion Charts") appear in the convert tab.
   - The 10-row table renders with all four columns populated.
   - The "Browse our recipe eBooks library" anchor switches tabs to `books`.
   - `/sitemap.xml` returns 200 with the expected XML.
   - `/robots.txt` returns 200 and includes the `Sitemap:` line.
4. Run `<head>` through Google's Rich Results Test (manual step the user does; link to be verified post-deploy).
5. Lighthouse SEO audit should report a measurable improvement (manual).

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Hidden H1 visible in some theme due to CSS bug | The visually-hidden pattern is well-known and width-in-px rather than `display: none` so screen readers still read it. Spot-check both light and dark themes. |
| Tab `onClick` anchor link looks styled differently from text | Reuse the existing `.bc-ebooks-hint-more` styles for the new anchor; add a hover state if missing. |
| Sitemap lastmod is a static date | Acceptable trade-off; would need a build-time generator for true dynamic. Documented as a future improvement. |
| Future routes added to the SPA | sitemap.xml would need updating manually until prerendering is added. Acceptable for now. |
| JSON-LD `@context` URL typo | The literal `https://schema.org` from the plan is used verbatim; the implementer should double-check against [schema.org SoftwareApplication](https://schema.org/SoftwareApplication). |
