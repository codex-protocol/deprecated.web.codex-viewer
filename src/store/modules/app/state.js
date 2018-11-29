import Faucet from '../../../util/api/faucet'

const stripeHandler = !process.env.VUE_APP_STRIPE_PUBLIC_KEY
  ? null
  : window.StripeCheckout.configure({
    key: process.env.VUE_APP_STRIPE_PUBLIC_KEY,
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    zipCode: true,
    billingAddress: process.env.VUE_APP_TARGET_ENV === 'production',
    token: (token) => {
      Faucet.purchaseCODX(token.id)
        .catch((error) => {
          console.log(JSON.stringify(error))
          throw error
        })
    },
  })

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
    stripeHandler,
  }
}
