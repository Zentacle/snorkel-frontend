import styles from "./styles.module.css";
import Star from "icons/Star";

export const EmptyStar = () => (
  <Star className={styles.starempty}></Star>
)

export const FullStar = () => (
  <Star className={styles.starfull}></Star>
)

export const TransparentStar = () => (
  <Star className={styles.transparent}></Star>
)
