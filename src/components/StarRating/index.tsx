import ReactRating from "react-rating";

import styles from "./styles.module.css";
import Star from "icons/Star";

export const EmptyStar = () => <Star className={styles.starempty}></Star>;

export const FullStar = () => <Star className={styles.starfull}></Star>;

export const TransparentStar = () => (
  <Star className={styles.transparent}></Star>
);

interface Props {
  className?: string;
  fractions?: number;
  initialRating: number;
  readonly?: boolean;
}

export default ({
  className,
  fractions = 2,
  initialRating,
  readonly,
}: Props) => (
  <ReactRating
    className={className}
    fractions={fractions}
    initialRating={initialRating}
    emptySymbol={<EmptyStar />}
    fullSymbol={<FullStar />}
    readonly={readonly}
  />
);
