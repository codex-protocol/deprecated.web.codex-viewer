import Mixpanel from 'mixpanel'

let mixpanel

if (process.env.VUE_APP_MIXPANEL_TOKEN) {
  mixpanel = Mixpanel.init(process.env.VUE_APP_MIXPANEL_TOKEN, {
    protocol: 'https',
  })
}

// if there's no VUE_APP_MIXPANEL_TOKEN, just return a noop
const mixpanelTrack = !process.env.VUE_APP_MIXPANEL_TOKEN ? Function.prototype : (event, params) => {
  if (params) {
    mixpanel.track(event, params)
  } else {
    mixpanel.track(event)
  }
}

export { mixpanelTrack } // eslint-disable-line import/prefer-default-export
