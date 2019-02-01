import callApi from './callApi'

export default {
  searchUserRecords: ({ query, limit = 5, order = 'metadata.name' }) => {
    const requestOptions = {
      method: 'get',
      url: '/user/records',
      params: {
        limit,
        order,
        query,
      },
    }

    return callApi(requestOptions)

  },

  getUserRecords: ({ limit, offset, order }) => {
    const requestOptions = {
      method: 'get',
      url: '/user/records',
      params: {
        limit,
        order,
        offset,
      },
    }

    return callApi(requestOptions, true)

  },

  getRecord: (recordId) => {
    const requestOptions = {
      method: 'get',
      url: `/record/${recordId}`,
    }

    return callApi(requestOptions)
  },

  createMetadata: (metadata) => {
    const requestOptions = {
      method: 'post',
      url: '/users/record-metadata',
      data: metadata,
    }

    return callApi(requestOptions)
  },

  updateRecord: (recordId, recordData) => {
    const requestOptions = {
      method: 'put',
      url: `/users/records/${recordId}`,
      data: recordData,
    }

    return callApi(requestOptions)
  },

  updateMetadata: (recordId, metadata) => {
    const requestOptions = {
      method: 'put',
      url: `/users/records/${recordId}/metadata`,

      data: metadata,
    }

    return callApi(requestOptions)
  },
}
