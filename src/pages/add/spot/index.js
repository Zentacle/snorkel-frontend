import React from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import { toaster } from 'evergreen-ui';

import { clientSideDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import GooglePlaceSelector from 'components/GooglePlaceSelector';
import Head from 'next/head';
import Layout from "components/Layout/Layout";
import MaxWidth from 'components/MaxWidth';
import PrimaryButton from 'components/PrimaryButton';
import styles from './styles.module.css';
import useDebounce from 'hooks/useDebounce';
import searchGoogleMapsAPI from 'lib/searchGoogleMapsAPI';

const NewSpot = (props) => {
  const router = useRouter();
  const submitSpot = () => {
    setIsSubmitDisabled(true);
    const body = {
      'name': locationName,
      'location_city': locationCity,
      'description': description,
      'difficulty': difficulty,
      'max_depth': maxDepth,
    }
    if (selectedGooglePlace) {
      body['place_id'] = selectedGooglePlace.place_id;
    }

    fetch(`${clientSideDomain}/spots/add`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
      },
    }).then(response => {
      if (response.ok) {
        sendEvent('spot_add');
        toaster.success('Successfully submitted! Check your email for next steps.')
        response.json().then(data => router.push(data.data.url));
      } else {
        setIsSubmitDisabled(false);
        response.json().then(({ msg }) => toaster.danger(msg));
      }
    })
  }

  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);
  const [locationName, setLocationName] = React.useState(props.query['name'] || '');
  const [mapsLocationName, setMapsLocationName] = React.useState(props.query['name'] || '')
  const [locationCity, setLocationCity] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [googlePlaceCandidates, setGooglePlaceCandidates] = React.useState(null);
  const [selectedGooglePlace, setSelectedGooglePlace] = React.useState(null);
  const [difficulty, setDifficulty] = React.useState(null);
  const [maxDepth, setMaxDepth] = React.useState(null);

  const debouncedSearchTerm = useDebounce(mapsLocationName, 2000);

  React.useEffect(() => {
    if (selectedGooglePlace) {
      const formatted_address = selectedGooglePlace.formatted_address.split(',')[1].trim()
      setLocationCity(formatted_address)
    }
  }, [selectedGooglePlace])

  React.useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSearchTerm) {
        searchGoogleMapsAPI(debouncedSearchTerm).then(results => {
          setGooglePlaceCandidates(results);
          if (results.length === 1) {
            setSelectedGooglePlace(results[0]);
          }
        });
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  );

  const setSelected = (index) => () => { setSelectedGooglePlace(googlePlaceCandidates[index]) }

  return (
    <Layout>
      <Head>
        <link rel="canonical" href={`https://www.zentacle.com/add/spot`} />
        <meta name="description" content="Submit your favorite dive or snorkel spot to Zentacle!" key="description" />
        <meta property="og:description" content="Submit your favorite dive or snorkel spot to Zentacle!" key="og:description" />
      </Head>
      <MaxWidth>
        <div className={styles.container}>
          <h1 className={styles.title}>Add a new dive spot!</h1>
          <h2 className={styles.subtitle}>
            New dive spots you add will credit you as the discoverer once approved
          </h2>
          <div className={styles.spacer}>
            <div className={styles.sectiontitle}>Dive Location Name</div>
            <input className={styles.text} value={locationName} onChange={e => setLocationName(e.target.value)} />
          </div>
          <div className={styles.spacer}>
            <div className={styles.sectiontitle}>Search on Google Maps</div>
            <input className={styles.text} value={mapsLocationName} onChange={e => setMapsLocationName(e.target.value)} />
          </div>
          <GooglePlaceSelector
            setSelected={setSelected}
            selectedGooglePlace={selectedGooglePlace}
            googlePlaceCandidates={googlePlaceCandidates}
          />
          <div className={styles.spacer}>
            <div className={styles.sectiontitle}>City/State/Country</div>
            <div className={styles.helper}>(ie. Monterey, CA, United States)</div>
            <input className={styles.text} value={locationCity} onChange={e => setLocationCity(e.target.value)} />
          </div>
          <div className={styles.spacer}>
            <div className={styles.sectiontitle}>Difficulty</div>
            <div className={styles.helper}>Must choose either beginner, intermediate, or advanced (optional)</div>
            <input className={styles.text} value={difficulty} onChange={e => setDifficulty(e.target.value)} />
          </div>
          <div className={styles.spacer}>
            <div className={styles.sectiontitle}>Max Depth</div>
            <div className={styles.helper}>ie. 120ft (optional)</div>
            <input className={styles.text} value={maxDepth} onChange={e => setMaxDepth(e.target.value)} />
          </div>
          <div className={styles.spacer}>
            <div className={styles.sectiontitle}>Description</div>
            <div className={styles.helper}>Any extra info/links you&apos;re aware of about the dive site</div>
            <textarea className={styles.textArea} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className={styles.spacer}>
            <PrimaryButton onClick={submitSpot} disabled={isSubmitDisabled}>Submit</PrimaryButton>
          </div>
        </div>
      </MaxWidth>
    </Layout>
  )
}

NewSpot.getInitialProps = (context) => {
  return { query: context.query }
}

export default NewSpot;
