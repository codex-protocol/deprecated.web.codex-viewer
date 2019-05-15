export default () => {
  return {
    emailAddressToConfirm: null,
    pendingUserCode: null,
    passwordResetCode: null,
    passwordResetEmail: null,
    verifiedUsers: null,
    apiErrorCode: null,
    apiErrorMessage: null,
    isLoaded: false,
    postLoginDestination: null,
    giveaway: null,
    featuredCollections: [],
    publicCollections: [],
    auctionHouses: [],
    eventEmails: [],
    codxCosts: null,
    codxPackages: null,
    showNav: false,
    paymentsEnabled: !!process.env.VUE_APP_STRIPE_PUBLIC_KEY,
    $globalRefs: {},
  }
}
