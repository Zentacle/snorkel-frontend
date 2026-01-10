import { legacyToGeographicPath, buildGeographicUrl } from './geographicUtils';

/**
 * Migrates old location URLs to new geographic URLs
 */
export function migrateLocationUrl(oldUrl: string): string {
  // Handle old location URLs like /loc/us/_/ca/san-diego
  const locationMatch = oldUrl.match(/^\/loc\/([^\/]+)\/([^\/]*)\/([^\/]+)\/([^\/]+)$/);
  if (locationMatch) {
    const [, country, underscore, areaTwo, locality] = locationMatch;
    if (underscore === '_') {
      // This is the old format with underscore
      const pathSegments = [country, areaTwo, locality];
      return buildGeographicUrl(pathSegments);
    }
  }

  // Handle old location URLs like /loc/us/ca/san-diego
  const simpleLocationMatch = oldUrl.match(/^\/loc\/([^\/]+)\/([^\/]+)\/([^\/]+)$/);
  if (simpleLocationMatch) {
    const [, country, areaOne, areaTwo] = simpleLocationMatch;
    const pathSegments = [country, areaOne, areaTwo];
    return buildGeographicUrl(pathSegments);
  }

  // Handle old location URLs like /loc/us/ca
  const twoLevelMatch = oldUrl.match(/^\/loc\/([^\/]+)\/([^\/]+)$/);
  if (twoLevelMatch) {
    const [, country, areaOne] = twoLevelMatch;
    const pathSegments = [country, areaOne];
    return buildGeographicUrl(pathSegments);
  }

  // Handle old location URLs like /loc/us
  const oneLevelMatch = oldUrl.match(/^\/loc\/([^\/]+)$/);
  if (oneLevelMatch) {
    const [, country] = oneLevelMatch;
    const pathSegments = [country];
    return buildGeographicUrl(pathSegments);
  }

  // Handle shop URLs
  const shopMatch = oldUrl.match(/^\/loc\/([^\/]+)\/([^\/]*)\/([^\/]+)\/([^\/]+)\/shop$/);
  if (shopMatch) {
    const [, country, underscore, areaTwo, locality] = shopMatch;
    if (underscore === '_') {
      const pathSegments = [country, areaTwo, locality];
      return buildGeographicUrl(pathSegments, true);
    }
  }

  const simpleShopMatch = oldUrl.match(/^\/loc\/([^\/]+)\/([^\/]+)\/([^\/]+)\/shop$/);
  if (simpleShopMatch) {
    const [, country, areaOne, areaTwo] = simpleShopMatch;
    const pathSegments = [country, areaOne, areaTwo];
    return buildGeographicUrl(pathSegments, true);
  }

  const twoLevelShopMatch = oldUrl.match(/^\/loc\/([^\/]+)\/([^\/]+)\/shop$/);
  if (twoLevelShopMatch) {
    const [, country, areaOne] = twoLevelShopMatch;
    const pathSegments = [country, areaOne];
    return buildGeographicUrl(pathSegments, true);
  }

  const oneLevelShopMatch = oldUrl.match(/^\/loc\/([^\/]+)\/shop$/);
  if (oneLevelShopMatch) {
    const [, country] = oneLevelShopMatch;
    const pathSegments = [country];
    return buildGeographicUrl(pathSegments, true);
  }

  // If no match, return the original URL
  return oldUrl;
}

/**
 * Migrates old spot URLs to new geographic URLs
 */
export function migrateSpotUrl(oldUrl: string): string {
  // Handle old spot URLs like /Beach/123/la-jolla-cove
  const beachMatch = oldUrl.match(/^\/Beach\/(\d+)\/([^\/]+)$/);
  if (beachMatch) {
    const [, spotId, spotName] = beachMatch;
    // For now, we'll redirect to the old format until we have geographic context
    // In a real implementation, you'd need to fetch the spot data to get its geographic context
    return oldUrl;
  }

  return oldUrl;
}

/**
 * Checks if a URL needs migration
 */
export function needsMigration(url: string): boolean {
  // Check for old location patterns
  const oldLocationPatterns = [
    /^\/loc\/[^\/]+\/_[^\/]+\/[^\/]+$/, // /loc/us/_/ca/san-diego
    /^\/loc\/[^\/]+\/[^\/]+\/[^\/]+\/shop$/, // /loc/us/ca/san-diego/shop
    /^\/loc\/[^\/]+\/_[^\/]+\/[^\/]+\/shop$/, // /loc/us/_/ca/san-diego/shop
  ];

  return oldLocationPatterns.some(pattern => pattern.test(url));
}

/**
 * Creates a redirect component for old URLs
 */
export function createRedirectComponent(oldUrl: string) {
  const newUrl = migrateLocationUrl(oldUrl);

  if (newUrl !== oldUrl) {
    return {
      redirect: {
        destination: newUrl,
        permanent: true,
      },
    };
  }

  return null;
}