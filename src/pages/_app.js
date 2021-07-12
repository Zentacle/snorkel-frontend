import React from 'react';
import '../styles/globals.css'
import { UserProvider, useCurrentUser } from 'src/context/usercontext';
import useUser from 'lib/useUser';
import { rootDomain } from "src/lib/constants";
function MyApp({ Component, pageProps }) {


  React.useEffect(() => {
    
  }, []);

  return (
    <UserProvider>
      <SetUser></SetUser>
      <Component {...pageProps} />
    </UserProvider>
  )
}

function SetUser() {
  const { dispatch } = useCurrentUser();
  
  React.useEffect(() => {
    
    fetch(`${rootDomain}/user/me`, {
      method: 'GET',
      //body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json()
    }).then(data => {
     
      dispatch(data)
     
    }).catch((err) => {
      
      console.log(err)

    })
    

  }, [])
 
  return null;

}

export default MyApp
