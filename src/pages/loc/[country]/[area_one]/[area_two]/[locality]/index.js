import Page, { getPillLocalityLevel } from 'pages/loc/[country]/index';
import { rootDomain } from "src/lib/constants";
import { fetchLocationMap } from "lib/locationMap";
import { fetchLocationExtras } from "lib/locationPage";

export async function getStaticProps(context) {
  const locality = context.params.locality;
  const area_two = context.params.area_two;
  const area_one = context.params.area_one;
  const country = context.params.country;
  const props = {};
  let res;
  res = await fetch(
    `${rootDomain}/spots/get?sort=top&area_one=${area_one}&country=${country}&area_two=${area_two}&locality=${locality}&limit=none`
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

  props['loc'] = 'locality'
  props['map'] = await fetchLocationMap(props.loc, props.area)
  props['country'] = country
  props['area_one'] = area_one
  props['area_two'] = area_two
  props['locality'] = locality
  Object.assign(props, await fetchLocationExtras(props.loc, { country, area_one, area_two, locality }, props.area))

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
  const res = await fetch(`${rootDomain}/locality/locality`)
  const data = await res.json()
  return {
      paths: data.data
        .filter(loc => loc.area_one && loc.area_two && loc.area_one.short_name && loc.area_two.short_name)
        .map(loc => ({
            params: {
                country: loc.country.short_name,
                area_one: loc.area_one.short_name,
                area_two: loc.area_two.short_name,
                locality: loc.short_name,
            }
        })),
      fallback: 'blocking',
  }
}

export default Page