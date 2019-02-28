import callApi from './callApi'

export default {
  getAuctionHouses: () => {
    const requestOptions = {
      method: 'get',
      url: '/auction-houses',
    }

    return callApi(requestOptions)
  },

  searchAuctionHouseRecords: (auctionHouseShareCode, { query, limit = 5, order = 'metadata.name' }) => {
    const requestOptions = {
      method: 'get',
      url: `/auction-house/${auctionHouseShareCode}/records`,
      params: {
        limit,
        order,
        query,
      },
    }

    return callApi(requestOptions)

  },

  getAuctionHouseRecords: (auctionHouseShareCode, { limit, order, offset, filters }) => {
    const requestOptions = {
      method: 'get',
      url: `/auction-house/${auctionHouseShareCode}/records`,
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

  getAuctionHouse: (auctionHouseShareCode) => {
    const requestOptions = {
      method: 'get',
      url: `/auction-house/${auctionHouseShareCode}`,
    }

    return callApi(requestOptions)
  },

}
