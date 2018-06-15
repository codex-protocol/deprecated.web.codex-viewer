import { getApi, postApi } from './helpers'

export default {
  getAllEligibleGiveaways: () => {
    return getApi('/giveaways')
      .then((response) => {
        return response.data.result
      })
  },
  participateInGiveaway: (giveawayId) => {
    return getApi(`/user/giveaway/${giveawayId}`)
  },

  // Admin functions
  createNewGiveaway: () => {
    return postApi('/giveaways')
  },
}
