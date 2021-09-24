import { sendEvent } from 'hooks/amplitude';
import { clientSideDomain } from "src/lib/constants";
import * as ga from 'lib/ga';

const useGoogleOneTap = (redirectURL, user) => () => {
  if (!user) { return }
  if (user && user.id) { return }
  const handleLogin = (response) => {
    if (response.credential) {
      fetch(`${clientSideDomain}/user/google_register`, {
        method: 'POST',
        body: JSON.stringify(response),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        sendEvent('google_register_success');
        ga.event({
          action: "sign_up",
          params: {
            'method': "Google One Tap"
          }
        })
        window.location.href = redirectURL
      })
    } else {
      sendEvent('google_register_error');
    }
  }

  const initializeGSI = () => {
    if (google) {
      google.accounts.id.initialize({
        client_id: '609299692665-bl3secuu5i4v1iumjm0kje0db1lge1ec.apps.googleusercontent.com',
        callback: handleLogin,
      });
      google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed()) {
          sendEvent('onetap_error', {
            'reason': notification.getNotDisplayedReason(),
          })
        } else if (notification.isSkippedMoment()) {
          sendEvent('onetap_error', {
            'reason': notification.getSkippedReason(),
          })
        } else if (notification.isDismissedMoment()) {
          sendEvent('onetap_error', {
            'reason': notification.getDismissedReason(),
          })
        } else {
          sendEvent('onetap_view');
        }
      });
    }
  }
  setTimeout(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = setTimeout(initializeGSI, 1000)
    script.defer = true;
    document.querySelector('body').appendChild(script)
  }, 3000)
}

export default useGoogleOneTap;