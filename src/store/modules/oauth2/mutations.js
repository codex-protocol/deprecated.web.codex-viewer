export default {
  setOAuth2Clients(currentState, newOAuth2Clients) {

    const newClientNameMap = {}

    newOAuth2Clients.forEach((oAuth2Client) => {
      newClientNameMap[oAuth2Client.user.address] = oAuth2Client.user.name
    })

    currentState.oAuth2Clients = newOAuth2Clients
    currentState.clientNameMap = newClientNameMap
  },
}
