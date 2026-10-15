// Legacy sitemap URL, still registered in Search Console. It now serves the
// sitemap index so nothing is listed twice; /sitemap-index.xml is canonical.
export { getServerSideProps } from 'pages/sitemap-index.xml';

const SitemapNullComponent = () => {};
// Default export to prevent next.js errors
export default SitemapNullComponent;
