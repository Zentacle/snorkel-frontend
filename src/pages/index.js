import Layout from '../components/Layout/Layout';
import Home1 from '../components/Home/Home';
import Head from 'next/head';

// '/' route
export default function Home() {
  return (
    <Layout>
      <Head>
        <meta property="og:title" content="DiveBriefing" key="title" />
        <meta property="og:description" content="Search dive and snorkel spots around the world with maps, detailed reviews, and photos curated by oceans lovers like you." key="description" />
        <meta property="og:image" content="https://divebriefing.vercel.app/social_background.png" key="image" />
      </Head>
      <Home1>

      </Home1>
    </Layout>
  )
}
