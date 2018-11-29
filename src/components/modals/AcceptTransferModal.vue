<template>
  <MetaMaskNotificationModal
    id="acceptTransferModal"
    title="Accept Codex Record"
    ok-title="Accept transfer"
    cancel-variant="outline-primary"
    :ok-method="acceptTransfer"
    :requires-tokens="true"
  >
    Accept transfer
  </MetaMaskNotificationModal>
</template>

<script>
import { mapState } from 'vuex'

import contractHelper from '../../util/contractHelper'
import EventBus from '../../util/eventBus'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'ApproveTransferModal',

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
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)

          // @NOTE: leave the in the loading state so that they can't click the
          //  buttons while the transaction is waiting to be mined
          //
          // @TODO: figure out a way to persit this across route changes (local
          //  storage?)
          //
          // this.isLoading = false

          if (typeof this.onTransferCallback === 'function') {
            this.onTransferCallback()
          }
        })
    },
  },
}
</script>
