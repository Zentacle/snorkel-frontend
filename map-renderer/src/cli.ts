// Renders annotated maps for location pages whose top spots changed since the
// last run, and stores them with their pin positions.
//
//   npm run render -- [--apply] [--force] [--limit N] [--only /loc/us/hi/maui/wailea-makena]
//
// Without --apply nothing is uploaded: images go to ./out for review.
import path from 'path';

import { BasemapRenderer, latestBuildUrl } from './basemap';
import { composeImage, imageTitle } from './compose';
import { INDEX_KEY, PUBLIC_IMAGE_BASE, RENDER_VERSION, S3_PREFIX, STATE_KEY } from './config';
import { fetchRankedSpots, imageKeyFor, LEVELS, listLocationPages, LocationPage } from './locations';
import { MapPlan, planMap } from './plan';
import { LocalStorage, S3Storage, Storage } from './storage';

interface Args {
  apply: boolean;
  force: boolean;
  limit?: number;
  only: string[];
  concurrency: number;
}

const parseArgs = (argv: string[]): Args => {
  const args: Args = { apply: false, force: false, only: [], concurrency: 4 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--limit') args.limit = Number(argv[++i]);
    else if (arg === '--only') args.only.push(argv[++i]);
    else if (arg === '--concurrency') args.concurrency = Number(argv[++i]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
};

interface RenderState {
  version: number;
  entries: Record<string, { hash: string; renderedAt: string }>;
}
export interface IndexEntry {
  image: string;
  meta: string;
  width: number;
  height: number;
  title: string;
}

// Map metadata the page reads to line up clickable pins with the image.
export interface MapMeta {
  version: number;
  renderedAt: string;
  pageUrl: string;
  title: string;
  image: { url: string; width: number; height: number };
  // the map area inside the image, in image pixels (title band above, key below)
  map: { top: number; height: number };
  pins: { number: number; spotId: number | string; url: string; left: number; top: number }[];
}

const pageFromUrl = (url: string): LocationPage => {
  const depth = url.replace(/^\/loc\//, '').split('/').length;
  return { level: LEVELS[depth - 1], url };
};

const mapLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) => {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const storage: Storage = args.apply ? new S3Storage() : new LocalStorage(path.join(__dirname, '..', 'out'));
  console.log(`Writing to ${storage.describe()}${args.apply ? '' : ' (dry run; pass --apply to upload)'}`);

  const state = (await storage.readJson<RenderState>(STATE_KEY)) || { version: RENDER_VERSION, entries: {} };
  const index = (await storage.readJson<Record<string, IndexEntry>>(INDEX_KEY)) || {};

  const allPages = await listLocationPages();
  // --only pages still use their listed entry, for the old image key
  const pages = args.only.length
    ? args.only.map((url) => allPages.find((page) => page.url === url) || pageFromUrl(url))
    : allPages;
  console.log(`${pages.length} location pages`);

  // Plan every page (cheap API calls), then render only what changed.
  let noMap = 0;
  const planned = await mapLimit(pages, args.concurrency, async (page) => {
    try {
      const result = await fetchRankedSpots(page);
      const plan = result && planMap(result.areaName, result.spots);
      if (!plan) noMap++;
      return plan ? { page, plan } : null;
    } catch (error) {
      console.error(`plan failed ${page.url}: ${(error as Error).message}`);
      return null;
    }
  });
  let changed = planned.filter(
    (p): p is { page: LocationPage; plan: MapPlan } =>
      !!p && (args.force || state.entries[p.page.url]?.hash !== p.plan.hash),
  );
  console.log(`${changed.length} to render, ${noMap} with no mappable spots`);
  if (args.limit) changed = changed.slice(0, args.limit);
  if (!changed.length) return;

  const buildUrl = await latestBuildUrl();
  console.log(`Base map: ${buildUrl}`);
  const renderer = new BasemapRenderer(buildUrl, path.join(__dirname, '..', '.cache'));

  const save = async () => {
    await storage.writeJson(STATE_KEY, { ...state, version: RENDER_VERSION });
    await storage.writeJson(INDEX_KEY, index);
  };

  let done = 0;
  const failures: string[] = [];
  for (const { page, plan } of changed) {
    try {
      const basemap = await renderer.render(plan.view);
      const image = composeImage(plan, basemap);
      const key = `${S3_PREFIX}${imageKeyFor(page)}`;
      const renderedAt = new Date().toISOString();
      const meta: MapMeta = {
        version: RENDER_VERSION,
        renderedAt,
        pageUrl: page.url,
        title: imageTitle(plan.areaName),
        image: { url: `${PUBLIC_IMAGE_BASE}${key}.png`, width: image.width, height: image.height },
        map: { top: image.mapTop, height: image.mapHeight },
        pins: plan.pins.map(({ number, spotId, url, left, top }) => ({ number, spotId, url, left, top })),
      };
      await storage.writeImage(`${key}.png`, image.png);
      await storage.writeJson(`${key}.json`, meta);
      index[page.url] = {
        image: meta.image.url,
        meta: `${PUBLIC_IMAGE_BASE}${key}.json`,
        width: image.width,
        height: image.height,
        title: meta.title,
      };
      state.entries[page.url] = { hash: plan.hash, renderedAt };
      done++;
      if (done % 25 === 0) {
        await save();
        console.log(`${done}/${changed.length} rendered`);
      }
    } catch (error) {
      failures.push(page.url);
      console.error(`render failed ${page.url}: ${(error as Error).message}`);
    }
  }
  renderer.release();
  await save();
  console.log(`Rendered ${done}, failed ${failures.length}`);
  if (failures.length) process.exitCode = 1;
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
