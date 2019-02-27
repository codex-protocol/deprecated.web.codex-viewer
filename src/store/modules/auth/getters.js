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

  availableCODXBalance: (state) => {
    if (!state.user) return 0
    return state.user.codxBalance - state.user.reservedCODXBalance
  },
}
