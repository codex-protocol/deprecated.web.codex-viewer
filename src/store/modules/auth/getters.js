export default {
  isAuthenticated: (state) => {
    return !!state.authToken && !!state.user
  },

  isAdmin: (state) => {
    return state.user && state.user.isAdmin
  },

  isNotSavvyUser: (state) => {
    return state.user && state.user.type !== 'savvy'
  },
}
