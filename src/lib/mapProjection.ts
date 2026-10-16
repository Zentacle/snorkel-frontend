// Web Mercator math (what Google Maps uses), so pins drawn over a static map
// image land exactly where the map puts those coordinates.

const TILE_SIZE = 256;
const MAX_LATITUDE = 85.05112878;
const MAX_ZOOM = 14;
const SINGLE_POINT_ZOOM = 12;

export interface LatLng {
  latitude: number;
  longitude: number;
}

const worldSize = (zoom: number) => TILE_SIZE * Math.pow(2, zoom);

const clampLatitude = (latitude: number) =>
  Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, latitude));

// pixel x/y of a coordinate on the whole world map at a zoom level
export const toWorldPixels = ({ latitude, longitude }: LatLng, zoom: number) => {
  const sin = Math.sin((clampLatitude(latitude) * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * worldSize(zoom),
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldSize(zoom),
  };
};

const fromWorldPixels = (x: number, y: number, zoom: number): LatLng => {
  const n = Math.PI - (2 * Math.PI * y) / worldSize(zoom);
  return {
    latitude: (180 / Math.PI) * Math.atan(Math.sinh(n)),
    longitude: (x / worldSize(zoom)) * 360 - 180,
  };
};

// Points spanning the antimeridian (Fiji, Tuvalu…) are shifted onto one side
// so their bounding box is the short way round.
const unwrapLongitudes = (points: LatLng[]): LatLng[] => {
  const longitudes = points.map((p) => p.longitude);
  if (Math.max(...longitudes) - Math.min(...longitudes) <= 180) {
    return points;
  }
  return points.map((p) => ({
    ...p,
    longitude: p.longitude < 0 ? p.longitude + 360 : p.longitude,
  }));
};

export interface MapView {
  center: LatLng;
  zoom: number;
}

// The highest zoom (up to MAX_ZOOM) at which every point fits inside a
// width x height map with `padding` pixels to spare on each side.
export const fitView = (
  rawPoints: LatLng[],
  width: number,
  height: number,
  padding = 24,
): MapView | null => {
  if (!rawPoints.length) {
    return null;
  }
  const points = unwrapLongitudes(rawPoints);
  for (let zoom = MAX_ZOOM; zoom >= 1; zoom--) {
    const pixels = points.map((p) => toWorldPixels(p, zoom));
    const xs = pixels.map((p) => p.x);
    const ys = pixels.map((p) => p.y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    const fits = spanX <= width - 2 * padding && spanY <= height - 2 * padding;
    if (fits || zoom === 1) {
      const center = fromWorldPixels(
        (Math.max(...xs) + Math.min(...xs)) / 2,
        (Math.max(...ys) + Math.min(...ys)) / 2,
        zoom,
      );
      return {
        // rounded so nearby views share a cached map image
        center: {
          latitude: Number(center.latitude.toFixed(4)),
          longitude: Number((((center.longitude + 540) % 360) - 180).toFixed(4)),
        },
        zoom: points.length === 1 ? Math.min(zoom, SINGLE_POINT_ZOOM) : zoom,
      };
    }
  }
  return null;
};

// Position of a point on a width x height map of `view`, as percentages
// from the top-left (so it still lines up when the image is scaled).
export const pinPosition = (
  point: LatLng,
  view: MapView,
  width: number,
  height: number,
) => {
  const centerPixels = toWorldPixels(view.center, view.zoom);
  let pointPixels = toWorldPixels(point, view.zoom);
  // pick the copy of the point nearest the center (antimeridian)
  const world = worldSize(view.zoom);
  if (pointPixels.x - centerPixels.x > world / 2) {
    pointPixels = { ...pointPixels, x: pointPixels.x - world };
  } else if (centerPixels.x - pointPixels.x > world / 2) {
    pointPixels = { ...pointPixels, x: pointPixels.x + world };
  }
  return {
    left: ((pointPixels.x - centerPixels.x) / width + 0.5) * 100,
    top: ((pointPixels.y - centerPixels.y) / height + 0.5) * 100,
  };
};

// Nudges pins (in rank order) that would sit on top of an earlier pin onto
// a small ring around their true position, so every number stays visible
// and clickable. Positions are percentages of a width x height map.
export const spreadPins = (
  positions: { left: number; top: number }[],
  width: number,
  height: number,
  minDistancePx = 34,
) => {
  const placed: { x: number; y: number }[] = [];
  return positions.map(({ left, top }) => {
    const x0 = (left / 100) * width;
    const y0 = (top / 100) * height;
    let x = x0;
    let y = y0;
    for (let attempt = 0; attempt < 36; attempt++) {
      const collides = placed.some((p) => Math.hypot(p.x - x, p.y - y) < minDistancePx);
      if (!collides) {
        break;
      }
      const ring = Math.floor(attempt / 6) + 1;
      const angle = (attempt % 6) * (Math.PI / 3) + ring * 0.5;
      x = x0 + ring * minDistancePx * Math.cos(angle);
      y = y0 + ring * minDistancePx * Math.sin(angle);
    }
    placed.push({ x, y });
    return { left: (x / width) * 100, top: (y / height) * 100 };
  });
};
