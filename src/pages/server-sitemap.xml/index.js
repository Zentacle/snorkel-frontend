// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async (ctx) => {
  // Method to source urls from cms
  let res = await fetch('https://zentacle.com/api/spots/get?limit=none')
  let data = await res.json()

  const spot_fields = data.data.map(location => (
    {
      loc: `https://www.zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/getall?top=true')
  data = await res.json()

  const user_fields = data.data.filter(user => user.username).map(user => (
    {
      loc: `https://www.zentacle.com/user/${user.username}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.2,
    }
  ))

  return getServerSideSitemap(ctx, [...spot_fields, ...user_fields])
}

const SitemapNullComponent = () => {}
// Default export to prevent next.js errors
export default SitemapNullComponent;
