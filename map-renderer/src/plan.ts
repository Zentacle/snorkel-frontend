// Decide what a location's map shows: the top spots with coordinates, the
// view that fits them, and where each numbered pin goes. Uses the page's own
// projection code so the image and the page agree.
import { createHash } from 'crypto';

import { fitView, pinPosition, spreadPins, MapView } from '../../src/lib/mapProjection';
import { IMAGE_PIN_SPACING, MAP_HEIGHT, MAP_WIDTH, MAX_PINS, RENDER_VERSION } from './config';
import { ApiSpot } from './locations';

export interface PlannedPin {
  number: number; // matches "#n - Name" in the page's list
  spotId: number | string;
  name: string;
  url: string;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  // position in the image's map area, in percent (after spreading overlaps)
  left: number;
  top: number;
}

export interface MapPlan {
  areaName: string;
  view: MapView;
  pins: PlannedPin[];
  hash: string;
}

const hasCoordinates = (spot: ApiSpot) =>
  typeof spot.latitude === 'number' && typeof spot.longitude === 'number';

export const planMap = (areaName: string, spots: ApiSpot[]): MapPlan | null => {
  const pinned = spots
    .map((spot, index) => ({ spot, number: index + 1 }))
    .filter(({ spot, number }) => number <= MAX_PINS && hasCoordinates(spot));
  const view = fitView(
    pinned.map(({ spot }) => ({ latitude: spot.latitude as number, longitude: spot.longitude as number })),
    MAP_WIDTH,
    MAP_HEIGHT,
  );
  if (!view) return null;

  const raw = pinned.map(({ spot }) =>
    pinPosition({ latitude: spot.latitude as number, longitude: spot.longitude as number }, view, MAP_WIDTH, MAP_HEIGHT),
  );
  const positions = spreadPins(raw, MAP_WIDTH, MAP_HEIGHT, IMAGE_PIN_SPACING);

  const pins: PlannedPin[] = pinned.map(({ spot, number }, i) => ({
    number,
    spotId: spot.id,
    name: spot.name,
    url: spot.url,
    rating: Number(spot.rating) || 0,
    reviews: spot.num_reviews || 0,
    latitude: spot.latitude as number,
    longitude: spot.longitude as number,
    left: Number(positions[i].left.toFixed(3)),
    top: Number(positions[i].top.toFixed(3)),
  }));

  // Everything that changes the picture; a different hash means re-render.
  const fingerprint = JSON.stringify({
    v: RENDER_VERSION,
    areaName,
    view,
    pins: pins.map((p) => [p.number, p.spotId, p.name, p.latitude.toFixed(5), p.longitude.toFixed(5), p.rating.toFixed(1), p.reviews]),
  });
  const hash = createHash('sha1').update(fingerprint).digest('hex');
  return { areaName, view, pins, hash };
};
