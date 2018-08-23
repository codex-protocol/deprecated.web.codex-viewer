import { Web3Errors } from '../../../util/constants/web3'

export default () => {
  return {
    instance: null,
    network: null,
    account: null,
    isLoaded: false,
    error: Web3Errors.None,
    recordContractInstance: null,
    tokenContractInstance: null,
    stakeContractInstance: null,
  }
}
