import callApi from './callApi'

export default {
  getPublicCollections: () => {
    const requestOptions = {
      method: 'get',
      url: '/public-collection',
    }

    return callApi(requestOptions)
  },

  getPublicCollection: (shareCode) => {
    const requestOptions = {
      method: 'get',
      url: `/public-collection/${shareCode}`,
    }

    return callApi(requestOptions)
  },

  searchRecords: (shareCode, { query, limit = 5, order = 'metadata.name' }) => {
    const requestOptions = {
      method: 'get',
      url: `/public-collection/${shareCode}/records`,
      params: {
        limit,
        order,
        query,
      },
    }

    return callApi(requestOptions)

  },

  getRecords: (shareCode, { limit, order, offset, filters }) => {
    const requestOptions = {
      method: 'get',
      url: `/public-collection/${shareCode}/records`,
      params: {
        limit,
        order,
        offset,
        filters,
      },
    }

    return callApi(requestOptions, true)
      .then(({ totalCount, result: records }) => {
        return { totalCount, records }
      })
  },

}
