<template>
  <div>
    <b-button @click="metamaskLogin">Login with MetaMask</b-button>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    metamaskLogin() {
      const account = this.web3.account
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Title Registry.'

      this.web3.instance().currentProvider.sendAsync({
        method: 'personal_sign',
        params: [
          account,
          this.web3.instance().toHex(personalMessageToSign),
        ],
      }, (error, result) => {
        if (error) console.log(error)
        else {
          this.$store.dispatch('sendAuthRequest', {
            userAddress: account,
            signedData: result.result.substr(2),
          }).then(() => {
            this.$router.push('my-titles')
          })
        }
      })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
}
</script>

<style>

</style>
