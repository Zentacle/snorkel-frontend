import Page, { getPillLocalityLevel } from 'pages/loc/[country]/index';
import { rootDomain } from "src/lib/constants";
import { fetchLocationMap } from "lib/locationMap";

export async function getStaticProps(context) {
  const area_two = context.params.area_two;
  const area_one = context.params.area_one;
  const country = context.params.country;
  const props = {};
  let res;
  res = await fetch(
    `${rootDomain}/spots/get?sort=top&area_one=${area_one}&country=${country}&area_two=${area_two}&limit=none`
  )
  const data = await res.json().catch(() => null)
  props['default'] = (data && data.data) || null;
  if (data && data.area) {
    props['area'] = data.area;
  }

  // the page can't render without its area (title, breadcrumbs, canonical)
  if (!props.default || !props.area) {
    return {
      notFound: true,
    }
  }

  props['loc'] = 'area_two'
  props['map'] = await fetchLocationMap(props.loc, props.area)
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
    return (data && data.data) || [];
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