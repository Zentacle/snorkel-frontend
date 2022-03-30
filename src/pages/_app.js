import React, { useEffect } from 'react';
import { initAmplitude } from 'hooks/amplitude';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';

import '../styles/globals.css'
import { UserProvider, useCurrentUser } from 'src/context/usercontext';
import { clientSideDomain } from "src/lib/constants";

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:type" content="website" key="og:type" />
        <meta name="twitter:card" content="summary_large_image" key="twitter-card"></meta>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://www.zentacle.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.zentacle.com/search?query={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }`
          }}
          key="seo-search"
        />
      </Head>
      <UserProvider>
        <SetUser></SetUser>
        <CssBaseline />
        <Component {...pageProps} />
      </UserProvider>
    </>
  )
}

function SetUser() {
  const { dispatch } = useCurrentUser();

  React.useEffect(() => {
    fetch(`${clientSideDomain}/user/me`, {
      method: 'GET',
      
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json()
    }).then(data => {
      initAmplitude(data.id);
      dispatch(data)
    }).catch((err) => {
      console.log(err)
    })

  }, [])

  return null;

}

export default MyApp
