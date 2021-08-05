import React from 'react';
import Cookies from 'js-cookie'
import { withRouter } from 'next/router';

import { rootDomain } from 'lib/constants';
import PrimaryButton from "components/PrimaryButton";
import Layout from "components/Layout/Layout";
import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';

const NewSpot = (props) => {
  const submitSpot = () => {
    const router = withRouter();
    setIsSubmitDisabled(true);

    fetch(`${rootDomain}/spots/add`, {
      method: 'POST',
      body: JSON.stringify({
        'name': locationName,
        'location_city': locationCity,
        'description': description,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
      },
    }).then(response => {
      if (response.ok) {
        sendEvent('spot_add');
        router.push(`/`)
      } else {
        setIsSubmitDisabled(false);
        response.json().then(({ msg }) => toaster.danger(msg));
      }
      return response.json()
    })
  }

  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);
  const [locationName, setLocationName] = React.useState(props.query['name']);
  const [locationCity, setLocationCity] = React.useState('');
  const [description, setDescription] = React.useState('');

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Add a new dive spot!</h1>
        <h2 className={styles.subtitle}>
          New dive spots you add will be permanently attributed to you as the discoverer once approved
        </h2>
        <div className={styles.spacer}>
          <div className={styles.sectiontitle}>Dive Location Name</div>
          <input className={styles.text} value={locationName} onChange={e=> setLocationName(e.target.value)} />
        </div>
        <div className={styles.spacer}>
          <div className={styles.sectiontitle}>City/State/Country</div>
          <div className={styles.helper}>(ie. Monterey, CA, United States)</div>
          <input className={styles.text} value={locationCity} onChange={e=> setLocationCity(e.target.value)} />
        </div>
        <div className={styles.spacer}>
          <div className={styles.sectiontitle}>Extra info</div>
          <div className={styles.helper}>Any extra info/links you&apos;re aware of about the dive site</div>
          <textarea className={styles.text} value={description} onChange={e=> setDescription(e.target.value)} />
        </div>
        <div className={styles.spacer}>
          <PrimaryButton onClick={submitSpot} disabled={isSubmitDisabled}>Submit</PrimaryButton>
        </div>
      </div>
    </Layout>
  )
}

NewSpot.getInitialProps = (context) => {
  return { query: context.query }
}

export default NewSpot;
