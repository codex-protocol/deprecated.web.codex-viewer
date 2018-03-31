<template>
  <div>
    <p>Network: {{ web3.network }}</p>
    <p>Account: {{ web3.account }}</p>
    <p>Balance: {{ web3.balance }}</p>
  </div>
</template>

<script>
export default {
  name: 'account-details',
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
}
</script>
