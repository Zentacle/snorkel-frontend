// Building blocks of the location pages (src/pages/loc/...): the intro with
// tabs and areas, the ranked spot list with filters, the dive shop card and
// the guide with FAQs.
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Breadcrumbs from 'components/Breadcrumbs';
import { sendEvent } from 'hooks/amplitude';
import { Faq } from 'lib/locationFaqs';
import { plainText, shopBookingUrl } from 'lib/locationPage';
import Beach from 'models/Beach';
import Location from 'models/Location';
import Shop from 'models/Shop';
import styles from './styles.module.css';

export { styles as locationPageStyles };

const Star = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--star)" aria-hidden="true">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
  </svg>
);

const formatRating = (value: unknown) => {
  const number = parseFloat(`${value}`);
  return isNaN(number) || number <= 0 ? null : number.toFixed(1);
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/* ---------------- intro ---------------- */

interface Stat {
  value: string;
  label: string;
}

interface IntroProps {
  area: Location;
  title: string;
  lede: React.ReactNode;
  stats: Stat[];
  activeTab: 'sites' | 'shops';
  numSpots?: string | null;
  numShops?: number | null;
  // child areas (or, on a locality page, its sibling localities)
  areas: Location[];
  areasLabel: string;
  isShop?: boolean;
}

const AREAS_SHOWN = 8;

export const LocationIntro = ({
  area,
  title,
  lede,
  stats,
  activeTab,
  numSpots,
  numShops,
  areas,
  areasLabel,
  isShop = false,
}: IntroProps) => {
  const [showAllAreas, setShowAllAreas] = React.useState(false);
  const sortedAreas = [...areas]
    .filter((loc) => loc.url)
    .sort((a, b) => (b.num_spots || 0) - (a.num_spots || 0));
  const hiddenAreas = Math.max(0, sortedAreas.length - AREAS_SHOWN);

  return (
    <>
      <Breadcrumbs
        country={area.country}
        area_one={area.area_one}
        area_two={area.area_two}
        isShop={isShop}
      />
      <div className={styles.intro}>
        <div className={styles.introText}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lede}>{lede}</p>
        </div>
        {stats.length > 0 && (
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <nav className={styles.tabs} aria-label={`${area.name} sections`}>
        <Link href={area.url}>
          <a
            className={`${styles.tab} ${activeTab === 'sites' ? styles.tabActive : ''}`}
            aria-current={activeTab === 'sites' ? 'page' : undefined}
          >
            Dive sites{numSpots ? ` · ${numSpots}` : ''}
          </a>
        </Link>
        <Link href={`${area.url}/shop`}>
          <a
            className={`${styles.tab} ${activeTab === 'shops' ? styles.tabActive : ''}`}
            aria-current={activeTab === 'shops' ? 'page' : undefined}
            onClick={() => sendEvent('loc_tab__shops_click')}
          >
            Dive shops{numShops ? ` · ${numShops}` : ''}
          </a>
        </Link>
        <Link href={activeTab === 'sites' ? '#guide' : `${area.url}#guide`}>
          <a className={styles.tab}>Guide &amp; FAQ</a>
        </Link>
      </nav>

      {sortedAreas.length > 0 && (
        <div className={styles.areas}>
          <span className={styles.areasLabel}>{areasLabel}</span>
          {sortedAreas.map((loc, i) => (
            <Link key={`${loc.short_name}-${loc.id}`} href={`${loc.url}${isShop ? '/shop' : ''}`}>
              <a
                className={`${styles.areaChip} ${
                  loc.short_name === area.short_name ? styles.areaChipActive : ''
                }`}
                // collapsed chips stay in the page (they are links to crawl)
                style={!showAllAreas && i >= AREAS_SHOWN ? { display: 'none' } : undefined}
              >
                {loc.name}
                {!isShop && loc.num_spots ? (
                  <span className={styles.areaCount}>{loc.num_spots}</span>
                ) : null}
              </a>
            </Link>
          ))}
          {hiddenAreas > 0 && !showAllAreas && (
            <button type="button" className={styles.moreAreas} onClick={() => setShowAllAreas(true)}>
              + {hiddenAreas} more
            </button>
          )}
        </div>
      )}
    </>
  );
};

/* ---------------- spot list ---------------- */

export interface ListSpot extends Beach {
  access?: { short_name?: string; text?: string }[] | null;
  max_depth?: string | null;
}

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const ENTRIES = ['shore', 'boat'];
// rows shown before "Show all"; the rest are in the page but hidden
const ROWS_SHOWN = 20;
// an in-feed ad after this many rows, and one after the list if it is longer
// than END_AD_MIN_ROWS
const AD_AFTER = 4;
const END_AD_MIN_ROWS = 8;

const accessOf = (spot: ListSpot) =>
  (spot.access || [])
    .map((tag) => (tag.short_name || tag.text || '').toLowerCase())
    .filter((access) => ENTRIES.includes(access));

const depthLabel = (depth?: string | null) => {
  if (!depth) return null;
  const clean = depth.replace(/(\d)\s*ft\b/i, '$1 ft').replace(/(\d)\s*m\b/i, '$1 m').trim();
  return /\d/.test(clean) ? clean : null;
};

const InFeedAd = () => (
  <aside className={styles.ad} aria-label="Advertisement">
    <span className={styles.adLabel}>Advertisement</span>
    <div className={styles.adDesktop}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-fh-2s+hd-1e-1gn"
        data-ad-client="ca-pub-7099980041278313"
        data-ad-slot="8488292082"
      ></ins>
    </div>
    <div className={styles.adMobile}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6d+e4+4h-78+7"
        data-ad-client="ca-pub-7099980041278313"
        data-ad-slot="4223983131"
      ></ins>
    </div>
  </aside>
);

const SpotRow = ({
  spot,
  rank,
  onMap,
  hidden,
}: {
  spot: ListSpot;
  rank: number;
  onMap: boolean;
  hidden: boolean;
}) => {
  const [photoFailed, setPhotoFailed] = React.useState(false);
  const rating = formatRating(spot.rating);
  const difficulty = (spot.difficulty || '').toLowerCase();
  const depth = depthLabel(spot.max_depth);
  return (
    <article className={styles.row} style={hidden ? { display: 'none' } : undefined}>
      <div className={styles.rowPhoto}>
        {spot.hero_img && !photoFailed ? (
          <Image
            src={spot.hero_img}
            alt={spot.name}
            layout="fill"
            objectFit="cover"
            unoptimized
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <div className={styles.noPhoto}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="12" cy="12" r="3.2" />
              <path d="M8 5l1.5-2h5L16 5" />
            </svg>
            No photos yet
          </div>
        )}
        <span
          className={`${styles.rank} ${onMap ? '' : styles.rankOffMap}`}
          title={onMap ? `#${rank} on the map` : `#${rank} (not on the map)`}
        >
          {rank}
        </span>
      </div>
      <div className={styles.rowBody}>
        <h2 className={styles.rowName}>
          <Link href={spot.url}>
            <a className={styles.rowLink}>{spot.name}</a>
          </Link>
        </h2>
        <div className={styles.meta}>
          {rating ? (
            <>
              <span className={styles.ratingValue}>
                <Star />
                {rating}
              </span>
              <span>
                ({spot.num_reviews} review{spot.num_reviews === 1 ? '' : 's'})
              </span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
          {spot.location_city && (
            <>
              <span aria-hidden="true">·</span>
              {spot.locality && spot.locality.url ? (
                <Link href={spot.locality.url}>
                  <a className={styles.placeLink}>{spot.location_city}</a>
                </Link>
              ) : (
                <span>{spot.location_city}</span>
              )}
            </>
          )}
        </div>
        {spot.description && <p className={styles.blurb}>{plainText(spot.description)}</p>}
        <div className={styles.chips}>
          {DIFFICULTIES.includes(difficulty) && (
            <span className={`${styles.chip} ${styles[difficulty]}`}>{capitalize(difficulty)}</span>
          )}
          {depth && <span className={styles.chip}>Max depth {depth}</span>}
          {accessOf(spot).length > 0 && (
            <span className={styles.chip}>
              {accessOf(spot).map(capitalize).join(' or ')} entry
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

interface SpotListProps {
  areaName: string;
  // ranked best first; the rank shown is the position in this list
  spots: ListSpot[];
  // ids of the spots drawn as pins on the map
  pinnedIds: Set<string>;
  // the column beside the list (map and shops): above it on phones
  side: React.ReactNode;
}

export const SpotList = ({ areaName, spots, pinnedIds, side }: SpotListProps) => {
  const [difficulty, setDifficulty] = React.useState<string | null>(null);
  const [entry, setEntry] = React.useState<string | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  const toggle = (
    value: string,
    current: string | null,
    set: (value: string | null) => void,
    event: string,
  ) => {
    sendEvent(event, { value });
    set(current === value ? null : value);
  };

  // filtering keeps each spot's overall rank, so numbers still match the map
  const ranked = spots.map((spot, i) => ({ spot, rank: i + 1 }));
  const shown = ranked.filter(
    ({ spot }) =>
      (!difficulty || (spot.difficulty || '').toLowerCase() === difficulty) &&
      (!entry || accessOf(spot).includes(entry)),
  );
  const filtered = !!(difficulty || entry);

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter dive sites">
        <div className={styles.filterGroup}>
          {DIFFICULTIES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={difficulty === value}
              className={`${styles.filterChip} ${difficulty === value ? styles.filterChipActive : ''}`}
              onClick={() => toggle(value, difficulty, setDifficulty, 'loc_filter__difficulty')}
            >
              {capitalize(value)}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          {ENTRIES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={entry === value}
              className={`${styles.filterChip} ${entry === value ? styles.filterChipActive : ''}`}
              onClick={() => toggle(value, entry, setEntry, 'loc_filter__entry')}
            >
              {capitalize(value)} entry
            </button>
          ))}
        </div>
        {filtered && (
          <button
            type="button"
            className={styles.clearFilters}
            onClick={() => {
              setDifficulty(null);
              setEntry(null);
            }}
          >
            Clear
          </button>
        )}
        <span className={styles.resultCount}>
          {filtered ? `${shown.length} of ${spots.length} sites` : `${spots.length} sites, ranked by diver reviews`}
        </span>
      </div>
      <div className={styles.layout}>
        <SpotListBody
          areaName={areaName}
          shown={shown}
          pinnedIds={pinnedIds}
          showAll={showAll || filtered}
          onShowAll={() => {
            sendEvent('loc_list__show_all');
            setShowAll(true);
          }}
        />
        {side}
      </div>
    </>
  );
};

const SpotListBody = ({
  areaName,
  shown,
  pinnedIds,
  showAll,
  onShowAll,
}: {
  areaName: string;
  shown: { spot: ListSpot; rank: number }[];
  pinnedIds: Set<string>;
  showAll: boolean;
  onShowAll: () => void;
}) => (
  <section className={styles.list} aria-label={`Top dive sites in ${areaName}`}>
    {shown.length === 0 && (
      <div className={styles.empty}>No dive sites in {areaName} match these filters.</div>
    )}
    {shown.map(({ spot, rank }, i) => (
      <React.Fragment key={spot.id}>
        <SpotRow
          spot={spot}
          rank={rank}
          onMap={pinnedIds.has(String(spot.id))}
          hidden={!showAll && i >= ROWS_SHOWN}
        />
        {i === AD_AFTER - 1 && <InFeedAd />}
      </React.Fragment>
    ))}
    {!showAll && shown.length > ROWS_SHOWN && (
      <button type="button" className={styles.secondaryButton} onClick={onShowAll}>
        Show all {shown.length} dive sites
      </button>
    )}
    {shown.length > END_AD_MIN_ROWS && (
      <aside className={styles.ad} aria-label="Advertisement">
        <span className={styles.adLabel}>Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-fh-2s+hd-1e-1gn"
          data-ad-client="ca-pub-7099980041278313"
          data-ad-slot="5483092474"
        ></ins>
      </aside>
    )}
  </section>
);

/* ---------------- dive shops ---------------- */

export const ShopsCard = ({
  area,
  shops,
  numShops,
}: {
  area: Location;
  shops: Shop[];
  numShops: number | null;
}) => {
  if (!shops.length) {
    return null;
  }
  return (
    <section className={styles.card} aria-label={`Dive shops in ${area.name}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Top dive shops in {area.name}</h2>
        <Link href={`${area.url}/shop`}>
          <a className={styles.textLink}>{numShops ? `All ${numShops}` : 'See all'}</a>
        </Link>
      </div>
      {shops.map((shop) => {
        const rating = formatRating(shop.rating);
        const booking = shopBookingUrl(shop);
        return (
          <div key={shop.id} className={styles.shop}>
            <div className={styles.shopInfo}>
              <Link href={shop.url}>
                <a className={styles.shopName}>{shop.name}</a>
              </Link>
              <div className={styles.shopMeta}>
                {rating && Number(shop.num_reviews) > 0 ? (
                  <>
                    <Star size={13} />
                    <b style={{ color: 'var(--ink)' }}>{rating}</b> ({shop.num_reviews})
                  </>
                ) : (
                  'No reviews yet'
                )}
                {shop.city ? ` · ${shop.city.split(',')[0]}` : ''}
              </div>
            </div>
            {/* rel="noopener" without noreferrer, so shops see the visits came from Zentacle */}
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a
              className={styles.bookButton}
              href={booking.url}
              target={booking.external ? '_blank' : undefined}
              rel={booking.external ? 'noopener' : undefined}
              onClick={() =>
                sendEvent('loc_shop__book_click', {
                  shop_id: shop.id,
                  shop_name: shop.name,
                  destination: booking.destination,
                  location: area.short_name,
                })
              }
            >
              Book
            </a>
          </div>
        );
      })}
    </section>
  );
};

/* ---------------- guide ---------------- */

interface GuideProps {
  areaName: string;
  // the area's description (HTML, may hold links)
  descriptionHtml?: string;
  summary: string;
  faqs: Faq[];
  siblings: Location[];
  siblingsTitle: string;
}

export const LocationGuide = ({
  areaName,
  descriptionHtml,
  summary,
  faqs,
  siblings,
  siblingsTitle,
}: GuideProps) => (
  <section id="guide" className={styles.guide}>
    <div>
      <h2 className={styles.guideTitle}>{areaName} diving guide</h2>
      <div className={styles.guideText}>{summary}</div>
      {descriptionHtml && (
        <div className={styles.guideText} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
      )}
      {faqs.length > 0 && (
        <>
          <h2 className={styles.faqTitle}>Frequently asked questions</h2>
          <div className={styles.faqs}>
            {faqs.map((faq) => (
              <div key={faq.question} className={styles.faq}>
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    {siblings.length > 0 && (
      <aside>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{siblingsTitle}</h2>
          <div className={styles.siblings}>
            {siblings.map((loc) => (
              <Link key={loc.id} href={loc.url}>
                <a className={styles.sibling}>
                  <div className={styles.siblingName}>{loc.name}</div>
                  {loc.num_spots ? (
                    <div className={styles.siblingCount}>{loc.num_spots} sites</div>
                  ) : null}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    )}
  </section>
);
