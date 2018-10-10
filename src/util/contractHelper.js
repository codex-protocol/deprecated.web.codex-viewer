import callContract from './web3/callContract'
import identityProxy from './api/identityProxy'

// eslint-disable-next-line consistent-return
const contractHelper = ((contractName, functionName, args, store) => {
  const { recordContract } = store.state.web3
  const { user } = store.state.auth

  switch (user.type) {
    case 'simple':
      return identityProxy.contractCall(contractName, functionName, args)
        .then((result) => {
          store.commit('auth/SPEND_GAS', {
            estimatedGas: result.value.tx.estimatedGas,
          })
        })

    case 'savvy':
      if (contractName === 'CodexRecord') {
        return callContract(recordContract[functionName], args)
      }
      break

    default:
      break
  }
})

export default contractHelper
