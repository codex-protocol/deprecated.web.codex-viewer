import callApi from './callApi'

export default {
  getGalleries: () => {
    const requestOptions = {
      method: 'get',
      url: '/galleries',
    }

    return callApi(requestOptions)
  },

  searchGalleryRecords: (galleryShareCode, { query, limit = 5, order = 'metadata.name' }) => {
    const requestOptions = {
      method: 'get',
      url: `/galleries/${galleryShareCode}/records`,
      params: {
        limit,
        order,
        query,
      },
    }

    return callApi(requestOptions)

  },

  getGalleryRecords: (galleryShareCode, { limit, order, offset }) => {
    const requestOptions = {
      method: 'get',
      url: `/galleries/${galleryShareCode}/records`,
      params: {
        limit,
        order,
        offset,
      },
    }

    return callApi(requestOptions, true)
      .then(({ totalCount, result: records }) => {
        return { totalCount, records }
      })
  },

  getGallery: (galleryShareCode) => {
    const requestOptions = {
      method: 'get',
      url: `/galleries/${galleryShareCode}`,
    }

    return callApi(requestOptions)
  },

  // @TODO: uncomment when "user galleries" is a thing
  //
  // getUserGalleries: () => {
  //   const requestOptions = {
  //     method: 'get',
  //     url: '/user/galleries',
  //   }
  //
  //   return callApi(requestOptions)
  // },
  //
  // createGallery: (metadata) => {
  //   const requestOptions = {
  //     method: 'post',
  //     url: '/users/galleries',
  //     data: metadata,
  //   }
  //
  //   return callApi(requestOptions)
  // },
  //
  // updateGallery: (galleryId, galleryData) => {
  //   const requestOptions = {
  //     method: 'put',
  //     url: `/users/galleries/${galleryId}`,
  //     data: galleryData,
  //   }
  //
  //   return callApi(requestOptions)
  // },
  //
  // deleteGallery: (galleryId) => {
  //   const requestOptions = {
  //     method: 'delete',
  //     url: `/users/galleries/${galleryId}`,
  //   }
  //
  //   return callApi(requestOptions)
  // },

}
