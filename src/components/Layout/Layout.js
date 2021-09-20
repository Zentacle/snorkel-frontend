import Head from "next/head";
import Header from "./Header/Header";
import Footer from "./Footer/Footer"
import styles from "./Layout.module.css";
const Layout = ({children, ...props}) => {
    return (
        <div className={styles.container}>
        <Head>
          <title>Zentacle - Snorkel and Scuba Diving Reviews, Maps, and Photos</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        <Header isShorediving={props.isShorediving}></Header>
        <main className={styles.main}>
          {children}
        </main>
  
        <Footer></Footer>
      </div>
    )
}

export default Layout;