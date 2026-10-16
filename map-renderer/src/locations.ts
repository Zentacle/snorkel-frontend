// The location pages to render, and their ranked spots, fetched exactly the
// way the pages fetch them (src/pages/loc/...), so numbering matches.
import { API_URL } from './config';

export type Level = 'country' | 'area_one' | 'area_two' | 'locality';
export const LEVELS: Level[] = ['country', 'area_one', 'area_two', 'locality'];

export interface LocationPage {
  level: Level;
  url: string; // e.g. /loc/us/hi/maui/wailea-makena
  // where the old static map was stored (the API's map_image_url)
  mapImageUrl?: string | null;
}

export interface ApiSpot {
  id: number | string;
  name: string;
  url: string;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number | string | null;
  num_reviews?: number | null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getJson = async (url: string, attempts = 4): Promise<any> => {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'zentacle-map-renderer' } });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      if (attempt >= attempts) throw new Error(`${url}: ${(error as Error).message}`);
      await sleep(1000 * 2 ** attempt);
    }
  }
};

const segmentsOf = (url: string) => url.replace(/^\/loc\//, '').split('/');

export const listLocationPages = async (): Promise<LocationPage[]> => {
  const pages: LocationPage[] = [];
  for (const level of LEVELS) {
    const body = await getJson(`${API_URL}/locality/${level}?limit=none`);
    for (const row of body?.data || []) {
      if (
        row.url &&
        row.url.startsWith('/loc/') &&
        !row.url.includes('/_/') &&
        !row.url.includes('None') &&
        // "/loc/th/trat/" and "/loc/th/trat//koh-chang-tai" are missing a level
        !segmentsOf(row.url).includes('')
      ) {
        pages.push({ level, url: row.url, mapImageUrl: row.map_image_url });
      }
    }
  }
  // two pages must never write the same image
  const claims = new Map<string, number>();
  pages.forEach((page) => {
    const key = legacyKey(page.mapImageUrl);
    if (key) claims.set(key, (claims.get(key) || 0) + 1);
  });
  return pages.map((page) => {
    const key = legacyKey(page.mapImageUrl);
    return key && claims.get(key)! > 1 ? { ...page, mapImageUrl: null } : page;
  });
};

// Same query as the page's getStaticProps for that level.
export const spotsQueryUrl = ({ level, url }: LocationPage) => {
  const [country, area_one, area_two, locality] = url.replace(/^\/loc\//, '').split('/');
  const params: string[] = ['sort=top', `country=${country}`];
  if (area_one) params.push(`area_one=${area_one}`);
  if (area_two) params.push(`area_two=${area_two}`);
  if (locality) params.push(`locality=${locality}`);
  params.push(level === 'country' ? 'limit=100' : 'limit=none');
  return `${API_URL}/spots/get?${params.join('&')}`;
};

export const fetchRankedSpots = async (page: LocationPage) => {
  const body = await getJson(spotsQueryUrl(page));
  if (!body?.data) return null;
  return { areaName: (body.area?.name as string) || page.url, spots: body.data as ApiSpot[] };
};

// The old static map's key (from map_image_url, e.g. ".../loc-map/area_one/
// cw_curacao.png" -> "area_one/cw_curacao"), so Google Images keeps the same
// image URL. Null for the broken ones with an empty name ("th_", "th__"),
// which several pages shared. Keep in sync with src/lib/locationMap.ts.
export const legacyKey = (mapImageUrl?: string | null) => {
  const match = mapImageUrl?.match(/\/loc-map\/((?:country|area_one|area_two|locality)\/[^/]+)\.png$/);
  if (!match || match[1].split('/')[1].split('_').includes('')) return null;
  return match[1];
};

// S3 key (without extension) for a page's map: the old map's key when it has
// one, otherwise loc-map/<level>/<url segments joined by "_"> (which is what
// almost every old map used anyway).
export const imageKeyFor = ({ level, url, mapImageUrl }: LocationPage) =>
  legacyKey(mapImageUrl) || `${level}/${segmentsOf(url).join('_')}`;
