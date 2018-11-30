export default () => {
  return {
    emailAddressToConfirm: null,
    pendingUserCode: null,
    verifiedUsers: null,
    apiErrorCode: null,
    apiErrorMessage: null,
    isLoaded: false,
    postLoginDestination: null,
    giveaway: null,
    galleries: [],
    eventEmails: [],
    codxCosts: null,
    codxPackages: null,
    showNav: false,
    paymentsEnabled: !!process.env.VUE_APP_STRIPE_PUBLIC_KEY,
  }
}
