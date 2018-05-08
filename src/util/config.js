// TODO: Move to a common config location

const apiUrl = (() => {

  switch (process.env.TARGET_ENV) {
    case 'production':
      return 'http://ec2-34-238-117-54.compute-1.amazonaws.com'

    case 'staging':
      return 'http://codex-title-api.codexprotocol-staging.com'

    default:
      return 'http://localhost:3001'
  }

})()

export default {
  apiUrl,
}
