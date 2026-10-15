import { GetServerSidePropsContext } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

import Beach from 'models/Beach';
import Location from 'models/Location';
import Shop from 'models/Shop';

export const SITE_URL = 'https://www.zentacle.com';
const API_URL = 'https://www.zentacle.com/api';

// Google allows 50k URLs per sitemap; smaller files make Search Console's
// per-sitemap indexing report useful.
export const URLS_PER_SITEMAP = 5000;

// Location pages listing fewer spots than this are thin and are noindexed,
// so they are left out of the sitemap.
const MIN_SPOTS_FOR_LOCATION_PAGE = 3;

const LOCATION_LEVELS = ['country', 'area_one', 'area_two', 'locality'];

// Sitemaps are expensive to build (they fetch every spot/shop), so let the
// CDN cache them for a day.
const CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=3600';

export const escapeForXML = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Latest valid date among the inputs, as ISO 8601, or undefined if none.
// A real lastmod lets Google prioritise recrawling pages that changed;
// stamping every URL with "now" (as before) makes Google ignore it.
export const toLastmod = (...dates: (string | null | undefined)[]) => {
  const times = dates
    .filter(Boolean)
    .map((date) => new Date(date as string).getTime())
    .filter((time) => !isNaN(time));
  return times.length ? new Date(Math.max(...times)).toISOString() : undefined;
};

const fetchData = async (path: string) => {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json();
  return data.data;
};

export const fetchSpots = async (): Promise<Beach[]> =>
  (await fetchData('/spots/get?limit=none')).filter(
    (spot: Beach) => spot.url && !spot.is_deleted,
  );

export const fetchShops = async (): Promise<Shop[]> =>
  (await fetchData('/shop/get?limit=none')).filter((shop: Shop) => shop.url);

export const fetchLocations = async (shops: boolean): Promise<Location[]> => {
  const levels = await Promise.all(
    LOCATION_LEVELS.map((level) =>
      fetchData(`/locality/${level}?limit=none${shops ? '&shops=true' : ''}`),
    ),
  );
  return levels
    .flat()
    .filter(
      (location: Location) =>
        location.url &&
        (shops || (location.num_spots ?? 0) >= MIN_SPOTS_FOR_LOCATION_PAGE),
    );
};

export const spotFields = (spots: Beach[]): ISitemapField[] =>
  spots.map((spot) => {
    const field: any = {
      loc: `${SITE_URL}${spot.url}`,
      lastmod: toLastmod(spot.updated, spot.last_review_date),
      changefreq: 'weekly',
      priority: 0.7,
    };
    if (spot.hero_img) {
      field['image:image'] = `
        <image:loc>${escapeForXML(spot.hero_img)}</image:loc>
        <image:title>${escapeForXML(spot.name)}</image:title>
      `;
    }
    return field;
  });

export const shopFields = (shops: Shop[]): ISitemapField[] =>
  shops.map((shop) => ({
    loc: `${SITE_URL}${shop.url}`,
    lastmod: toLastmod(shop.updated),
    changefreq: 'weekly',
    priority: 0.6,
  }));

export const locationFields = (
  locations: Location[],
  suffix = '',
): ISitemapField[] =>
  locations.map((location) => ({
    loc: `${SITE_URL}${location.url}${suffix}`,
    changefreq: 'weekly',
    priority: 0.7,
  }));

export const chunk = <T>(items: T[], page: number) =>
  items.slice((page - 1) * URLS_PER_SITEMAP, page * URLS_PER_SITEMAP);

export const numChunks = (items: unknown[]) =>
  Math.max(1, Math.ceil(items.length / URLS_PER_SITEMAP));

export const sendUrlset = (
  ctx: GetServerSidePropsContext,
  fields: ISitemapField[],
) => {
  ctx.res.setHeader('Cache-Control', CACHE_CONTROL);
  return getServerSideSitemap(ctx, fields);
};

export const sendSitemapIndex = (
  ctx: GetServerSidePropsContext,
  sitemapUrls: string[],
) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `<sitemap><loc>${url}</loc></sitemap>`).join('\n')}
</sitemapindex>`;
  ctx.res.setHeader('Content-Type', 'text/xml');
  ctx.res.setHeader('Cache-Control', CACHE_CONTROL);
  ctx.res.write(xml);
  ctx.res.end();
  return { props: {} };
};
