import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { SelectMenu } from 'evergreen-ui'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import styles from "components/Home/Home.module.css"
import SearchBar from "components/SearchBar"
import Layout from 'components/Layout/Layout';
import Carousel from "components/Carousel/Carousel"
import { rootDomain } from "src/lib/constants";
import Banner from "components/EmailBanner";
import Cookies from "js-cookie";
import { useCurrentUser } from 'context/usercontext';
import useGoogleOneTap from "hooks/useGoogleOneTap";
import { useRouter } from "next/router";
import MaxWidth from "components/MaxWidth";

export async function getStaticProps(context) {
  const sorts = ['top', 'latest', 'default']
  const props = {};
  await Promise.all(sorts.map(async sort => {
    let res;
    res = await fetch(`${rootDomain}/spots/get?sort=${sort}`,)

    const data = await res.json()
    props[sort] = data.data || null;
    return data;
  }))

  if (!props.default) {
    return {
      notFound: true,
    }
  }

  props['area'] = {
    'name': 'Maui',
  }

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  }
}

// '/' route
const Home = (props) => {
  const [shouldShowBanner, setShouldShowBanner] = React.useState(false);
  const [recs, setRecs] = React.useState(null);
  const { state } = useCurrentUser();

  React.useEffect(() => {
    setShouldShowBanner(!(Cookies.get('has_seen_banner') || Cookies.get('csrf_access_token')));

    if (document.referrer.match(/^https?:\/\/([^\/]+\.)?google\.com(\/|$)/i)) {
      setShouldShowBanner(false);
    }
  }, [])

  React.useEffect(() => {
    if (!state.user) { return }
    fetch(`${rootDomain}/spots/recs`).then(res =>
      res.json()
    ).then(data => {
      setRecs(data.data)
    })
  }, [state.user])

  React.useEffect(useGoogleOneTap('/', state.user), [state])

  let title = "Zentacle - Snorkel and Scuba Diving Reviews, Maps, and Photos"
  if (props.area.name && props.area.name !== 'Maui') {
    title = `Zentacle - ${props.area.name} - Snorkel and Scuba Diving Reviews, Maps, and Photos`;
  }

  const [selected, setSelected] = React.useState(null)
  const router = useRouter();

  React.useEffect(() => {
    const initializeMap = () => {
      var locations = props.default;

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: new google.maps.LatLng(20.83674343601845, -156.4178040410507),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
  
      var infowindow = new google.maps.InfoWindow();
  
      var marker, i;
  
      for (i = 0; i < locations.length; i++) {  
        console.log(locations.latitude)
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
          map: map
        });
  
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i].name);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }
    }
    const script = document.createElement('script')
    script.src = 'https://maps.google.com/maps/api/js?key=AIzaSyAPbvPcOMVp6qdWP59cML7kmYd2ShEGu_Y&sensor=false'
    script.onload = setTimeout(initializeMap, 1000)
    script.async = true;
    document.querySelector('body').appendChild(script)
  }, [])
  
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="og:title" />
        <meta property="og:description" content="Search dive and snorkel spots around the world with maps, detailed reviews, and photos curated by oceans lovers like you." key="og:description" />
        <meta property="og:image" content="https://www.zentacle.com/social_background_v2.jpg" key="og:image" />
        <meta name="description" content="Search dive and snorkel spots around the world with maps, detailed reviews, and photos curated by oceans lovers like you." key="description" />
      </Head>
      <div className={styles.container}>
        <div className={styles.image}>
          <div className={styles.imageinner} style={{ 'backgroundImage': `url(\'/hero.jpg\')` }}>
            <h1 className={styles.pagetitle}>Find your next underwater adventure</h1>
          </div>
          <div className={styles.menu}>
            <SearchBar></SearchBar>
          </div>
        </div>
        <Banner isShown={shouldShowBanner}></Banner>
        <MaxWidth>
          <SelectMenu
            title="Select location"
            options={[{ label: 'Maui', value: "maui" }, { label: 'Big Island', value: "big-island" }]}
            selected={selected}
            onSelect={(item) => router.push(`/loc/us/hi/${item.value}`)}
          >
            <div id="map" className={styles.googleMap}></div>
            <div className={styles.areaDropdown}>
              <h1 className={styles.areaTitle}>{props.area.name}</h1>
              <ArrowDropDownIcon />
            </div>
          </SelectMenu>
          {recs && Object.keys(recs).length > 0 && <div>
            <div className={styles.carouseltitle}>Recommended Locations (Rate spots to personalize!)</div>
            <Carousel data={recs}></Carousel>
          </div>}
          <div>
            <h2 className={styles.carouseltitle}>{`Local Snorkel and Scuba Favorites in ${props.area.name}`}</h2>
            <Carousel data={props.default}></Carousel>
          </div>
          <div>
            <h2 className={styles.carouseltitle}>{`Top Rated Snorkel and Scuba in ${props.area.name}`}</h2>
            <Carousel data={props.top}></Carousel>
          </div>
          <div>
            <div className={styles.carouseltitle}>Conditions Reported Recently</div>
            <Carousel data={props.latest}></Carousel>
          </div>
        </MaxWidth>
      </div>
    </Layout>
  )
}

export default Home;
