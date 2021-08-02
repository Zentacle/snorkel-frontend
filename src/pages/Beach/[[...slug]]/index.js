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
  const beach_data = await res.json()

  const response = await fetch(`${rootDomain}/review/get?beach_id=${beachid}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  const review_data = await response.json();

  if (!beach_data) {
      return {
          notFound: true,
      }
  }

  return {
      props: {
          'beach': beach_data.data,
          'reviews': review_data.data,
      }, // will be passed to the page component as props
  }
}

const Beach = (props) => {
  const [beach, setBeach] = useState(props.beach)

  useEffect(() => {
      sendEvent('beach_view', { site_id: beach.id });
  }, [])

  return (
      <Layout>
          <Head>
              <title key="title">{`Zentacle - ${beach.name}`}</title>
              <meta property="og:title" content={`Zentacle - ${beach.name} - Scuba and Snorkel reviews`} key="og-title" />
              <meta property="og:description" content={ beach.description } key="og-description" />
              <meta property="og:image" content={ beach.hero_img } key="og-image" />
              <meta name="description" content={`${beach.name} is a ${beach.rating}-star rated scuba dive and snorkel destination in ${beach.location_city}`} key="description"/>
              <link rel="canonical" href={`https://www.zentacle.com${beach.url}`}/>
              <link rel="preload" as="image" href={beach.hero_img}/>
          </Head>
          <BeachPage beach={beach} beachid={beach.id} reviews={props.reviews}></BeachPage>
      </Layout>
  )
}

export default Beach;