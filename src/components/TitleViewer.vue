<template>
  <div class="container">
    <title-viewer-header button-name="Create title" v-on:showModal="showModal" />
    <account-details v-bind:web3="web3" />
    <div v-if="typeof titleId !== 'number'">
      <title-list v-bind:titles="titles" />
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
    <div v-if="typeof titleId === 'number'">
      <title-detail
        v-bind:codex-title="titles[titleId]"
        v-on:transferTitle="transferTitle"
      />
    </div>
  </div>
</template>

<script>
import AccountDetails from './AccountDetails';
import TitleDetail from './TitleDetail';
import TitleViewerHeader from './TitleViewerHeader';
import TitleList from './TitleList';

import mockTitlesArray from '../util/constants/mockTitles';

export default {
  name: 'title-viewer',
  components: {
    AccountDetails,
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
      titles: mockTitlesArray,
    };
  },
  methods: {
    showModal() {
      this.$refs.createTitleModalRef.show();
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
    transferTitle() {
      // TODO: Need another modal dialog to prompt for transfer details
      // const account = this.web3.account;
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
    titleId() {
      return this.$route.params.titleId;
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
