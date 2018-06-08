// TODO: Move to a common config location

const apiUrl = (() => {

  switch (process.env.TARGET_ENV) {
    case 'production':
      return 'https://codex-registry-api.codexprotocol.com'

    case 'staging':
      return 'http://codex-registry-api.codexprotocol-staging.com'

    default:
      return 'http://localhost:3001'
  }

})()

const etherScanUrl = (() => {
  switch (process.env.TARGET_ENV) {
    case 'production':
      return 'https://etherscan.io/'

    case 'staging':
      return 'https://rinkeby.etherscan.io/'

    default:
      return 'https://rinkeby.etherscan.io/'
  }
})()

export {
  apiUrl,
  etherScanUrl,
}
