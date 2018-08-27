import axios from 'axios'
import debug from 'debug'
import BigNumber from 'bignumber.js'

import getInitialState from './state'
import SocketService from '../../../util/socket'

const logger = debug('app:store:auth:mutations')

const logMutation = (mutationName, payload) => {
  logger(`${mutationName} mutation being executed`, payload)
}

export default {
  setAuthToken(currentState, newAuthToken) {
    logMutation('setAuthToken', newAuthToken)

    currentState.authToken = newAuthToken
    axios.defaults.headers.common.Authorization = newAuthToken

    SocketService.updateSocket(newAuthToken)

    window.localStorage.setItem('authToken', newAuthToken)
  },

  setUser(currentState, newUser) {
    logMutation('setUser', newUser)
    currentState.user = newUser
  },

  updateUser(currentState, newProperties) {
    logMutation('updateUser', newProperties)

    Object.assign(currentState.user, newProperties)
  },

  clearUserState(currentState) {
    logMutation('clearUserState')

    SocketService.disconnect()
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('hideSetup')
    delete axios.defaults.headers.common.Authorization

    // Reset state to its initial values
    Object.assign(currentState, getInitialState())

    currentState.authToken = null
  },

  updateTokenBalance(currentState, newBalance) {
    logMutation('updateTokenBalance', newBalance)

    currentState.balance = newBalance
  },

  updatePersonalStakes(currentState, newPersonalStakes) {
    logMutation('updatePersonalStakes', newPersonalStakes)

    currentState.personalStakes = newPersonalStakes
  },

  updateCreditBalance(currentState, newBalance) {
    logMutation('updateCreditBalance', newBalance)

    currentState.creditBalance = newBalance
  },

  updateApprovalStatus(currentState, payload) {
    const {
      allowance,
      stateProperty,
    } = payload

    logMutation('updateApprovalStatus', payload)

    // The approval exposed in the UI is not a binary operation, but it does
    //  approve the contract's allowance to a high value (2^255).
    // Here we check to see if it's greater than 1 token, and if so assume that
    //  approval has taken place.
    // If somehow the user has used so many tokens that their allowance is now low,
    //  they'll need to re-approve the contract for more.
    currentState[stateProperty] = allowance.greaterThan(new BigNumber('10e18'))
  },

  hideSetup(currentState) {
    logMutation('hideSetup')

    currentState.hideSetup = true

    window.localStorage.setItem('hideSetup', true)
  },
}
