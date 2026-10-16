import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Beach from "models/Beach";
import Location from "models/Location";
import Shop from "models/Shop";
import Layout from "components/Layout/Layout";
import { rootDomain } from "src/lib/constants";
import { useCurrentUser } from "context/usercontext";
import useGoogleOneTap from "hooks/useGoogleOneTap";
import BuddyCarousel from "components/BuddyCarousel";
import Patron from "components/Patron";
import { sendEvent } from "hooks/amplitude";
import Expander from "icons/Expander";
import SpotMap from "components/SpotMap";
import {
  ListSpot,
  LocationGuide,
  LocationIntro,
  locationPageStyles as pageStyles,
  ShopsCard,
  SpotList,
} from "components/LocationPage";
import mapStyles from "components/Home/Home.module.css";
import { fetchLocationMap, LocationMap } from "lib/locationMap";
import {
  fetchLocationExtras,
  LocationStats,
  plainText,
} from "lib/locationPage";
import { locationFaqs } from "lib/locationFaqs";
import {
  breadcrumbList,
  faqPage,
  jsonLd,
  spotItemList,
} from "lib/structuredData";
import hasPatron from "lib/hasPatron";

// TODO - fix type of context
// Location pages with no spots have nothing to rank for. Keep them out of
// the index (their links are still followed). Pages with 1-2 spots stay
// indexed: many of them earn search traffic. The sitemap applies the same
// threshold.
const MIN_LISTINGS_TO_INDEX = 1;
// country pages list at most this many spots
const COUNTRY_SPOT_LIMIT = 100;
// pins drawn on the live map when there is no stored map image
const MAX_PINS = 20;
// the intro sentence is taken from the description only if it is this short
const MAX_LEDE_LENGTH = 220;

export async function getStaticProps(context: any) {
  const country_short_name: string = context.params.country;
  const props: Partial<Props> = {};

  // TODO - fix res type
  let res: any;
  res = await fetch(
    `${rootDomain}/spots/get?sort=top&country=${country_short_name}&limit=${COUNTRY_SPOT_LIMIT}`
  );
  const data = await res.json().catch((err: any) => console.log(err));
  props["default"] = (data && data.data) || null;
  if (data && data.area) {
    props["area"] = data.area;
  }

  // the page can't render without its area (title, breadcrumbs, canonical)
  if (!props.default || !props.area) {
    // return 404
    return {
      notFound: true,
    };
  }

  props.loc = "country";
  props.country = country_short_name;
  props.map = await fetchLocationMap(props.loc, props.area);
  Object.assign(
    props,
    await fetchLocationExtras(props.loc, { country: props.country }, props.area)
  );

  const localityType = getPillLocalityLevel[props.loc];
  let url = `${rootDomain}/locality/${localityType}?country=${props.country}`;
  props["areas"] = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return (data && data.data) || [];
    });

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const res = await fetch(`${rootDomain}/locality/country`);
  const data = await res.json();
  return {
    paths: data.data.map((loc: Location) => ({
      params: {
        country: loc.short_name,
      },
    })),
    fallback: "blocking",
  };
}

export const getPillLocalityLevel: { [key: string]: string } = {
  country: "area_one",
  area_one: "area_two",
  area_two: "locality",
  locality: "locality",
};

interface Props {
  default: Beach[];
  loc: "country" | "area_one" | "area_two" | "locality";
  area: Location;
  // annotated map image rendered by map-renderer/, if any
  map?: LocationMap | null;
  areas: Location[];
  // from fetchLocationExtras (lib/locationPage)
  shops: Shop[];
  numSpots: number | null;
  numShops: number | null;
  stats: LocationStats | null;
  siblings: Location[];
  country?: string;
  area_one?: string;
  area_two?: string;
  locality?: string;
}

const hasCoordinates = (spot: Beach) =>
  typeof spot.latitude === "number" && typeof spot.longitude === "number";

