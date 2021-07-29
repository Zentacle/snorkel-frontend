import { useEffect, useState } from 'react';
import Head from 'next/head';

import Layout from "components/Layout/Layout";
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import IndividualReview from 'components/BeachPage/BeachReviews/IndividualReview/IndividualReview';
import styles from './styles.module.css';

export async function getServerSideProps(context) {
  const username = context.query.username;
  const res = await fetch(`${rootDomain}/user/get?username=${username}`, {
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
  const [user, setUser] = useState(props)

  useEffect(() => {
    sendEvent('user_profile_view', { profile_username: user.username });
  }, [])

  return (
    <Layout>
      <Head>
        <title key="title">{`Zentacle - ${user.display_name} (${user.username}) Dive Log`}</title>
        <meta property="og:title" content={`Zentacle - ${user.display_name}'s Dive Log`} key="og-title" />
        <meta property="og:description" content={user.display_name} key="og-description" />
        <meta property="og:image" content={user.profile_pic} key="og-image" />
        <meta property="description" content={user.display_name} key="description" />
        <link rel="canonical" href={`https://www.zentacle.com/user/${user.username}`} />
      </Head>
      <h1 className={styles.title}>{user.display_name}&apos;s Dive Log</h1>
      <h2 className={styles.username}>@{user.username}</h2>
      <h3 className={styles.subtitle}>{user.reviews.length} dives</h3>
      {
        user.reviews.map(review => {
          return (
            <div className={styles.reviewContainer} key={review.id} >
              <div className={styles.reviewBeach}>{review.spot.name} on {review.date_dived}</div>
              <IndividualReview review={review} user={user} />
            </div>
          )
        })
      }
    </Layout>
  )
}

export default Beach;