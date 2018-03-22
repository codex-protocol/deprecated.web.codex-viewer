<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Network: {{ web3.networkId }}</p>
    <p>Account: {{ web3.account }}</p>
    <p>Balance: {{ web3.balance }}</p>
    <p>Input title details here</p>
    <input type="text" placeholder="Name" v-model="name" />
    <input type="text" placeholder="Description" v-model="description" />
    <input type="text" placeholder="Image URL" v-model="imageUrl" />
    <input type="button" value="Create title" v-on:click="createTitle" />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  beforeCreate() {
    this.$store.dispatch('registerWeb3');
  },
  mounted() {
    this.$store.dispatch('registerContract');
  },
  data() {
    return {
      msg: 'Codex Title Viewer',
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
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
