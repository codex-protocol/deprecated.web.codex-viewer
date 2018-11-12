export default {
  filteredUserRecords: (state) => {
    return state.userRecords.filter((record) => {
      return !!record.metadata
    })
  },
}
