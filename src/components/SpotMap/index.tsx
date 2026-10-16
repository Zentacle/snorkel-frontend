import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { sendEvent } from 'hooks/amplitude';
import { googleMapsKey, rootDomain } from 'lib/constants';
import { LocationMap } from 'lib/locationMap';
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
  // the annotated image rendered for this page (map-renderer/), if any
  stored?: LocationMap | null;
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

const SpotMap = ({ spots, areaName, stored }: Props) => {
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

  const exploreButton = !interactive && (
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
  );

  const interactiveMap = (
    <div
      ref={interactiveRef}
      className={styles.interactive}
      aria-label={`Interactive map of dive sites in ${areaName}`}
    />
  );

  if (stored) {
    return (
      <StoredMap
        stored={stored}
        spots={spots}
        areaName={areaName}
        activePin={activePin}
        setActivePin={setActivePin}
        interactive={interactive}
        interactiveMap={interactiveMap}
        exploreButton={exploreButton}
      />
    );
  }

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
        interactiveMap
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
        {exploreButton}
      </figcaption>
    </figure>
  );
};

interface StoredMapProps {
  stored: LocationMap;
  spots: MapSpot[];
  areaName: string;
  activePin: number | null;
  setActivePin: (pin: number | null) => void;
  interactive: boolean;
  interactiveMap: React.ReactNode;
  exploreButton: React.ReactNode;
}

// The annotated image (title band, map with pins, key) cropped to its map
// area, with invisible links over the pins drawn into it. The full image is
// what Google Images indexes and what "Full map" opens.
const StoredMap = ({
  stored,
  spots,
  areaName,
  activePin,
  setActivePin,
  interactive,
  interactiveMap,
  exploreButton,
}: StoredMapProps) => {
  const { image, map, pins } = stored;
  const spotsById = new Map(spots.map((spot) => [String(spot.id), spot]));

  return (
    <figure className={styles.figure}>
      <div className={styles.map} style={{ aspectRatio: `${image.width} / ${map.height}` }}>
        {interactive ? (
          interactiveMap
        ) : (
          <>
            <div className={styles.mapImage}>
              {/* a plain <img> so the indexed image URL is exactly the stored one */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                width={image.width}
                height={image.height}
                alt={`${stored.title}: numbered map of the top ${pins.length} dive and snorkel sites, with ratings`}
                className={styles.storedImage}
                style={{ top: `${(-map.top / map.height) * 100}%` }}
              />
            </div>
            {pins.map((pin) => {
              const spot = spotsById.get(String(pin.spotId));
              const name = spot?.name || `Site ${pin.number}`;
              const active = activePin === pin.number;
              return (
                <Link key={pin.spotId} href={pin.url}>
                  <a
                    className={`${styles.hotspot} ${active ? styles.hotspotActive : ''}`}
                    style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                    aria-label={`${pin.number}. ${name}`}
                    aria-describedby={active ? `pin-card-${pin.number}` : undefined}
                    onMouseEnter={() => setActivePin(pin.number)}
                    onMouseLeave={() => setActivePin(null)}
                    onFocus={() => setActivePin(pin.number)}
                    onBlur={() => setActivePin(null)}
                    onClick={() => sendEvent('loc_map__pin_click')}
                  >
                    {/* only shown on phones, where the image's own numbers are too small */}
                    <span className={styles.hotspotNumber}>{pin.number}</span>
                  </a>
                </Link>
              );
            })}
            {pins.map((pin) => {
              const spot = spotsById.get(String(pin.spotId));
              return activePin === pin.number && spot ? (
                <PinCard
                  key={`card-${pin.spotId}`}
                  id={`pin-card-${pin.number}`}
                  number={pin.number}
                  spot={spot}
                  left={pin.left}
                  top={pin.top}
                />
              ) : null;
            })}
          </>
        )}
      </div>
      <figcaption className={styles.caption}>
        <span>
          Numbers match the ranked list of {areaName} dive and snorkel sites
          below.{' '}
          <a href={image.url} target="_blank" rel="noreferrer" className={styles.fullMapLink}>
            Full map with key
          </a>
        </span>
        {exploreButton}
      </figcaption>
    </figure>
  );
};

export default SpotMap;
