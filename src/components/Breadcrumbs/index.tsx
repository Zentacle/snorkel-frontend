import Link from 'next/link';
import SearchBar from 'components/SearchBar';
import styles from './styles.module.css';
import Location from 'models/Location';

interface Props {
    country?: Location;
    area_one?: Location;
    area_two?: Location;
    locality?: Location;
    isShop?: boolean;
}

const Breadcrumbs = ({ country, area_one, area_two, locality }: Props) => {
    return (
        <div className={styles.locBreadcrumbContainer}>
            <div itemScope={true} itemType="http://schema.org/BreadcrumbList">
                {country && country.short_name &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <Link href={`${country.url}/shop`}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{country.name}</span>
                                <meta itemProp="position" content="1" />
                            </a>
                        </Link>
                    </span>
                }
                {area_one && area_one.short_name &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <span className={styles.locBreadcrumbCaret}>›</span>
                        <Link href={`${area_one.url}/shop`}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{area_one.name}</span>
                                <meta itemProp="position" content="2" />
                            </a>
                        </Link>
                    </span>
                }
                {area_two && area_two.short_name && area_two.url &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <span className={styles.locBreadcrumbCaret}>›</span>
                        <Link href={`${area_two.url}/shop`}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{area_two.name}</span>
                                <meta itemProp="position" content="3" />
                            </a>
                        </Link>
                    </span>
                }
                {locality && locality.short_name && locality.url &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <span className={styles.locBreadcrumbCaret}>›</span>
                        <Link href={`${locality.url}/shop`}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{locality.name}</span>
                                <meta itemProp="position" content="4" />
                            </a>
                        </Link>
                    </span>
                }
            </div>
            <div className={styles.search}>
                <SearchBar largeSearchBar={false}></SearchBar>
            </div>
        </div >
    )
}

export default Breadcrumbs;
