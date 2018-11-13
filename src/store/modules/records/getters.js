export default {
  filteredIncomingTransfers: (state) => {
    return state.lists.incomingTransfers.filter((record) => {
      return record
    })
  },
}