// One or two sentences for under the title: the start of the area's own
// description when it is short enough, else a summary.
const ledeText = (area: Location, numSpots: string) => {
  const description = plainText(area.description);
  const sentences = description.match(/[^.!?]+[.!?]+/g) || [];
  let lede = "";
  for (const sentence of sentences) {
    if ((lede + sentence).length > MAX_LEDE_LENGTH) break;
    lede += sentence;
  }
  return (
    lede.trim() ||
    `The top ${numSpots} dive and snorkel sites in ${area.name}, ranked by diver reviews, with maps and photos.`
  );
};

const Home = (props: Props) => {
  const [buddies, setBuddies] = React.useState([]);
  const spots = props.default as ListSpot[];

  const { state } = useCurrentUser();
  const currentUser = state.user;

  React.useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (e) {}
    }
  }, [props.area]);

  React.useEffect(() => {
    if (currentUser) {
      sendEvent("page_view", {
        type: "location",
        loc_type: props.loc,
        loc_name: props.area.short_name,
      });
    }
  }, [state, props.loc, props.area.short_name]);

  React.useEffect(() => {
    fetch(`${rootDomain}/buddy/get?${props.loc}=${props.area.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBuddies(data.data);
      });
  }, [props.area, props.loc]);

  React.useEffect(useGoogleOneTap(props.area.url, state.user), [state]);

  let areaPatronKey = null;
  if (props.loc === "locality") {
    if (props.area_two) {
      areaPatronKey = [props.area_one, props.area_two];
    }
  } else if (props.loc === "area_two") {
    areaPatronKey = [props.area_one, props.area.short_name];
  } else if (props.loc === "area_one") {
    areaPatronKey = [props.area.short_name, null];
  }

  const firstMapped = spots.find(hasCoordinates);
  const exploreUrl = firstMapped
    ? `https://www.zentacle.com/explore?latitude=${firstMapped.latitude}&longitude=${firstMapped.longitude}`
    : `https://www.zentacle.com/explore`;

  // country pages only load the top spots, so totals come from /locality/stats
  const capped =
    props.loc === "country" && spots.length >= COUNTRY_SPOT_LIMIT;
  const numSpots = props.numSpots ?? (capped ? null : spots.length);
  const numSpotsLabel = numSpots ? `${numSpots}` : `${spots.length}+`;
  const numReviews =
    props.stats?.num_reviews ??
    (capped
      ? null
      : spots.reduce((sum, spot) => sum + (spot.num_reviews || 0), 0));

  const stats = [
    { value: numSpotsLabel, label: numSpots === 1 ? "dive site" : "dive sites" },
    ...(props.numShops
      ? [{ value: `${props.numShops}`, label: props.numShops === 1 ? "dive shop" : "dive shops" }]
      : []),
    ...(numReviews ? [{ value: `${numReviews}`, label: "reviews" }] : []),
  ];

  // spots drawn on the map get blue rank badges in the list
  const pinnedIds = new Set(
    props.map
      ? props.map.pins.map((pin) => String(pin.spotId))
      : spots
          .slice(0, MAX_PINS)
          .filter(hasCoordinates)
          .map((spot) => String(spot.id))
  );

  const faqs = locationFaqs(props.area.name, spots, props.shops, props.numShops);
  const parent =
    props.loc === "area_one"
      ? props.area.country
      : props.loc === "area_two"
      ? props.area.area_one
      : null;

  const title = `Top Snorkeling and Scuba Diving in ${props.area.name} | Zentacle - Reviews, Maps, and Photos`;
  const description = `Top scuba dive and snorkel spots in ${props.area.name} with maps, detailed reviews, and photos curated by oceans lovers like you.`;

  const side = (
    <div className={pageStyles.side}>
      <div className={pageStyles.mapSlot}>
        <SpotMap spots={spots} areaName={props.area.name} stored={props.map} flush />
        {/* fallback when no listed spot has coordinates for the map */}
        {props.area.map_image_url && !spots.some(hasCoordinates) && (
          <Link
            href={`https://zentacle.app.link?utm_medium=xpromo&utm_source=xpromo&campaign=loc_map&$desktop_url=${exploreUrl}`}
          >
            <a
              onClick={() => sendEvent("loc_map__click")}
              className={mapStyles.mapImageContainer}
            >
              <div className={mapStyles.mapExpander}>
                <Expander />
              </div>
              <Image
                src={props.area.map_image_url}
                className={mapStyles.mapImage}
                objectFit="contain"
                height="300"
                width="600"
                unoptimized
                alt={`${props.area.name} dive site map`}
              />
            </a>
          </Link>
        )}
      </div>
      <div className={pageStyles.shopSlot}>
        {hasPatron(props.area, props.area_one, props.area_two) &&
          areaPatronKey &&
          areaPatronKey.length && (
            <Patron
              areaPatronKey={areaPatronKey}
              className={pageStyles.patron}
              name={props.area.name}
            />
          )}
        <ShopsCard area={props.area} shops={props.shops} numShops={props.numShops} />
      </div>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="og:title" />
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
        <meta
          property="og:image"
          content={props.map?.image.url || "https://www.zentacle.com/social_background_v2.jpg"}
          key="og:image"
        />
        {props.map && (
          <>
            <meta property="og:image:width" content={`${props.map.image.width}`} key="og:image:width" />
            <meta property="og:image:height" content={`${props.map.image.height}`} key="og:image:height" />
            <meta property="og:image:alt" content={props.map.title} key="og:image:alt" />
          </>
        )}
        <meta name="description" content={description} key="description" />
        {props.default.length < MIN_LISTINGS_TO_INDEX && (
          <meta name="robots" content="noindex, follow" key="robots" />
        )}
        {props.area.url && (
          <link
            rel="canonical"
            href={`https://www.zentacle.com${props.area.url}`}
          />
        )}
        {props.area.url && (
          <script
            type="application/ld+json"
            key="ld-breadcrumbs"
            dangerouslySetInnerHTML={jsonLd(
              breadcrumbList(props.area, { name: props.area.name, url: props.area.url })
            )}
          />
        )}
        {spots.length > 0 && (
          <script
            type="application/ld+json"
            key="ld-itemlist"
            dangerouslySetInnerHTML={jsonLd(
              spotItemList(`Top dive and snorkel sites in ${props.area.name}`, spots)
            )}
          />
        )}
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            key="ld-faq"
            dangerouslySetInnerHTML={jsonLd(faqPage(faqs))}
          />
        )}
      </Head>
      <div className={pageStyles.page}>
        <div className={pageStyles.container}>
          <LocationIntro
            area={props.area}
            title={`Top Snorkeling and Scuba Diving in ${props.area.name}`}
            lede={
              <>
                {ledeText(props.area, numSpotsLabel)}{" "}
                <a href="#guide">Read the {props.area.name} guide</a>
              </>
            }
            stats={stats}
            activeTab="sites"
            numSpots={numSpotsLabel}
            numShops={props.numShops}
            areas={props.areas}
            areasLabel={props.loc === "locality" ? "Nearby areas" : "Areas"}
          />
          <SpotList
            areaName={props.area.name}
            spots={spots}
            pinnedIds={pinnedIds}
            side={side}
          />
          {buddies.length ? (
            <BuddyCarousel buddies={buddies} loc={props.area.short_name} />
          ) : (
            <></>
          )}
          <LocationGuide
            areaName={props.area.name}
            descriptionHtml={props.area.description}
            summary={
              `Ready to check out the best sites in ${props.area.name} for scuba diving, snorkeling, shore diving, ` +
              `free diving or other ocean activities? Zentacle has ${numSpotsLabel} dive sites, snorkel spots, ` +
              `beaches, and more. Discover hand-curated maps, along with reviews and photos from nature lovers like you.`
            }
            faqs={faqs}
            siblings={props.siblings}
            siblingsTitle={parent ? `More of ${parent.name}` : "Nearby"}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
