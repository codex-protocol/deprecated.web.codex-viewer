<template>
  <div class="flex">
    <div class="vertical">
      <img :src="codexTitle.imageUri" />
      <div class="mt-3">
        <b-button v-if="showTransferButton" v-b-modal.transferTitleModal>Transfer title</b-button>
      </div>
    </div>
    <div class="top">
      <h1>{{ codexTitle.name }}</h1>
      <div>{{ codexTitle.description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-detail',
  props: ['codexTitle'],
  computed: {
    showTransferButton() {
      return this.$store.state.web3.account === this.codexTitle.ownerAddress
    },
  },
}
</script>

<style scope>
.flex {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.top {
  align-self: flex-start;
}
.vertical {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
img {
  max-height: 400px;
  max-width: 400px;
  margin-right: 30px;
}
</style>
