import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "components/Home/Home.module.css";
import Beach from "models/Beach";
import Location from "models/Location";
import Layout from "components/Layout/Layout";
import LocationCard from "components/LocationCard";
import { rootDomain } from "src/lib/constants";
import { useCurrentUser } from "context/usercontext";
import useGoogleOneTap from "hooks/useGoogleOneTap";
import Breadcrumbs from "components/Breadcrumbs";
import BuddyCarousel from "components/BuddyCarousel";
import FilterBar from "components/FilterBar";
import Patron from "components/Patron";
import { sendEvent } from "hooks/amplitude";
import Expander from "icons/Expander";
import hasPatron from "lib/hasPatron";
import LinkifyText from "controls/LinkifyText";

interface Props {
  default: Beach[];
  area: Location & {
    hero_img?: string;
    num_spots?: number;
    num_shops?: number;
  };
  areas: (Location & {
    num_spots?: number;
    num_shops?: number;
  })[];
  geographicPath: string[];
  breadcrumbs: Array<{
    name: string;
    url: string;
    level: number;
  }>;
}

export async function getStaticProps(context: any) {
  const { geographicPath } = context.params;
  const path = geographicPath.join('/');

  // Use the new geographic API
  const res = await fetch(`${rootDomain}/loc/${path}`);

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const data = await res.json();
  const props: Partial<Props> = {};

  props.default = data.spots || [];
  props.area = data.area;
  props.geographicPath = geographicPath;

  // Generate breadcrumbs with new /geo/ prefix
  const breadcrumbs = [];
  let currentPath = '';

  for (let i = 0; i < geographicPath.length; i++) {
    currentPath += `/${geographicPath[i]}`;
    breadcrumbs.push({
      name: geographicPath[i], // In a real implementation, you'd fetch actual names
      url: `/geo${currentPath}`,
      level: i
    });
  }

  props.breadcrumbs = breadcrumbs;

  // Remove fetching child areas for navigation
  // const childAreasRes = await fetch(`${rootDomain}/loc/${path}/children`);
  // if (childAreasRes.ok) {
  //   const childAreasData = await childAreasRes.json();
  //   props.areas = childAreasData.data || [];
  // } else {
  //   props.areas = [];
  // }

  return {
    props,
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  // For now, return empty paths to use fallback
  // In production, you'd want to pre-generate common paths
  return {
    paths: [],
    fallback: 'blocking',
  };
}

const GeographicLocationPage = (props: Props) => {
  const [buddies, setBuddies] = React.useState([]);
  const [spots, setSpots] = React.useState(props.default);
  const [access, setAccess] = React.useState<string | undefined>(undefined);
  const [activity, setActivity] = React.useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = React.useState<string | undefined>(undefined);

  const { state } = useCurrentUser();
  const currentUser = state.user;

  React.useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, [props.area]);

  React.useEffect(() => {
    if (currentUser) {
      sendEvent("page_view", {
        type: "location",
        loc_type: "geographic",
        loc_name: props.area.short_name,
      });
    }
  }, [state, props.area.short_name]);

  React.useEffect(() => {
    setSpots(props.default);
  }, [props.default]);

  React.useEffect(() => {
    fetch(`${rootDomain}/buddy/get?geographic_node_id=${props.area.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBuddies(data.data);
      });
  }, [props.area]);

  React.useEffect(useGoogleOneTap(props.area.url, state.user), [state]);

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

  const title = `Top Snorkeling and Scuba Diving in ${props.area.name} | Zentacle - Reviews, Maps, and Photos`;
  const description = `Top scuba dive and snorkel spots in ${props.area.name} with maps, detailed reviews, and photos curated by oceans lovers like you.`;

  const fetchSpots = (params: { [key: string]: string | undefined }) => {
    const queryString = Object.keys(params)
      .filter((key) => params[key])
      .map((key) => key + "=" + params[key])
      .join("&");

    const path = props.geographicPath.join('/');
    fetch(`${rootDomain}/loc/${path}?${queryString}`)
      .then((res) => res.json().catch((err) => console.log(res)))
      .then((data) => setSpots(data.spots || []));
  };

  React.useEffect(() => {
    fetchSpots({
      limit: "100",
      sort: "top",
      difficulty: difficulty,
      entry: access,
    });
  }, [difficulty, access, props.geographicPath]);

  return (
    <Layout>
      <Head>
        <title key="title">{title}</title>
        <meta property="og:title" content={title} key="og-title" />
        <meta
          property="og:description"
          content={description}
          key="og-description"
        />
        <meta property="og:image" content={props.area.hero_img} key="og-image" />
        <meta property="og:url" content={`https://www.zentacle.com${props.area.url}`} key="og-url" />
        <meta name="description" content={description} key="description" />
        <link rel="canonical" href={`https://www.zentacle.com${props.area.url}`} key="canonical" />
      </Head>

      <div className={styles.container}>
        <Breadcrumbs
          breadcrumbs={props.breadcrumbs}
          area={props.area}
        />

        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Top Snorkeling and Scuba Diving in {props.area.name}
            </h1>
            <p className={styles.heroDescription}>
              {props.area.description || `Discover the best scuba dive and snorkel spots in ${props.area.name} with maps, detailed reviews, and photos curated by ocean lovers like you.`}
            </p>
          </div>
        </div>

        <FilterBar
          access={access}
          setAccess={setAccess}
          activity={activity}
          setActivity={setActivity}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        <div className={styles.contentSection}>
          <div className={styles.spotsGrid}>
            {spots.map((beach: Beach, index: number) => (
              <LocationCard key={beach.id} info={beach} index={index} />
            ))}
          </div>

          {/* Removed child areas section for now */}
          {/* {props.areas && props.areas.length > 0 && (
            <div className={styles.childAreasSection}>
              <h2>Explore {props.area.name}</h2>
              <div className={styles.areasGrid}>
                {props.areas.map((area) => (
                  <Link key={area.id} href={area.url}>
                    <a className={styles.areaCard}>
                      <h3>{area.name}</h3>
                      <p>{area.num_spots || 0} spots • {area.num_shops || 0} shops</p>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )} */}

          {buddies && buddies.length > 0 && (
            <BuddyCarousel buddies={buddies} loc="geographic" />
          )}
        </div>

        <Patron
          areaPatronKey={[props.geographicPath[0], props.geographicPath[1]]}
          className={styles.patronSection}
          name={props.area.name}
        />
      </div>
    </Layout>
  );
};

export default GeographicLocationPage;