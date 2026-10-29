// QA crawl of the E-tum menu in headless Chrome via the DevTools protocol.
// Usage: node qa-crawl.mjs <baseUrl> <outDir> [--quick]
//   baseUrl: http://127.0.0.1:5173 or https://thorng-vanthiev.github.io/etum_menu_digital
//   --quick: phone + desktop, Khmer only (faster)
// Reads routes (item slugs, category ids) from the repo's src/data JSON.
// Prints every issue found and saves screenshots of key pages to <outDir>/qa/.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , baseUrlArg, outDir, ...flags] = process.argv;
if (!baseUrlArg || !outDir) {
  console.error('Usage: node qa-crawl.mjs <baseUrl> <outDir> [--quick]');
  process.exit(2);
}
const baseUrl = baseUrlArg.replace(/\/$/, '');
const quick = flags.includes('--quick');
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
const itemsJson = JSON.parse(readFileSync(join(repoRoot, 'src/data/menu-items.json'), 'utf8'));
const items = Array.isArray(itemsJson) ? itemsJson : itemsJson.items;
const slugs = items.map((i) => i.slug);
const variantSlug = items.find((i) => i.variants?.length > 1)?.slug;
const cats = JSON.parse(readFileSync(join(repoRoot, 'src/data/categories.json'), 'utf8')).map((c) => c.id);
const LOCALE_KEY = 'restaurant_menu_locale';
mkdirSync(join(outDir, 'qa'), { recursive: true });

const port = 9300 + Math.floor(Math.random() * 90);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-first-run', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'etum-qa-'))}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 60 && !targets; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); }
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
const events = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method) events.push(m);
});
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const ev = async (expression) => {
  const res = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression });
  if (res.result?.exceptionDetails) return { evalError: res.result.exceptionDetails.text };
  return res.result?.result?.value;
};
const open = async (route) => { await send('Page.navigate', { url: `${baseUrl}/?qa=${Date.now()}${route}` }); await sleep(1800); };

await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Log.enable');

const issues = [];
const note = (ctx, msg) => issues.push({ ctx, msg });

const pageCheck = `(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 900));
  const imgs = [...document.querySelectorAll('main img')];
  const offscreen = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[role=tablist]') || el.closest('[aria-hidden=true]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width && (r.right > innerWidth + 1 || r.left < -1)) offscreen.push(el.tagName + '.' + String(el.className).split(' ').slice(0, 3).join('.'));
  }
  return {
    hOverflow: document.documentElement.scrollWidth - innerWidth,
    broken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
    fallback: imgs.filter(i => (i.currentSrc || i.src).includes('espresso.svg')).length,
    invisible: imgs.filter(i => !i.closest('[aria-hidden=true]') && getComputedStyle(i).opacity !== '1').length,
    noAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
    offscreen: offscreen.slice(0, 5),
    unnamed: [...document.querySelectorAll('button, a[href]')].filter(el => !(el.getAttribute('aria-label') || el.textContent.trim() || el.getAttribute('title'))).length,
    h1: document.querySelectorAll('h1').length,
  };
})()`;

const viewports = [
  { name: 'phone', width: 390, height: 844, mobile: true },
  ...(quick ? [] : [{ name: 'tablet', width: 768, height: 1024, mobile: true }]),
  { name: 'desktop', width: 1280, height: 900, mobile: false },
];
const locales = quick ? ['km'] : ['km', 'en'];
const routes = ['#/', '#/menu', ...cats.map((c) => `#/menu?category=${c}`), ...slugs.map((s) => `#/menu/${s}`), '#/menu/does-not-exist', '#/nope'];
const shotRoutes = new Set(['#/', '#/menu', variantSlug && `#/menu/${variantSlug}`, '#/nope']);

