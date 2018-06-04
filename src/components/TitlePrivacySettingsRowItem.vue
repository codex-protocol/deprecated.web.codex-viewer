<template>
  <b-container class="title-settings-row">
      <!-- TODO: Better handling of title w/ no metadata -->
      <b-row v-if="codexRecord.metadata">
        <b-col class="image">
          <a href="#" @click.prevent="viewTitle">
            <img :src="codexRecord.metadata.mainImage.uri"/>
          </a>
        </b-col>
        <b-col class="name">
          <a href="#" @click.prevent="viewTitle">
            {{ codexRecord.metadata.name }}
          </a>
        </b-col>
        <b-col class="toggle">
          <input
            type="checkbox"
            class="toggle-checkbox"
            v-model="titleIsPublic"
            @change="savePrivacySetting"
          />
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'title-privacy-settings-row-item',
  props: ['codexRecord', 'isPrivate'],
  data() {
    return {
      titleIsPublic: !this.isPrivate,
      route: { name: 'title-detail', params: { titleId: this.codexRecord.tokenId } },
    }
  },
  methods: {
    viewTitle() {
      this.$router.push(this.route)
    },
    savePrivacySetting() {
      const url = `/users/titles/${this.codexRecord.tokenId}`
      axios.put(url, {
        isPrivate: !this.titleIsPublic,
      }).then((response) => {
        const { error } = response.data
        if (error) {
          console.log('there was an error setting title privacy', error)
          // @TODO: better error messaging
          // Reset toggle on error
          this.titleIsPublic = !this.titleIsPublic
        }
      }).catch((error) => {
        console.log('there was an error setting title privacy', error)
        // @TODO: better error messaging
        // Reset toggle on error
        this.titleIsPublic = !this.titleIsPublic
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.title-settings-row
  height: 6rem

  +.title-settings-row
    border-top: 1px solid $color-light-gray

.row
  height: 100%
  display: flex
  padding: 1rem 0
  align-items: center

.name
  flex-grow: 5
  font-weight: 300
  text-transform: uppercase

.toggle
  text-align: center

.image
  height: 100%

  img
    max-width: 5rem
    max-height: 100%

a
  color: $color-secondary

  &:hover
    text-decoration: none
</style>
