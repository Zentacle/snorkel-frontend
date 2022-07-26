import Breadcrumbs from "components/Breadcrumbs";
import Layout from "components/Layout/Layout";
import MaxWidth from "components/MaxWidth";
import { rootDomain } from "lib/constants";
import Shop from "models/Shop";
import React, { useEffect } from "react";
import styles from "../../../Beach/[[...slug]]/styles.module.css";
import ShopPageHero from "components/ShopPage/ShopPageHero";
import ShopDetails from "components/ShopPage/ShopDetails";
import Carousel from "components/Carousel/Carousel";

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
        name: `${shop.url_name}`,
      },
    })),
    fallback: "blocking",
  };
}

function ShopPage(props: any) {
  const [shop, setShop] = React.useState(props.shop);
  const [nearbyBeaches, setNearbyBeaches] = React.useState([])

  useEffect(() => {
    let nearby = fetch(`${rootDomain}/spots/nearby?lat=${props.shop.latitude}&lng=${props.shop.longitude}`)
    nearby.then((res) => {
      return res.json()
    }).then(data => {
      setNearbyBeaches(data.data)
    })
  }, [props.shop.latitude, props.shop.longitude])

  return (
    <Layout>
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
        <ShopPageHero shop={shop}/>
        <ShopDetails
          phone={shop.phone}
          address1={shop.address1}
          address2={shop.address2}
          hours={shop.hours}
          description={shop.description}
          city={shop.city}
          state={shop.state}
          country={shop.country_name}
          full_address={shop.full_address}/>
        <div className={styles.carouseltitle}>Other Locations Nearby</div>
        <Carousel data={nearbyBeaches} allowVertical></Carousel>
      </MaxWidth>
    </Layout>
  );
}

export default ShopPage;
