import callApi from './callApi'

export default {
  getIncomingTransfers: (includeIgnoredTransfers) => {
    const requestOptions = {
      method: 'get',
      url: '/user/transfers/incoming',
      params: {
        filters: {
          isIgnored: !!includeIgnoredTransfers,
        },
      },
    }

    return callApi(requestOptions)
  },

  getOutgoingTransfers: () => {
    const requestOptions = {
      method: 'get',
      url: '/user/transfers/outgoing',
    }

    return callApi(requestOptions)
  },

  ignoreIncomingTransfer: (tokenId) => {
    const requestOptions = {

      method: 'put',
      url: `/user/transfers/incoming/${tokenId}`,

      data: {
        isIgnored: true,
      },
    }

    return callApi(requestOptions)
  },
}
