// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async (ctx) => {
  // Method to source urls from cms
  let res = await fetch('https://zentacle.com/api/spots/get?limit=none')
  let data = await res.json()

  const spot_fields = data.data
  .filter(location => (
    location.sd_url
  ))
  .map(location => (
    {
      loc: `https://www.shorediving.com${location.sd_url}/index.htm`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }
  ))

  return getServerSideSitemap(ctx, spot_fields)
}

const ShoreDivingSitemapNullComponent = () => {}
// Default export to prevent next.js errors
export default ShoreDivingSitemapNullComponent;
