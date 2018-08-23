import store from '../../store/'
import { Web3Errors } from '../../util/constants/web3'

const pollWeb3 = (router) => {
  const web3 = store.state.web3.instance

  setInterval(() => {
    if (web3) {
      web3().eth.getAccounts((error, accounts) => {
        if (error) {
          store.commit('web3/setWeb3Error', {
            message: 'Error while polling web3',
            error: Web3Errors.Unknown,
          })
        } else if (!accounts.length) {
          store.commit('web3/setWeb3Error', {
            message: 'MetaMask is locked',
            error: Web3Errors.Locked,
          })
        } else if (store.state.web3.account !== accounts[0]) {
          store.dispatch('auth/logout', router, {
            root: true,
          })

          store.dispatch('web3/pollWeb3', {
            account: accounts[0],
          })
        }
      })
    }
  }, 1000)
}

export default pollWeb3
