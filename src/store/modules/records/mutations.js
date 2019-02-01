import Vue from 'vue'
import debug from 'debug'

import getInitialState from './state'

const logger = debug('app:store:records:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {

  RESET_STATE(currentState) {
    logMutation('records/RESET_STATE')
    Object.assign(currentState, getInitialState())
  },

  SET_TOTAL_RECORD_COUNT(currentState, { totalCount }) {
    logMutation('SET_TOTAL_RECORD_COUNT', totalCount)
    if (Number.isNaN(totalCount)) {
      logger('SET_TOTAL_RECORD_COUNT mutation called with non-number for totalCount:', totalCount)
      return
    }
    currentState.totalRecordCount = +totalCount
  },

  SET_PAGINATION_OPTIONS(currentState, { order = null, pageSize = null, pageNumber = null }) {
    logMutation('SET_PAGINATION_OPTIONS', order, pageSize, pageNumber)
    if (order !== null) currentState.paginationOptions.order = order
    if (pageSize !== null) currentState.paginationOptions.pageSize = pageSize
    if (pageNumber !== null) currentState.paginationOptions.pageNumber = pageNumber
  },

  ADD_PAGE_TO_USER_RECORDS(currentState, { records }) {
    logMutation('ADD_PAGE_TO_USER_RECORDS', records)

    const newRecords = records.filter((record) => {
      // Filter out any records that don't have metadata attached to them.
      //  These are records that were created by other providers.
      return record.metadata && !currentState.lists.userRecords.find((existingRecord) => {
        return existingRecord.tokenId === record.tokenId
      })
    })

    currentState.lists.userRecords.push(...newRecords)
  },

  SET_RECORDS(currentState, { listName, records = [] }) {
    logMutation('SET_RECORDS', listName, records)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    currentState.lists[listName] = records.filter((record) => {
      return !!record.metadata
    })
  },

  ADD_RECORD_TO_LIST(currentState, { listName, record }) {
    logMutation('ADD_RECORD_TO_LIST', listName, record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    const exists = currentState.lists[listName].find((existingRecord) => {
      return existingRecord.tokenId === record.tokenId
    })

    if (!exists) {
      // really, the record should be injected into the proper location based on
      //  the sorting choice, but that's super complicated and would often
      //  result in the record not even being shown in the list... so let's just
      //  always add it to the beginning
      currentState.lists[listName].unshift(record)
      if (listName === 'userRecords') currentState.totalRecordCount += 1
    }
  },

  REMOVE_RECORD_FROM_LIST(currentState, { listName, record }) {
    logMutation('REMOVE_RECORD_FROM_LIST', listName, record)

    currentState.lists[listName] = currentState.lists[listName].filter((codexRecord) => {
      return codexRecord.tokenId !== record.tokenId
    })
  },

  SET_ACTIVE_RECORD(currentState, record) {
    logMutation('SET_ACTIVE_RECORD_INDEX', record)

    currentState.activeRecord = record
  },

  SET_SELECTED_RECORD_TO_TRANSFER(currentState, { codexRecord, callback }) {
    logMutation('SET_SELECTED_RECORD_TO_TRANSFER', codexRecord)

    currentState.selectedRecordToTransfer = codexRecord
    currentState.onTransferCallback = callback
  },

  UPDATE_RECORD_IN_LISTS(currentState, record) {
    logMutation('UPDATE_RECORD_IN_LISTS', record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    // Update the record in each list that we've cached
    Object.keys(currentState.lists).forEach((listName) => {
      const listRecords = currentState.lists[listName]
      const index = listRecords.findIndex((listRecord) => {
        return listRecord.tokenId === record.tokenId
      })

      if (index !== -1) {
        Vue.set(listRecords, index, record)
      }
    })

    // Also update the active record if it's what the user is currently looking at
    if (currentState.activeRecord && currentState.activeRecord.tokenId === record.tokenId) {
      currentState.activeRecord = record
    }
  },
}
