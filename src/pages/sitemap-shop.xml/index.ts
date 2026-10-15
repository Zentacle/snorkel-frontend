// Legacy URL, still registered in Search Console. Shops are now listed in
// the sitemap index at /server-sitemap.xml.
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/server-sitemap.xml',
    permanent: true,
  },
});

const SitemapNullComponent = () => {};
// Default export to prevent next.js errors
export default SitemapNullComponent;
