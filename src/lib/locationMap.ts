// Annotated location map images rendered by map-renderer/ and stored in S3
// (served publicly at https://www.zentacle.com/image/loc-map/...).

// read directly from S3 on the server (the site's /image/* rewrite points
// here); LOCATION_MAP_BASE can point at a local map-renderer/out for testing
const STORAGE_BASE = process.env.LOCATION_MAP_BASE || 'https://snorkel.s3.amazonaws.com/loc-map/';

export interface LocationMapPin {
  number: number;
  spotId: number | string;
  url: string;
  // centre of the pin in the image's map area, in percent
  left: number;
  top: number;
}

export interface LocationMap {
  version: number;
  renderedAt: string;
  pageUrl: string;
  title: string;
  image: { url: string; width: number; height: number };
  // the map area inside the image, in image pixels (title band above, key below)
  map: { top: number; height: number };
  pins: LocationMapPin[];
}

// The old static map's key (from the location's map_image_url), kept so
// Google Images keeps the same image URL; null for the broken ones with an
// empty name ("th_") that several pages shared.
const legacyKey = (mapImageUrl?: string | null) => {
  const match = mapImageUrl?.match(/\/loc-map\/((?:country|area_one|area_two|locality)\/[^/]+)\.png$/);
  if (!match || match[1].split('/')[1].split('_').includes('')) {
    return null;
  }
  return match[1];
};

// Same naming as map-renderer/src/locations.ts imageKeyFor: the old map's
// key, else loc-map/<level>/<url segments joined by "_">
export const locationMapKey = (level: string, url: string, mapImageUrl?: string | null) =>
  legacyKey(mapImageUrl) || `${level}/${url.replace(/^\/loc\//, '').split('/').join('_')}`;

// The stored map for a location page, or null if it hasn't been rendered.
export const fetchLocationMap = async (
  level: string,
  area: { url?: string; map_image_url?: string | null } | undefined,
): Promise<LocationMap | null> => {
  const url = area?.url;
  if (!url) {
    return null;
  }
  try {
    const res = await fetch(`${STORAGE_BASE}${locationMapKey(level, url, area?.map_image_url)}.json`);
    if (!res.ok) {
      return null;
    }
    const map = (await res.json()) as LocationMap;
    return map.pageUrl === url && map.pins?.length ? map : null;
  } catch {
    return null;
  }
};

// All rendered maps by page URL, for the image sitemap.
export interface LocationMapIndexEntry {
  image: string;
  title: string;
}
export const fetchLocationMapIndex = async (): Promise<Record<string, LocationMapIndexEntry>> => {
  try {
    const res = await fetch(`${STORAGE_BASE}_index.json`);
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
};
