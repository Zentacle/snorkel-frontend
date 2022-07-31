import Link from 'next/link';

import Layout from 'components/Layout/Layout';
import { rootDomain } from 'lib/constants';
import Shop from 'models/Shop';
import styles from './styles.module.css';
import Head from 'next/head';

export const getStaticProps = async (ctx: any) => {
  // Method to source urls from cms
  let res: any = fetch(`${rootDomain}/shop/get?limit=none`)

  res = await res.then((res: any) => res.json())
  const shops = res.data;

  return {
    props: {
      shops,
    },
    'revalidate': 86400,
  }
}

interface Props {
  shops: Shop[];
}

// Default export to prevent next.js errors
const Directory = (props: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">Directory - Regions | Zentacle</title>
          <meta
            name="description"
            content="View the full directory of all the scuba diving and snorkel regions around the world available on Zentacle"
            key="description"
          />
          <meta
            property="og:description"
            content="View the full directory of all the scuba diving and snorkel regions around the world available on Zentacle"
            key="og:description"
          />
        </Head>
        <div className={styles.container}>
          <h1 className={styles.title}>Regions Directory</h1>
          <div className={styles.locationsContainer}>
            {
              props.shops.map((shop: Shop) => (
                <div className={styles.link} key={shop.url}>
                  <Link href={shop.url} prefetch={false}>
                    <a>{shop.name} <span className={styles.city}>({shop.state || shop.city}, {shop.country_name})</span></a>
                  </Link>
                </div>
              ))
            }
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Directory;
