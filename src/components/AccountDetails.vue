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
  props: ['web3'],
};
</script>
