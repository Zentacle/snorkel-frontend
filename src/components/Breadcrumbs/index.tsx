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
    breadcrumbs?: Array<{
        name: string;
        url: string;
        level: number;
    }>;
    area?: Location;
}

const Breadcrumbs = ({ country, area_one, area_two, locality, isShop, breadcrumbs, area }: Props) => {
    return (
        <div className={styles.locBreadcrumbContainer}>
            <div itemScope={true} itemType="http://schema.org/BreadcrumbList">
                {breadcrumbs ? (
                    // New geographic breadcrumb system
                    breadcrumbs.map((crumb, index) => (
                        <span key={crumb.url} itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                            {index > 0 && <span className={styles.locBreadcrumbCaret}>›</span>}
                            <Link href={`${crumb.url}${isShop ? '/shop' : ''}`}>
                                <a className={styles.locBreadcrumb} itemProp="item">
                                    <span itemProp="name">{crumb.name}</span>
                                    <meta itemProp="position" content={String(index + 1)} />
                                </a>
                            </Link>
                        </span>
                    ))
                ) : (
                    // Legacy breadcrumb system
                    <>
                        {country && country.short_name &&
                            <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                                <Link href={`${country.url}${isShop ? '/shop' : ''}`}>
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
                                <Link href={`${area_one.url}${isShop ? '/shop' : ''}`}>
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
                                <Link href={`${area_two.url}${isShop ? '/shop' : ''}`}>
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
                                <Link href={`${locality.url}${isShop ? '/shop' : ''}`}>
                                    <a className={styles.locBreadcrumb} itemProp="item">
                                        <span itemProp="name">{locality.name}</span>
                                        <meta itemProp="position" content="4" />
                                    </a>
                                </Link>
                            </span>
                        }
                    </>
                )}
            </div>
            <div className={styles.search}>
                <SearchBar largeSearchBar={false}></SearchBar>
            </div>
        </div >
    )
}

export default Breadcrumbs;
