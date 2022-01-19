import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import { rootDomain } from 'lib/constants';

import Layout from "components/Layout/Layout";
import styles from "./styles.module.css"

const EditBeach = () => {
    const [spot1, setSpot1] = React.useState('');
    const [spot2, setSpot2] = React.useState('');

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
                console.log(data.data)
                setSpot2(data.data);
            })
        }
    }, [router.isReady])

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.itemContainer}>
                    <div className={`${styles.item} ${styles.title}`}>
                        {spot1.name}
                    </div>
                    <div className={styles.item}>
                        {spot1.location_city}
                    </div>
                    <div className={styles.item}>
                        {spot1.description}, {spot1.description}
                    </div>
                    <div className={styles.item}>
                        {`${spot1.latitude}, ${spot1.longitude}`}
                    </div>
                </div>
                <div className={styles.itemContainer}>
                    <div className={`${styles.item} ${styles.title}`}>
                        {spot2.name}
                    </div>
                    <div className={styles.item}>
                        {spot2.location_city}
                    </div>
                    <div className={styles.item}>
                        {spot2.description}, {spot2.description}
                    </div>
                    <div className={styles.item}>
                        {`${spot2.latitude}, ${spot2.longitude}`}
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default EditBeach;