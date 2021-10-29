import { useEffect, useState } from 'react';
import Head from 'next/head';

import Layout from "components/Layout/Layout";
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import IndividualReview from 'components/BeachPage/BeachReviews/IndividualReview/IndividualReview';
import styles from './styles.module.css';
import Link from 'next/link';
import MaxWidth from 'components/MaxWidth';
import { useCurrentUser } from 'context/usercontext';

export async function getServerSideProps(context) {
  const username = context.query.username;
  const res = await fetch(`${rootDomain}/user/get?username=${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()

  if (!data || data.msg) {
    return {
      notFound: true,
    }
  }

  return {
    props: data.data, // will be passed to the page component as props
  }
}

const DiveLog = (props) => {
  const [user, setUser] = useState(props)

  const { state } = useCurrentUser();

  useEffect(() => {
    const currentUser = state.user;
    if (currentUser) {
        sendEvent('page_view', {
            type: 'user',
            profile_username: user.username,
        });
    }
  }, [state])

  return (
    <Layout>
      <Head>
        <title key="title">{`${user.display_name} | Zentacle - (${user.username}) Dive Log`}</title>
        <meta
          name="description"
          content={`${user.display_name} (${user.username}) is a scuba diver and snorkeler with ${user.reviews.length} dives`}
          key="description"
        />
        <meta property="og:title" content={`${user.display_name}'s Dive Log on Zentacle`} key="og-title" />
        <meta
          property="og:description"
          content={`${user.display_name} (${user.username}) is a scuba diver and snorkeler with ${user.reviews.length} dives`}
          key="og-description"
        />
        <meta property="og:image" content={user.profile_pic} key="og-image" />
        <meta property="og:url" content={`https://www.zentacle.com/user/${user.username}`} key="og-url" />
        <link rel="canonical" href={`https://www.zentacle.com/user/${user.username}`} />
      </Head>
      <MaxWidth>
        <div className={styles.container}>
          <h1 className={styles.title}>{user.display_name}&apos;s Dive Log</h1>
          <h2 className={styles.username}>@{user.username}</h2>
          <h3 className={styles.subtitle}>{user.reviews.length} dives</h3>
          {
            user.reviews.map(review => {
              return (
                <div className={styles.reviewContainer} key={review.id} >
                  <div
                    className={styles.reviewBeach}
                  >
                    <Link href={review.spot.url}>
                      <a>
                        {review.spot.name}
                      </a>
                    </Link>
                    &nbsp;on {new Date(review.date_dived || review.date_posted).toLocaleDateString()}
                  </div>
                  <IndividualReview review={review} user={user} />
                </div>
              )
            })
          }
        </div>
      </MaxWidth>
    </Layout>
  )
}

export default DiveLog;