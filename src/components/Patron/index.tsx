import React from 'react';

import * as ga from 'lib/ga';
import SectionTitle from 'components/SectionTitle';
import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import Image from 'next/image';
import ShopCard from 'components/NearbyShops/ShopCard';

type AreaPatronKey = (string | undefined)[] | (string | null)[];

interface Props {
  areaPatronKey: AreaPatronKey,
  className: string,
  name: string,
}

const Patron = (props: Props) => {
  React.useEffect(() => {
    const sendViewEvents = (areaPatronKey: AreaPatronKey) => {
      const patrons = getPatron(areaPatronKey);
      patrons?.map(patron => {
        const itemLabel = patron.name
        sendEvent('view_patron', {
          name: itemLabel,
          location: props.name,
        })

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
      })
    }
    sendViewEvents(props.areaPatronKey);

    const initializeFareharbor = () => {
      const script = document.createElement('script')
      script.src = 'https://fareharbor.com/embeds/api/v1/?autolightframe=yes'
      script.async = true;
      document.querySelector('body')?.appendChild(script)
    }
    setTimeout(initializeFareharbor, 1000)
  }, [props.areaPatronKey, props.name])

  const getPatron = (areaPatronKey: (string | undefined)[] | (string | null)[]) => {
    if (areaPatronKey[1] == 'big-island') {
      return [{
        'name': 'Kona Shore Divers',
        'url': 'https://www.konashoredivers.com',
        'fareharbor_url': 'https://fareharbor.com/embeds/book/konashoredivers/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=101672',
        'address1': '75-5660 D5B, Kopiko St',
        'address2': '',
        'city': 'Kailua-Kona',
        'state': 'HI',
        'zip_code': '96740',
        'logo_img': 'https://i.ytimg.com/vi/1Y-jraRZI0Y/mqdefault.jpg',
      },{
        "address1": "74-380 Kealakehe Parkway",
    "address2": "Slip # 21",
    "city": "Kailua Kona, Hawaii",
    "id": 3367,
    "latitude": 19.671436,
    "logo_img": "https://diveshopmedia.padiww.com/dsl-media/26421466/logo/201903310340-Logo.jpg",
    "longitude": -156.015168,
    "name": "Aquatic Life Divers",
    "owner_user_id": null,
    "phone": "(808) 345 4411",
    "stamp_uri": "https://diveshopmedia.padiww.com/dsl-media/26421466/logo/201903310340-Logo.jpg",
    "state": "Hawaii",
    "url": "/shop/3367/aquatic-life-divers",
    "website": "http://www.aquaticlifedivers.com/",
    "zip_code": "96740"
      }
    ]
    }
    else if (areaPatronKey[1] == 'maui') {
      return [{
        'name': 'Maui Dreams',
        'url': 'https://www.mauidreamsdiveco.com',
        'fareharbor_url': 'https://fareharbor.com/embeds/book/mauidreamsdiveco/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=541902',
        'address1': '1993 S Kihei Rd',
        'address2': '',
        'city': 'Kihei',
        'state': 'HI',
        'zip_code': '96753',
        'logo_img': 'https://www.mauidreamsdiveco.com/uploads/images/logo_mauidreamsdiveco.png',
      }]
    }
    else if (areaPatronKey[1] == 'oahu') {
      return [{
        'name': 'Trident Adventures',
        'url': 'https://tridentadventures.com/',
        'fareharbor_url': 'https://fareharbor.com/embeds/book/tridentadventures/?ref=asn&asn=shorediving&full-items=yes&back=shorediving.com&flow=111790',
        'address1': '3 Aloha Tower Rd',
        'address2': '',
        'city': 'Honolulu',
        'state': 'HI',
        'zip_code': '96826',
        'logo_img': 'https://d2p1cf6997m1ir.cloudfront.net/media/shop/27/6b/3f/1de3/schermata-2022-03-14-alle-16-47-01.png',
      }]
    }
    else if (areaPatronKey[0] == 'ny' || areaPatronKey[0] == 'nj') {
      return [{
        'name': 'Scuba.com',
        'url': 'https://imp.i302817.net/c/3557996/847281/11629',
        'fareharbor_url': 'https://imp.i302817.net/c/3557996/847281/11629',
        'address1': '42 W 18th St',
        'address2': '',
        'city': 'New York',
        'state': 'NY',
        'zip_code': '10011',
        'logo_img': 'https://pbs.twimg.com/profile_images/1300575478919520256/8quWmyRH_400x400.jpg',
      }]
    }
  }

  const sendClickEvent = (areaPatronKey: AreaPatronKey, index: number) => () => {
    const patrons = getPatron(areaPatronKey);
    if (!patrons) {
      return;
    }
    const itemLabel = patrons[index].name;
    sendEvent('click_patron', {
      name: itemLabel,
      location: props.name,
    })

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

  const patrons = getPatron(props.areaPatronKey)

  return <div className={props.className}>
  <SectionTitle text='Recommended dive shops' />
  <div className={styles.patronContainer}>
  {patrons && patrons.length
  ? patrons.map((patron, index) => (
    <ShopCard
      key={patron.name}
      shop={patron as any}
    />
  ))
  : <></>
  }</div></div>
}

export default Patron;