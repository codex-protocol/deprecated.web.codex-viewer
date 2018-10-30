import debug from 'debug'

const logger = debug('app:store:verified-users:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_ADDRESS_NAME_MAP(currentState, users) {
    logMutation('SET_ADDRESS_NAME_MAP', users)

    const newAddressNameMap = {}

    users.forEach((user) => {
      if (!user.name || !user.address) return
      newAddressNameMap[user.address.toLowerCase()] = user.name
    })

    currentState.addressNameMap = newAddressNameMap

  },
}
