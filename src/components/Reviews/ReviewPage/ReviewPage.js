import React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

import styles from "../ReviewPage/ReviewPage.module.css";
import ScubaSnorkel from "./ScubaSnorkel/ScubaSnorkel";
import StarRate from "./StarRate/StarRate";
import Layout from "../../Layout/Layout";
import Router from "next/router";
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'lib/constants';

const submitReview = (body) => {
    fetch(`${rootDomain}/review/add`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
        },
    }).then(response => {
        if (response.ok) {
            Router.push(`/beach/${body['beach_id']}`)
        }
        return response.json()
    })
}

const ReviewPage = (props) => {
    const router = useRouter()
    const { beachid } = router.query

    const [activity, setActivity] = React.useState('snorkel');
    const [rating, setRating] = React.useState(0);
    const [name, setName] = React.useState(props.name);
    const [text, setText] = React.useState('');
    const [visibility, setVisibility] = React.useState('');

    React.useEffect(() => {
        if(!router.isReady) return;

        if (!props.name) {
            fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setName(data.data.name);
            })
        }
    }, [router.isReady])

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.beachtitle}>{name}</div>
                <ScubaSnorkel value={activity} onChange={setActivity}></ScubaSnorkel>
                <StarRate value={rating} onChange={setRating}></StarRate>
                <div className={styles.paragraphwrapper}>
                    <div className={styles.reviewtitle}>
                        Review
                    </div>
                    <textarea value={text} onChange={ e => setText(e.target.value)} className={styles.paragraphreview}>
                    </textarea>
                    <div className={styles.vizwrapper}>
                        <div className={styles.reviewtitle}>
                            Visibility
                        </div>
                        <div className={styles.vizreview}>
                            <input value={visibility} onChange={ e=> setVisibility(e.target.value)} placeholder="visibility (ft)"></input>
                        </div>
                    </div>
                    <div className={styles.buttonwrapper}>
                        <PrimaryButton className={styles.nextbutton} onClick={() => submitReview({
                            'activity_type': activity,
                            rating,
                            text,
                            visibility,
                            beach_id: beachid,
                        })}>
                            Submit
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ReviewPage;