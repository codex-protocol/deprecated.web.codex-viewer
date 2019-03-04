<template>
  <div>
    <h2>Provenance</h2>

    <table v-if="provenance">
      <tr v-for="row in provenance" :key="row.id">
        <td>{{ getEventDescription(row.type) }}</td>
        <td class="display-name-container"><DisplayName :name="getEventAddress(row)" /></td>
        <td>{{ getTimeSince(row.createdAt) }}</td>
        <td>
          <span v-if="row.type === 'modified' && row.codexRecordModifiedEvent.changedData">
            <b-button
              variant="link"
              class="show-modified-details"
              @click="showModifiedDetailsModal(row)"
            >
              <img src="../assets/icons/info.svg">
            </b-button>
          </span>
          <a :href="getTransactionUrl(row.transactionHash)" target="_blank">
            <img src="../assets/icons/share.svg">
          </a>
        </td>
      </tr>
    </table>

    <div v-else>
      <!--
        this would be an anomoly, since all records have at least one provenance
        event (the minted event)
      -->
      <p>There is no provenance to display for this Codex Record.</p>
    </div>

    <b-modal
      ok-only
      id="modifiedDetailsModal"
      title="Modification Details"
      v-model="modifiedDetailsModalVisible"
    >
      <div class="modified-details" v-if="modifiedDetails !== null">
        <b-table :items="modifiedDetails" outlined></b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import DisplayName from './util/DisplayName'
import { timeSince } from '../util/dateHelpers'
import etherscanHelper from '../util/web3/etherscanHelper'

export default {

  props: ['provenance'],

  components: {
    DisplayName,
  },

  data() {
    return {
      modifiedDetails: null,
      modifiedDetailsModalVisible: false,
    }
  },

  methods: {
    getTimeSince(createdAt) {
      return `${timeSince(new Date(createdAt))} ago`
    },

    getEventDescription(eventType) {
      switch (eventType) {
        case 'created':
          return 'Created by'

        case 'destroyed':
          return 'Destroyed by'

        case 'transferred':
          return 'Transferred to'

        case 'modified':
          return 'Modified by'

        default:
          return null
      }
    },

    getEventAddress(row) {

      let address = null

      switch (row.type) {
        case 'created':
        case 'destroyed':
        case 'transferred':
          address = row.newOwnerAddress
          break

        case 'modified':
          address = row.codexRecordModifiedEvent.modifierAddress
          break

        default: // do nothing
      }

      return address
    },

    getTransactionUrl(txHash) {
      return etherscanHelper.getTxUrl(txHash)
    },

    showModifiedDetailsModal(row) {
      this.modifiedDetailsModalVisible = true
      this.modifiedDetails = Object.keys(row.codexRecordModifiedEvent.changedData).map((fieldName) => {
        return {
          fieldName,
          changed: row.codexRecordModifiedEvent.changedData[fieldName] ? 'yes' : 'no',
        }
      })
    },

  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

table
  width: 100%

  tr
    border-bottom: solid 1px rgba(white, .1)

  td
    padding: .5rem
    font-size: small
    text-align: center

    @media (min-width: $breakpoint-lg)
      padding: 1rem
      font-size: 1rem

    .display-name
      @media (max-width: $breakpoint-md)
        max-width: 50%

      @media (max-width: $breakpoint-sm)
        white-space: unset
        word-break: break-all

.show-modified-details
  padding: 0 .5rem 0 0

.modified-details
  .table
    background-color: rgba(white, .1)

    &.border
      border: 1px solid rgba(white, .25) !important

</style>
