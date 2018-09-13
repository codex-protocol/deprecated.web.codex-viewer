export default {
  isAuthenticated: (state) => {
    return !!state.authToken
  },

  isAdmin: (state) => {
    return state.user && state.user.isAdmin
  },

  isSimpleUser: (state) => {
    return state.user && state.user.type === 'simple'
  },
}
