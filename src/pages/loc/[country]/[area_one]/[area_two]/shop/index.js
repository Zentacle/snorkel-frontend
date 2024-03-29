import Page, { getPillLocalityLevel } from 'pages/loc/[country]/shop/index';
import { rootDomain } from "src/lib/constants";

export async function getStaticProps(context) {
  const area_two = context.params.area_two;
  const area_one = context.params.area_one;
  const country = context.params.country;
  const props = {};
  const res = await fetch(
    `${rootDomain}/shop/loc?sort=top&area_one=${area_one}&country=${country}&area_two=${area_two}&limit=none`
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

  props['loc'] = 'area_two'
  props['country'] = country
  props['area_one'] = area_one
  props['area_two'] = area_two

  const localityType = getPillLocalityLevel[props.loc];
  let url = `${rootDomain}/locality/${localityType}`
  if (props.country) {
    url += `?country=${props.country}`
  }
  if (props.area_one) {
    url += `&area_one=${props.area_one}`
  }
  if (props.area_two) {
    url += `&area_two=${props.area_two}`
  }
  props['areas'] = await fetch(url).then(res =>
    res.json()
  ).then(data => {
    return data.data;
  })

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  const res = await fetch(`${rootDomain}/locality/area_two`)
  const data = await res.json()
  return {
      paths: data.data.filter(loc => loc.area_one && loc.country && loc.area_one.short_name).map(loc => ({
          params: {
              country: loc.country.short_name,
              area_one: loc.area_one.short_name,
              area_two: loc.short_name,
          }
      })),
      fallback: 'blocking',
  }
}

export default Page