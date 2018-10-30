export default {
  getVerifiedNameFromAddress(currentState) {
    return (address = '', includeCheckmark = false) => {

      if (!currentState.addressNameMap || !address) {
        return address
      }

      const name = currentState.addressNameMap[address.toLowerCase()]

      if (!name) {
        return address
      }

      return `${includeCheckmark ? '✅ ' : ''}${currentState.addressNameMap[address]}`

    }
  },
}
