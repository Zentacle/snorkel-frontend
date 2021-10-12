import Link from 'next/link';
import SearchBar from 'components/SearchBar';
import styles from './styles.module.css';

const Breadcrumbs = ({ country, area_one, area_two }) => {
    return (
        <div className={styles.locBreadcrumbContainer}>
            <div itemScope={true} itemType="http://schema.org/BreadcrumbList">
                {country && country.short_name &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <Link href={country.url}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{country.name}</span>
                                <meta itemProp="position" content="1" />
                            </a>
                        </Link>
                    </span>
                }
                {area_one && area_one.short_name &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <span className={styles.locBreadcrumb}>›</span>
                        <Link href={area_one.url}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{area_one.name}</span>
                                <meta itemProp="position" content="2" />
                            </a>
                        </Link>
                    </span>
                }
                {area_two && area_two.short_name &&
                    <span itemProp="itemListElement" itemScope={true} itemType="http://schema.org/ListItem">
                        <span className={styles.locBreadcrumb}>›</span>
                        <Link href={area_two.url}>
                            <a className={styles.locBreadcrumb} itemProp="item">
                                <span itemProp="name">{area_two.name}</span>
                                <meta itemProp="position" content="3" />
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
