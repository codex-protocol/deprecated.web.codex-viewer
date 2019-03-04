<template>
  <MetaMaskNotificationModal
    v-if="codexRecord"
    id="acceptTransferModal"
    title="Accept Codex Record"
    ok-title="Accept transfer"
    cancel-variant="outline-primary"
    :ok-method="acceptTransfer"
    checkout-title="Accept Codex Record"
  >
    <template slot="checkout">
      <h3>{{ codexRecord.metadata.name }}</h3>
      <div class="image-container">
        <img :src="codexRecord.metadata | getMainImageUri" />
      </div>
      <div class="description">{{ codexRecord.metadata.description }}</div>
    </template>

    <b-alert variant="secondary" show>
      The current owner of this Codex Record has made it <strong>{{ codexRecord.isPrivate ? 'private' : 'publicly visible' }}</strong>.
      After accepting this transfer, the privacy settings will remain the same. You can update the privacy settings for this record on your Settings page after the transfer is complete.
    </b-alert>
  </MetaMaskNotificationModal>
</template>

<script>
import { mapState } from 'vuex'

import contractHelper from '../../util/contractHelper'
import EventBus from '../../util/eventBus'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {

  props: {
    codexRecord: Object,
  },

  components: {
    MetaMaskNotificationModal,
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('records', ['onTransferCallback']),
  },

  methods: {
    acceptTransfer() {
      const input = [
        this.codexRecord.ownerAddress,
        this.user.address,
        this.codexRecord.tokenId,
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'safeTransferFrom', input, this.$store)
        .then(() => {
          EventBus.$emit('events:record-transfer', this.codexRecord.tokenId)
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)

          if (typeof this.onTransferCallback === 'function') {
            this.onTransferCallback()
          }
        })
    },
  },
}
</script>
