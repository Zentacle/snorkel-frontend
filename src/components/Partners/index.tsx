import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';

import { rootDomain } from 'lib/constants';
import * as ga from 'lib/ga';
import PrimaryButton, { PrimaryLink } from 'components/PrimaryButton';
import styles from './styles.module.css';

interface Props {
  loc: string;
  partners: any[];
}

export default function Partners(props: Props) {
  React.useEffect(() => {
    props.partners.map(partner => (
      ga.event({
        action: "view_item",
        params: {
          eventLabel: partner.user.id,
          items: [{
            item_list_name: props.loc,
            item_name: 'Partner',
            item_brand: partner.user.id,
            item_category: 'Partner',
          }]
        }
      })
    ))
  }, [])

  return (
    <div className={styles.partnerOuterContainer}>
      <h3 className={styles.partnerTitle}>Find a Dive Buddy</h3>
      <div className={styles.partnerInnerContainer}>
        {
          props.partners.map(partner => (
            <div className={styles.partnerContainer}>
              <Image
                className={styles.profilePic}
                src={partner.user.profile_pic || 'https://snorkel.s3.amazonaws.com/default/default_hero_background.png'}
                width="64"
                height="64"
              />
              <Link href={`/user/${partner.user.username}`}>{partner.user.display_name}</Link>
              <div>{partner.user.hometown}</div>
              <PrimaryButton
                onClick={() => {
                  ga.event({
                    action: "purchase",
                    params: {
                      eventLabel: partner.user.id,
                      items: [{
                        item_list_name: partner.user.id,
                        item_name: 'Partner',
                        item_brand: partner.user.id,
                        item_category: 'Partner',
                      }]
                    }
                  })
                  fetch(`${rootDomain}/partner/connect`, {
                    method: 'POST',
                    body: JSON.stringify({
                      userId: partner.user.id,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-TOKEN': Cookies.get('csrf_access_token') || '',
                    },
                  })
                }}
              >
                Reach Out
              </PrimaryButton>
            </div>
          ))
        }
        <div className={styles.partnerContainer}>
          Want to get matched up with a dive buddy in your area?
          <PrimaryLink
            href={'https://buy.stripe.com/00gcPhf2Octp3nOaEE'}
          >
            Get Pro
          </PrimaryLink>
        </div>
      </div>
    </div>
  );
}
