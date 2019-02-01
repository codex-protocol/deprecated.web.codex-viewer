import debug from 'debug'

import Record from '../../../util/api/record'
import Transfer from '../../../util/api/transfer'

const logger = debug('app:store:records:actions')

export default {
  FETCH_USER_DATA({ dispatch }) {

    // Don't block on any of these async actions
    // The UI will fill in as they are populated
    dispatch('FETCH_CURRENT_PAGE')
    dispatch('FETCH_INCOMING_TRANSFERS')
    dispatch('FETCH_OUTGOING_TRANSFERS')
  },

  REFRESH_USER_RECORDS({ commit, state }, { order = state.paginationOptions.order }) {
    logger('REFRESH_USER_RECORDS action being executed')

    const offset = 0
    const limit = state.paginationOptions.pageSize

    return Record.getUserRecords({ limit, offset, order })
      .then(({ totalCount, result: records }) => {
        commit('SET_PAGINATION_OPTIONS', { pageNumber: 0, offset: 0 })
        commit('SET_TOTAL_RECORD_COUNT', { totalCount })
        commit('SET_RECORDS', {
          listName: 'userRecords',
          records,
        })
      })
  },

  FETCH_CURRENT_PAGE({ commit, state }) {
    logger('FETCH_CURRENT_PAGE action being executed')

    const limit = state.paginationOptions.pageSize
    const offset = limit * state.paginationOptions.pageNumber

    return Record.getUserRecords({ limit, offset, order: state.paginationOptions.order })
      .then(({ totalCount, result: records }) => {
        commit('SET_TOTAL_RECORD_COUNT', { totalCount })
        commit('ADD_PAGE_TO_USER_RECORDS', {
          listName: 'userRecords',
          records,
        })
      })
  },

  FETCH_NEXT_PAGE({ commit, state, dispatch }) {
    logger('FETCH_NEXT_PAGE action being executed')
    commit('SET_PAGINATION_OPTIONS', { pageNumber: state.paginationOptions.pageNumber + 1 })
    dispatch('FETCH_CURRENT_PAGE')
  },

  FETCH_INCOMING_TRANSFERS({ commit }) {
    logger('FETCH_INCOMING_TRANSFERS action being executed')

    return Transfer.getIncomingTransfers()
      .then((records) => {
        commit('SET_RECORDS', {
          listName: 'incomingTransfers',
          records,
        })
      })
  },

  FETCH_OUTGOING_TRANSFERS({ commit }) {
    logger('FETCH_OUTGOING_TRANSFERS action being executed')

    return Transfer.getOutgoingTransfers()
      .then((records) => {
        commit('SET_RECORDS', {
          listName: 'outgoingTransfers',
          records,
        })
      })
  },

  FETCH_RECORD({ commit, state }, tokenId) {
    logger('FETCH_RECORD action being executed', tokenId)

    // First, check to see if we've cached this in the userRecords array
    const existingRecord = state.lists.userRecords.find((userRecord) => {
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

  IGNORE_RECORD({ commit }, codexRecord) {
    Transfer.ignoreIncomingTransfer(codexRecord.tokenId)
      .then((record) => {
        commit('UPDATE_RECORD_IN_LISTS', record)

        commit('REMOVE_RECORD_FROM_LIST', {
          listName: 'incomingTransfers',
          record,
        })
      })
  },
}
