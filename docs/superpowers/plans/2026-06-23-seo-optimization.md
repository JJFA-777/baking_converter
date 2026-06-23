# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the SEO plan in code using Approach A (static HTML, no new deps): metadata + JSON-LD, hidden H1, static conversion chart with both metric and US/imperial columns, sitemap.xml, canonical tag, robots.txt update, and an internal-link polish on the ebooks section.

**Architecture:** Single React SPA. SEO additions live in `public/index.html` (static) and a new `src/ConversionCharts.js` component. Heading hierarchy is reshaped in `src/App.js` with a `.bc-visually-hidden` CSS class supporting the hidden H1. Internal link in `EbooksSection` is upgraded from a static hint to a clickable tab-switcher via a new prop.

**Tech Stack:** React 19 (`create-react-app`), Jest + Testing Library (already configured in `src/setupTests.js`).

**Spec:** `docs/superpowers/specs/2026-06-23-seo-optimization-design.md`

## Global Constraints

- Branch: `main`; commits are small and frequent (one per task).
- Working dir: `C:\Users\jesun\Downloads\bi_converter_app\baking-converter`.
- The canonical and OG URLs use `https://bakingintelligence-converter.vercel.app/` (current Vercel URL; custom domain deferred per spec).
- No new npm dependencies.
- All visible styling continues to use existing CSS variables (`--surface`, `--border`, etc.) so themes still render unchanged.
- The hidden H1 copy is exactly: `Baking Measurement & Ingredient Converter` (from the spec).
- Inline-anchors that switch tabs must call `e.preventDefault()` to avoid hash navigation.

---

### Task 1: Add CSS for visually-hidden pattern

**Files:**
- Modify: `src/App.css` (append at end)

**Interfaces:**
- Consumes: nothing
- Produces: a `.bc-visually-hidden` utility class available to any future component

- [ ] **Step 1: Append the class to `src/App.css`**

Open `src/App.css` and add at the very bottom:

```css
/* visually hidden but accessible to crawlers and screen readers */
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

- [ ] **Step 2: Verify file parses**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && npx --no-install postcss --version 2>&1 | head -5`
Expected: either a version printed (raises error if you have it) or a clear "not installed" message — this is just sanity that nothing else is broken. If unsure: just run `npm test` once and confirm CSS-import side effects still work.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add src/App.css
git commit -m "feat(seo): add bc-visually-hidden utility class"
```

---

### Task 2: Create the static ConversionCharts component (TDD)

**Files:**
- Create: `src/ConversionCharts.js`
- Create: `src/ConversionCharts.test.js`

**Interfaces:**
- Consumes: nothing (stateless component)
- Produces: `<section aria-labelledby="conversion-charts-heading">` containing an `<h2>`, intro `<p>`, and a `<table>` with 10 rows + visually-hidden caption. Exports a default React component.

- [ ] **Step 1: Write the failing test**

Create `src/ConversionCharts.test.js`:

```js
import { render, screen, within } from '@testing-library/react';
import ConversionCharts from './ConversionCharts';

test('renders the heading and intro for SEO', () => {
  render(<ConversionCharts />);
  const heading = screen.getByRole('heading', { level: 2, name: /Common Ingredient Conversion Charts/i });
  expect(heading).toBeInTheDocument();
});

test('renders all 10 ingredient rows with the expected names', () => {
  render(<ConversionCharts />);
  const table = screen.getByRole('table', { name: /baking ingredient density chart/i });
  const expected = [
    'All-Purpose Flour',
    'Granulated Sugar',
    'Brown Sugar (packed)',
    'Butter',
    'Powdered / Icing Sugar',
    'Whole Wheat Flour',
    'Honey',
    'Cocoa Powder',
    'Rolled Oats (old-fashioned)',
    'Heavy / Whipping Cream',
  ];
  const rows = within(table).getAllByRole('row');
  // First row is the header; data rows follow.
  expect(rows.length - 1).toBe(expected.length);
  for (const name of expected) {
    const cell = within(table).getByText(name);
    expect(cell).toBeInTheDocument();
  }
});

