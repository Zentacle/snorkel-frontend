// Extra data for the location pages (src/pages/loc/...): the area's top dive
// shops, its sibling areas and, once the backend serves it, /locality/stats.
// Every fetch is optional: a failure leaves that section out of the page.
import { rootDomain } from 'lib/constants';
import Location from 'models/Location';
import Shop from 'models/Shop';

export type LocationLevel = 'country' | 'area_one' | 'area_two' | 'locality';

export interface LocationParams {
  country?: string;
  area_one?: string;
  area_two?: string;
  locality?: string;
}

// GET /locality/stats (snorkel-backend). Fields are null below 3 data points.
export interface LocationStats {
  num_spots?: number | null;
  num_shops?: number | null;
  num_reviews?: number | null;
}

export interface LocationExtras {
  // total dive sites in the area, or null when unknown
  numSpots: number | null;
  // the area's top dive shops, best first
  shops: Shop[];
  // total dive shops in the area, or null when unknown
  numShops: number | null;
  stats: LocationStats | null;
  // other areas at the same level under the same parent (not for countries)
  siblings: Location[];
}

const SHOPS_SHOWN = 4;
const SIBLINGS_SHOWN = 12;
// country pages list at most this many shops (same as the country shop page)
const COUNTRY_SHOP_LIMIT = 100;

// rating pulled toward PRIOR_RATING as if it had PRIOR_REVIEWS more reviews
const PRIOR_RATING = 4;
const PRIOR_REVIEWS = 10;
const shopScore = (shop: Shop) => {
  const rating = parseFloat(`${shop.rating}`) || 0;
  const reviews = Number(shop.num_reviews) || 0;
  return reviews ? (rating * reviews + PRIOR_RATING * PRIOR_REVIEWS) / (reviews + PRIOR_REVIEWS) : 0;
};

const getJson = async (url: string) => {
  try {
    const res = await fetch(url);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const query = (params: LocationParams) =>
  (['country', 'area_one', 'area_two', 'locality'] as const)
    .filter((key) => params[key])
    .map((key) => `${key}=${params[key]}`)
    .join('&');

export const fetchLocationExtras = async (
  level: LocationLevel,
  params: LocationParams,
  area: Location,
): Promise<LocationExtras> => {
  const limit = level === 'country' ? COUNTRY_SHOP_LIMIT : 'none';
  const siblingsUrl =
    level === 'area_one'
      ? `${rootDomain}/locality/area_one?country=${params.country}`
      : level === 'area_two'
      ? `${rootDomain}/locality/area_two?country=${params.country}&area_one=${params.area_one}`
      : null;

  const [shopData, stats, siblingData, countryData] = await Promise.all([
    getJson(`${rootDomain}/shop/loc?sort=top&${query(params)}&limit=${limit}`),
    getJson(`${rootDomain}/locality/stats?${query(params)}`),
    siblingsUrl ? getJson(siblingsUrl) : null,
    // country pages only load their top spots; the country list has the total
    level === 'country' ? getJson(`${rootDomain}/locality/country?limit=none`) : null,
  ]);
  const countryRow = ((countryData && countryData.data) || []).find(
    (loc: Location) => loc.id === area.id,
  );

  const allShops: Shop[] = (shopData && shopData.data) || [];
  // best first, trusting ratings with more reviews (a 5.0 from 3 reviews
  // shouldn't outrank a 4.9 from 800)
  const bestShops = [...allShops].sort((a, b) => shopScore(b) - shopScore(a));
  const capped = level === 'country' && allShops.length >= COUNTRY_SHOP_LIMIT;
  const siblings: Location[] = ((siblingData && siblingData.data) || [])
    .filter((loc: Location) => loc.url && loc.id !== area.id && (loc.num_spots || 0) > 0)
    .sort((a: Location, b: Location) => (b.num_spots || 0) - (a.num_spots || 0))
    .slice(0, SIBLINGS_SHOWN);

  return {
    numSpots: stats?.num_spots ?? countryRow?.num_spots ?? null,
    shops: bestShops.slice(0, SHOPS_SHOWN),
    numShops: stats?.num_shops ?? (capped ? null : allShops.length),
    stats: stats || null,
    siblings,
  };
};

// Where a shop's "Book" button goes: its booking page, else its website,
// else its Zentacle page.
export const shopBookingUrl = (shop: Shop) => {
  if (shop.fareharbor_url) {
    return { url: shop.fareharbor_url, destination: 'fareharbor', external: true };
  }
  if (shop.website) {
    const url = /^https?:\/\//.test(shop.website) ? shop.website : `https://${shop.website}`;
    return { url, destination: 'website', external: true };
  }
  return { url: shop.url, destination: 'shop_page', external: false };
};

// "the United States", "the Philippines", "Maui": for use mid-sentence
const NEEDS_THE = /^(United |Dominican Republic|Czech Republic|Philippines|Bahamas|Maldives|Netherlands|Seychelles|Comoros|Gambia)|Islands$/;
export const placeName = (name: string) =>
  NEEDS_THE.test(name) && !/^The /.test(name) ? `the ${name}` : name;

// Plain text of an HTML description (spot and area descriptions hold links).
export const plainText = (html: string | null | undefined) =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();
