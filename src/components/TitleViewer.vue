<template>
  <div class="container">
    <title-viewer-header button-name="Create title" v-on:showModal="showModal" />
    <div>
      <p>Network: {{ web3.network }}</p>
      <p>Account: {{ web3.account }}</p>
      <p>Balance: {{ web3.balance }}</p>
    </div>
    <div v-if="!titleDetail">
      <title-list v-on:viewTitleDetail="updateTitleDetail" />
      <b-modal ref="createTitleModalRef"
        title="Create a new Codex Title"
        ok-title="Create with MetaMask"
        @ok="createTitle"
      >
        <b-form-group>
          <b-form-input type="text" class="my-1" placeholder="Name" v-model="name" />
          <b-form-input type="text" class="my-1" placeholder="Description" v-model="description" />
          <b-form-input type="text" class="my-1" placeholder="Image URL" v-model="imageUrl" />
        </b-form-group>
      </b-modal>
    </div>
    <div v-if="titleDetail">
      <title-detail v-bind:codex-title="titleDetail" />
    </div>
  </div>
</template>

<script>
import TitleDetail from './TitleDetail';
import TitleViewerHeader from './TitleViewerHeader';
import TitleList from './TitleList';

export default {
  name: 'title-viewer',
  components: {
    TitleDetail,
    TitleViewerHeader,
    TitleList,
  },
  beforeCreate() {
    this.$store.dispatch('registerWeb3');
  },
  mounted() {
    this.$store.dispatch('getContract');
  },
  data() {
    return {
      name: null,
      description: null,
      imageUrl: null,
      titleDetail: null,
    };
  },
  methods: {
    showModal() {
      this.$refs.createTitleModalRef.show();
    },
    updateTitleDetail(title) {
      this.titleDetail = title;
    },
    createTitle(event) {
      event.preventDefault();

      const account = this.web3.account;
      this.contract().deployed().then((codexTitle) => {
        codexTitle.createToken(this.name, this.description, this.imageUrl, { from: account })
          .then(() => {
            this.$refs.createTitleModalRef.hide();
          });
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
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
