import debug from 'debug'

import Record from '../../../util/api/record'
import Transfer from '../../../util/api/transfer'

const logger = debug('app:store:records:actions')

export default {
  GET_USER_DATA({ dispatch }) {
    dispatch('GET_USER_RECORDS')
    dispatch('GET_INCOMING_TRANSFERS')

    // @note: we may be able to defer this
    dispatch('GET_OUTGOING_TRANSFERS')
  },

  GET_USER_RECORDS({ commit }) {
    logger('GET_USER_RECORDS action being executed')

    Record.getUserRecords()
      .then((records) => {
        commit('SET_RECORDS', {
          listName: 'userRecords',
          records,
        })
      })
      // .catch((error) => {
      //   EventBus.$emit('toast:error', `Could not get collection: ${error.message}`)
      // })
  },

  GET_INCOMING_TRANSFERS({ commit }) {
    logger('GET_INCOMING_TRANSFERS action being executed')

    Transfer.getIncomingTransfers()
      .then((records) => {
        commit('SET_RECORDS', {
          listName: 'incomingTransfers',
          records,
        })
      })
      // .catch((error) => {
      //   EventBus.$emit('toast:error', `Could not fetch ${transferDirection} transfers: ${error.message}`)
      // })
  },

  GET_OUTGOING_TRANSFERS({ commit }) {
    logger('GET_OUTGOING_TRANSFERS action being executed')

    Transfer.getOutgoingTransfers()
      .then((records) => {
        commit('SET_RECORDS', {
          listName: 'outgoingTransfers',
          records,
        })
      })
  },
}
