import React from 'react';
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import { toaster } from 'evergreen-ui';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import styles from "../ReviewPage/ReviewPage.module.css";
import ScubaSnorkel from "./ScubaSnorkel/ScubaSnorkel";
import StarRate from "./StarRate/StarRate";
import Layout from "../../Layout/Layout";
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
    const [visibilityHover, setVisibilityHover] = React.useState(undefined);
    const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);
    const [dateDived, setDateDived] = React.useState(new Date());

    React.useEffect(() => {
        if (!router.isReady) return;

        sendEvent('review_begin', {
            'site_id': beachid,
        })

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
                        Date
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            variant="inline"
                            value={dateDived}
                            onChange={setDateDived}
                            maxDate={new Date()}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div className={styles.spacer}>
                    <div className={styles.reviewtitle}>
                        Rating
                    </div>
                    <StarRate large value={rating} onChange={setRating}></StarRate>
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
                    date_dived: new Date(dateDived).toISOString(),
                })}>
                    Submit
                </PrimaryButton>
            </div>
        </Layout>
    )
}

export default ReviewPage;