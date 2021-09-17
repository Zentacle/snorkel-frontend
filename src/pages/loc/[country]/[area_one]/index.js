import Page from 'pages/loc/[country]/index';
import { rootDomain } from "src/lib/constants";

export async function getServerSideProps(context) {
  const area_one = context.query.area_one;
  const country = context.query.country;
  const props = {};
  const res = await fetch(
    `${rootDomain}/spots/get?sort=top&area_one=${area_one}&country=${country}`
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

  return {
    props, // will be passed to the page component as props
  }
}

export default Page