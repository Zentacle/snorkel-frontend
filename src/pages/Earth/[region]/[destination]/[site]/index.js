import { rootDomain } from 'lib/constants';

export async function getServerSideProps(context) {
  const region = context.params.region;
  const destination = context.params.destination;
  const site = context.params.site;
  const res = await fetch(`${rootDomain}/spots/get?region=${region}&destination=${destination}&site=${site}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  const beach_data = await res.json()
  if (!beach_data) {
      return {
          notFound: true,
      }
  }

  return {
      redirect: {
          destination: beach_data.data.url,
          permanent: true,
      }
  }
}

const Page = () => {
  return <div></div>
}

export default Page;
