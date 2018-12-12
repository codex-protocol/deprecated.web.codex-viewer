import config from '../config'

export default {
  getTxUrl(txHash) {
    return `${config.etherScanUrl}/tx/${txHash}`
  },
  getAddressUrl(address) {
    return `${config.etherScanUrl}/address/${address}`
  },
  getTokenUrl(tokenAddress, userAddress) {
    return `${config.etherScanUrl}/token/${tokenAddress}${userAddress ? `?a=${userAddress}` : ''}`
  },
}
