import Image from 'next/image';

import Layout from "components/Layout/Layout";
import styles from './styles.module.css';

export default function Custom404() {
  return <Layout>
    <div className={styles.container}>
        <h1>Looking for directions? We couldn't find that page</h1>
        <h6>Try going back to the home page</h6>
        <Image src='/turtle.jpg' height={455} width={340} />
    </div>
  </Layout>
}
