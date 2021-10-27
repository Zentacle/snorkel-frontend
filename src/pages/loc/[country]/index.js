import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import styles from "components/Home/Home.module.css"
import Layout from 'components/Layout/Layout';
import LocationCard from 'components/LocationCard';
import { rootDomain } from "src/lib/constants";
import { useCurrentUser } from 'context/usercontext';
import useGoogleOneTap from "hooks/useGoogleOneTap";
import Breadcrumbs from 'components/Breadcrumbs';
import Patron from 'components/Patron';
import { sendEvent } from 'hooks/amplitude';

export async function getStaticProps(context) {
  const country = context.params.country;
  const props = {};
  let res;
  res = await fetch(
    `${rootDomain}/spots/get?sort=top&country=${country}&limit=100`
  )
  const data = await res.json()
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
  const { state } = useCurrentUser();

  React.useEffect(() => {
    const currentUser = state.user;
    if (currentUser) {
        sendEvent('page_view', {
            type: 'location',
            loc_type: getPillLocalityLevel[props.loc],
            loc_name: props.area.short_name,
        });
    }
  }, [state])

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
      setAreas(data.data)
    })
  }, [props.area])

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

  let areaPatronKey = null;
  if (props.loc === 'locality') {
    areaPatronKey = props.area_two.short_name;
  } else if (props.loc === 'area_two') {
    areaPatronKey = props.area.short_name
  }

  const hasPatron = isMaui || isBigIsland;

  const title = `Top Snorkel and Scuba Dive Sites in ${props.area.name} | Zentacle - Reviews, Maps, and Photos`;
  const description = `Top scuba dive and snorkel spots in ${props.area.name} with maps, detailed reviews, and photos curated by oceans lovers like you.`

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="og:title" />
        <meta property="og:description" content={description} key="og:description" />
        <meta property="og:image" content="https://www.zentacle.com/social_background_v2.jpg" key="og:image" />
        <meta name="description" content={description} key="description" />
        {props.area.url && <link rel="canonical" href={`https://www.zentacle.com${props.area.url}`}/>}
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
          { areas.length
            ? <div className={styles.locationContainer}>
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
            {props.area.description}
          </div>
          {
              hasPatron && <Patron areaPatronKey={areaPatronKey} name={props.area.name}/>
          }
          <div>
            {
              props.default.map(location => (
                <LocationCard key={location.id} info={location}/>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home;
