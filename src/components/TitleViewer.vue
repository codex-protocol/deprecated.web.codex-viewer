<template>
  <div class="container">
    <title-viewer-header button-name="Create title" v-on:showModal="showModal" />
    <div v-if="typeof titleId !== 'number'">
      <title-list v-bind:titles="titles" />
      <b-modal ref="createTitleModalRef"
        title="Initialize title"
        ok-title="Create with MetaMask"
        v-on:shown="focusModal"
        v-on:ok="createTitle"
      >
        <b-form-group
          label="Image link" label-for="imageUrl" label-size="sm" label-class="text-secondary"
        >
          <b-form-input
            id="imageUrl"
            type="text"
            class="mb-4"
            placeholder="https://site.com/image.png"
            ref="defaultModalFocus"
            v-model="imageUrl"
          />
        </b-form-group>
        <b-form-group
          label="Piece title" label-for="name" label-size="sm" label-class="text-secondary"
        >
          <b-form-input
            id="name"
            type="text"
            class="mb-4"
            placeholder="e.g., Figure with horses"
            v-model="name"
          />
        </b-form-group>
        <b-form-group
          label="Description" label-for="description" label-size="sm" label-class="text-secondary"
        >
          <b-form-textarea
            id="description"
            placeholder="Enter item description"
            v-bind:rows="3"
            v-bind:max-rows="10"
            v-model="description"
          />
        </b-form-group>
      </b-modal>
    </div>
    <div v-if="typeof titleId === 'number'">
      <title-detail
        v-bind:codex-title="titles[titleId]"
        v-on:transferTitle="transferTitle"
      />
    </div>
    <viewer-footer />
  </div>
</template>

<script>
import TitleDetail from './TitleDetail';
import TitleViewerHeader from './TitleViewerHeader';
import TitleList from './TitleList';
import ViewerFooter from './ViewerFooter';

import mockTitlesArray from '../util/constants/mockTitles';

export default {
  name: 'title-viewer',
  components: {
    TitleDetail,
    TitleViewerHeader,
    TitleList,
    ViewerFooter,
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
    focusModal() {
      this.$refs.defaultModalFocus.focus();
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

<style scoped>
h1 {
  font-weight: normal;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
