import debug from 'debug'

import { mixpanelTrack } from './mixpanel'
import events from './events'

const logger = debug('app:util:analytics')
const provider = process.env.VUE_APP_ANALYTICS_PROVIDER

const analytics = {
  track(event, params) {
    switch (provider) {
      case 'log':
        logger(`Tracking the event ${event}`, params)
        break
      case 'mixpanel':
        mixpanelTrack(event, params)
        break
      default:
        break
    }
  },
}

events(analytics)

export default analytics
