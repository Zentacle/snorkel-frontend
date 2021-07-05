import Head from "next/head";
import Header from "./Header/Header";
import Footer from "./Footer/Footer"
import styles from "./Layout.module.css";
const Layout = ({children}) => {
    return (
        <div className={styles.container}>
        <Head>
          <title>SnorkelFinder</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        <Header></Header>
        <main className={styles.main}>
          {children}
        </main>
  
        <Footer></Footer>
      </div>
    )
}

export default Layout;