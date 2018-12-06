export default {
  widget: window.StripeCheckout.configure({
    key: process.env.VUE_APP_STRIPE_PUBLIC_KEY,
    image: 'https://s3-us-west-2.amazonaws.com/codex.registry-production/assets/stripe-checkout-icon.png',
    locale: 'auto',
    zipCode: true,
    billingAddress: process.env.VUE_APP_TARGET_ENV === 'production',
  }),
}
