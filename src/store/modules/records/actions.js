import debug from 'debug'

import Record from '../../../util/api/record'
import Transfer from '../../../util/api/transfer'

const logger = debug('app:store:records:actions')

export default {
  FETCH_USER_DATA({ dispatch }) {

    // Don't block on any of these async actions
    // The UI will fill in as they are populated
    dispatch('GET_USER_RECORDS')
    dispatch('GET_INCOMING_TRANSFERS')
    dispatch('GET_OUTGOING_TRANSFERS')
  },

  GET_USER_RECORDS({ commit }) {
    logger('GET_USER_RECORDS action being executed')

    return Record.getUserRecords()
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

    return Transfer.getIncomingTransfers()
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

    return Transfer.getOutgoingTransfers()
      .then((records) => {
        commit('SET_RECORDS', {
          listName: 'outgoingTransfers',
          records,
        })
      })
  },

  GET_RECORD({ commit, state }, tokenId) {
    logger('GET_RECORD action being executed', tokenId)

    // First, check to see if we've cached this in the userRecords array
    const existingRecord = state.userRecords.find((userRecord) => {
      return userRecord.tokenId === tokenId
    })

    if (existingRecord) {
      commit('SET_ACTIVE_RECORD', existingRecord)
      return null
    }

    return Record.getRecord(tokenId)
      .then((record) => {
        commit('SET_ACTIVE_RECORD', record)
      })
  },

  UPDATE_RECORD({ commit }, { codexRecord, dataToUpdate }) {
    logger('UPDATE_RECORD action being executed', dataToUpdate)

    return Record.updateRecord(codexRecord.tokenId, dataToUpdate)
      .then((updatedRecord) => {
        commit('UPDATE_RECORD_IN_LISTS', updatedRecord)
      })
  },
}
