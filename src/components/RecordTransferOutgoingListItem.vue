<template>
  <b-card
    :img-src="codexRecord.metadata | getMainImageUri"
    img-top
  >
    <div class="approved-overlay" v-if="this.cancelApproved">
      <p>Transfer Cancelled</p>
      <b-button variant="secondary" @click.prevent="viewRecord">View Asset</b-button>
    </div>
    <p class="name"><a href="#" @click.prevent="viewRecord">{{ codexRecord.metadata.name }}</a></p>
    <p class="address">Sent to {{ codexRecord.approvedAddress }}</p>
    <p class="action-buttons">
      <b-button variant="outline-primary" @click.prevent="cancelTransfer">Cancel</b-button>
    </p>
  </b-card>
</template>

<script>
import EventBus from '../util/eventBus'
import { ZeroAddress } from '../util/constants/web3'
import contractHelper from '../util/contractHelper'

export default {

  props: ['codexRecord'],

  data() {
    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      cancelApproved: false,
    }
  },

  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },

    cancelTransfer() {
      const input = [ZeroAddress, this.codexRecord.tokenId]

      return contractHelper('CodexRecord', 'approve', input, this.$store)
        .then(() => {
          EventBus.$emit('events:record-transfer-cancel', this.codexRecord.tokenId)
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)
          this.cancelApproved = true
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not cancel transfer: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()

  .approved-overlay
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: $color-primary

    p
      font-weight: 600

  p
    color: $color-secondary

    &.name
      font-weight: 600

    &.address
      font-weight: 300

  .action-buttons
    button
      width: 100%

      &+button
        margin-top: 1rem

</style>
