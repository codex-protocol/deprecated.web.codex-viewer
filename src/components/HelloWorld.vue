<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Network: {{ web3.network }}</p>
    <p>Account: {{ web3.account }}</p>
    <p>Balance: {{ web3.balance }}</p>
    <p>Input title details here</p>
    <input type="text" placeholder="Name" v-model="name" />
    <input type="text" placeholder="Description" v-model="description" />
    <input type="text" placeholder="Image URL" v-model="imageUrl" />
    <b-button v-on:click="createTitle">Create title</b-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  beforeCreate() {
    this.$store.dispatch('registerWeb3');
  },
  mounted() {
    this.$store.dispatch('getContract');
  },
  data() {
    return {
      title: 'Codex Title Viewer',
      name: null,
      description: null,
      imageUrl: null,
    };
  },
  methods: {
    createTitle() {
      const account = this.web3.account;
      this.contract().deployed().then((codexTitle) => {
        codexTitle.createToken(this.name, this.description, this.imageUrl, { from: account });
      });
    },
  },

  // TODO: Do some reading on how computeds work with Vuex
  // e.g., Does this dynamically get updated when $store.state changes?
  computed: {
    web3() {
      return this.$store.state.web3;
    },
    contract() {
      return this.$store.state.contractInstance;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
a {
  color: #42b983;
}
</style>
