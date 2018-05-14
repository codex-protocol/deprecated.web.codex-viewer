<template>
    <div class="sub-heading">
      <span :class="{ 'active': activeTab === 'incoming' }">
          <b-link to="/transfers/incoming" v-if="activeTab !== 'incoming'">Incoming</b-link>
          <span v-else>Incoming</span>
      </span>
      <span :class="{ 'active': activeTab === 'outgoing' }">
        <b-link to="/transfers/outgoing" v-if="activeTab !== 'outgoing'">Outgoing</b-link>
        <span v-else>Outgoing</span>
      </span>
      <!--
        // @TODO: Add at a later point.
        <span><b-link to="/transfers/completed">Completed</b-link></span>
      -->
    </div>
</template>

<script>
export default {
  name: 'app-sub-header',
  props: ['activeTab'],
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.sub-heading
  font-weight: 600
  margin-bottom: 1rem

  span
  a
    display: inline-block

  .active
  a:hover
    color: $color-secondary-accent
    font-weight: 600
    border-bottom: 3px solid $color-secondary-accent
    text-decoration: none

  a:hover
    cursor: pointer
</style>
