// Bump RENDER_VERSION whenever the image design changes: every location
// whose stored version differs is re-rendered on the next run.
export const RENDER_VERSION = 1;

export const API_URL = process.env.ZENTACLE_API_URL || 'https://www.zentacle.com/api';
export const SITE_URL = 'https://www.zentacle.com';

// Images live at the URLs the old location maps used (the site rewrites
// /image/* to this bucket), so already-indexed image URLs keep working.
export const S3_BUCKET = process.env.MAP_S3_BUCKET || 'snorkel';
export const S3_REGION = process.env.AWS_REGION || 'us-east-1';
export const S3_PREFIX = 'loc-map/';
export const PUBLIC_IMAGE_BASE = `${SITE_URL}/image/`;
export const STATE_KEY = `${S3_PREFIX}_render-state.json`;
export const INDEX_KEY = `${S3_PREFIX}_index.json`;

// Map geometry, shared with the page (src/components/SpotMap): the map is
// fitted to MAP_WIDTH x MAP_HEIGHT logical pixels and rendered at SCALE.
export const MAP_WIDTH = 640;
export const MAP_HEIGHT = 320;
export const SCALE = 2;
export const MAX_PINS = 20;
// minimum distance between pin centres in the image, in logical pixels
export const IMAGE_PIN_SPACING = 23;

// Protomaps publishes daily OpenStreetMap basemap builds; the newest is used.
export const PROTOMAPS_BUILDS_URL = 'https://build-metadata.protomaps.dev/builds.json';
export const PROTOMAPS_BUILD_BASE = 'https://build.protomaps.com/';
export const PROTOMAPS_ASSETS = 'https://protomaps.github.io/basemaps-assets';
// tiles are fetched up to this zoom (the basemap's own max is 15)
export const BASEMAP_MAX_ZOOM = 15;
