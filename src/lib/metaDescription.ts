// Builds <meta name="description"> text from structured fields so every page
// gets a unique, readable ~155 character summary instead of a raw dump of its
// description (which could run to 1,000+ characters or contain HTML).
import Shop from 'models/Shop';

const MAX_LENGTH = 158;

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&[a-z]+;/g, ' ');

export const toPlainText = (text?: string | null) =>
  decodeEntities(`${text || ''}`.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

// Below this many free characters a truncated sentence reads as noise.
const MIN_TRUNCATED_LENGTH = 40;

const truncateAtWord = (text: string, length: number) => {
  const cut = text.slice(0, length - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
};

// Joins sentences until the next one wouldn't fit, then fills any remaining
// room with that sentence cut at a word boundary.
export const fitSentences = (parts: (string | undefined | null)[]) => {
  const sentences = parts.map((part) => toPlainText(part)).filter(Boolean);
  let result = '';
  for (const sentence of sentences) {
    const separator = result ? ' ' : '';
    const next = `${result}${separator}${sentence}`;
    if (next.length <= MAX_LENGTH) {
      result = next;
      continue;
    }
    const room = MAX_LENGTH - result.length - separator.length;
    if (room >= MIN_TRUNCATED_LENGTH) {
      result = `${result}${separator}${truncateAtWord(sentence, room)}`;
    }
    break;
  }
  return result;
};

const firstSentence = (text?: string | null) => {
  const plain = toPlainText(text);
  // end on punctuation after a lowercase letter or digit, so abbreviations
  // like "P.A.D.I." or "St." don't count as the end of a sentence
  const match = plain.match(/^.+?[a-z0-9)][.!?](\s|$)/);
  return (match ? match[0] : plain).trim();
};

const listPhrase = (items: string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export const diveSiteDescription = (beach: any) => {
  const access: string[] = (beach.access || [])
    .map((tag: { text?: string }) => tag.text)
    .filter(Boolean);
  const where = beach.location_city ? ` in ${beach.location_city}` : '';
  const accessPhrase = access.length ? `${listPhrase(access)}-access ` : '';
  const intro = `${beach.name} is a ${accessPhrase}scuba diving and snorkeling site${where}.`;

  const facts: string[] = [];
  if (beach.max_depth) {
    facts.push(`Max depth ${beach.max_depth}.`);
  }
  const rating = parseFloat(beach.rating);
  if (beach.num_reviews > 0 && !isNaN(rating)) {
    const reviews = beach.num_reviews == 1 ? 'review' : 'reviews';
    facts.push(`Rated ${rating.toFixed(1)}/5 from ${beach.num_reviews} ${reviews}.`);
  }

  return fitSentences([intro, ...facts, firstSentence(beach.description)]);
};

export const diveShopDescription = (shop: Shop) => {
  const where = [shop.city, shop.country_name]
    .filter((part, i, parts) => part && parts.indexOf(part) == i)
    .join(', ');
  const intro = `${shop.name} is a dive shop${where ? ` in ${where}` : ''}.`;

  const courses = shop.padi_data?.coursesOffered || [];
  const languages = shop.padi_data?.languages || [];
  const facts: string[] = [];
  if (courses.length) {
    facts.push(`${courses.length} PADI courses offered.`);
  }
  if (languages.length) {
    facts.push(`Languages: ${languages.slice(0, 4).join(', ')}.`);
  }

  return fitSentences([intro, firstSentence(shop.description), ...facts]);
};
