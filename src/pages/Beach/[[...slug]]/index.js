import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import BeachPage from "components/BeachPage/BeachPage";
import { rootDomain } from 'lib/constants';
import Head from 'next/head';
import { sendEvent } from 'hooks/amplitude';

export async function getServerSideProps(context) {
  const beachid = context.params.slug[0];
  const res = await fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  const data = await res.json()

  if (!data) {
      return {
          notFound: true,
      }
  }

  return {
      props: data.data, // will be passed to the page component as props
  }
}

const Beach = (props) => {
  const router = useRouter()
  const { beachid } = router.query

  const [beach, setBeach] = useState(props)

  useEffect(() => {
      if (!router.isReady) { return; }

      sendEvent('beach_view', { site_id: beach.id });

      if (beach.notFound) {
          fetch(`${rootDomain}/spots/get?beach_id=${beach.id}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          }).then(response => {
              return response.json();
          }).then(data => {
              setBeach(data.data);
          })
      }
  }, [router.isReady])

  return (
      <Layout>
          <Head>
              <meta property="og:title" content={`Zentacle - ${beach.name} - Scuba and Snorkel reviews`} key="title" />
              <meta property="og:description" content={ beach.description } key="description" />
              <meta property="og:image" content={ beach.hero_img } key="image" />
              <link rel="canonical" href={`https://www.zentacle.com${beach.url}`}/>
          </Head>
          <BeachPage beach={beach} beachid={beachid}></BeachPage>
      </Layout>
  )
}

export default Beach;