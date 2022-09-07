import React, { useEffect } from 'react';
import { initAmplitude, setAmplitudeUserId } from 'hooks/amplitude';
import { setGAUserID } from 'lib/ga';
import Head from 'next/head';

import '../styles/globals.css'
import { UserProvider, useCurrentUser } from 'src/context/usercontext';
import { clientSideDomain } from "src/lib/constants";
import EmailBanner from 'components/EmailBanner';

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    initAmplitude();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:type" content="website" key="og:type" />
        <meta name="twitter:card" content="summary_large_image" key="twitter-card"></meta>
        <meta name="apple-itunes-app" content="app-id=1611242564" key="apple-app"></meta>
        <meta name="appleid-signin-client-id" content="org.reactjs.native.example.Zentacle-ios" />
        <meta name="appleid-signin-scope" content="name email" />
        <meta name="appleid-signin-redirect-uri" content="https://www.zentacle.com/api/user/apple_register" />
        <meta name="appleid-signin-state" content="password" />
        <meta name="appleid-signin-use-popup" content="true" />
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
        <Component {...pageProps} />
        <EmailBanner/>
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
      setGAUserID(data.id);
      setAmplitudeUserId(data.id);
      dispatch(data)
    }).catch((err) => {
      console.log(err)
    })

  }, [dispatch])

  return null;

}

export default MyApp
