import Page from 'pages/index';
import { rootDomain } from "src/lib/constants";

export async function getServerSideProps(context) {
  const area_one = context.query.area_one;
  const country = context.query.country;
  const sorts = ['top', 'latest', 'default']
  const props = {};
  await Promise.all(sorts.map(async sort => {
    let res;
    res = await fetch(
      `${rootDomain}/spots/get?sort=${sort}&area_one=${area_one}&country=${country}`
    )
    const data = await res.json()
    props[sort] = data.data || null;
    return data;
  }))

  if (!props.default) {
    return {
      notFound: true,
    }
  }

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  }
}

export default Page