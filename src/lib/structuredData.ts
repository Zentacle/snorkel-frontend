// schema.org JSON-LD builders. Always serialise with jsonLd() — never build
// JSON-LD with string templates (a quote in a name breaks the whole block).
import Location from 'models/Location';
import Shop from 'models/Shop';

const SITE_URL = 'https://www.zentacle.com';

export const jsonLd = (data: object) => ({
  // escape "<" so a value can't close the surrounding <script> tag
  __html: JSON.stringify(data).replace(/</g, '\\u003c'),
});

const toNumber = (value: unknown) => {
  const number = parseFloat(`${value}`);
  return isNaN(number) ? undefined : number;
};

const geo = (latitude: unknown, longitude: unknown) => {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);
  return lat !== undefined && lng !== undefined
    ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
    : undefined;
};

const aggregateRating = (rating: unknown, count: unknown) => {
  const ratingValue = toNumber(rating);
  const ratingCount = toNumber(count);
  return ratingValue && ratingCount
    ? {
        '@type': 'AggregateRating',
        ratingValue: Math.round(ratingValue * 10) / 10,
        ratingCount,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined;
};

interface Area {
  country?: Location;
  area_one?: Location;
  area_two?: Location;
  locality?: Location;
}

// Mirrors the visible <Breadcrumbs> trail, plus the current page.
export const breadcrumbList = (
  area: Area,
  current: { name: string; url: string },
  isShop = false,
) => {
  const crumbs = [area.country, area.area_one, area.area_two, area.locality]
    .filter((loc): loc is Location => !!(loc && loc.short_name && loc.url))
    .map((loc) => ({ name: loc.name, url: `${loc.url}${isShop ? '/shop' : ''}` }));
  crumbs.push(current);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  };
};

interface Review {
  rating?: number | string;
  text?: string;
  date_posted?: string;
  user?: { display_name?: string; first_name?: string };
}

const MAX_REVIEWS = 5;

export const diveSite = (beach: any, reviews: Review[] = []) => {
  const reviewItems = reviews
    .filter((review) => review.text && toNumber(review.rating))
    .slice(0, MAX_REVIEWS)
    .map((review) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: toNumber(review.rating),
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: review.user?.display_name || review.user?.first_name || 'Zentacle diver',
      },
      datePublished: review.date_posted
        ? new Date(review.date_posted).toISOString().slice(0, 10)
        : undefined,
      reviewBody: review.text,
    }));

  const rating = aggregateRating(beach.rating, beach.num_reviews);

  return {
    '@context': 'https://schema.org',
    // Google only shows review stars for certain types (LocalBusiness, not
    // TouristAttraction). Rated dive sites carried LocalBusiness markup
    // before, and results with stars earned ~14% of all search clicks, so
    // keep them star-eligible while also describing them accurately.
    '@type': rating ? ['TouristAttraction', 'LocalBusiness'] : 'TouristAttraction',
    name: beach.name,
    url: `${SITE_URL}${beach.url}`,
    image: beach.hero_img || undefined,
    geo: geo(beach.latitude, beach.longitude),
    address: beach.location_city
      ? {
          '@type': 'PostalAddress',
          addressLocality: beach.locality?.name,
          addressRegion: beach.area_one?.name,
          addressCountry: beach.country?.name,
        }
      : undefined,
    touristType: ['Scuba divers', 'Snorkelers'],
    isAccessibleForFree: true,
    hasMap: beach.location_google || undefined,
    aggregateRating: rating,
    review: reviewItems.length ? reviewItems : undefined,
  };
};

const DAYS: { [day: string]: string } = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const openingHours = (shop: Shop) => {
  if (!Array.isArray(shop.hours)) {
    return undefined;
  }
  const specs = shop.hours
    .map((hours) => ({
      day: DAYS[`${hours.shopDayName}`.slice(0, 3).toLowerCase()],
      opens: hours.shopHourOpen,
      closes: hours.shopHourClose,
    }))
    .filter((hours) => hours.day && hours.opens && hours.closes)
    .map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.day,
      opens: hours.opens,
      closes: hours.closes,
    }));
  return specs.length ? specs : undefined;
};

export const diveShop = (shop: Shop) => {
  const courses = shop.padi_data?.coursesOffered || [];
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: shop.name,
    url: `${SITE_URL}${shop.url}`,
    image: shop.hero_img || shop.logo_img || undefined,
    logo: shop.logo_img || undefined,
    telephone: shop.phone || undefined,
    email: shop.email || undefined,
    sameAs: shop.website ? [shop.website] : undefined,
    geo: geo(shop.latitude, shop.longitude),
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        [shop.address1, shop.address2].filter(Boolean).join(', ') || undefined,
      addressLocality: shop.city || undefined,
      addressRegion: shop.state || undefined,
      postalCode: shop.zip || undefined,
      addressCountry: shop.country_name || undefined,
    },
    openingHoursSpecification: openingHours(shop),
    // rating is omitted on purpose: the shop page doesn't display it, and
    // structured data must match what's visible on the page
    makesOffer: courses.length
      ? courses.map((course) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: course },
        }))
      : undefined,
  };
};

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zentacle',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  sameAs: ['https://apps.apple.com/app/id1611242564'],
};

export const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Zentacle',
  url: `${SITE_URL}/`,
};

// A location page's ranked list of dive sites.
export const spotItemList = (
  name: string,
  spots: { name: string; url: string }[],
  max = 20,
) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
  numberOfItems: spots.length,
  itemListElement: spots.slice(0, max).map((spot, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: spot.name,
    url: `${SITE_URL}${spot.url}`,
  })),
});

export const faqPage = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
});
