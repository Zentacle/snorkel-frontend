import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import BeachPage from "components/BeachPage/BeachPage";
import { rootDomain } from 'lib/constants';

const Beach = () => {
    const router = useRouter()
    const { beachid } = router.query

    const [beach, setBeach] = useState({
        "description": "Mala wharf was once a fully-functioning pier which served as a shipping facility for the island’s pineapple and agriculture. In 1992, however, 30 ft. surf came marching into Lahaina as a result of Hurricane Iniki, and the end of the dock was completely destroyed. Today, the pilings from the old dock lie scattered along the ocean floor, and what was once a shipping facility above water is now a healthy artificial reef which is home to a vast array of marine life.",
        "entry_map": "https://snorkel.s3.amazonaws.com/mala_entry.png",
        "hero_img": "https://californiadiver.com/wp-content/uploads/2013/09/IMG_4968.jpg",
        "id": 1,
        "location_city": "Lahaina, Maui, Hawaii",
        "location_google": "https://goo.gl/maps/YsaNYnPtsn9bGTyN8",
        "name": "Mala Wharf",
        "num_reviews": 2,
        "rating": 4
    })

    useEffect(() => {
        if(!router.isReady) { return; }

        fetch(`${rootDomain}/spots/get?beach_id=${beachid}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            setBeach(data.data);
        })

    }, [router.isReady])

    return (
        <Layout>
            <BeachPage beach={ beach } beachid={beachid}></BeachPage>
        </Layout>
    )
}

export default Beach;