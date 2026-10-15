// Serves the child sitemaps listed in /sitemap-index.xml:
//   /sitemaps/spots-<n>.xml, /sitemaps/shops-<n>.xml,
//   /sitemaps/locations.xml, /sitemaps/shop-locations.xml
import { GetServerSideProps } from 'next';

import {
  chunk,
  fetchLocations,
  fetchShops,
  fetchSpots,
  locationFields,
  sendUrlset,
  shopFields,
  spotFields,
} from 'lib/sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const file = `${ctx.params?.file}`;

  if (file === 'locations.xml') {
    return sendUrlset(ctx, locationFields(await fetchLocations(false)));
  }
  if (file === 'shop-locations.xml') {
    return sendUrlset(ctx, locationFields(await fetchLocations(true), '/shop'));
  }

  const match = file.match(/^(spots|shops)-(\d+)\.xml$/);
  if (match) {
    const page = parseInt(match[2], 10);
    const fields =
      match[1] === 'spots'
        ? spotFields(chunk(await fetchSpots(), page))
        : shopFields(chunk(await fetchShops(), page));
    if (fields.length) {
      return sendUrlset(ctx, fields);
    }
  }

  return { notFound: true };
};

const SitemapNullComponent = () => {};
// Default export to prevent next.js errors
export default SitemapNullComponent;
