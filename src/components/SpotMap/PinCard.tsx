import React from 'react';
import Image from 'next/image';

import styles from './styles.module.css';

export interface PinCardSpot {
  name: string;
  hero_img?: string | null;
  location_city?: string | null;
  rating?: number | string | null;
  num_reviews?: number | null;
  difficulty?: string | null;
  max_depth?: string | null;
  access?: { text?: string; short_name?: string }[] | null;
}

interface Props {
  id: string;
  number: number;
  spot: PinCardSpot;
  // pin position on the map, in percent
  left: number;
  top: number;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Short facts shown as chips: difficulty, how you get in, how deep it goes.
const facts = (spot: PinCardSpot) => {
  const chips: string[] = [];
  const difficulty = (spot.difficulty || '').toLowerCase();
  if (['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
    chips.push(capitalize(difficulty));
  }
  (spot.access || []).forEach((tag) => {
    const access = (tag.text || tag.short_name || '').toLowerCase();
    if (access) {
      chips.push(`${capitalize(access)} entry`);
    }
  });
  if (spot.max_depth) {
    chips.push(`Max ${spot.max_depth.replace(/\s+/g, ' ').trim()}`);
  }
  return chips;
};

// The hover/focus card for a map pin. It's placed above the pin, or below it
// when the pin is near the top of the map, and kept inside the map's edges.
const PinCard = ({ id, number, spot, left, top }: Props) => {
  const rating = Number(spot.rating);
  const reviews = spot.num_reviews || 0;
  const vertical = top < 45 ? styles.cardBelow : styles.cardAbove;
  const horizontal = left < 28 ? styles.cardFromLeft : left > 72 ? styles.cardFromRight : styles.cardCentered;

  return (
    <div
      id={id}
      role="tooltip"
      className={`${styles.card} ${vertical} ${horizontal}`}
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <div className={styles.cardPhoto}>
        <Image
          src={spot.hero_img || '/generic_beach.jpeg'}
          alt=""
          layout="fill"
          objectFit="cover"
          unoptimized
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <span className={styles.cardNumber}>{number}</span>
          {spot.name}
        </div>
        {spot.location_city && <div className={styles.cardPlace}>{spot.location_city}</div>}
        <div className={styles.cardRating}>
          {reviews > 0 && !isNaN(rating) ? (
            <>
              <span className={styles.cardStar} aria-hidden="true">
                ★
              </span>{' '}
              {rating.toFixed(1)}{' '}
              <span className={styles.cardMuted}>
                ({reviews} {reviews === 1 ? 'review' : 'reviews'})
              </span>
            </>
          ) : (
            <span className={styles.cardMuted}>No reviews yet</span>
          )}
        </div>
        {facts(spot).length > 0 && (
          <div className={styles.cardChips}>
            {facts(spot).map((fact) => (
              <span key={fact} className={styles.cardChip}>
                {fact}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinCard;
