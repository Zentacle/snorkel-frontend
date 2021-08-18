import React from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import { toaster } from 'evergreen-ui';

import { rootDomain } from 'lib/constants';
import PrimaryButton from "components/PrimaryButton";
import Layout from "components/Layout/Layout";
import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import useDebounce from 'hooks/useDebounce';
import MaxWidth from 'components/MaxWidth';

const NewSpot = (props) => {
  const router = useRouter();
  const submitSpot = () => {
    setIsSubmitDisabled(true);
    const body = {
      'name': locationName,
      'location_city': locationCity,
      'description': description,
    }
    if (selectedGooglePlace) {
      body['place_id'] = selectedGooglePlace.place_id;
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
        response.json().then(data => router.push(data.data.url));
      } else {
        setIsSubmitDisabled(false);
        response.json().then(({ msg }) => toaster.danger(msg));
      }
    })
  }

  const getApi = () => {
    fetch(`${rootDomain}/search/location?input=${locationName}`)
      .then(response => response.json())
      .then(data => {
        setGooglePlaceCandidates(data.results);
        if (data.results.length === 1) {
          setSelectedGooglePlace(data.results[0]);
        }
      });
  }

  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false);
  const [locationName, setLocationName] = React.useState(props.query['name'] || '');
  const [locationCity, setLocationCity] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [googlePlaceCandidates, setGooglePlaceCandidates] = React.useState(null);
  const [selectedGooglePlace, setSelectedGooglePlace] = React.useState(null);

  const debouncedSearchTerm = useDebounce(locationName, 2000);

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
        getApi(debouncedSearchTerm);
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  );

  React.useEffect(() => {
    const initializeMap = () => {
      window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: new google.maps.LatLng(20.83674343601845, -156.4178040410507),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    }
    const script = document.createElement('script')
    script.src = 'https://maps.google.com/maps/api/js?key=AIzaSyAPbvPcOMVp6qdWP59cML7kmYd2ShEGu_Y'
    script.onload = setTimeout(initializeMap, 1000)
    script.async = true;
    document.querySelector('body').appendChild(script)
  }, [])

  React.useEffect(() => {
    if (!window.google || !selectedGooglePlace) { return }
    const location = selectedGooglePlace.geometry.location;
    var center = new google.maps.LatLng(location.lat, location.lng);
    window.map.panTo(center);
    const marker = new google.maps.Marker({
      position: center,
      map: map
    });
  }, [selectedGooglePlace, googlePlaceCandidates])

  const setSelected = (index) => () => { setSelectedGooglePlace(googlePlaceCandidates[index]) }

  return (
    <Layout>
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
          {
            googlePlaceCandidates && googlePlaceCandidates.length ? (
              <div>
                <div className={styles.helper}>Is it one of the following locations?</div>
                <div className={styles.placeContainer}>
                  {googlePlaceCandidates.map((place, index) => (
                    <div
                      className={`${styles.placeSelection} ${selectedGooglePlace && selectedGooglePlace.place_id === place.place_id && styles.active}`}
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
          <div id="map" className={styles.googleMap}></div>
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
      </MaxWidth>
    </Layout>
  )
}

NewSpot.getInitialProps = (context) => {
  return { query: context.query }
}

export default NewSpot;
