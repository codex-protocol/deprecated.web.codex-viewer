export default {
  getOAuth2ClientNameFromAddress(currentState) {
    return (address, includeCheckmark = false) => {
      const name = currentState.clientNameMap[address]

      if (!name) {
        return address
      }

      return `${includeCheckmark ? '✅ ' : ''}${currentState.clientNameMap[address]}`

    }
  },
}
