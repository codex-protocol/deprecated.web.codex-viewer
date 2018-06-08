import { logTrack } from './log'
import events from './events'

const provider = process.env.ANALYTICS_PROVIDER

const analytics = {
  track(event, params) {
    switch (provider) {
      case 'log':
        logTrack(event, params)
        break
      default:
        break
    }
  },
}

events(analytics)

export default analytics
