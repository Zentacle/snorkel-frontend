import Link from 'next/link';

import Layout from 'components/Layout/Layout';
import { rootDomain } from 'lib/constants';
import styles from './styles.module.css';

export const getServerSideProps = async (ctx) => {
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
    }
  }
}

// Default export to prevent next.js errors
const Directory = ({ data }) => {
  return (
    <Layout>
      <div className={ styles.container }>
        <h1 className={ styles.title }>Locations Directory</h1>
        {
          data.map(location => (
            <div className={ styles.link } key={location.url}>
              <Link href={location.url}>
                <a>{location.name} ({location.city})</a>
              </Link>
            </div>
          ))
        }
      </div>
    </Layout>
  )
}

export default Directory;
