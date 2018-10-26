export default () => {
  return {
    // The web3 object
    instance: null,

    // Smart contract abstractions
    recordContract: null,
    tokenContract: null,
    stakeContract: null,

    // Savvy-user specific state
    registrationError: null,
    providerAccount: null,
    isPolling: false,
  }
}
