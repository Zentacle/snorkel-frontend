import { useRouter } from 'next/router';
import React from 'react';

import { rootDomain } from 'lib/constants';
import { PhotoPage } from "components/PhotoPage";

export async function getServerSideProps(context) {
    const beachid = context.query.beachid;
    const beach = await fetch(`${rootDomain}/spots/get?beach_id=` + beachid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        return data.data;
    })
    return {
        props: { beach }, // will be passed to the page component as props
    }
}

const ThePhotoPage = (props) => {
    return (
        <PhotoPage beach={props.beach}></PhotoPage>
    )
}

export default ThePhotoPage;