import Image from 'next/image';
import { useEffect } from 'react';

import Layout from "components/Layout/Layout";
import { sendEvent } from 'hooks/amplitude';
import { useCurrentUser } from 'context/usercontext';
import styles from './styles.module.css';

export default function Custom500() {
  let { state } = useCurrentUser();
  const currentUser = state.user;

  useEffect(() => {
    if (currentUser) {
      sendEvent('page_view', {
        type: '500',
      });
    }
  }, [currentUser])

  return <Layout>
    <div className={styles.container}>
        <h1>Hmm, something went wrong (500)</h1>
        <h6>Try going back to the home page</h6>
        <Image src='/turtle.jpg' height={455} width={340} />
    </div>
  </Layout>
}
