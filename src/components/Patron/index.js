import React from 'react';

import * as ga from 'lib/ga';
import SectionTitle from 'components/SectionTitle';
import styles from './styles.module.css';

const Patron = (props) => {
  React.useEffect(() => {
    sendViewEvent(props.areaPatronKey);

    const script = document.createElement('script')
    script.src = 'https://fareharbor.com/embeds/api/v1/?autolightframe=yes'
    script.async = true;
    document.querySelector('body').appendChild(script)
  }, [])

  const getAreaPatronName = (areaPatronKey) => {
    return areaPatronKey == 'big-island'
      ? 'Kona Shore Divers'
      : 'Maui Dreams'
  }

  const getAreaPatronWebsiteLink = (areaPatronKey) => {
    return areaPatronKey == 'big-island'
      ? "https://www.konashoredivers.com"
      : "https://www.mauidreamsdiveco.com"
  }

  const getAreaPatronFareharborLink = (areaPatronKey) => {
    return areaPatronKey == 'big-island'
      ? "https://fareharbor.com/embeds/book/konashoredivers/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=101672"
      : "https://fareharbor.com/embeds/book/mauidreamsdiveco/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=541902"
  }

  const getAreaPatronDescription = (areaPatronKey) => {
    return areaPatronKey == 'big-island'
      ? 'Our goal is to give you the opportunity to share and explore the underwater world in and around the near shore waters of Kailua-Kona. We focus on small group sizes and strive to offer the best personalized service we can to our guests. From the first timer to the old timer come with us and see what the Kona Shore has to offer!'
      : 'Maui Dreams is the premiere dive shop serving the whole Maui area.'
  }

  const sendViewEvent = (areaPatronKey) => {
    const itemLabel = getAreaPatronName(areaPatronKey);

    ga.event({
      action: "view_item",
      params: {
        eventLabel: itemLabel,
        items: [{
          item_list_name: props.name,
          item_name: 'Patron Link',
          item_brand: itemLabel,
          item_category: 'Patron',
        }]
      }
    })
  }

  const sendClickEvent = (areaPatronKey) => () => {
    const itemLabel = getAreaPatronName(areaPatronKey);

    ga.event({
      action: "purchase",
      params: {
        eventLabel: itemLabel,
        items: [{
          item_list_name: props.name,
          item_name: 'Patron Link',
          item_brand: itemLabel,
          item_category: 'Patron',
        }]
      }
    })
  }

  return (
    <div>
        <SectionTitle text='Find a Guide' />
        <div className={styles.description}>
            <a
                onClick={ sendClickEvent(props.areaPatronKey) }
                className={styles.patronName}
                href={getAreaPatronWebsiteLink(props.areaPatronKey)}
            >
              {getAreaPatronName(props.areaPatronKey)}
            </a>
            <span> - {getAreaPatronDescription(props.areaPatronKey)}</span>
            <a
              className={styles.patronName}
              href={getAreaPatronFareharborLink(props.areaPatronKey)}
            >
              &nbsp;Book Now
            </a>
        </div>
    </div>
  )
}

export default Patron;