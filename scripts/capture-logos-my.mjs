import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const htmlFile = resolve(projectRoot, 'docs', 'logo-preview.html');
const outDir = resolve(projectRoot, 'public', 'logos-my');

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(`file:///${htmlFile.replace(/\\/g, '/')}`);

// Wait for Google Fonts (Fraunces + Karla) to finish loading
await page.waitForFunction(() => document.fonts.ready);
await page.waitForTimeout(2500);

// ── Replace "the" / "THE" with "my" / "MY" everywhere in the page ──
await page.evaluate(() => {
  // All spans that carry the "the" word across all concepts
  const selectors = [
    '.wm .t',           // Concepts 1, 2, 3 — "the" label
    '.c4-the-xl',       // Concept 4 full-size "the"
    '.c4-the-hd',       // Concept 4 header-size "the"
    '.c5-the',          // Concept 5 stacked "the"
    '.chosen-the',      // Chosen direction "THE"
  ];

  for (const sel of selectors) {
    document.querySelectorAll(sel).forEach(el => {
      const t = el.textContent.trim();
      if (t === 'the') el.textContent = 'my';
      else if (t === 'THE') el.textContent = 'MY';
    });
  }

  // Also update the page title and section labels
  document.querySelectorAll('.pg-title').forEach(el => {
    el.textContent = el.textContent.replace('thestackmint', 'mystackmint');
  });
  document.querySelectorAll('.sect-label').forEach(el => {
    el.textContent = el.textContent
      .replace(/[""]the[""]|"the"/gi, '"my"')
      .replace(/"THE"/gi, '"MY"');
  });
});

// ── Helper: screenshot an element with a solid background ──
async function shot(selector, filename, bgColor = '#111111') {
  const el = await page.$(selector);
  if (!el) { console.warn(`Not found: ${selector}`); return; }

  await page.evaluate(({ sel, bg }) => {
    const el = document.querySelector(sel);
    el.style.padding = '32px 40px';
    el.style.background = bg;
    el.style.borderRadius = '16px';
  }, { sel: selector, bg: bgColor });

  await el.screenshot({ path: resolve(outDir, filename), scale: 'device' });
  console.log(`✓ ${filename}`);

  await page.evaluate(({ sel }) => {
    const el = document.querySelector(sel);
    el.style.padding = '';
    el.style.background = '';
    el.style.borderRadius = '';
  }, { sel: selector });
}

// ── Full page reference sheet ──
await page.screenshot({ path: resolve(outDir, 'all-concepts.png'), fullPage: true, scale: 'device' });
console.log('✓ all-concepts.png');

// Assign stable IDs to targets
await page.evaluate(() => {
  // Chosen direction
  const chosen = document.querySelectorAll('.chosen-wrap');
  if (chosen[0]) chosen[0].id = 'chosen-hero';
  if (chosen[1]) chosen[1].id = 'chosen-header';

  // Concept 1 — 3D extrusion
  const c1xl = document.querySelectorAll('.wm.xl.c1');
  if (c1xl[0]) c1xl[0].id = 'c1-xl';
  if (c1xl[1]) c1xl[1].id = 'c1-xl-caps';
  const c1md = document.querySelectorAll('.wm.md.c1');
  if (c1md[0]) c1md[0].id = 'c1-md';

  // Concept 2 — neon glow
  const c2xl = document.querySelectorAll('.wm.xl.c2');
  if (c2xl[0]) c2xl[0].id = 'c2-xl';
  if (c2xl[1]) c2xl[1].id = 'c2-xl-caps';

  // Concept 3 — metallic
  const c3xl = document.querySelectorAll('.wm.xl.c3');
  if (c3xl[0]) c3xl[0].id = 'c3-xl';
  if (c3xl[1]) c3xl[1].id = 'c3-xl-caps';

  // Concept 4 — prismatic (horizontal)
  const c4 = document.querySelectorAll('.c4-wrap');
  if (c4[0]) c4[0].id = 'c4-xl';
  if (c4[1]) c4[1].id = 'c4-header';
  if (c4[2]) c4[2].id = 'c4-xl-caps';
  if (c4[3]) c4[3].id = 'c4-header-caps';

  // Concept 5 — stacked 2-line
  const c5 = document.querySelectorAll('.c5-wrap:not(.sm)');
  if (c5[0]) c5[0].id = 'c5-xl';
  if (c5[1]) c5[1].id = 'c5-xl-caps';
});

// ── Chosen direction (live logo with "MY") ──
await shot('#chosen-hero',   'logo-chosen-hero.png',   '#05050a');
await shot('#chosen-header', 'logo-chosen-header.png', '#05050a');

// ── Concept 1 ──
await shot('#c1-xl',      'concept-1-3d-xl.png',      '#111111');
await shot('#c1-xl-caps', 'concept-1-3d-xl-caps.png', '#111111');
await shot('#c1-md',      'concept-1-3d-md.png',      '#111111');

// ── Concept 2 ──
await shot('#c2-xl',      'concept-2-neon-xl.png',      '#040406');
await shot('#c2-xl-caps', 'concept-2-neon-xl-caps.png', '#040406');

// ── Concept 3 ──
await shot('#c3-xl',      'concept-3-metallic-xl.png',      '#0a0a0a');
await shot('#c3-xl-caps', 'concept-3-metallic-xl-caps.png', '#0a0a0a');

// ── Concept 4 ──
await shot('#c4-xl',          'concept-4-prismatic-xl.png',          '#050505');
await shot('#c4-xl-caps',     'concept-4-prismatic-xl-caps.png',     '#050505');
await shot('#c4-header',      'concept-4-prismatic-header.png',      '#050505');
await shot('#c4-header-caps', 'concept-4-prismatic-header-caps.png', '#050505');

// ── Concept 5 ──
await shot('#c5-xl',      'concept-5-stacked-xl.png',      '#07070a');
await shot('#c5-xl-caps', 'concept-5-stacked-xl-caps.png', '#07070a');

// ── Full section cards ──
await page.evaluate(() => {
  document.querySelectorAll('.sect').forEach((s, i) => { s.id = `sect-${i}`; });
});
const sectNames = ['chosen','concept-1-3d','concept-2-neon','concept-3-metallic','concept-4-prismatic','concept-5-stacked'];
for (let i = 0; i < sectNames.length; i++) {
  const el = await page.$(`#sect-${i}`);
  if (el) {
    await el.screenshot({ path: resolve(outDir, `card-${sectNames[i]}.png`), scale: 'device' });
    console.log(`✓ card-${sectNames[i]}.png`);
  }
}

await browser.close();
console.log(`\nAll "my" logos saved to: public/logos-my/`);
