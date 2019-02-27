<template>
  <b-form
    class="record-search-form"
    @submit.prevent="searchRecords(searchQuery)"
  >
    <b-form-input
      type="search"
      ref="search-input"
      autocomplete="off"
      class="search-input"
      v-model="searchQuery"
      placeholder="Search..."
      @keydown.native="onKeydown"
      @blur.native="toggleFocus(false)"
      @focus.native="toggleFocus(true)"
    />

    <div
      class="search-results"
      v-show="isFocused && hasSearched"
    >
      <LoadingOverlay
        type="dark"
        size="small"
        v-if="isLoading"
      />

      <div
        class="no-results"
        v-if="searchQuery && hasSearched && searchResults.length === 0"
      >
        no results found
      </div>
      <div
        :key="index"
        class="search-result"
        v-if="searchResult.metadata"
        @click="goToRecord(searchResult)"
        v-for="(searchResult, index) in searchResults"
        :class="{ 'selected': selectedResultIndex === index }"
      >
        <img :src="searchResult.metadata | getMainImageUri" />
        {{ searchResult.metadata.name }}
      </div>
    </div>
  </b-form>
</template>

<script>

import Record from '../util/api/record'
import Gallery from '../util/api/gallery'
import LoadingOverlay from '../components/util/LoadingOverlay'

export default {

  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => {
        return value === 'user' || value === 'gallery'
      },
    },
    gallery: {
      type: Object,
      default: null,
    },
  },

  components: {
    LoadingOverlay,
  },

  data() {
    return {
      pageNumber: 0,
      isLoading: false,
      isFocused: false,
      searchQuery: null,
      searchResults: [],
      hasSearched: false,
      searchDebounceTimer: null,
      selectedResultIndex: null,
    }
  },

  computed: {
    $input() {
      return this.$refs['search-input'].$el
    },
  },

  watch: {
    searchQuery(newSearchQuery, oldSearchQuery) {

      if (!newSearchQuery) {
        this.clearSearch()
      }

      if (newSearchQuery.length <= 1 || newSearchQuery === oldSearchQuery) return

      this.isLoading = true

      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer)
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.searchRecords(newSearchQuery)
        this.searchDebounceTimer = null
      }, 250)
    },
  },

  methods: {
    onKeydown(event) {
      switch (event.code) {
        case 'Enter':
          if (this.selectedResultIndex !== null) {
            this.goToRecord(this.searchResults[this.selectedResultIndex])
            event.preventDefault()
          }
          break

        case 'ArrowUp':
          if (this.selectedResultIndex !== null) {
            this.selectedResultIndex = this.selectedResultIndex - 1

            if (this.selectedResultIndex < 0) {
              this.selectedResultIndex = 0
            }
          }

          event.preventDefault()
          break

        case 'ArrowDown':
          if (this.selectedResultIndex === null) {
            this.selectedResultIndex = 0
          } else {
            this.selectedResultIndex = this.selectedResultIndex + 1
          }

          if (this.selectedResultIndex > this.searchResults.length - 1) {
            this.selectedResultIndex = this.searchResults.length - 1
          }

          event.preventDefault()
          break

        default:
          // do nothing
      }
    },
    toggleFocus(isFocused) {
      if (!isFocused) {
        // @NOTE: the delay is necessary to allow clicks inside the dropdown to
        //  get picked up after the blur event hides it... couldn't figure out a
        //  better way to do this ¯\_(ツ)_/¯
        setTimeout(() => { this.isFocused = false }, 250)

      } else {
        this.isFocused = true
        this.$input.setSelectionRange(0, this.$input.value.length)
      }
    },
    goToRecord(record) {
      this.clearSearch()
      this.$router.push({ name: 'record-detail', params: { recordId: record.tokenId } })
    },
    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
      this.hasSearched = false
      this.selectedResultIndex = null
    },
    searchRecords(query) {
      this.isLoading = true

      const promise = this.type === 'user'
        ? Record.searchUserRecords({ query })
        : Gallery.searchGalleryRecords(this.gallery.shareCode, { query })

      return promise
        .then((records) => {
          this.searchResults = records
          this.selectedResultIndex = null
        })
        .finally(() => {
          this.isLoading = false
          this.hasSearched = true
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.record-search-form
  position: relative

  .search-input
    padding-left: 2.25rem
    background-size: 24px 24px
    background-repeat: no-repeat
    background-position: .5rem center
    background-image: url(../assets/icons/search.svg)

    @media (min-width: $breakpoint-sm)
      width: 0rem
      padding-left: 2rem
      transition: width ease .25s .25s

      &:focus
        width: 14rem
        transition-delay: 0s
        padding-left: 2.25rem

.search-results
  width: 100%
  z-index: 100
  font-size: small
  overflow-y: auto
  position: absolute
  overflow-x: hidden
  backdrop-filter: blur(4px)
  background-color: rgba($color-dark, .95)
  box-shadow: 0 0 1rem rgba($color-dark, .6)
  border: 1px solid rgba($color-primary, .1)

  border-top-width: 0

  .search-result
    width: 100%
    padding: .5rem
    cursor: pointer
    max-width: 100%
    overflow: hidden
    white-space: nowrap
    display: inline-block
    vertical-align: middle
    text-overflow: ellipsis
    transition: background-color ease .25s

    &:hover
    &.selected
      background-color: rgba(white, .1)

    img
      width: 2rem
      height: 2rem
      object-fit: contain
      margin-right: .5rem

  .no-results
    padding: 1rem
    font-size: small
    text-align: center
    color: rgba($color-light, .5)

</style>
