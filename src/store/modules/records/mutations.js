import debug from 'debug'

const logger = debug('app:store:records:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_RECORDS(currentState, { listName, records }) {
    logMutation('SET_RECORDS', listName, records)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    currentState[listName] = records.filter((record) => {
      return !!record.metadata
    }) || []
  },

  ADD_RECORD_TO_LIST(currentState, { listName, record }) {
    logMutation('ADD_RECORD_TO_LIST', listName, record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    const alreadyExists = currentState[listName].some((codexRecord) => {
      return codexRecord.tokenId === record.tokenId
    })

    if (!alreadyExists) {
      currentState[listName].push(record)
    }
  },

  REMOVE_RECORD_FROM_LIST(currentState, { listName, record }) {
    logMutation('REMOVE_RECORD_FROM_LIST', listName, record)

    currentState[listName] = currentState[listName].filter((codexRecord) => {
      return codexRecord.tokenId !== record.tokenId
    })
  },
}
