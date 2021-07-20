// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async (ctx) => {
  // Method to source urls from cms
  const res = await fetch('https://zentacle.com/api/spots/get')
  const data = await res.json()

  const fields = data.data.map(location => (
    {
      loc: `https://zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }
  ))

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default () => {}
