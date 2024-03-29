import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "components/Home/Home.module.css";
import locStyles from "./styles.module.css";
import Beach from "models/Beach";
import Location from "models/Location";
import Layout from "components/Layout/Layout";
import LocationCard from "components/LocationCard";
import { rootDomain } from "src/lib/constants";
import { useCurrentUser } from "context/usercontext";
import useGoogleOneTap from "hooks/useGoogleOneTap";
import Breadcrumbs from "components/Breadcrumbs";
import Patron from "components/Patron";
import { sendEvent } from "hooks/amplitude";
import Expander from "icons/Expander";
import hasPatron from "lib/hasPatron";
import LinkifyText from "controls/LinkifyText";

// TODO - fix type of context
export async function getStaticProps(context: any) {
  const country_short_name: string = context.params.country;
  const props: Partial<Props> = {};

  // TODO - fix res type
  let res: any;
  res = await fetch(
    `${rootDomain}/shop/loc?sort=top&country=${country_short_name}&limit=100`
  );
  const data = await res.json().catch((err: any) => console.log(err));
  props["default"] = data.data || null;
  if (data.area) {
    props["area"] = data.area;
  }

  if (!props.default) {
    // return 404
    return {
      notFound: true,
    };
  }

  props.loc = "country";
  props.country = country_short_name;

  const localityType = getPillLocalityLevel[props.loc];
  let url = `${rootDomain}/locality/${localityType}?country=${props.country}&shops=true`;
  props["areas"] = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    });

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const res = await fetch(`${rootDomain}/locality/country?shops=true`);
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
  loc: string;
  area: Location;
  areas: Location[];
  country?: string;
  area_one?: string;
  area_two?: string;
  locality?: string;
}

const Home = (props: Props) => {
  const [spots, setSpots] = React.useState(props.default);

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
        type: "shop_location",
        loc_type: props.loc,
        loc_name: props.area.short_name,
      });
    }
  }, [state, props.loc, props.area.short_name]);

  React.useEffect(() => {
    setSpots(props.default);
  }, [props.default]);

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

  let longitude: number | undefined;
  let latitude: number | undefined;
  props.default.map((beach: Beach) => {
    if (!latitude && beach.latitude) {
      latitude = beach.latitude;
      longitude = beach.longitude;
    }
  });
  const exploreUrl =
    latitude && longitude
      ? `https://www.zentacle.com/explore?latitude=${latitude}&longitude=${longitude}`
      : `https://www.zentacle.com/explore`;

  const title = `Top scuba dive shops in ${props.area.name} | Zentacle - Reviews, Maps, and Photos`;
  const description = `Top scuba dive shops in ${props.area.name} with maps, detailed reviews, and photos curated by oceans lovers like you.`;

  const fetchLocations = (params: { [key: string]: string | undefined }) => {
    const queryString = Object.keys(params)
      .filter((key) => params[key])
      .map((key) => key + "=" + params[key])
      .join("&");
    fetch(`${rootDomain}/spots/get?${queryString}`)
      .then((res) => res.json().catch((err) => console.log(res)))
      .then((data) => setSpots(data.data));
  };

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
          content="https://www.zentacle.com/social_background_v2.jpg"
          key="og:image"
        />
        <meta name="description" content={description} key="description" />
        {props.area.url && (
          <link
            rel="canonical"
            href={`https://www.zentacle.com${props.area.url}/shop`}
          />
        )}
      </Head>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <Breadcrumbs
            country={props.area.country}
            area_one={props.area.area_one}
            area_two={props.area.area_two}
            isShop={true}
          />
          {props.areas.length ? (
            <div
              className={`${styles.locationContainer} ${locStyles.locationContainer}`}
            >
              {props.areas.map((area) => (
                <Link
                  key={`${area.short_name}-${area.id}`}
                  href={`${area.url}/shop`}
                >
                  <a
                    className={`${styles.location} ${
                      props.area.short_name === area.short_name && styles.active
                    }`}
                  >
                    {area.name}
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
          <h1 className={styles.areaTitle}>
            Top Scuba Dive Shops in {props.area.name}
          </h1>
          <div className={styles.marginContainer}>
            Ready to check out the best shops in {props.area.name} for scuba
            diving, snorkeling, shore diving, free diving or other ocean
            activities? Zentacle has {props.default.length} dive shops where you
            can rent equipment, book dives, and get guided tours. Discover
            hand-curated maps, along with reviews and photos from nature lovers
            like you.
            {"\n\n"}
            No matter what you&apos;re looking for, you can find a diverse range
            of the best ocean activities in {props.area.name} to suit your
            needs.
            {props.area.description && "\n\n"}
            {props.area.description && (
              <LinkifyText text={props.area.description} />
            )}
          </div>
          {props.area.map_image_url && (
            <Link
              href={`https://zentacle.app.link?utm_medium=xpromo&utm_source=xpromo&campaign=loc_map&$desktop_url=${exploreUrl}`}
            >
              <a
                onClick={() => sendEvent("loc_map__click")}
                className={styles.mapImageContainer}
              >
                <div className={styles.mapExpander}>
                  <Expander />
                </div>
                <Image
                  src={props.area.map_image_url}
                  className={styles.mapImage}
                  objectFit="contain"
                  height="300"
                  width="600"
                  unoptimized
                  alt={`${props.area.name} dive site map`}
                />
              </a>
            </Link>
          )}
          {hasPatron(props.area, props.area_one, props.area_two) &&
          areaPatronKey &&
          areaPatronKey.length ? (
            <Patron
              areaPatronKey={areaPatronKey}
              className={locStyles.patronContainer}
              name={props.area.name}
            />
          ) : (
            <></>
          )}
          <div className={styles.homeAd}>
            <ins
              className="adsbygoogle"
              style={{
                display: "block",
                minWidth: "300px",
                maxWidth: "970px",
                width: "100%",
                height: "90px",
                margin: "16px auto",
              }}
              data-ad-client="ca-pub-7099980041278313"
              data-ad-slot="5284949215"
            ></ins>
          </div>
          <div>
            {spots.map((location, index) => {
              return (index + 1) % 7 == 3 ? (
                <React.Fragment key={location.id}>
                  <LocationCard info={location} index={index} />
                  {
                    //<!-- region listing -->
                  }
                  <div className={`${styles.ad} ${styles.inFeedAdDesktop}`}>
                    <ins
                      className={`adsbygoogle`}
                      style={{ display: "block" }}
                      data-ad-format="fluid"
                      data-ad-layout-key="-fh-2s+hd-1e-1gn"
                      data-ad-client="ca-pub-7099980041278313"
                      data-ad-slot="8488292082"
                    ></ins>
                  </div>
                  <div className={`${styles.ad} ${styles.inFeedAdMobile}`}>
                    <ins
                      className={`adsbygoogle`}
                      style={{ display: "block" }}
                      data-ad-format="fluid"
                      data-ad-layout-key="-6d+e4+4h-78+7"
                      data-ad-client="ca-pub-7099980041278313"
                      data-ad-slot="4223983131"
                    ></ins>
                  </div>
                </React.Fragment>
              ) : (
                <LocationCard key={location.id} info={location} index={index} />
              );
            })}
            <div className={styles.ad}>
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="fluid"
                data-ad-layout-key="-fh-2s+hd-1e-1gn"
                data-ad-client="ca-pub-7099980041278313"
                data-ad-slot="5483092474"
              ></ins>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
