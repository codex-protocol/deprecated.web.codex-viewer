import Vue from 'vue'
import debug from 'debug'

const logger = debug('app:util:analytics')

export default !process.env.VUE_APP_GOOGLE_ANALYTICS_ID
  ? Function.prototype // if there's no VUE_APP_GOOGLE_ANALYTICS_ID, just return a noop
  : (category, action, label, value) => {

    if (value !== null && typeof value !== 'undefined' && typeof value !== 'number') {
      logger(`GA events can only have numeric "value" parameters, ignoring value of ${value}`)
      Vue.$ga.event(category, action, label)
      return
    }

    Vue.$ga.event(category, action, label, value)

  }
