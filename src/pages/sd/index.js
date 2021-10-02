import { rootDomain } from "src/lib/constants";
import Home from 'pages/index.js';

export async function getStaticProps(context) {
  const sorts = ['top', 'latest', 'default']
  const props = {};
  await Promise.all(sorts.map(async sort => {
    let res;
    res = await fetch(`${rootDomain}/spots/get?sort=${sort}`)

    const data = await res.json()
    props[sort] = data.data || null;
    return data;
  }))

  if (!props.default) {
    return {
      notFound: true,
    }
  }

  props['isShorediving'] = true;

  return {
    props, // will be passed to the page component as props
    revalidate: 3600,
  }
}

export default Home;
