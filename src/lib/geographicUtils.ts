import { rootDomain } from './constants';

export interface GeographicNode {
  id: number;
  name: string;
  short_name: string;
  url: string;
  admin_level: number;
  parent?: GeographicNode;
  num_spots?: number;
  num_shops?: number;
  description?: string;
  hero_img?: string;
}

export interface GeographicResponse {
  area: GeographicNode;
  spots?: any[];
  shops?: any[];
  total_spots?: number;
  total_shops?: number;
}

export interface Breadcrumb {
  name: string;
  url: string;
  level: number;
}

/**
 * Resolves a geographic path to fetch area data
 */
export async function resolveGeographicPath(pathSegments: string[]): Promise<GeographicResponse | null> {
  const path = pathSegments.join('/');

  try {
    const response = await fetch(`${rootDomain}/loc/${path}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error resolving geographic path:', error);
    return null;
  }
}

/**
 * Checks if a path segment might be a spot URL and resolves it
 */
export async function resolveSpotFromPath(pathSegments: string[]): Promise<{ spotId: string; geographicPath: string[] } | null> {
  const lastSegment = pathSegments[pathSegments.length - 1];
  const spotMatch = lastSegment.match(/^(.+)-(\d+)$/);

  if (spotMatch) {
    const [, spotName, spotId] = spotMatch;
    const geographicPath = pathSegments.slice(0, -1);

    // Verify this is actually a spot by trying to fetch it
    const path = geographicPath.join('/');
    const response = await fetch(`${rootDomain}/loc/${path}/${spotId}`);

    if (response.ok) {
      return {
        spotId,
        geographicPath
      };
    }
  }

  return null;
}

/**
 * Generates breadcrumbs from geographic path segments
 */
export function generateBreadcrumbs(pathSegments: string[]): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [];
  let currentPath = '';

  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    breadcrumbs.push({
      name: pathSegments[i], // In a real implementation, you'd fetch actual names
      url: `/geo${currentPath}`,
      level: i
    });
  }

  return breadcrumbs;
}

/**
 * Fetches child areas for a given geographic path
 */
export async function fetchChildAreas(pathSegments: string[]): Promise<GeographicNode[]> {
  const path = pathSegments.join('/');

  try {
    const response = await fetch(`${rootDomain}/loc/${path}/children`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching child areas:', error);
    return [];
  }
}

/**
 * Converts legacy location parameters to new geographic path
 */
export function legacyToGeographicPath(params: {
  country?: string;
  area_one?: string;
  area_two?: string;
  locality?: string;
}): string[] {
  const path: string[] = [];

  if (params.country) path.push(params.country);
  if (params.area_one) path.push(params.area_one);
  if (params.area_two) path.push(params.area_two);
  if (params.locality) path.push(params.locality);

  return path;
}

/**
 * Converts geographic path to legacy location parameters
 */
export function geographicPathToLegacy(pathSegments: string[]): {
  country?: string;
  area_one?: string;
  area_two?: string;
  locality?: string;
} {
  const params: any = {};

  if (pathSegments[0]) params.country = pathSegments[0];
  if (pathSegments[1]) params.area_one = pathSegments[1];
  if (pathSegments[2]) params.area_two = pathSegments[2];
  if (pathSegments[3]) params.locality = pathSegments[3];

  return params;
}

/**
 * Builds a URL for a geographic area
 */
export function buildGeographicUrl(pathSegments: string[], isShop: boolean = false): string {
  const path = pathSegments.join('/');
  return `/geo/${path}${isShop ? '/shop' : ''}`;
}

/**
 * Builds a URL for a spot within a geographic context
 */
export function buildSpotUrl(geographicPath: string[], spotId: string, spotName: string): string {
  const path = geographicPath.join('/');
  return `/geo/${path}/${spotName}-${spotId}`;
}