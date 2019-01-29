import callContract from './web3/callContract'
import identityProxy from './api/identityProxy'

const contractHelper = ((contractName, functionName, args, store) => {

  const { recordContract } = store.state.web3
  const { user } = store.state.auth

  if (user.type === 'savvy') {
    if (contractName === 'CodexRecord') {
      return callContract(recordContract.methods[functionName](...args))
    }
    return null
  }

  return identityProxy.contractCall(contractName, functionName, args)

})

export default contractHelper
