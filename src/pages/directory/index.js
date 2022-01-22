import Link from 'next/link';

import Layout from 'components/Layout/Layout';
import { rootDomain } from 'lib/constants';
import styles from './styles.module.css';
import Head from 'next/head';

export const getStaticProps = async (ctx) => {
  // Method to source urls from cms
  const res = await fetch(`${rootDomain}/spots/get?limit=none`)
  const data = await res.json()

  const fields = data.data.map(location => (
    {
      url: `https://www.zentacle.com${location.url}`,
      name: location.name,
      city: location.location_city,
    }
  ))

  return {
    props: {
      'data': fields,
    },
    'revalidate': 86400,
  }
}

// Default export to prevent next.js errors
const Directory = ({ data }) => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">Directory - Dive and Snorkel Spots | Zentacle</title>
          <meta
            name="description"
            content="View the full directory of all the scuba diving and snorkel locations around the world available on Zentacle"
            key="description"
          />
          <meta
            property="og:description"
            content="View the full directory of all the scuba diving and snorkel locations around the world available on Zentacle"
            key="og:description"
          />
        </Head>
        <div className={styles.container}>
          <h1 className={styles.title}>Locations Directory</h1>
          <div className={styles.locationsContainer}>
            {
              data.map(location => (
                <div className={styles.link} key={location.url}>
                  <Link href={location.url} prefetch={false}>
                    <a>{location.name} ({location.city})</a>
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
