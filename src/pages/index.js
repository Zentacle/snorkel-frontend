import React, { useEffect } from "react";
import Head from 'next/head';
import Image from "next/image"

import styles from "components/Home/Home.module.css"
import SearchBar from "components/SearchBar"
import Layout from 'components/Layout/Layout';
import Carousel from "components/Carousel/Carousel"
import { rootDomain } from "src/lib/constants";

export async function getServerSideProps(context) {
  const sorts = ['top', 'latest', 'default', 'recs']
  const props = {};
  await Promise.all(sorts.map(async sort => {
    let res;
    if (sort === 'recs') {
      res = await fetch(`${rootDomain}/spots/recs`, {
        headers: context.req ? { cookie: context.req.headers.cookie } : undefined
      })
    } else {
      res = await fetch(`${rootDomain}/spots/get?sort=${sort}`,)
    }
    
    const data = await res.json()
    props[sort] = data.data;
    return data;
  }))

  if (!props.default) {
    return {
      notFound: true,
    }
  }

  return {
    props, // will be passed to the page component as props
  }
}

// '/' route
export default function Home(props) {
  return (
    <Layout>
      <Head>
        <meta property="og:title" content="Zentacle - Scuba and Snorkel Reviews" key="title" />
        <meta property="og:description" content="Search dive and snorkel spots around the world with maps, detailed reviews, and photos curated by oceans lovers like you." key="description" />
        <meta property="og:image" content="https://www.zentacle.com/social_background.jpg" key="image" />
      </Head>
      <div className={styles.container}>
        <div className={styles.image}>
          <div className={styles.imageinner} style={{ 'backgroundImage': `url(\'/hero.jpg\')`}}>
            <div className={styles.pagetitle}>Find your next underwater adventure</div>
          </div>
          <div className={styles.menu}>

            <SearchBar></SearchBar>
          </div>
        </div>
        { props.recs && Object.keys(props.recs).length > 0 && <div>
          <div className={styles.carouseltitle}>Recommended Locations (Rate spots to personalize!)</div>
          <Carousel data={ props.recs }></Carousel>
        </div>}
        <div>
          <div className={styles.carouseltitle}>Local Favorites in Maui</div>
          <Carousel data={ props.default }></Carousel>
        </div>
        <div>
          <div className={styles.carouseltitle}>Conditions Reported Recently</div>
          <Carousel data={ props.latest }></Carousel>
        </div>
        <div>
          <div className={styles.carouseltitle}>Top Rated in Maui</div>
          <Carousel data={ props.top }></Carousel>
        </div>
      </div>
    </Layout>
  )
}
