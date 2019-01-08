import debug from 'debug'

import events from './events'
import EventBus from '../eventBus'
import googleTrack from './google'

const logger = debug('app:util:analytics')

const track = (category, action, label, value) => {
  switch (process.env.VUE_APP_ANALYTICS_PROVIDER) {
    case 'log':
      logger(`Tracking the event ${category}:${action}:${label}:${value}`)
      break

    case 'google':
      logger(`Sending Google the event: ${category}:${action}:${label}:${value}`)
      googleTrack(category, action, label, value)
      break

    default:
      break
  }
}

Object.keys(events).forEach((eventName) => {
  EventBus.$on(eventName, (label, value) => {
    track(
      events[eventName].category,
      events[eventName].action,
      label,
      value,
    )
  })
})
