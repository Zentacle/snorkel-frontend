import React from 'react';

import * as ga from 'lib/ga';
import SectionTitle from 'components/SectionTitle';
import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import Image from 'next/image';

const Patron = (props) => {
  React.useEffect(() => {
    sendViewEvent(props.areaPatronKey);

    const initializeFareharbor = () => {
      const script = document.createElement('script')
      script.src = 'https://fareharbor.com/embeds/api/v1/?autolightframe=yes'
      script.async = true;
      document.querySelector('body').appendChild(script)
    }
    setTimeout(initializeFareharbor, 1000)
  }, [])

  const getPatron = (areaPatronKey) => {
    if (areaPatronKey == 'big-island') {
      return {
        'name': 'Kona Shore Divers',
        'url': 'https://www.konashoredivers.com',
        'fareharbor_url': 'https://fareharbor.com/embeds/book/konashoredivers/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=101672',
        'address1': '75-5660 D5B, Kopiko St',
        'address2': '',
        'city': 'Kailua-Kona',
        'state': 'HI',
        'zip_code': '96740',
        'logo_img': 'https://i.ytimg.com/vi/1Y-jraRZI0Y/mqdefault.jpg',
      }
    }
    else if (areaPatronKey == 'maui') {
      return {
        'name': 'Maui Dreams',
        'url': 'https://www.mauidreamsdiveco.com',
        'fareharbor_url': 'https://fareharbor.com/embeds/book/mauidreamsdiveco/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=541902',
        'address1': '1993 S Kihei Rd',
        'address2': '',
        'city': 'Kihei',
        'state': 'HI',
        'zip_code': '96753',
        'logo_img': 'https://www.mauidreamsdiveco.com/uploads/images/logo_mauidreamsdiveco.png',
      }
    }
    else if (areaPatronKey == 'oahu') {
      return {
        'name': 'Waikiki Diving Center',
        'url': 'https://waikikidiving.com/',
        'fareharbor_url': 'https://fareharbor.com/embeds/book/waikikidivecenter/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=522147',
        'address1': '424 Nāhua St',
        'address2': '',
        'city': 'Honolulu',
        'state': 'HI',
        'zip_code': '96815',
        'logo_img': 'https://fh-sites.imgix.net/sites/4671/2022/01/24213304/WaikikiDC_logo_Color.png?auto=compress%2Cformat&h=120&fit=max',
      }
    }
  }

  const sendViewEvent = (areaPatronKey) => {
    const itemLabel = getPatron(areaPatronKey).name;
    sendEvent('view_patron')

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
    const itemLabel = getPatron(areaPatronKey).name;
    sendEvent('click_patron')

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

    ga.event({ action: 'conversion', params: { 'send_to': 'AW-997844434/VRQkCKW2uP0CENLL59sD' } });
  }

  const patron = getPatron(props.areaPatronKey)

  return (
    <div>
      <SectionTitle text='Recommended dive shops' />
      <div className={styles.patronCard}>
        <div className={styles.image}>
          <Image
            src={patron.logo_img}
            layout="fill"
            objectFit='contain'
          />
        </div>
        <div className={styles.description}>
          <a
            onClick={sendClickEvent(props.areaPatronKey)}
            className={styles.patronName}
            href={patron.url}
          >
            {patron.name}
          </a>
          <div>{patron.address1}</div>
          <div>{patron.address2}</div>
          <div>{`${patron.city}, ${patron.state} ${patron.zip_code}`}</div>
          <a
            onMouseDown={sendClickEvent(props.areaPatronKey)}
            className={styles.bookNow}
            href={patron.fareharbor_url}
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default Patron;