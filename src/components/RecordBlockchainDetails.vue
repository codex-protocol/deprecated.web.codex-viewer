<template>
  <div>
    <h4>Details</h4>
    <p>Current owner: <HashFormatter :data="codexRecord.ownerAddress" /></p>
    <p>Approved owner: <HashFormatter :data="codexRecord.approvedAddress" /></p>
    <!-- @FIXME: Hiding until we bring back Modify option
      <p>Last updated: {{ this.formatDate(codexRecord.updatedAt) }}</p>
    -->
    <h5>Metadata</h5>
    <p>Name hash: <HashFormatter :data="codexRecord.nameHash" /></p>
    <p>Description hash: <HashFormatter :data="codexRecord.descriptionHash" /></p>
    <p>ProviderId:
      {{ codexRecord.providerId }}
    </p>
  </div>
</template>

<script>
import HashFormatter from './util/HashFormatter'
import { formatDate } from '../util/dateHelpers'

export default {
  name: 'RecordBlockchainDetails',
  props: ['codexRecord'],
  components: {
    HashFormatter,
  },
  methods: {
    formatDate(date) {
      return formatDate(date)
    },
  },
}
</script>
