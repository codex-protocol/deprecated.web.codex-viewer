export default () => {
  return {
    lists: {
      userRecords: [],
      incomingTransfers: [],
      outgoingTransfers: [],
    },
    activeRecord: null,
    selectedRecordToTransfer: null,
    onTransferCallback: null,
  }
}
