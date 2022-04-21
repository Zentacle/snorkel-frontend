import { sendEvent } from 'hooks/amplitude';
import { clientSideDomain } from "src/lib/constants";
import * as ga from 'lib/ga';

const useGoogleButton = (redirectURL, user) => () => {
    if (!user) { return }
    if (user && user.id) { return }
    const handleLogin = (response) => {
        if (response.authorization) {
            fetch(`${clientSideDomain}/user/apple_register`, {
                method: 'POST',
                body: JSON.stringify(response.authorization),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                sendEvent('apple_register_success');
                ga.event({
                    action: "sign_up",
                    params: {
                        'method': "Apple Button"
                    }
                })
                window.location.href = redirectURL
            })
        } else {
            sendEvent('apple_register_error');
        }
    }

    const initializeGSI = () => {
        // Listen for authorization success.
        document.addEventListener('AppleIDSignInOnSuccess', (event) => {
            // Handle successful response.
            handleLogin(event.detail)
        });

        // Listen for authorization failures.
        document.addEventListener('AppleIDSignInOnFailure', (event) => {
            // Handle error.
            console.log(event.detail.error);
        });
    }
    const script = document.createElement('script')
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
    script.onload = setTimeout(initializeGSI, 1000)
    script.async = true;
    document.querySelector('body').appendChild(script)
}


export default useGoogleButton;