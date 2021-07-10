import React from "react";
import Head from 'next/head';
import Image from "next/image"

import styles from "components/Home/Home.module.css"
import SearchBar from "components/SearchBar"
import Layout from 'components/Layout/Layout';
import MyCarousel from "components/Carousel/Carousel"
import { rootDomain } from "src/lib/constants";

export async function getServerSideProps(context) {
  const sorts = ['top', 'latest', 'default']
  const props = {};
  await Promise.all(sorts.map(async sort => {
    let res = await fetch(`${rootDomain}/spots/get?sort=${sort}`,)
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
        <meta property="og:title" content="DiveBriefing" key="title" />
        <meta property="og:description" content="Search dive and snorkel spots around the world with maps, detailed reviews, and photos curated by oceans lovers like you." key="description" />
        <meta property="og:image" content="https://divebriefing.vercel.app/social_background.png" key="image" />
      </Head>
      <div className={styles.container}>
        <div className={styles.image}>
          <div className={styles.imageinner}>
            <Image className={styles.actualimage} height='300' width='720' objectFit="contain" alt="hero" src="/homepageimg.jpeg">
            </Image>
          </div>
          <div className={styles.pagetitle}>Whats the viz?</div>
          <div className={styles.menu}>

            <SearchBar></SearchBar>
          </div>
        </div>
        <div>
          <div className={styles.carouseltitle}>Local Favorites in Maui</div>
          <MyCarousel data={ props.default }></MyCarousel>
        </div>
        <div>
          <div className={styles.carouseltitle}>Viz Reported Recently</div>
          <MyCarousel data={ props.latest }></MyCarousel>
        </div>
        <div>
          <div className={styles.carouseltitle}>Top Rated in Maui</div>
          <MyCarousel data={ props.top }></MyCarousel>
        </div>
      </div>
    </Layout>
  )
}
