// TODO: Move to a common config location

const apiUrl = (() => {

  switch (process.env.NODE_ENV) {
    case 'production':
      return 'http://codex-title-api.codexprotocol-staging.com' // change this when staging config is done

    case 'staging':
      return 'http://codex-title-api.codexprotocol-staging.com'

    default:
      return 'http://localhost:3001'
  }

})()

export default {
  apiUrl,
}
