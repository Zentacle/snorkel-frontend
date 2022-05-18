import Link from 'next/link';

import Layout from 'components/Layout/Layout';
import { rootDomain } from 'lib/constants';
import styles from './styles.module.css';
import Head from 'next/head';

export const getStaticProps = async (ctx) => {
  // Method to source urls from cms
  let res = fetch(`${rootDomain}/locality/area_one?limit=none`)
  let res1 = fetch(`${rootDomain}/locality/area_two?limit=none`)
  let res2 = fetch(`${rootDomain}/locality/locality?limit=none`)

  res = await res.then(res => res.json())
  const area_one = res.data.filter(location => location.url).map(location => (
    {
      url: `https://www.zentacle.com${location.url}`,
      name: location.name,
    }
  ))

  res1 = await res1.then(res1 => res1.json())
  const area_two = res1.data.filter(location => location.url).map(location => (
    {
      url: `https://www.zentacle.com${location.url}`,
      name: location.name,
    }
  ))

  res2 = await res2.then(res2 => res2.json())
  const locality = res2.data.filter(location => location.url).map(location => (
    {
      url: `https://www.zentacle.com${location.url}`,
      name: location.name,
    }
  ))

  return {
    props: {
      area_one,
      area_two,
      locality,
    },
    'revalidate': 86400,
  }
}

// Default export to prevent next.js errors
const Directory = ({
  area_one,
  area_two,
  locality
}) => {
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
              area_one.map(location => (
                <div className={styles.link} key={location.url}>
                  <Link href={location.url} prefetch={false}>
                    <a>{location.name}</a>
                  </Link>
                </div>
              ))
            }
            {
              area_two.map(location => (
                <div className={styles.link} key={location.url}>
                  <Link href={location.url} prefetch={false}>
                    <a>{location.name}</a>
                  </Link>
                </div>
              ))
            }
            {
              locality.map(location => (
                <div className={styles.link} key={location.url}>
                  <Link href={location.url} prefetch={false}>
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
