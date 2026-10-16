// Questions and answers for a location page, written only from the ranked
// spot list and shop data the page already has. A question is left out when
// there isn't enough data to answer it.
import Beach from 'models/Beach';
import Shop from 'models/Shop';
import { placeName } from 'lib/locationPage';

export interface Faq {
  question: string;
  answer: string;
}

interface FaqSpot extends Beach {
  access?: { short_name?: string; text?: string }[] | null;
  max_depth?: string | null;
}

const rating = (value: unknown) => {
  const number = parseFloat(`${value}`);
  return isNaN(number) ? null : number.toFixed(1);
};

const reviewCount = (count: number) => `${count} review${count === 1 ? '' : 's'}`;

const describe = (spot: FaqSpot) =>
  `${spot.name} (${rating(spot.rating)} from ${reviewCount(spot.num_reviews)})`;

// "A", "A and B", "A, B and C"
const joinNames = (names: string[]) =>
  names.length <= 1
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

const hasAccess = (spot: FaqSpot, access: string) =>
  (spot.access || []).some((tag) => (tag.short_name || tag.text || '').toLowerCase() === access);

export const locationFaqs = (
  name: string,
  spots: FaqSpot[],
  shops: Shop[],
  numShops: number | null,
): Faq[] => {
  const areaName = placeName(name);
  // in rank order (the list is sorted by the site's "top" score)
  const reviewed = spots.filter((spot) => spot.num_reviews > 0 && rating(spot.rating));
  const faqs: Faq[] = [];

  if (reviewed.length >= 3) {
    faqs.push({
      question: `What are the best dive and snorkel sites in ${areaName}?`,
      answer:
        `Based on Zentacle reviews, the top-rated sites in ${areaName} are ` +
        `${joinNames(reviewed.slice(0, 3).map(describe))}.`,
    });
  }

  const beginner = reviewed.filter((spot) => spot.difficulty === 'beginner');
  if (beginner.length >= 2) {
    faqs.push({
      question: `Where is the best snorkeling for beginners in ${areaName}?`,
      answer:
        `The top-rated beginner sites are ${joinNames(beginner.slice(0, 3).map(describe))}.`,
    });
  }

  const shore = reviewed.filter((spot) => hasAccess(spot, 'shore'));
  if (shore.length >= 2) {
    faqs.push({
      question: `Where can I shore dive in ${areaName}?`,
      answer:
        `${joinNames(shore.slice(0, 4).map((spot) => spot.name))} are the ` +
        `top-rated sites you can enter from shore.`,
    });
  }

  const advanced = reviewed.filter((spot) => spot.difficulty === 'advanced');
  if (advanced.length >= 1) {
    const best = advanced[0];
    const access = hasAccess(best, 'boat') ? ', reached by boat' : '';
    faqs.push({
      question: `What is the best advanced dive in ${areaName}?`,
      answer:
        `${describe(best)}${access}` +
        `${best.max_depth ? `, with a maximum depth of ${best.max_depth.replace(/(\d)\s*ft/i, '$1 ft')}` : ''}.`,
    });
  }

  const rated = shops.filter((shop) => shop.num_reviews && rating(shop.rating));
  if (numShops && rated.length) {
    faqs.push({
      question: `Are there dive shops in ${areaName}?`,
      answer:
        `Zentacle lists ${numShops} dive shop${numShops === 1 ? '' : 's'} in ${areaName}. ` +
        `The top-rated ${rated.length === 1 ? 'is' : 'are'} ` +
        `${joinNames(
          rated
            .slice(0, 2)
            .map((shop) => `${shop.name} (${rating(shop.rating)} from ${reviewCount(Number(shop.num_reviews))})`),
        )}.`,
    });
  }

  return faqs;
};
