export default {
  isAuthenticated: (state) => {
    return !!state.user
  },

  isAdmin: (state) => {
    return state.user && state.user.isAdmin
  },

  isSimpleUser: (state) => {
    return state.user && state.user.type === 'simple'
  },
}
