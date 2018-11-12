import debug from 'debug'

const logger = debug('app:store:records:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_RECORDS(currentState, { listName, records }) {
    logMutation('SET_RECORDS', listName, records)

    currentState[listName] = records || []
  },

  ADD_RECORD_TO_LIST(currentState, { listName, record }) {
    logMutation('ADD_RECORD_TO_LIST', listName, record)

    currentState[listName].push(record)
  },

  REMOVE_RECORD_FROM_LIST(currentState, { listName, record }) {
    logMutation('REMOVE_RECORD_FROM_LIST', listName, record)

    currentState[listName] = currentState[listName].filter((codexRecord) => {
      return codexRecord.tokenId !== record.tokenId
    })
  },
}
