import Link from 'next/link';

import Layout from 'components/Layout/Layout';
import { rootDomain } from 'lib/constants';
import styles from './styles.module.css';
import Head from 'next/head';

export const getStaticProps = async (ctx) => {
  // Method to source urls from cms
  const res = await fetch(`${rootDomain}/locality/area_one?limit=none`)
  const data = await res.json()

  const fields = data.data.filter(location => location.url).map(location => (
    {
      url: `https://www.zentacle.com${location.url}`,
      name: location.name,
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
      <Head>
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
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.title}>Locations Directory</h1>
          <div className={styles.locationsContainer}>
            {
              data.map(location => (
                <div className={styles.link} key={location.url}>
                  <Link href={location.url}>
                    <a>{location.name}</a>
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
