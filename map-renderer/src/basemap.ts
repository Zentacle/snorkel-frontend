// Renders the base map (no pins) for a view with MapLibre Native, reading
// OpenStreetMap vector tiles straight from a Protomaps daily build.
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mbgl = require('@maplibre/maplibre-gl-native');
import { PMTiles } from 'pmtiles';
import { layers, namedFlavor } from '@protomaps/basemaps';
import { PNG } from 'pngjs';

import { MapView } from '../../src/lib/mapProjection';
import {
  BASEMAP_MAX_ZOOM,
  MAP_HEIGHT,
  MAP_WIDTH,
  PROTOMAPS_ASSETS,
  PROTOMAPS_BUILDS_URL,
  PROTOMAPS_BUILD_BASE,
  SCALE,
} from './config';
import { getJson } from './locations';

export const latestBuildUrl = async () => {
  const builds: { key: string }[] = await getJson(PROTOMAPS_BUILDS_URL);
  const latest = builds.map((b) => b.key).filter((k) => /^\d{8}\.pmtiles$/.test(k)).sort().pop();
  if (!latest) throw new Error('No Protomaps build found');
  return `${PROTOMAPS_BUILD_BASE}${latest}`;
};

// Fonts and sprites are small and shared by every render: cache them on disk.
const fetchAsset = async (url: string, cacheDir: string) => {
  const file = path.join(cacheDir, url.replace(PROTOMAPS_ASSETS, '').replace(/[^\w.-]+/g, '_'));
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(file, data);
  return data;
};

export class BasemapRenderer {
  private map: any;
  private archive: PMTiles;

  constructor(buildUrl: string, cacheDir: string) {
    this.archive = new PMTiles(buildUrl);
    const archive = this.archive;
    this.map = new mbgl.Map({
      ratio: SCALE,
      request: async (req: { url: string }, callback: (err: Error | null, res?: { data?: Buffer }) => void) => {
        try {
          const tile = req.url.match(/^pmtiles:\/\/basemap\/(\d+)\/(\d+)\/(\d+)$/);
          if (tile) {
            const [z, x, y] = tile.slice(1).map(Number);
            const result = await archive.getZxy(z, x, y);
            if (!result) return callback(null, {}); // no tile here (e.g. open ocean)
            let data = Buffer.from(result.data);
            if (data[0] === 0x1f && data[1] === 0x8b) data = zlib.gunzipSync(data);
            return callback(null, { data });
          }
          const data = await fetchAsset(req.url, cacheDir);
          return callback(null, data ? { data } : {});
        } catch (error) {
          return callback(error as Error);
        }
      },
    });
    this.map.load({
      version: 8,
      glyphs: `${PROTOMAPS_ASSETS}/fonts/{fontstack}/{range}.pbf`,
      sprite: `${PROTOMAPS_ASSETS}/sprites/v4/light`,
      sources: {
        protomaps: {
          type: 'vector',
          tiles: ['pmtiles://basemap/{z}/{x}/{y}'],
          maxzoom: BASEMAP_MAX_ZOOM,
        },
      },
      layers: layers('protomaps', namedFlavor('light'), { lang: 'en' }),
    });
  }

  // PNG of the view at MAP_WIDTH x MAP_HEIGHT logical pixels (x SCALE).
  render(view: MapView): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.map.render(
        {
          // the page's zoom is on Google's 256px tiles; MapLibre's world is 512px
          zoom: view.zoom - 1,
          center: [view.center.longitude, view.center.latitude],
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
        },
        (error: Error | null, pixels: Uint8Array) => {
          if (error) return reject(error);
          const png = new PNG({ width: MAP_WIDTH * SCALE, height: MAP_HEIGHT * SCALE });
          png.data = Buffer.from(pixels);
          resolve(PNG.sync.write(png));
        },
      );
    });
  }

  release() {
    this.map.release();
  }
}