test('each row exposes grams, ounces, and millilitres columns', () => {
  render(<ConversionCharts />);
  const table = screen.getByRole('table', { name: /baking ingredient density chart/i });
  // Spot-check the all-purpose flour row text content.
  const flourRow = within(table).getByText('All-Purpose Flour').closest('tr');
  expect(flourRow.textContent).toMatch(/120/);   // grams per US cup
  expect(flourRow.textContent).toMatch(/4\.2/);  // ounces (120 / 28.3495)
  expect(flourRow.textContent).toMatch(/122/);   // 240 ml in grams
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && npx --no-install react-scripts test --watchAll=false src/ConversionCharts.test.js`
Expected: FAIL — `Cannot find module './ConversionCharts'`.

- [ ] **Step 3: Implement `src/ConversionCharts.js`**

```js
import React from "react";

const ML_PER_CUP = 236.588;
const G_PER_OZ = 28.3495;

// Density in grams per US cup for the 10 highest-traffic ingredients.
// Source: same values used in App.js INGREDIENT_GROUPS.
const ROWS = [
  { name: "All-Purpose Flour",            gpc: 120 },
  { name: "Granulated Sugar",            gpc: 200 },
  { name: "Brown Sugar (packed)",        gpc: 220 },
  { name: "Butter",                      gpc: 227 },
  { name: "Powdered / Icing Sugar",      gpc: 120 },
  { name: "Whole Wheat Flour",           gpc: 130 },
  { name: "Honey",                       gpc: 340 },
  { name: "Cocoa Powder",                gpc:  85 },
  { name: "Rolled Oats (old-fashioned)",  gpc:  90 },
  { name: "Heavy / Whipping Cream",      gpc: 238 },
];

function gramsForMl(gpc, ml) {
  return Math.round((gpc / ML_PER_CUP) * ml);
}

function ozFromGrams(g) {
  return Math.round((g / G_PER_OZ) * 10) / 10;
}

export default function ConversionCharts() {
  const rows = ROWS.map(r => ({
    name: r.name,
    grams: r.gpc,
    oz: ozFromGrams(r.gpc),
    ml240: gramsForMl(r.gpc, 240),
  }));

  return (
    <section
      className="bc-conversion-charts"
      aria-labelledby="conversion-charts-heading"
      style={{
        margin: "24px 16px",
        padding: "16px",
        borderRadius: "16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        id="conversion-charts-heading"
        style={{ fontSize: "20px", marginBottom: "8px" }}
      >
        Common Ingredient Conversion Charts
     </h2>
      <p
        style={{
          margin: "0 0 16px",
          lineHeight: 1.5,
          fontSize: "15px",
        }}
      >
        Use these quick-reference baking measurement charts to convert cups to
        grams and ounces for the most-searched baking ingredients. Every value
        reflects the density of the ingredient — not a one-size-fits-all
        approximation — so your baking measurements stay precise.
     </p>
      <table
        className="bc-conversion-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <caption className="bc-visually-hidden">
          Baking ingredient density chart for cups, ounces, and millilitres
       </caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "left", padding: "8px" }}>Ingredient</th>
            <th scope="col" style={{ textAlign: "right", padding: "8px" }}>1 US cup (g</th>
            <th scope="col" style={{ textAlign: "right", padding: "8px" }}>1 US cup (oz</th>
            <th scope="col" style={{ textAlign: "right", padding: "8px" }}>240 ml (g</th>
         </tr>
       </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "8px", textAlign: "left" }}>{r.name</td>
              <td style={{ padding: "8px", textAlign: "right" }}>{r.grams</td>
              <td style={{ padding: "8px", textAlign: "right" }}>{r.oz</td>
              <td style={{ padding: "8px", textAlign: "right" }}>{r.ml240</td>
           </tr>
          ))}
       </tbody>
     </table>
   </section>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && npx --no-install react-scripts test --watchAll=false src/ConversionCharts.test.js`
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add src/ConversionCharts.js src/ConversionCharts.test.js
git commit -m "feat(seo): add static conversion charts with 10 ingredients"
```

---

### Task 3: Add metadata, JSON-LD, and canonical to public/index.html

**Files:**
- Modify: `public/index.html` (insert into `<head>`)

**Interfaces:**
- Consumes: nothing
- Produces: a fully-populated `<head>` containing title, primary meta, OG, Twitter, canonical, and JSON-LD script

- [ ] **Step 1: Replace the contents of `public/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />

    <!-- Primary Meta Tags -->
    <title>Baking Measurement Converter | Grams to Cups Ingredient Tool</title>
    <meta name="title" content="Baking Measurement Converter | Grams to Cups Ingredient Tool" />
    <meta
      name="description"
      content="Accurately convert baking measurements for 180+ ingredients. Switch between grams, cups, ounces, and more with our density-aware converter. Perfect for home and professional bakers."
    />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://bakingintelligence-converter.vercel.app/" />
    <meta property="og:title" content="Baking Measurement Converter | Grams to Cups Ingredient Tool" />
    <meta property="og:description" content="Accurately convert baking measurements for 180+ ingredients. Density-aware and precise." />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://bakingintelligence-converter.vercel.app/" />
    <meta property="twitter:title" content="Baking Measurement Converter | Grams to Cups Ingredient Tool" />
    <meta property="twitter:description" content="Accurately convert baking measurements for 180+ ingredients. Density-aware and precise." />

    <link rel="canonical" href="https://bakingintelligence-converter.vercel.app/" />

    <!-- Structured Data: SoftwareApplication -->
    <script type="application/ld+json">
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
   </script>

    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
 </head>
  <body>
    <noscript>You need to enable JavaScript to run this app</noscript>
    <div id="root</div>
 </body>
</html>
```

- [ ] **Step 2: Spot-check the file**

Read `public/index.html` and confirm:
- `<title>` matches the new string.
- One `<meta name="title">`, one `<meta name="description">`.
- Four OG meta tags (`og:type`, `og:url`, `og:title`, `og:description`).
- Four Twitter meta tags (`twitter:card`, `twitter:url`, `twitter:title`, `twitter:description`).
- `<link rel="canonical">` is present.
- The JSON-LD `<script type="application/ld+json">` is present and `</script>` closes it.
- **No** `<meta name="robots" content="noindex">` anywhere.
- `charset`, `viewport`, `theme-color`, `apple-touch-icon`, `manifest` retained.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add public/index.html
git commit -m "feat(seo): add title, meta, og, twitter, canonical, json-ld to index.html"
```

---

### Task 4: Create public/sitemap.xml

**Files:**
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: nothing
- Produces: a valid `sitemaps.org/schemas/sitemap/0.9` XML at `/sitemap.xml`

- [ ] **Step 1: Create the file**

Write `public/sitemap.xml`:

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

- [ ] **Step 2: Validate XML**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && npx --no-install xmllint --noout public/sitemap.xml 2>&1 | head -3 || echo OK`
Expected: empty output (xmllint silent on success) or `OK` if xmllint isn't installed. As an alternate check: open the file and confirm `<urlset>` opens and closes with the namespace, and the single `<url>` element has `loc`, `lastmod`, `changefreq`, `priority`.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add public/sitemap.xml
git commit -m "feat(seo): add sitemap.xml"
```

---

### Task 5: Update public/robots.txt with sitemap reference

**Files:**
- Modify: `public/robots.txt`

**Interfaces:**
- Consumes: nothing
- Produces: an open-crawl robots policy plus a `Sitemap:` directive

- [ ] **Step 1: Replace the contents**

Write the exact contents of `public/robots.txt`:

```
User-agent: *
Disallow:

Sitemap: https://bakingintelligence-converter.vercel.app/sitemap.xml
```

- [ ] **Step 2: Verify**

Re-read the file. Confirm: one blank line between `Disallow:` and `Sitemap:`, the Sitemap URL is exactly the production URL.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add public/robots.txt
git commit -m "feat(seo): reference sitemap from robots.txt"
```

---

### Task 6: Reshape heading hierarchy in src/App.js (hidden H1 + H1→H2 demote + H3→H2 upgrades)

**Files:**
- Modify: `src/App.js` at the header block and inside `<TemperatureTab>`/convert-tab fragments

**Interfaces:**
- Consumes: nothing new beyond what's already there
- Produces:
  - A hidden H1 with text `Baking Measurement & Ingredient Converter` rendered above the dynamic title.
  - The dynamic visible label demoted from `<h1 className="bc-title-main">` to `<h2 className="bc-title-main">`.
  - In the convert tab: the `<h3>How it works</h3>` upgraded to `<h2>How to use the Baking Converter</h2>`.
  - In `TemperatureTab`: the `<h3>Oven Temperature Guide</h3>` upgraded to `<h2>Oven Temperature Guide</h2>`.

- [ ] **Step 1: Replace the header `<h1>` block**

Find these lines in `src/App.js` (the old header):

```jsx
        <div className="bc-title-block">
          <h1 className="bc-title-main">{tab === "temperature" ? "Temperature" : "Ingredients"}</h1>
          <p className="bc-title-sub">C O N V E R T E R</p>
       </div>
```

Replace them with:

```jsx
        <div className="bc-title-block">
          <h1 className="bc-visually-hidden">Baking Measurement & Ingredient Converter</h1>
          <h2 className="bc-title-main">{tab === "temperature" ? "Temperature" : "Ingredients"}</h2>
          <p className="bc-title-sub">C O N V E R T E R</p>
       </div>
```

- [ ] **Step 2: Rename and upgrade the convert-tab "How it works" h3**

Find in `src/App.js` (inside the convert branch):

```jsx
              <h3 className="bc-custom-title" style={{ fontSize: '20px', marginBottom: '8px' }}>How it works</h3>
```

Replace with:

```jsx
              <h2 className="bc-custom-title" style={{ fontSize: '20px', marginBottom: '8px' }}>How to use the Baking Converter</h2>
```

- [ ] **Step 3: Upgrade the temperature tab's "Oven Temperature Guide" h3**

Find in `src/App.js` (inside `TemperatureTab`):

```jsx
        <h3 className="bc-handwriting-title" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>
          Oven Temperature Guide
       </h3>
```

Replace with:

```jsx
        <h2 className="bc-handwriting-title" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>
          Oven Temperature Guide
       </h2>
```

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add src/App.js
git commit -m "feat(seo): add hidden h1 and fix heading hierarchy (h3 to h2)"
```

---

### Task 7: Mount ConversionCharts in the convert tab

**Files:**
- Modify: `src/App.js`

**Interfaces:**
- Consumes: the previously-created `ConversionCharts` default export
- Produces: `<ConversionCharts />` rendered at the bottom of the convert-tab branch (above the `<AppFooter />`)

- [ ] **Step 1: Add the import**

Near the top of `src/App.js`, add alongside the existing CSS import:

```js
import ConversionCharts from "./ConversionCharts";
```

- [ ] **Step 2: Place the component**

Locate the convert-tab branch in `BakingConverter`. It ends with `<EbooksSection />` followed by the closing fragment `</>`. Change:

```jsx
            {/* ── Book Ads ── */}
            <EbooksSection />
          </>
```

to:

```jsx
            {/* ── Book Ads ── */}
            <EbooksSection />

            {/* ── Static SEO Conversion Charts ── */}
            <ConversionCharts />
          </>
```

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add src/App.js
git commit -m "feat(seo): mount conversion charts in convert tab"
```

---

### Task 8: Wire keyword-rich ebooks internal link (onSwitchToBooks prop)

**Files:**
- Modify: `src/App.js`

**Interfaces:**
- Consumes: the existing `EbooksSection` component (children: cards + hint paragraph)
- Produces:
  - `function EbooksSection({ onSwitchToBooks }) { ... }` accepts an `onSwitchToBooks` callback prop.
  - The `<p>See full collection in Ebooks tab</p>` becomes an anchor: `<a role="button" onClick={onSwitchToBooks} className="bc-ebooks-hint-more">Browse our recipe eBooks library</a>` with `preventDefault()`.
  - `<EbooksSection />` in `BakingConverter` becomes `<EbooksSection onSwitchToBooks={() => setTab("books")} />`.

- [ ] **Step 1: Update the `EbooksSection` signature**

Find:

```jsx
function EbooksSection() {
  return (
    <div className="bc-ebooks-section">
      <div className="bc-ebooks-header">
        <span className="bc-ebooks-label bc-handwriting-title">📖 From the Author's Kitchen</span>
        <p className="bc-ebooks-sub-large">Tap an ebook to enquire via WhatsApp</p>
     </div>
      <div className="bc-ebooks-scroll">
        {EBOOKS.slice(0, 3).map((book, i) => <EbookCard key={book.id} book={book} index={i} />)}
     </div>
      <p className="bc-ebooks-hint-more">See full collection in Ebooks tab</p>
   </div>
  );
}
```

Replace with:

```jsx
function EbooksSection({ onSwitchToBooks }) {
  return (
    <div className="bc-ebooks-section">
      <div className="bc-ebooks-header">
        <span className="bc-ebooks-label bc-handwriting-title">📖 From the Author's Kitchen</span>
        <p className="bc-ebooks-sub-large">Tap an ebook to enquire via WhatsApp</p>
     </div>
      <div className="bc-ebooks-scroll">
        {EBOOKS.slice(0, 3).map((book, i) => <EbookCard key={book.id} book={book} index={i} />)}
     </div>
      <a
        href="#ebooks"
        role="button"
        className="bc-ebooks-hint-more"
        onClick={(e) => {
          e.preventDefault();
          if (onSwitchToBooks) onSwitchToBooks();
        }}
      >
        Browse our recipe eBooks library
     </a>
   </div>
  );
}
```

- [ ] **Step 2: Pass the prop from `BakingConverter`**

Find the JSX where `<EbooksSection />` is rendered (now near the bottom of the convert-tab branch, just above `<ConversionCharts />`):

```jsx
            {/* ── Book Ads ── */}
            <EbooksSection />
```

Replace with:

```jsx
            {/* ── Book Ads ── */}
            <EbooksSection onSwitchToBooks={() => setTab("books")} />
```

(Note: `EbooksTab` callsites — searching the file — are not affected; the prop is optional and `EbooksTab` doesn't invoke it.)

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add src/App.js
git commit -m "feat(seo): upgrade ebooks hint to keyword-rich internal link"
```

---

### Task 9: Replace stale App.test.js with one that asserts the new heading and chart are present

**Files:**
- Modify: `src/App.test.js`

**Interfaces:**
- Consumes: `App` default export from `./App`
- Produces: A passing Jest test that proves (a) the SEO H1 is in the document (implying it's in the rendered DOM even though visually hidden), and (b) the chart heading and one expected row are present.

- [ ] **Step 1: Replace the contents of `src/App.test.js`**

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SEO h1 in the DOM', () => {
  render(<App />);
  const h1 = screen.getByRole('heading', {
    level: 1,
    name: /Baking Measurement & Ingredient Converter/i,
  });
  expect(h1).toBeInTheDocument();
});

test('renders the static conversion charts heading and an expected ingredient', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { level: 2, name: /Common Ingredient Conversion Charts/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/All-Purpose Flour/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run all tests**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && npx --no-install react-scripts test --watchAll=false`
Expected: All tests pass — `App.test.js` (2 tests) plus `ConversionCharts.test.js` (3 tests).

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
git add src/App.test.js
git commit -m "test: assert seo h1 and conversion charts render"
```

---

### Task 10: Final build + manual verification

**Files:**
- (no edits — verification only)

- [ ] **Step 1: Run the production build**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && npx --no-install react-scripts build 2>&1 | tail -30`
Expected: exit 0, `The build folder is ready to be deployed.` line near the end.

- [ ] **Step 2: Confirm public assets are deployed correctly**

Run:
```bash
cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter"
ls build/sitemap.xml build/robots.txt build/index.html
grep -E 'name="description"|<title>' build/index.html
grep -E 'og:title|twitter:title|rel="canonical"' build/index.html
grep -E 'application/ld\+json' build/index.html
```

Expected:
- All three files exist.
- One `<title>` and one description tag (matching the new strings).
- Canonical, OG, Twitter tags present.
- A line containing `application/ld+json` is found.

- [ ] **Step 3: Confirm no `noindex` directive slipped in**

Run: `cd "/c/Users/jesun/Downloads/bi_converter_app/baking-converter" && grep -R "noindex" build/ 2>&1 || echo "OK no noindex"`
Expected: either no matches, or "OK no noindex".

- [ ] **Step 4: Final report**

If all of the above pass, the plan is complete. Final state:

| File | Status |
|------|--------|
| `src/App.css` | +8 lines: `.bc-visually-hidden` |
| `src/ConversionCharts.js` | new component, 10-row table |
| `src/ConversionCharts.test.js` | new, 3 tests |
| `src/App.test.js` | replaced stale test with 2 SEO assertions |
| `src/App.js` | hidden H1, h1→h2 demote, h3→h2 upgrades, ConversionCharts mount, onSwitchToBooks prop |
| `public/index.html` | full metadata + JSON-LD + canonical |
| `public/sitemap.xml` | new |
| `public/robots.txt` | +1 Sitemap line |

- No commit is created in this task — it's verification only.

---

## Self-Review Summary (already performed before publish)

- **Spec coverage:** Every requirement in the spec's four sections has a task. Section 5 (verification) maps to Task 10. Risks from the spec are noted in the verification step.
- **Placeholders:** None. Every `Step N` block contains real code or an actual command.
- **Type/signature consistency:** `EbooksSection({ onSwitchToBooks })` is used consistently. `ConversionCharts` is imported once and referenced once. `.bc-visually-hidden` is referenced in two files but defined in one — consistent.
- **Test-first ordering:** Tasks 2 and 9 follow the red-green-refactor cycle (write the failing test first, then implement).
- **Commit hygiene:** One commit per task; commits are scoped and message-formatted.
