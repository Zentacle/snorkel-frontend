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
  const start_date = new Date()
  return Promise.all([
    fetch('https://zentacle.com/api/spots/get?limit=none').then((res) => res.json()),
    fetch('https://zentacle.com/api/users/all?top=true').then((res) => res.json()),
    fetch('https://zentacle.com/api/locality/country?limit=none').then((res) => res.json()),
    fetch('https://zentacle.com/api/locality/area_one?limit=none').then((res) => res.json()),
    fetch('https://zentacle.com/api/locality/area_two?limit=none').then((res) => res.json()),
    fetch('https://zentacle.com/api/locality/locality?limit=none').then((res) => res.json()),
    fetch('https://zentacle.com/api/shop/get?limit=none').then((res) => res.json()),
    fetch('https://zentacle.com/api/locality/country?limit=none&shops=true').then((res) => res.json()),
    fetch('https://zentacle.com/api/locality/area_one?limit=none&shops=true').then((res) => res.json()),
  ]).then(([spots, users, countries, area_ones, area_twos, localities, shops, country_shops, area_one_shops]) => {
    const spot_fields = spots.data.map((location: Beach) => {
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
    const user_fields = users.data.filter((user: User) => user.username).map((user: User) => (
      {
        loc: `https://www.zentacle.com/user/${user.username}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.2,
      }
    ))
    const country_fields = countries.data.map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    ))
    const area_one_fields = area_ones.data.map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    ))
    const area_two_fields = area_twos.data.filter((location: Location) => location.url).map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    ))
    const locality_fields = localities.data.filter((location: Location) => location.url).map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }
    ))
    const shop_fields = shops.data.map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.5,
      }
    ))
    const country_shop_fields = country_shops.data.map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}/shop`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.5,
      }
    ))
    const area_one_shop_fields = area_one_shops.data.map((location: Location) => (
      {
        loc: `https://www.zentacle.com${location.url}/shop`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.5,
      }
    ))
    const end_date = new Date()
    console.log('Generating server site map took: ', Math.abs(end_date.getTime() - start_date.getTime())/1000, ' seconds')
    return getServerSideSitemap(ctx, [
        ...spot_fields,
        ...user_fields,
        ...country_fields,
        ...area_one_fields,
        ...area_two_fields,
        ...locality_fields,
        ...shop_fields,
        ...country_shop_fields,
        ...area_one_fields,
      ])
    })
}

const SitemapNullComponent = () => { }
// Default export to prevent next.js errors
export default SitemapNullComponent;
