import is from 'is_js'

export default () => {
  return {
    lists: {
      userRecords: [],
      incomingTransfers: [],
      outgoingTransfers: [],
    },

    activeRecord: null,
    totalRecordCount: 0,
    onTransferCallback: null,
    selectedRecordToTransfer: null,

    paginationOptions: {
      pageNumber: 0,
      order: '-createdAt',
      pageSize: is.mobile() ? 4 : 16,
    },
  }
}
