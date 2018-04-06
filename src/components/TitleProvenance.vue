<template>
  <div>
    <h1>Provenance</h1>
    <div class="flex mb-4 pb-1" v-for="row in provenance" :key="row.id">
      <div>{{ getEventDescription(row.type) }}</div>
      <div>{{ row.newOwnerAddress }}</div>
      <div>{{ getTimeSince(row.createdAt) }}</div>
    </div>
  </div>
</template>

<script>
import timeSince from '../util/timeSince'

export default {
  name: 'title-provenance',
  props: ['provenance'],
  mounted() {
    // TODO: This should get returned from the API in reverse order
    this.provenance = this.provenance.reverse()
  },
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

<style scoped>
.flex {
  display: flex;
  flex-direction: horizontal;
  border-bottom: solid 1px lightgrey;
}

.flex div {
  flex: 1;
}

.flex div:nth-child(2) {
  flex: 2;
}
</style>
