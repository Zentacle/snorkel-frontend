import Link from 'next/link';
import styles from './styles.module.css';
import Location from 'models/Location';

interface Props {
    country?: Location;
    area_one?: Location;
    area_two?: Location;
    locality?: Location;
    isShop?: boolean;
}

const Breadcrumbs = ({ country, area_one, area_two, locality, isShop }: Props) => {
    return (
        <div className={styles.locBreadcrumbContainer}>
            <div>
                {country && country.short_name &&
                    <span>
                        <Link href={`${country.url}${isShop ? '/shop' : ''}`}>
                            <a className={styles.locBreadcrumb}>
                                <span>{country.name}</span>
                            </a>
                        </Link>
                    </span>
                }
                {area_one && area_one.short_name &&
                    <span>
                        <span className={styles.locBreadcrumbCaret}>›</span>
                        <Link href={`${area_one.url}${isShop ? '/shop' : ''}`}>
                            <a className={styles.locBreadcrumb}>
                                <span>{area_one.name}</span>
                            </a>
                        </Link>
                    </span>
                }
                {area_two && area_two.short_name && area_two.url &&
                    <span>
                        <span className={styles.locBreadcrumbCaret}>›</span>
                        <Link href={`${area_two.url}${isShop ? '/shop' : ''}`}>
                            <a className={styles.locBreadcrumb}>
                                <span>{area_two.name}</span>
                            </a>
                        </Link>
                    </span>
                }
                {locality && locality.short_name && locality.url &&
                    <span>
                        <span className={styles.locBreadcrumbCaret}>›</span>
                        <Link href={`${locality.url}${isShop ? '/shop' : ''}`}>
                            <a className={styles.locBreadcrumb}>
                                <span>{locality.name}</span>
                            </a>
                        </Link>
                    </span>
                }
            </div>
        </div >
    )
}

export default Breadcrumbs;
