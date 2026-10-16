// The location pages to render, and their ranked spots, fetched exactly the
// way the pages fetch them (src/pages/loc/...), so numbering matches.
import { API_URL } from './config';

export type Level = 'country' | 'area_one' | 'area_two' | 'locality';
export const LEVELS: Level[] = ['country', 'area_one', 'area_two', 'locality'];

export interface LocationPage {
  level: Level;
  url: string; // e.g. /loc/us/hi/maui/wailea-makena
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

export const listLocationPages = async (): Promise<LocationPage[]> => {
  const pages: LocationPage[] = [];
  for (const level of LEVELS) {
    const body = await getJson(`${API_URL}/locality/${level}?limit=none`);
    for (const row of body?.data || []) {
      if (row.url && row.url.startsWith('/loc/') && !row.url.includes('/_/') && !row.url.includes('None')) {
        pages.push({ level, url: row.url });
      }
    }
  }
  return pages;
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

// S3 key the old static location maps used: loc-map/<level>/<segments>.png
export const imageKeyFor = ({ level, url }: LocationPage) =>
  `${level}/${url.replace(/^\/loc\//, '').split('/').join('_')}`;
