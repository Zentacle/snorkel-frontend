

let amplitude;
export const initAmplitude = (userId) => {
  console.log(process.browser);
  if (process.browser) {
    amplitude = require('amplitude-js');
    if (userId) {
      amplitude.getInstance().init('b628782272a6f671076be09a7b6fb6b7', userId=userId);
    } else {
      amplitude.getInstance().init('b628782272a6f671076be09a7b6fb6b7');
    }
    console.log('initialized');
  }
};

export const sendEvent = (event, obj) => {
  amplitude = require('amplitude-js');
  amplitude.getInstance().logEvent(event, obj);
}

export const setAmplitudeUserId = (userId) => {
  amplitude = require('amplitude-js');
  amplitude.getInstance().setUserId(userId);
}