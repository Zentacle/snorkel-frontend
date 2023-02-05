// pages/sitemap-shop.xml/index.tsx
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from 'next-sitemap'

import Location from "models/Location";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  let res = await fetch('https://zentacle.com/api/shop/get?limit=none')
  let data = await res.json()

  const shop_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.5,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/country?limit=none&shops=true')
  data = await res.json()

  const country_shop_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}/shop`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/area_one?limit=none&shops=true')
  data = await res.json()

  const area_one_shop_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}/shop`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/area_two?limit=none&shops=true')
  data = await res.json()

  const area_two_shop_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}/shop`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/locality?limit=none&shops=true')
  data = await res.json()

  const locality_shop_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}/shop`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  return getServerSideSitemap(ctx, [
    ...shop_fields,
    ...country_shop_fields,
    ...area_one_shop_fields,
    ...area_two_shop_fields,
    ...locality_shop_fields,
  ])
}

const SitemapNullComponent = () => { }
// Default export to prevent next.js errors
export default SitemapNullComponent;
