import { rootDomain } from 'lib/constants';

const searchGoogleMapsAPI = (location) => {
  const result = fetch(`${rootDomain}/search/location?input=${location}`)
    .then(response => response.json())
    .then(data => {
      console.log('TEST')
      console.log(data.results)
      return data.results;
    });
  return result
}

export default searchGoogleMapsAPI;
