<template>
  <div>
    <h4>Details</h4>
    <p>Current owner: <DisplayName :name="codexRecord.ownerAddress" /></p>
    <p>Approved owner: <DisplayName :name="codexRecord.approvedAddress" /></p>
    <p>Last updated: {{ formatDate(codexRecord.updatedAt) }}</p>

    <h4>Metadata</h4>
    <p>Name hash: <DisplayName :name="codexRecord.nameHash" /></p>
    <p>Description hash: <DisplayName :name="codexRecord.descriptionHash" /></p>
    <p>ProviderId:
      {{ codexRecord.providerId }}
    </p>
  </div>
</template>

<script>
import DisplayName from './util/DisplayName'
import { formatDate } from '../util/dateHelpers'

export default {

  props: {
    codexRecord: {
      type: Object,
      required: true,
    },
  },

  components: {
    DisplayName,
  },

  methods: {
    formatDate(date) {
      return formatDate(date)
    },
  },
}
</script>
