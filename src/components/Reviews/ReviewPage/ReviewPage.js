import React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import { toaster } from 'evergreen-ui';

import styles from "../ReviewPage/ReviewPage.module.css";
import ScubaSnorkel from "./ScubaSnorkel/ScubaSnorkel";
import StarRate from "./StarRate/StarRate";
import Layout from "../../Layout/Layout";
import Router from "next/router";
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';

const visibilityLabel = {
    1: 'Extremely poor (<5ft)',
    2: 'Poor (5-10ft)',
    3: 'Average (10-30ft)',
    4: 'Good (30-100ft)',
    5: 'Amazing (100ft/30m+)',
}

const ReviewPage = (props) => {
    const router = useRouter()
    const { beachid } = router.query

    const [activity, setActivity] = React.useState('snorkel');
    const [rating, setRating] = React.useState(0);
    const [name, setName] = React.useState(props.name);
    const [text, setText] = React.useState('');
    const [visibility, setVisibility] = React.useState('');
    const [visibilityHover, setVisibilityHover] = React.useState(undefined)
    const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!router.isReady) return;

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

    const submitReview = (body) => {
        setIsSubmitDisabled(true);

        fetch(`${rootDomain}/review/add`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
            },
        }).then(response => {
            if (response.ok) {
                sendEvent('review_submit', {
                    'site_id': body.beach_id,
                });
                Router.push(`/Beach/${body['beach_id']}`)
            } else {
                setIsSubmitDisabled(false);
                response.json().then(({msg}) => toaster.danger(msg));
            }
            return response.json()
        })
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.beachtitle}>{name}</div>
                <div className={styles.spacer}>
                    <ScubaSnorkel value={activity} onChange={setActivity}></ScubaSnorkel>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Rating
                    </div>
                    <StarRate value={rating} onChange={setRating}></StarRate>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Review
                    </div>
                    <textarea value={text} onChange={e => setText(e.target.value)} className={styles.paragraphreview}>
                    </textarea>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Visibility
                    </div>
                    <StarRate value={visibility} onChange={setVisibility} onHover={setVisibilityHover}></StarRate>
                    <div className={styles.visibilityLabel}>{ visibilityLabel[visibility || visibilityHover] }</div>
                </div>
                <PrimaryButton className={styles.nextbutton} disabled={ isSubmitDisabled } onClick={() => submitReview({
                    'activity_type': activity,
                    rating,
                    text,
                    visibility,
                    beach_id: beachid,
                })}>
                    Submit
                </PrimaryButton>
            </div>
        </Layout>
    )
}

export default ReviewPage;