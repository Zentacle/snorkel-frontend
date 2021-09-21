import { useRouter } from 'next/router';
import React from 'react';

import { rootDomain } from 'lib/constants';
import {PhotoPage} from "components/PhotoPage";

const ThePhotoPage = () => {
    let router = useRouter();
    const { beachid } = router.query;
    const [beach, setBeach] = React.useState({});

    React.useEffect(() => {
        if (beachid != -1)
            fetch(`${rootDomain}/spots/get?beach_id=` + beachid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data.data);
                setBeach(data.data);
            })
    }, [router.isReady])

    return (
        <PhotoPage beach={beach}></PhotoPage>
    )
}

export default ThePhotoPage;