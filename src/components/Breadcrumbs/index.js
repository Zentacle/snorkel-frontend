import Link from 'next/link';
import {Menu as SearchBar} from 'components/SearchBar';
import styles from './styles.module.css';

const Breadcrumbs = ({country, area_one, area_two}) => {
  return (
    country && country.short_name ? <div className={styles.locBreadcrumbContainer}>
        <div>
        <Link href={country.url}>
            <a className={styles.locBreadcrumb}>
                {country.name}
            </a>
        </Link>
        {area_one && area_one.short_name && <>
            <span className={styles.locBreadcrumb}>›</span>
            <Link href={area_one.url}>
                <a className={styles.locBreadcrumb}>
                    {area_one.name}
                </a>
            </Link>
        </>
        }
        {area_two && area_two.short_name && <>
            <span className={styles.locBreadcrumb}>›</span>
            <Link href={area_two.url}>
                <a className={styles.locBreadcrumb}>
                    {area_two.name}
                </a>
            </Link>
        </>
        }
        </div>
        <SearchBar width={'33%'}></SearchBar>
    </div> : <></>
  )
}

export default Breadcrumbs;
