
import Head from 'next/head';
import React from 'react';

import styles from './styles.module.css';

export default function Buddy() {
  React.useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://embed.typeform.com/next/embed.js'
    script.async = true;
    document.querySelector('body').appendChild(script)
  })
  return (
    <>
      <Head>
        <title>Dive Buddy</title>
        <style
          dangerouslySetInnerHTML={{
            __html: '*{margin:0;padding:0;} html,body,#wrapper{width:100%;height:100%;} iframe{border - radius:0 !important;}'
          }}
        >
        </style>
      </Head>
      <div className={styles.wrapper}>
        <div id="wrapper" data-tf-widget="A0ap8Y4b" data-tf-inline-on-mobile data-tf-medium="snippet"></div>
      </div>
    </>
  )
}