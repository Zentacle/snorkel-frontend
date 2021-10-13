import Page from 'pages/loc/[country]/index';
import { rootDomain } from "src/lib/constants";

export async function getStaticProps(context) {
  const area_one = context.params.area_one;
  const country = context.params.country;
  const props = {};
  const res = await fetch(
    `${rootDomain}/spots/get?sort=top&area_one=${area_one}&country=${country}&limit=none`
  )
  const data = await res.json()
  props['default'] = data.data || null;
  if (data.area) {
    props['area'] = data.area;
  }

  if (!props.default) {
    return {
      notFound: true,
    }
  }

  props['loc'] = 'area_one'
  props['country'] = country
  props['area_one'] = area_one

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  const res = await fetch(`${rootDomain}/locality/area_one`)
  const data = await res.json()
  return {
      paths: data.data.map(loc => ({
          params: {
              country: loc.country.short_name,
              area_one: loc.short_name,
          }
      })),
      fallback: 'blocking',
  }
}

export default Page