<template>
  <div>
    <h1>Provenance</h1>
    <div v-if="provenance.length">
      <div class="flex mb-4 pb-1" v-for="row in provenance" :key="row.id">
        <div>{{ getEventDescription(row.type) }}</div>
        <div>{{ row.newOwnerAddress }}</div>
        <div>{{ getTimeSince(row.createdAt) }}</div>
      </div>
    </div>
    <div v-else>
      <p>You must be logged in to view provenance.</p>
    </div>
  </div>
</template>

<script>
import { timeSince } from '../util/dateHelpers'

export default {
  name: 'title-provenance',
  props: ['provenance'],
  methods: {
    getTimeSince(createdAt) {
      return `${timeSince(new Date(createdAt))} ago`
    },
    getEventDescription(eventType) {
      switch (eventType) {
        case 'create':
          return 'Created by'
        case 'transfer':
          return 'Transferred to'
        default:
          return null
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.flex
  display: flex
  flex-direction: horizontal
  border-bottom: solid 1px rgba(white, .1)

.flex div
  flex: 1

.flex div:nth-child(2)
  flex: 2
</style>
