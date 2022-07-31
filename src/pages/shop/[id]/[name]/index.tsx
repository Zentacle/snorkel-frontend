import React, { useEffect } from "react";
import Head from 'next/head';

import Breadcrumbs from "components/Breadcrumbs";
import Layout from "components/Layout/Layout";
import MaxWidth from "components/MaxWidth";
import { rootDomain } from "lib/constants";
import Beach from 'models/Beach';
import Shop from "models/Shop";
import ShopPageHero from "components/ShopPage/ShopPageHero";
import ShopDetails from "components/ShopPage/ShopDetails";
import Carousel from "components/Carousel/Carousel";
import styles from "./styles.module.css";

interface Context {
  params: {
    id: string;
    name: string;
  };
}

export async function getStaticProps(context: Context) {
  let shopData: any = fetch(`${rootDomain}/shop/get/${context.params.id}`);

  shopData = await shopData.then((res: any) => {
    if (res.status == 404) {
      return {
        errorCode: 404,
      }
    }
    return res.json();
  });

  if (!shopData.data || (shopData.data && shopData.data.errorCode)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      'shop': shopData.data,
    }, // will be passed to the page component as props
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const res = await fetch(`${rootDomain}/shop/get`);
  const data = await res.json();

  return {
    paths: data.data.map((shop: Shop) => ({
      params: {
        id: `${shop.id}`,
        name: `${shop.url}`,
      },
    })),
    fallback: "blocking",
  };
}

interface Props {
  shop: Shop;
}

function ShopPage(props: Props) {
  const { shop } = props;
  const [nearbyBeaches, setNearbyBeaches] = React.useState<Beach[]>([])

  useEffect(() => {
    let nearby = fetch(`${rootDomain}/spots/nearby?lat=${props.shop.latitude}&lng=${props.shop.longitude}`)
    nearby.then((res) => {
      return res.json()
    }).then(data => {
      setNearbyBeaches(data.data)
    })
  }, [props.shop.latitude, props.shop.longitude])

  const canonicalURL = `https://www.zentacle.com${props.shop.url}`;
  const description = props.shop.description;
  const pageTitle = `${props.shop.name} in ${props.shop.country_name} - Zentacle`

  return (
    <Layout>
      <Head>
        <title key="title">{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="og-title" />
        <meta property="og:description" content={description} key="og-description" />
        <meta property="og:image" content={props.shop.logo_img} key="og-image" />
        <meta property="og:url" content={canonicalURL} key="og-url" />
        <meta name="description" content={description} key="description" />
        <link rel="canonical" href={canonicalURL} key="canonical" />
        <meta name="apple-itunes-app" content={`app-id=1611242564, app-argument=${props.shop.url}`} key="apple-app"></meta>
      </Head>
      <MaxWidth>
        {/* <div className={`${styles.ad} ${styles.desktopOnly}`} key={shop.id}>
          <ins className="adsbygoogle"
            style={{
              display: 'block',
              minWidth: '300px',
              maxWidth: '970px',
              width: '100%',
              height: '90px',
            }}
            data-ad-client="ca-pub-7099980041278313"
            data-ad-slot="9831586937"></ins>
        </div> */}
        <Breadcrumbs
          country={shop.country}
          area_one={shop.area_one}
          area_two={shop.area_two}
          locality={shop.locality}
        />
        <ShopPageHero shop={shop} />
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <ShopDetails
              phone={shop.phone}
              address1={shop.address1}
              address2={shop.address2}
              hours={shop.hours}
              description={shop.description}
              city={shop.city}
              state={shop.state}
              country={shop.country_name}
              full_address={shop.full_address} />
          </div>
          <div className={styles.carouselSpacer}>
            <div className={styles.carouseltitle}>Dive Locations Nearby</div>
            <Carousel data={nearbyBeaches} allowVertical></Carousel>
          </div>
        </div>
      </MaxWidth>
    </Layout>
  );
}

export default ShopPage;