let views = 0;
for (const vp of viewports) {
  await send('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.mobile });
  for (const locale of locales) {
    await open('#/');
    await ev(`localStorage.setItem('${LOCALE_KEY}', '${locale}')`);
    for (const route of routes) {
      events.length = 0;
      const ctx = `[${vp.name} ${locale}] ${route}`;
      await open(route);
      const r = await ev(pageCheck);
      views++;
      if (!r || r.evalError) { note(ctx, 'page check failed: ' + (r?.evalError ?? 'no result')); continue; }
      if (r.hOverflow > 0) note(ctx, `horizontal overflow ${r.hOverflow}px`);
      if (r.broken.length) note(ctx, `broken images: ${r.broken.join(', ')}`);
      if (r.fallback) note(ctx, `${r.fallback} image(s) showing the fallback placeholder`);
      if (r.invisible) note(ctx, `${r.invisible} image(s) not fully visible`);
      if (r.noAlt) note(ctx, `${r.noAlt} image(s) without alt`);
      if (r.offscreen.length) note(ctx, `off-screen elements: ${r.offscreen.join(' ; ')}`);
      if (r.unnamed) note(ctx, `${r.unnamed} unnamed button/link(s)`);
      if (r.h1 !== 1) note(ctx, `${r.h1} <h1> elements`);
      for (const m of events) {
        if (m.method === 'Runtime.exceptionThrown') note(ctx, 'JS exception: ' + m.params.exceptionDetails.exception?.description?.split('\n')[0]);
        if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) note(ctx, `console.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 160));
        if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) note(ctx, `log ${m.params.entry.level}: ${m.params.entry.text.slice(0, 160)}`);
        if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) note(ctx, `HTTP ${m.params.response.status} ${m.params.response.url}`);
        if (m.method === 'Network.loadingFailed' && !m.params.canceled) note(ctx, `request failed: ${m.params.errorText}`);
      }
      if (shotRoutes.has(route) && (locale === 'km' || vp.name === 'desktop')) {
        const height = Math.min(await ev('document.body.scrollHeight'), 2600);
        const { result } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true, clip: { x: 0, y: 0, width: vp.width, height, scale: vp.name === 'desktop' ? 0.5 : 0.7 } });
        writeFileSync(join(outDir, 'qa', `${vp.name}-${locale}-${route.replace(/[#/?=]/g, '_')}.jpg`), Buffer.from(result.data, 'base64'));
      }
    }
  }
}

// Interactions on a phone in Khmer: search, empty state, reset, category tabs, variant price.
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await open('#/');
await ev(`localStorage.setItem('${LOCALE_KEY}', 'km')`);
await open('#/menu');
const cardCount = () => ev(`document.querySelectorAll('main a[href*="#/menu/"]').length`);
const setSearch = (v) => ev(`(() => { const i = document.querySelector('main input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, ${JSON.stringify(v)}); i.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
const all = await cardCount();
await setSearch('zzzz'); await sleep(500);
const emptyState = await ev(`document.querySelector('main').innerText.includes('រកមិនឃើញមុខម្ហូបទេ')`);
await ev(`(() => { [...document.querySelectorAll('main button')].find(b => b.textContent.includes('កំណត់ការស្វែងរកឡើងវិញ'))?.click(); return true; })()`); await sleep(500);
const afterReset = await cardCount();
console.log(`search: all=${all}, "zzzz" shows empty state=${emptyState}, after reset=${afterReset}`);
if (!emptyState) note('[search]', 'no empty state for a query with no results');
if (afterReset !== all) note('[search]', `reset shows ${afterReset} of ${all}`);
const tabs = await ev(`(async () => { const res = []; for (const t of [...document.querySelectorAll('[role=tab]')]) { t.click(); await new Promise(r => setTimeout(r, 450)); res.push(t.textContent.trim().slice(0, 14) + '=' + document.querySelectorAll('main a[href*="#/menu/"]').length + (t.getAttribute('aria-selected') === 'true' ? '' : ' (not selected!)')); } return res; })()`);
console.log('category tabs:', tabs.join(', '));
if (tabs.some((t) => t.includes('not selected') || t.endsWith('=0'))) note('[tabs]', tabs.join(', '));
if (variantSlug) {
  await open(`#/menu/${variantSlug}`);
  const v = await ev(`(async () => { const price = () => document.querySelector('[data-testid=total-price]')?.innerText ?? ''; const radios = [...document.querySelectorAll('main [role=radio]')]; const before = price(); radios[radios.length - 1]?.click(); await new Promise(r => setTimeout(r, 300)); return { options: radios.length, before, after: price() }; })()`);
  console.log(`variant ${variantSlug}:`, JSON.stringify(v));
  if (!v || v.options < 2 || v.before === v.after) note('[variant]', 'price did not change when choosing another size');
}

console.log(`\nChecked ${views} page views. Issues found: ${issues.length}`);
const grouped = new Map();
for (const { ctx, msg } of issues) grouped.set(msg, [...(grouped.get(msg) ?? []), ctx]);
for (const [msg, where] of grouped) console.log(`- ${msg}\n    on ${where.length} page(s), e.g. ${where.slice(0, 3).join(' | ')}`);
console.log(`Screenshots: ${join(outDir, 'qa')}`);
ws.close();
chrome.kill();
process.exit(issues.length ? 1 : 0);
