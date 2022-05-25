

let amplitude;
export const initAmplitude = (userId) => {
  if (process.browser) {
    amplitude = require('amplitude-js');
    if (userId) {
      amplitude.getInstance().init('b628782272a6f671076be09a7b6fb6b7', userId=userId);
    } else {
      amplitude.getInstance().init('b628782272a6f671076be09a7b6fb6b7');
    }
    amplitude.getInstance().logEvent('view_app');
  }
};

export const sendEvent = (event, obj) => {
  amplitude = require('amplitude-js');
  amplitude.getInstance().init('b628782272a6f671076be09a7b6fb6b7');
  amplitude.getInstance().logEvent(event, obj);
}

export const setAmplitudeUserId = (userId) => {
  amplitude = require('amplitude-js');
  amplitude.getInstance().init('b628782272a6f671076be09a7b6fb6b7');
  amplitude.getInstance().setUserId(userId);
}
