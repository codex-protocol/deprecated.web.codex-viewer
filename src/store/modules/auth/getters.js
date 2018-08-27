export default {
  isAuthenticated: (currentState) => {
    return !!currentState.authToken
  },
}
