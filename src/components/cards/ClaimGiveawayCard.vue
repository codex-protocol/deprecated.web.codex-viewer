<template>
  <b-card
    img-top
    :img-src="giveaway.editionDetails | getMainImageUri"
  >
    <LoadingOverlay :show="isLoading" type="dark" />
    <b-button
      variant="secondary"
      @click="acceptGiveaway"
      :disabled="disableGiveawayButton"
    >
      Create Record
    </b-button>
  </b-card>
</template>

<script>

import LoadingOverlay from '../util/LoadingOverlay'

import EventBus from '../../util/eventBus'
import Giveaway from '../../util/api/giveaway'

export default {
  props: ['giveaway'],
  components: {
    LoadingOverlay,
  },
  data() {
    return {
      isLoading: false,
      disableGiveawayButton: false,
    }
  },
  methods: {
    acceptGiveaway() {
      // No need to toggle these off later--the toast will clean them up
      this.disableGiveawayButton = true
      this.isLoading = true

      Giveaway.participateInGiveaway(this.giveaway.id)
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not claim edition: ${error.message}`)
          this.disableGiveawayButton = false
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.card
  card()
  text-align: center

@keyframes spin
  from
    transform: rotate(0deg)

  to
    transform: rotate(360deg)
</style>
