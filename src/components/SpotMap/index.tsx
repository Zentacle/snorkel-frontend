import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { sendEvent } from 'hooks/amplitude';
import { googleMapsKey, rootDomain } from 'lib/constants';
import { fitView, pinPosition, spreadPins } from 'lib/mapProjection';
import PinCard, { PinCardSpot } from './PinCard';
import styles from './styles.module.css';

// The static image is requested at this size (x2 for retina); pins are placed
// as percentages, so it can be displayed at any width with the same ratio.
const MAP_WIDTH = 640;
const MAP_HEIGHT = 320;
// Only the top spots get pins on the static map, to keep it readable;
// the interactive map shows all of them.
const MAX_PINS = 20;

interface MapSpot extends PinCardSpot {
  id: string | number;
  name: string;
  url: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface Props {
  // in ranked order; pin numbers match the "#1 - Name" list below the map
  spots: MapSpot[];
  areaName: string;
}

const hasCoordinates = (spot: MapSpot) =>
  typeof spot.latitude === 'number' && typeof spot.longitude === 'number';

declare global {
  interface Window {
    google?: any;
  }
}

let googleMapsLoading: Promise<void> | null = null;
const loadGoogleMaps = () => {
  if (window.google?.maps) {
    return Promise.resolve();
  }
  if (!googleMapsLoading) {
    googleMapsLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return googleMapsLoading;
};

const SpotMap = ({ spots, areaName }: Props) => {
  const router = useRouter();
  const [interactive, setInteractive] = React.useState(false);
  // number of the pin being hovered or focused, if any
  const [activePin, setActivePin] = React.useState<number | null>(null);
  const interactiveRef = React.useRef<HTMLDivElement>(null);

  const numbered = spots
    .map((spot, index) => ({ spot, number: index + 1 }))
    .filter(({ spot }) => hasCoordinates(spot));
  const pinned = numbered.filter(({ number }) => number <= MAX_PINS);
  const view = fitView(
    pinned.map(({ spot }) => ({
      latitude: spot.latitude as number,
      longitude: spot.longitude as number,
    })),
    MAP_WIDTH,
    MAP_HEIGHT,
  );

  React.useEffect(() => {
    if (!interactive || !interactiveRef.current) {
      return;
    }
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !interactiveRef.current) {
        return;
      }
      const { maps } = window.google;
      const map = new maps.Map(interactiveRef.current, {
        mapTypeId: maps.MapTypeId.TERRAIN,
        gestureHandling: 'cooperative',
        streetViewControl: false,
      });
      const bounds = new maps.LatLngBounds();
      numbered.forEach(({ spot, number }) => {
        const position = new maps.LatLng(spot.latitude, spot.longitude);
        bounds.extend(position);
        const marker = new maps.Marker({
          position,
          map,
          title: `${number}. ${spot.name}`,
          label: { text: `${number}`, color: 'white', fontSize: '11px' },
        });
        marker.addListener('click', () => {
          sendEvent('loc_map__marker_click');
          router.push(spot.url);
        });
      });
      map.fitBounds(bounds);
    });
    return () => {
      cancelled = true;
    };
    // numbered is derived from spots
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, spots, router]);

  if (!view) {
    return null;
  }

  const pinPositions = spreadPins(
    pinned.map(({ spot }) =>
      pinPosition(
        { latitude: spot.latitude as number, longitude: spot.longitude as number },
        view,
        MAP_WIDTH,
        MAP_HEIGHT,
      ),
    ),
    MAP_WIDTH,
    MAP_HEIGHT,
  );

  const imageUrl =
    `${rootDomain}/maps/static?latitude=${view.center.latitude}` +
    `&longitude=${view.center.longitude}&zoom=${view.zoom}&marker=0` +
    `&size=${MAP_WIDTH}x${MAP_HEIGHT}`;

  return (
    <figure className={styles.figure}>
      <div className={styles.map}>
      {interactive ? (
        <div
          ref={interactiveRef}
          className={styles.interactive}
          aria-label={`Interactive map of dive sites in ${areaName}`}
        />
      ) : (
        <>
          <div className={styles.mapImage}>
            <Image
              src={imageUrl}
              alt={`Map of the top dive and snorkel sites in ${areaName}`}
              layout="fill"
              objectFit="cover"
              priority
              unoptimized
            />
          </div>
          {pinned.map(({ spot, number }, i) => {
            const { left, top } = pinPositions[i];
            const active = activePin === number;
            return (
              <Link key={spot.id} href={spot.url}>
                <a
                  className={`${styles.pin} ${active ? styles.pinActive : ''}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  aria-label={`${number}. ${spot.name}`}
                  aria-describedby={active ? `pin-card-${number}` : undefined}
                  onMouseEnter={() => setActivePin(number)}
                  onMouseLeave={() => setActivePin(null)}
                  onFocus={() => setActivePin(number)}
                  onBlur={() => setActivePin(null)}
                  onClick={() => sendEvent('loc_map__pin_click')}
                >
                  {number}
                </a>
              </Link>
            );
          })}
          {pinned.map(({ spot, number }, i) =>
            activePin === number ? (
              <PinCard
                key={`card-${spot.id}`}
                id={`pin-card-${number}`}
                number={number}
                spot={spot}
                left={pinPositions[i].left}
                top={pinPositions[i].top}
              />
            ) : null,
          )}
        </>
      )}
      </div>
      <figcaption className={styles.caption}>
        <span>
          Numbers match the ranked list of {areaName} dive and snorkel sites
          below.
        </span>
        {!interactive && (
          <button
            type="button"
            className={styles.exploreButton}
            onClick={() => {
              sendEvent('loc_map__explore_click');
              setInteractive(true);
            }}
          >
            Explore the map
          </button>
        )}
      </figcaption>
    </figure>
  );
};

export default SpotMap;
