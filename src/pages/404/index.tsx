import Image from 'next/image';
import { useEffect } from 'react';

import Layout from "components/Layout/Layout";
import { sendEvent } from 'hooks/amplitude';
import { useCurrentUser } from 'context/usercontext';
import styles from './styles.module.css';

export default function Custom404() {
  let { state } = useCurrentUser();
  const currentUser = state.user;

  useEffect(() => {
    if (currentUser) {
      sendEvent('page_view', {
        type: '404',
      });
    }
  }, [currentUser])

  return <Layout>
    <div className={styles.container}>
      <h1>Looking for directions? We couldn&apos;t find that page (404)</h1>
      <h6>Try going back to the home page</h6>
      <Image src='/turtle.jpg' height={455} width={340} alt="Diver with turtle"/>
    </div>
  </Layout>
}
