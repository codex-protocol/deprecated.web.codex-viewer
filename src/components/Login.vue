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
          console.log(result)

          fetch('http://ec2-34-238-117-54.compute-1.amazonaws.com:3000//auth-token', {
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              userAddress: account,
              signedData: result.result.substr(2),
            }),
            method: 'POST',
          }).then(response => response.json())
            .then((response) => {
              if (response.error) console.log(response.error)
              else {
                this.$store.commit('setAuthToken', response.result.token)
                this.$router.push('my-titles')
              }
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
