<template>
  <b-modal id="createTitleModal"
    title="Initialize title"
    ok-title="Create with MetaMask"
    v-model="modalVisible"
    v-on:shown="focusModal"
    v-on:ok="createTitle"
  >
    <b-form-group
      label="Image link" label-for="imageUri" label-size="sm" label-class="text-secondary"
    >
      <b-form-input
        id="imageUri"
        type="text"
        class="mb-4"
        placeholder="https://site.com/image.png"
        ref="defaultModalFocus"
        v-model="imageUri"
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
        :rows="3"
        :max-rows="10"
        v-model="description"
      />
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  name: 'create-title-modal',
  data() {
    return {
      name: null,
      description: null,
      imageUri: null,
      modalVisible: false,
    }
  },
  methods: {
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    createTitle(event) {
      event.preventDefault()

      const account = this.web3.account
      this.contract().deployed().then((contract) => {
        contract.mint(account, this.name, this.description, this.imageUri, { from: account })
          .then(() => {
            this.modalVisible = false
          })
      })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    contract() {
      return this.$store.state.contractInstance
    },
  },
}
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
