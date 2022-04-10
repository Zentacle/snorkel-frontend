import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { rootDomain } from 'lib/constants';
import { toaster } from 'evergreen-ui';
import Cookies from 'js-cookie';

import Layout from "components/Layout/Layout";
import styles from "./styles.module.css"

const EditBeach = () => {
    const [spot1, setSpot1] = React.useState('');
    const [spot2, setSpot2] = React.useState('');
    const [description, setDescription] = React.useState('');

    let router = useRouter();
    const { spot1_id, spot2_id } = router.query;
    useEffect(() => {
        if (spot1_id) {
            fetch(`${rootDomain}/spots/get?beach_id=${spot1_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setSpot1(data.data);
            })
        }
        if (spot2_id) {
            fetch(`${rootDomain}/spots/get?beach_id=${spot2_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setSpot2(data.data);
            })
        }
    }, [router.isReady, spot1_id, spot2_id])

    const saveDescription = (id) => () => {
        if (!description) {
            return
        }
        fetch(`${rootDomain}/spots/patch`, {
            method: 'PATCH',
            body: JSON.stringify({
                id,
                description,
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
            },
        }).then(response => {
            toaster.success('Done')
        })
    }

    const merge = () => {
        fetch(`${rootDomain}/spots/merge`, {
            method: 'POST',
            body: JSON.stringify({
                'orig_id': spot1_id,
                'dupe_id': spot2_id,
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
            },
        }).then(response => {
            if(response.ok) {
                toaster.success('Done')
            } else {
                toaster.error(response.status)
            }
        })
    }

    const remove = (id) => () => {
        fetch(`${rootDomain}/spots/patch`, {
            method: 'PATCH',
            body: JSON.stringify({
                id,
                is_deleted: true,
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
            },
        }).then(response => {
            toaster.success('Done')
        })
    }

    return (spot1 && spot2) ? (
        <Layout>
            <div className={styles.container}>
                <div className={styles.itemContainer}>
                    <div className={`${styles.item} ${styles.title}`}>
                        <Link href={spot1.url}>
                            <a>
                                {spot1.name}
                            </a>
                        </Link>
                    </div>
                    <div className={styles.item}>
                        {spot1.location_city}
                    </div>
                    <div className={styles.item}>
                        {spot1.description}
                    </div>
                    <div className={styles.item}>
                        {`${spot1.latitude}, ${spot1.longitude}`}
                    </div>
                    <button className={styles.danger} onClick={remove(spot1.id)}>
                        Remove
                    </button>
                    <button onClick={merge}>
                        Merge
                    </button>
                    <button onClick={saveDescription(spot1.id)}>
                        Save
                    </button>
                </div>
                <div className={styles.itemContainer}>
                    <div className={`${styles.item} ${styles.title}`}>
                        <Link href={spot2.url}>
                            <a>
                                {spot2.name}
                            </a>
                        </Link>
                    </div>
                    <div className={styles.item}>
                        {spot2.location_city}
                    </div>
                    <div className={styles.item}>
                        {spot2.description}
                    </div>
                    <div className={styles.item}>
                        {`${spot2.latitude}, ${spot2.longitude}`}
                    </div>
                    <button className={styles.danger} onClick={remove(spot2.id)}>
                        Remove
                    </button>
                </div>
            </div>
        </Layout>

    ) : <></>
}

export default EditBeach;