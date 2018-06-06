<template>
  <b-modal
    :ref="id"
    :id="id"
    :title="title"
    :ok-title="okTitle"
    :cancel-variant="cancelVariant"
    :ok-disabled="isDisabled"
    :size="modalSize"
    v-model="modalVisible"
    v-on:shown="shown"
    v-on:ok="showMetamaskNotification"
  >
    <slot v-if="!this.metamaskNotificationVisible"></slot>
    <div v-else>
      You are about to use Metamask.
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'meta-mask-notification-modal',
  props: [
    'id',
    'title',
    'okTitle',
    'cancelVariant',
    'okDisabled',
    'okMethod',
    'size',
    'onShown',
    'onClear',
    'clearData',
  ],
  data() {
    return {
      metamaskNotificationVisible: false,
      modalVisible: false,
    }
  },
  methods: {
    showMetamaskNotification(event) {
      if (this.metamaskNotificationVisible) {
        this.okMethod(event)
          .then(() => {
            this.modalVisible = false
          })
          .catch((error) => {
            console.error('There was an error completing the transaction', error)
          })
      } else {
        event.preventDefault()
        this.metamaskNotificationVisible = true
      }
    },
  },
  computed: {
    shown() {
      return this.onShown || this.noop
    },
    noop() {
      return () => {}
    },
    isDisabled() {
      return this.okDisabled || false
    },
    modalSize() {
      return this.size || ''
    },
  },
  watch: {
    modalVisible(newVisibility) {
      // Reset to first screen
      if (!newVisibility) {
        this.metamaskNotificationVisible = false
      }
      // When the modal dialog is closed, we reset the component data
      if (!newVisibility && this.clearData) {
        this.onClear()
      }
    },
  },
}
</script>
