<template>
  <div>
    <b-jumbotron
      header="Codex Title Viewer"
      lead="Decentralized application for viewing Codex Titles"
    >
      <p>Login with MetaMask to create new titles or view titles in your collection</p>
      <b-button @click="metamaskLogin">Login with MetaMask</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: 'login-view',
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
        if (error) {
          console.log(error)
        } else {
          // This will be populated if the user rejects the signature prompt
          if (result.error) {
            console.log(result.error)
            return
          }

          this.$store.dispatch('sendAuthRequest', {
            userAddress: account,
            signedData: result.result.substr(2),
          }).then(() => {
            this.$router.replace('collection')
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
