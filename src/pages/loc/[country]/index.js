import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import styles from "components/Home/Home.module.css"
import locStyles from './styles.module.css';
import Layout from 'components/Layout/Layout';
import LocationCard from 'components/LocationCard';
import { rootDomain } from "src/lib/constants";
import { useCurrentUser } from 'context/usercontext';
import useGoogleOneTap from "hooks/useGoogleOneTap";
import Breadcrumbs from 'components/Breadcrumbs';
import BuddyCarousel from 'components/BuddyCarousel';
import Patron from 'components/Patron';
import { sendEvent } from 'hooks/amplitude';

export async function getStaticProps(context) {
  const country = context.params.country;
  const props = {};
  let res;
  res = await fetch(
    `${rootDomain}/spots/get?sort=top&country=${country}&limit=100`
  )
  const data = await res.json().catch(err => console.log(res))
  props['default'] = data.data || null;
  if (data.area) {
    props['area'] = data.area;
  }

  if (!props.default) {
    return {
      notFound: true,
    }
  }

  props['loc'] = 'country'
  props['country'] = country

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  const res = await fetch(`${rootDomain}/locality/country`)
  const data = await res.json()
  return {
    paths: data.data.map(loc => ({
      params: {
        country: loc.short_name,
      }
    })),
    fallback: 'blocking',
  }
}

const getPillLocalityLevel = {
  'country': 'area_one',
  'area_one': 'area_two',
  'area_two': 'locality',
  'locality': 'locality',
}

