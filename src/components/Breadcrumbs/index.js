import Link from 'next/link';

import styles from './styles.module.css';

const Breadcrumbs = ({country, area_one, area_two}) => {
  return (
    country && country.short_name ? <div className={styles.locBreadcrumbContainer}>
        <Link href={`/loc/${country.short_name}`}>
            <a className={styles.locBreadcrumb}>
                {country.name}
            </a>
        </Link>
        {area_one && area_one.short_name && <>
            <span className={styles.locBreadcrumb}>›</span>
            <Link href={`/loc/${country.short_name}/${area_one.short_name}`}>
                <a className={styles.locBreadcrumb}>
                    {area_one.name}
                </a>
            </Link>
        </>
        }
        {area_two && area_two.short_name && <>
            <span className={styles.locBreadcrumb}>›</span>
            <Link href={`/loc/${country.short_name}/${area_one.short_name}/${area_two.short_name}`}>
                <a className={styles.locBreadcrumb}>
                    {area_two.name}
                </a>
            </Link>
        </>
        }
    </div> : <></>
  )
}

export default Breadcrumbs;
