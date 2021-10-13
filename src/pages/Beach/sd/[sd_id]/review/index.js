import { rootDomain } from "lib/constants";

export async function getServerSideProps(context) {
  const { sd_id } = context.query
  return fetch(`${rootDomain}/spots/get?sd_id=${sd_id}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  }).then(response => {
      return response.json();
  }).then(data => {
    if (data.data && data.data.url) {
      return {
        redirect: {
          destination: data.data.url + '/review',
          permanent: true,
        },
      }
    } else {
      return {
        props: {}
      }
    }
  })
}

const Page = () => {
  return <div></div>
}

export default Page;