const Home = (props) => {
  const [areas, setAreas] = React.useState([]);
  const [buddies, setBuddies] = React.useState([]);
  const { state } = useCurrentUser();

  React.useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) { }
    }
  }, [props.area]);

  React.useEffect(() => {
    const currentUser = state.user;
    if (currentUser) {
      sendEvent('page_view', {
        type: 'location',
        loc_type: props.loc,
        loc_name: props.area.short_name,
      });
    }
  }, [state, props.loc, props.area.short_name])

  React.useEffect(() => {
    const localityType = getPillLocalityLevel[props.loc];
    let url = `${rootDomain}/locality/${localityType}`
    if (props.country) {
      url += `?country=${props.country}`
    }
    if (props.area_one) {
      url += `&area_one=${props.area_one}`
    }
    if (props.area_two) {
      url += `&area_two=${props.area_two}`
    }
    fetch(url).then(res =>
      res.json()
    ).then(data => {
      setAreas(data.data);
    })

    fetch(`${rootDomain}/buddy/get?${props.loc}=${props.area.id}`).then(res => 
      res.json()
    ).then(data => {
      setBuddies(data.data);
    })
  }, [props.area, props.country, props.area_one, props.area_two, props.loc])

  React.useEffect(useGoogleOneTap(props.area.url, state.user), [state])

  const isBigIsland = (
    props.area.short_name == 'big-island'
    || (
      props.area_two
      && props.area_two.short_name == 'big-island'
    )
  )

  const isMaui = (
    props.area.short_name == 'maui'
    || (
      props.area_two
      && props.area_two.short_name == 'maui'
    )
  )

  const isOahu = (
    props.area.short_name == 'oahu'
    || (
      props.area_two
      && props.area_two.short_name == 'oahu'
    )
  )

  let areaPatronKey = null;
  if (props.loc === 'locality') {
    areaPatronKey = props.area_two.short_name;
  } else if (props.loc === 'area_two') {
    areaPatronKey = props.area.short_name
  }

  const hasPatron = isMaui || isBigIsland || isOahu;

  const title = `Top Snorkeling and Scuba Diving in ${props.area.name} | Zentacle - Reviews, Maps, and Photos`;
  const description = `Top scuba dive and snorkel spots in ${props.area.name} with maps, detailed reviews, and photos curated by oceans lovers like you.`

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="og:title" />
        <meta property="og:description" content={description} key="og:description" />
        <meta property="og:image" content="https://www.zentacle.com/social_background_v2.jpg" key="og:image" />
        <meta name="description" content={description} key="description" />
        {props.area.url && <link rel="canonical" href={`https://www.zentacle.com${props.area.url}`} />}
      </Head>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.marginContainer}>
            <Breadcrumbs
              country={props.area.country}
              area_one={props.area.area_one}
              area_two={props.area.area_two}
            />
          </div>
          {areas.length
            ? <div className={`${styles.locationContainer} ${locStyles.locationContainer}`}>
              {areas.map(area => (
                <Link key={area.short_name} href={area.url}>
                  <a className={`${styles.location} ${props.area.short_name === area.short_name && styles.active}`}>
                    {area.name}
                  </a>
                </Link>)
              )}
            </div>
            : <></>
          }
          <h1 className={styles.areaTitle}>Top Snorkeling and Scuba Diving in {props.area.name}</h1>
          <div className={styles.marginContainer}>
            Ready to check out the best sites in {props.area.name} for scuba diving, snorkeling, shore diving, free diving or other ocean activities? Zentacle has {props.default.length} dive sites, snorkel spots, beaches, and more. Discover hand-curated maps, along with reviews and photos from nature lovers like you.
            {'\n\n'}
            No matter what you&apos;re looking for, you can find a diverse range of the best ocean activities in {props.area.name} to suit your needs.
            {props.area.description && '\n\n'}
            {props.area.description}
          </div>
          {props.area.map_image_url &&
            <Link href="/explore">
              <a className={styles.mapImageContainer}>
                <div className={styles.mapExpander}>
                  <svg width="16" height="16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M64 4C64 2.93913 63.5786 1.92172 62.8284 1.17157C62.0783 0.421428 61.0609 0 60 0H40C38.9391 0 37.9217 0.421428 37.1716 1.17157C36.4214 1.92172 36 2.93913 36 4C36 5.06087 36.4214 6.07828 37.1716 6.82843C37.9217 7.57857 38.9391 8 40 8H50.28L37.16 21.16C36.7851 21.5319 36.4875 21.9743 36.2844 22.4617C36.0814 22.9491 35.9768 23.472 35.9768 24C35.9768 24.528 36.0814 25.0509 36.2844 25.5383C36.4875 26.0257 36.7851 26.4681 37.16 26.84C37.5319 27.2149 37.9743 27.5125 38.4617 27.7156C38.9491 27.9186 39.472 28.0232 40 28.0232C40.528 28.0232 41.0509 27.9186 41.5383 27.7156C42.0257 27.5125 42.4681 27.2149 42.84 26.84L56 13.68V24C56 25.0609 56.4214 26.0783 57.1716 26.8284C57.9217 27.5786 58.9391 28 60 28C61.0609 28 62.0783 27.5786 62.8284 26.8284C63.5786 26.0783 64 25.0609 64 24V4ZM26.84 37.16C26.4681 36.7851 26.0257 36.4875 25.5383 36.2844C25.0509 36.0814 24.528 35.9768 24 35.9768C23.472 35.9768 22.9491 36.0814 22.4617 36.2844C21.9743 36.4875 21.5319 36.7851 21.16 37.16L8 50.28V40C8 38.9391 7.57857 37.9217 6.82843 37.1716C6.07828 36.4214 5.06087 36 4 36C2.93913 36 1.92172 36.4214 1.17157 37.1716C0.421428 37.9217 0 38.9391 0 40V60C0 61.0609 0.421428 62.0783 1.17157 62.8284C1.92172 63.5786 2.93913 64 4 64H24C25.0609 64 26.0783 63.5786 26.8284 62.8284C27.5786 62.0783 28 61.0609 28 60C28 58.9391 27.5786 57.9217 26.8284 57.1716C26.0783 56.4214 25.0609 56 24 56H13.68L26.84 42.84C27.2149 42.4681 27.5125 42.0257 27.7156 41.5383C27.9186 41.0509 28.0232 40.528 28.0232 40C28.0232 39.472 27.9186 38.9491 27.7156 38.4617C27.5125 37.9743 27.2149 37.5319 26.84 37.16V37.16Z" fill="black" />
                  </svg>
                </div>
                <Image
                  src={props.area.map_image_url}
                  className={styles.mapImage}
                  objectFit="contain"
                  height="300"
                  width="600"
                  alt={`${props.area.name} dive site map`}
                />
              </a>
            </Link>
          }
          {
            buddies.length
              ? <BuddyCarousel
                  buddies={buddies}
                  loc={props.area.short_name}
                />
              : <></>
          }
          {
            hasPatron && <Patron areaPatronKey={areaPatronKey} name={props.area.name} />
          }
          <div className={styles.homeAd} key={props.area}>
            <ins className="adsbygoogle"
              style={{
                display: 'block',
                minWidth: '300px',
                maxWidth: '970px',
                width: '100%',
                height: '90px',
                margin: '16px auto',
              }}
              data-ad-client="ca-pub-7099980041278313"
              data-ad-slot="5284949215"></ins>
          </div>
          <div>
            {
              props.default.map((location, index) => {
                return (index + 1) % 7 == 0
                  ? (
                    <>
                      <LocationCard key={location.id} info={location} index={index} />
                      {
                        //<!-- region listing -->
                      }
                      <div className={`${styles.ad} ${styles.inFeedAdDesktop}`}>
                        <ins className={`adsbygoogle`}
                          style={{ display: 'block' }}
                          data-ad-format="fluid"
                          data-ad-layout-key="-fh-2s+hd-1e-1gn"
                          data-ad-client="ca-pub-7099980041278313"
                          data-ad-slot="8488292082"></ins>
                      </div>
                      <div className={`${styles.ad} ${styles.inFeedAdMobile}`}>
                        <ins className={`adsbygoogle`}
                          style={{ display: 'block' }}
                          data-ad-format="fluid"
                          data-ad-layout-key="-6d+e4+4h-78+7"
                          data-ad-client="ca-pub-7099980041278313"
                          data-ad-slot="4223983131"></ins>
                      </div>
                    </>
                  )
                  : (
                    <LocationCard key={location.id} info={location} index={index} />
                  )
              })
            }
            <div className={styles.ad}>
              <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-format="fluid"
                data-ad-layout-key="-fh-2s+hd-1e-1gn"
                data-ad-client="ca-pub-7099980041278313"
                data-ad-slot="5483092474"></ins>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home;
