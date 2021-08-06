import React from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

import { rootDomain } from 'lib/constants';
import PrimaryButton from "components/PrimaryButton";
import Layout from "components/Layout/Layout";
import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import useDebounce from 'hooks/useDebounce';

const NewSpot = (props) => {
  const router = useRouter();
  const submitSpot = () => {
    setIsSubmitDisabled(true);
    const body = {
      'name': locationName,
      'location_city': locationCity,
      'description': description,
    }
    if (selectedGooglePlaceIndex) {
      body['place_id'] = googlePlaceCandidates[selectedGooglePlaceIndex].place_id;
    }

    fetch(`${rootDomain}/spots/add`, {
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
        router.push(`/`)
      } else {
        setIsSubmitDisabled(false);
        response.json().then(({ msg }) => toaster.danger(msg));
      }
      return response.json()
    })
  }

  const getApi = () => {
    fetch(`${rootDomain}/search/location?input=${locationName}`)
      .then(response => response.json())
      .then(data => {
        setGooglePlaceCandidates(data.results);
        if (data.results.length === 1) {
          setSelectedGooglePlaceIndex(0);
        }
      });
  }

  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);
  const [locationName, setLocationName] = React.useState(props.query['name'] || '');
  const [locationCity, setLocationCity] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [googlePlaceCandidates, setGooglePlaceCandidates] = React.useState(null);
  const [selectedGooglePlaceIndex, setSelectedGooglePlaceIndex] = React.useState(null);

  const debouncedSearchTerm = useDebounce(locationName, 2000);

  React.useEffect(() => {
    if (selectedGooglePlaceIndex !== null && googlePlaceCandidates) {
      const formatted_address = googlePlaceCandidates[selectedGooglePlaceIndex].formatted_address.split(',')[1].trim()
      setLocationCity(formatted_address)
    }
  }, [selectedGooglePlaceIndex])

  React.useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSearchTerm) {
        getApi(debouncedSearchTerm);
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  );

  const setSelected = (index) => () => { setSelectedGooglePlaceIndex(index) }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Add a new dive spot!</h1>
        <h2 className={styles.subtitle}>
          New dive spots you add will credit you as the discoverer once approved
        </h2>
        <div className={styles.spacer}>
          <div className={styles.sectiontitle}>Dive Location Name</div>
          <input className={styles.text} value={locationName} onChange={e => setLocationName(e.target.value)} />
        </div>
        {
          googlePlaceCandidates && googlePlaceCandidates.length ? (
            <div>
              <div className={ styles.helper }>Is it one of the following locations?</div>
              <div className={styles.placeContainer}>
                {googlePlaceCandidates.map((place, index) => (
                  <div
                    className={`${styles.placeSelection} ${selectedGooglePlaceIndex === index && styles.active}`}
                    onClick={setSelected(index)}
                    key={place.place_id}
                  >
                    {place.name} - {place.formatted_address}
                  </div>
                ))}
                <div className={styles.placeSelection} onClick={setSelected(null)}>None of the above</div>
              </div>
            </div>
          ) : (<div>Nothing found! Please enter the rest of the info below</div>)
        }
        <div className={styles.spacer}>
          <div className={styles.sectiontitle}>City/State/Country</div>
          <div className={styles.helper}>(ie. Monterey, CA, United States)</div>
          <input className={styles.text} value={locationCity} onChange={e => setLocationCity(e.target.value)} />
        </div>
        <div className={styles.spacer}>
          <div className={styles.sectiontitle}>Extra info</div>
          <div className={styles.helper}>Any extra info/links you&apos;re aware of about the dive site</div>
          <textarea className={styles.textArea} value={description} onChange={e => setDescription(e.target.value)} />
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
