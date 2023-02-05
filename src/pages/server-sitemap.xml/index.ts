// pages/server-sitemap.xml/index.tsx

import Beach from "models/Beach";
import Location from "models/Location";
import User from "models/User";
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from 'next-sitemap'

const escapeForXML = (text: string) => text.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  let res = await fetch('https://zentacle.com/api/spots/get?limit=none')
  let data = await res.json()

  const spot_fields = data.data.map((location: Beach) => {
    const data: any = {
        loc: `https://www.zentacle.com${location.url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.7,
      }
    if (location.hero_img) {
      data["image:image"] = `
        <image:loc>${escapeForXML(location.hero_img)}</image:loc>
        <image:title>${escapeForXML(location.name)}</image:title>
        <image:caption>${escapeForXML(location.description)}</image:caption>
      `
    }
    return data;
  })

  res = await fetch('https://zentacle.com/api/users/all?top=true')
  data = await res.json()

  const user_fields = data.data.filter((user: User) => user.username).map((user: User) => (
    {
      loc: `https://www.zentacle.com/user/${user.username}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.2,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/country?limit=none')
  data = await res.json()

  const country_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/area_one?limit=none')
  data = await res.json()

  const area_one_fields = data.data.map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/area_two?limit=none')
  data = await res.json()

  const area_two_fields = data.data.filter((location: Location) => location.url).map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }
  ))

  res = await fetch('https://zentacle.com/api/locality/locality?limit=none')
  data = await res.json()

  const locality_fields = data.data.filter((location: Location) => location.url).map((location: Location) => (
    {
      loc: `https://www.zentacle.com${location.url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.5,
    }
  ))

  return getServerSideSitemap(ctx, [
    ...spot_fields,
    ...user_fields,
    ...country_fields,
    ...area_one_fields,
    ...area_two_fields,
    ...locality_fields,
  ])
}

const SitemapNullComponent = () => { }
// Default export to prevent next.js errors
export default SitemapNullComponent;
