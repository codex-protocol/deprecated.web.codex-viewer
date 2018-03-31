import store from '../store/'

function pollWeb3() {
  const web3 = store.state.web3.instance

  setInterval(() => {
    if (web3) {
      web3().eth.getAccounts((error, accounts) => {
        if (error) {
          console.log(error)
        } else if (store.state.web3.account !== accounts[0]) {
          web3().eth.getBalance(accounts[0], (balanceError, balance) => {
            if (balanceError) {
              console.log(balanceError)
            } else {
              store.dispatch('pollWeb3', {
                account: accounts[0],
                balance: parseInt(balance, 10),
              })
            }
          })
        }
      })
    }
  }, 500)
}

export default pollWeb3
