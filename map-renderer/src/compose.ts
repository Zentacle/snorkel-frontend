// Composes the final annotated image: title band with the Zentacle logo, the
// base map with numbered pins and the OpenStreetMap credit, and a key listing
// every site with its star rating and review count.
import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

import { MAP_HEIGHT, MAP_WIDTH, SCALE } from './config';
import { MapPlan } from './plan';

const ASSETS = path.join(__dirname, '..', 'assets');
const FONT_FILES = [
  path.join(ASSETS, 'fonts', 'NotoSans-Regular.ttf'),
  path.join(ASSETS, 'fonts', 'NotoSans-Bold.ttf'),
];
const LOGO = fs.readFileSync(path.join(ASSETS, 'logo-256.png')).toString('base64');

const W = MAP_WIDTH * SCALE; // 1280
export const TITLE_H = 120;
export const MAP_H = MAP_HEIGHT * SCALE; // 640
const COLUMNS = 3;
const ROW_H = 74; // two lines per site: name, then stars + reviews
const KEY_TOP = 66;
const BLUE = '#0087D3';
const NAVY = '#03045e';
const GOLD = '#f5a623';
const GREY_STAR = '#d9d9d9';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trim = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const pin = (x: number, y: number, n: number, r = 22) => `
  <g>
    <circle cx="${x}" cy="${y + 3}" r="${r}" fill="rgba(0,0,0,0.25)"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${BLUE}" stroke="white" stroke-width="4"/>
    <text x="${x}" y="${y + r * 0.36}" text-anchor="middle" font-size="${Math.round(r * (n > 9 ? 0.9 : 1.05))}" font-weight="700" fill="white">${n}</text>
  </g>`;

// 5-point star of radius r centred at (cx, cy)
const starPath = (cx: number, cy: number, r: number) => {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${points.join('L')}Z`;
};

// five stars filled to the exact rating (4.3 -> four and a third)
const stars = (x: number, y: number, rating: number, ids: { next: number }, size = 11) =>
  [0, 1, 2, 3, 4]
    .map((i) => {
      const cx = x + size + i * size * 2.2;
      const fill = Math.max(0, Math.min(1, rating - i));
      const d = starPath(cx, y, size);
      const id = `s${ids.next++}`;
      const filled =
        fill > 0
          ? `<clipPath id="${id}"><rect x="${cx - size}" y="${y - size}" width="${2 * size * fill}" height="${2 * size}"/></clipPath>
             <path d="${d}" fill="${GOLD}" clip-path="url(#${id})"/>`
          : '';
      return `<path d="${d}" fill="${GREY_STAR}"/>${filled}`;
    })
    .join('');

export const imageTitle = (areaName: string) => `Snorkeling & Scuba Map of ${areaName}`;

export const composeImage = (plan: MapPlan, basemapPng: Buffer) => {
  const rows = Math.ceil(plan.pins.length / COLUMNS);
  const keyH = KEY_TOP + rows * ROW_H + 8;
  const H = TITLE_H + MAP_H + keyH;
  const ids = { next: 0 };

  const pins = plan.pins
    .map((p) => pin((p.left / 100) * W, TITLE_H + (p.top / 100) * MAP_H, p.number))
    .join('');

  const colW = (W - 64) / COLUMNS;
  const key = plan.pins
    .map((p, i) => {
      const x = 32 + Math.floor(i / rows) * colW;
      const y = TITLE_H + MAP_H + KEY_TOP + (i % rows) * ROW_H;
      const detail =
        p.reviews > 0 && p.rating > 0
          ? `${stars(x + 46, y + 32, p.rating, ids)}
             <text x="${x + 168}" y="${y + 39}" font-size="20" fill="#555"><tspan font-weight="700" fill="#333">${p.rating.toFixed(1)}</tspan> · ${p.reviews} ${p.reviews === 1 ? 'review' : 'reviews'}</text>`
          : `<text x="${x + 46}" y="${y + 39}" font-size="20" fill="#777">No reviews yet</text>`;
      return `${pin(x + 18, y + 8, p.number, 17)}
        <text x="${x + 46}" y="${y + 16}" font-size="25" fill="#222">${esc(trim(p.name, 28))}</text>
        ${detail}`;
    })
    .join('');

  const subtitle = `${plan.pins.length} top dive and snorkel ${plan.pins.length === 1 ? 'site' : 'sites'} · numbered by rating`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>text { font-family: 'Noto Sans'; }</style>
  <rect width="${W}" height="${H}" fill="white"/>
  <rect width="${W}" height="${TITLE_H}" fill="${NAVY}"/>
  <text x="32" y="60" font-size="38" font-weight="700" fill="white">${esc(trim(imageTitle(plan.areaName), 44))}</text>
  <text x="32" y="98" font-size="24" fill="#caf0f8">${subtitle}</text>
  <image href="data:image/png;base64,${LOGO}" x="${W - 32 - 200 - 84}" y="18" width="84" height="84"/>
  <text x="${W - 32}" y="72" font-size="30" font-weight="700" fill="white" text-anchor="end">zentacle.com</text>
  <image href="data:image/png;base64,${basemapPng.toString('base64')}" x="0" y="${TITLE_H}" width="${W}" height="${MAP_H}"/>
  ${pins}
  <rect x="${W - 300}" y="${TITLE_H + MAP_H - 34}" width="300" height="34" fill="rgba(255,255,255,0.85)"/>
  <text x="${W - 12}" y="${TITLE_H + MAP_H - 11}" font-size="18" fill="#333" text-anchor="end">© OpenStreetMap contributors</text>
  <text x="32" y="${TITLE_H + MAP_H + 38}" font-size="22" font-weight="700" fill="${NAVY}" letter-spacing="2">KEY</text>
  ${key}
</svg>`;

  const png = new Resvg(svg, {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Noto Sans' },
    fitTo: { mode: 'width', value: W },
  })
    .render()
    .asPng();
  return { png: Buffer.from(png), width: W, height: H, mapTop: TITLE_H, mapHeight: MAP_H };
};
