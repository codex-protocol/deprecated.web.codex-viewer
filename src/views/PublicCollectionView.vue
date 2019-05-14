<template>
  <div v-if="publicCollection">

    <FullscreenImageModal
      mode="records"
      :records="records"
      :useFullscreen="true"
      @change="onFullscreenImageChange"
    />

    <header>
      <CarouselBackground :urls="headerBackgroundImageUrls" />
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-lg-6">
            <div class="info glass-pane">
              <div class="info-row title">
                <img :src="publicCollection.iconUrl || missingImage">
                <h2>{{ publicCollection.name }}</h2>
              </div>
              <div class="info-row description">
                <p>{{ publicCollection.description }}</p>
              </div>
              <div class="info-row social-links">
                <a
                  :key="name"
                  :href="link"
                  v-if="!!link"
                  v-for="(link, name) in orderedSocialLinks"
                >
                  {{ name | titleCase }}
                </a>
              </div>
            </div>
          </div>
          <div class="action-buttons col-12 col-lg-4 offset-lg-2">
            <b-button
              target="_blank"
              variant="primary"
              v-if="publicCollection.contactLink"
              :href="publicCollection.contactLink"
            >
              <img src="../assets/icons/contact.svg"> Contact Owner
            </b-button>
            <b-button
              variant="primary"
              v-b-modal.fullscreenImageModal
            >
              <img src="../assets/icons/fullscreen.svg"> View Fullscreen
            </b-button>
            <b-button
              variant="primary"
              @click="copyShareLink" ref="copy-share-link-button"
            >
              <img src="../assets/icons/copy.svg"> Copy Share Link
            </b-button>
          </div>
        </div>
      </div>
    </header>

    <section class="container-fluid">
      <div class="row">
        <div class="col-12">

          <div class="pagination-actions">

            <b-button
              size="sm"
              tabindex="1"
              v-if="hasFilterOptions"
              suppress-top-level-click
              @click="toggleFilterOptionsVisibility()"
              :class="{ 'active': areFilterOptionsVisible }"
              class="toggle-filter-options-button glass-button"
            >
              <img src="../assets/icons/filter.svg">{{ areFilterOptionsVisible ? 'Hide' : 'Show' }} Filters
            </b-button>

            <div
              suppress-top-level-click
              class="filter-options glass-pane flex-column-to-row"
              :class="{ 'is-visible': areFilterOptionsVisible }"
            >
              <div
                class="filter-option"
                :key="filterOption.name"
                v-for="(filterOption, index) in filterOptions"
                v-if="filterOption.values && filterOption.values.length !== 0"
              >
                <b-button
                  size="sm"
                  :tabindex="index + 2"
                  class="filter-option-button glass-button"
                  :class="{ 'active': filterOption.isDropdownVisible }"
                  @click="toggleFilterDropdownVisibility(filterOption)"
                >
                  {{ filterOption.label }} ({{ getNumSelectedFilterValues(filterOption) }} / {{ filterOption.values.length }})
                  <span class="spacer"></span>
                  <img src="../assets/icons/arrow-right.svg">
                </b-button>
                <div
                  class="filter-option-dropdown glass-pane"
                  :class="{ 'is-visible': filterOption.isDropdownVisible }"
                >
                  <template v-if="filterOption.type === 'date'">
                    <b-form-group
                      :key="value.name"
                      :label="value.label"
                      v-for="(value) in filterOption.values"
                    >
                      <b-input
                        size="sm"
                        type="date"
                        v-model="filterOption.selectedDateValues[value.name]"
                      />
                    </b-form-group>
                  </template>
                  <template v-else>
                    <b-form-checkbox-group
                      stacked
                      size="sm"
                      :options="filterOption.values"
                      v-model="filterOption.selectedValues"
                    />
                  </template>

                </div>
              </div>

              <!-- <b-button
                size="sm"
                @click="resetFilters"
                variant="outline-primary"
                class="reset-filters-button"
                :tabindex="filterOptions.length + 2"
              >
                Reset
              </b-button> -->
              <b-button
                size="sm"
                variant="primary"
                class="apply-filters-button"
                @click="applyFiltersAndSorting"
                :tabindex="filterOptions.length + 1"
              >
                Apply
              </b-button>
            </div>

            <div class="spacer"></div>

            <div class="flex-column-to-row">
              <RecordSearch
                type="public-collection"
                :shareCode="publicCollection.shareCode"
              />

              <b-form class="sorting-options">
                <b-form-select
                  class="form-control"
                  :options="sortingOptions"
                  @input="applyFiltersAndSorting"
                  v-model="selectedSortingOption"
                />
              </b-form>
            </div>
          </div>

          <template v-if="records.length === 0">
            <div class="no-results">
              <p>
                <template v-if="hasInitialRequestLoaded && !isLoading">No records found.</template>
                <template v-else><LoadingIcon size="small" /> Loading records...</template>
              </p>
              <p v-if="!isLoading && numSelectedFilters !== 0">Perhaps you should <b-link @click="resetFilters()">reset all filters</b-link>?</p>
            </div>
          </template>
          <template v-else>
            <b-card-group deck class="record-list">

              <LoadingOverlay :show="isLoading" type="dark" />

              <RecordListItem
                :key="record.tokenId"
                :codex-record="record"
                v-for="record in records"
              />
            </b-card-group>
          </template>

          <div class="pagination-controls" v-if="totalCount > pageSize">
            <b-button
              size="sm"
              @click="loadMore()"
              variant="outline-primary"
              :disabled="isLoading || records.length >= totalCount"
            >
              Load More
              <LoadingIcon v-show="isLoading" size="small" />
            </b-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import is from 'is_js'

import EventBus from '../util/eventBus'
import copyToClipboard from '../util/copyToClipboard'
import PublicCollection from '../util/api/publicCollection'

import missingImage from '../assets/images/missing-image.png'

import RecordSearch from '../components/RecordSearch'
import LoadingIcon from '../components/util/LoadingIcon'
import RecordListItem from '../components/RecordListItem'
import LoadingOverlay from '../components/util/LoadingOverlay'
import CarouselBackground from '../components/CarouselBackground'
import FullscreenImageModal from '../components/modals/FullscreenImageModal'

export default {

  components: {
    LoadingIcon,
    RecordSearch,
    LoadingOverlay,
    RecordListItem,
    CarouselBackground,
    FullscreenImageModal,
  },

  data() {
    return {
      records: [],
      missingImage,
      totalCount: 0,
      isLoading: false,
      publicCollection: null,
      headerBackgroundImageUrls: [],
      hasInitialRequestLoaded: false,

      filterOptions: [],
      areFilterOptionsVisible: false,

      pageNumber: 0,
      pageSize: is.mobile() ? 4 : 16,
      selectedSortingOption: '-createdAt',
      sortingOptions: [
        { value: 'createdAt', text: 'Oldest First' },
        { value: '-createdAt', text: 'Newest First' },
        { value: 'metadata.name', text: 'Name (A-Z)' },
        { value: '-metadata.name', text: 'Name (Z-A)' },
      ],
    }
  },

  computed: {

    shareCode() {
      return this.$route.params.shareCode
    },

    // make sure "website" is always listed first in the social links
    orderedSocialLinks() {

      const orderedSocialLinks = {}

      Object.keys(this.publicCollection.socialLinks)
        .sort((key) => {
          if (key === 'website') {
            return -1
          }
          return 0
        })
        .forEach((key) => {
          orderedSocialLinks[key] = this.publicCollection.socialLinks[key]
        })

      return orderedSocialLinks

    },

    hasFilterOptions() {
      return (
        this.filterOptions &&
        this.filterOptions.length !== 0 &&
        this.filterOptions.some((filterOption) => {
          return filterOption.values && filterOption.values.length !== 0
        })
      )
    },

    numSelectedFilters() {
      return this.filterOptions
        .reduce((accumulator, filterOption) => {
          return accumulator + this.getNumSelectedFilterValues(filterOption)
        }, 0)
    },

    filters() {
      const filters = {}
      this.filterOptions.forEach((filterOption) => {
        if (filterOption.type === 'date') {
          filters[filterOption.name] = filterOption.selectedDateValues
        } else {
          filters[filterOption.name] = filterOption.selectedValues
        }
      })
      return filters
    },
  },

  created() {
    // @TODO: Add caching for individual public collections?
    this.getPublicCollection()
  },

  mounted() {
    EventBus.$on('app:top-level-click', this.hideAllFilterDropdowns)
  },

  beforeDestroy() {
    EventBus.$off('app:top-level-click', this.hideAllFilterDropdowns)
  },

  methods: {

    onFullscreenImageChange(imageIndex) {
      if (
        !this.isLoading &&
        this.records.length < this.totalCount &&
        imageIndex >= this.records.length / 2
      ) {
        this.loadMore()
      }
    },

    copyShareLink() {
      copyToClipboard(window.location.href, 'Share link copied to clipboard!')
      this.$refs['copy-share-link-button'].focus()
    },

    viewRecord(tokenId) {
      this.$router.push({
        name: 'record-detail',
        params: {
          recordId: tokenId,
        },
      })
    },

    getPublicCollection() {

      this.isLoading = true

      PublicCollection.getPublicCollection(this.shareCode)
        .then(({ publicCollection, filterOptions }) => {

          this.filterOptions = filterOptions
          this.publicCollection = publicCollection

          this.filterOptions.forEach((filterOption) => {
            this.$set(filterOption, 'selectedValues', [])
            this.$set(filterOption, 'selectedDateValues', {})
            this.$set(filterOption, 'isDropdownVisible', false)
          })

          return this.getRecords()
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get auction house: ${error.message}`)
          this.$router.replace({ name: 'auction-houses' })
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    getRecords() {

      this.pageNumber = 0
      this.isLoading = true

      const limit = this.pageSize
      const offset = limit * this.pageNumber
      const order = this.selectedSortingOption

      return PublicCollection.getRecords(this.publicCollection.shareCode, { limit, offset, order, filters: this.filters })
        .then(({ totalCount, records }) => {

          this.records = records || []
          this.totalCount = totalCount

          // this is likely because there are too many filters
          if (!records || records.length === 0) {
            this.records = []
            return
          }

          // only populate headerBackgroundImageUrls once, so the header doesn't
          //  reload with filter & sorting changes (that's why this isn't a
          //  computed property)
          if (this.headerBackgroundImageUrls.length === 0) {
            const headerBackgroundImageUrls = Array.from(this.records)
              // this shouldn't be necessary...
              // .filter((record) => {
              //   return record && record.metadata && record.metadata.mainImage
              // })
              .sort(() => {
                return Math.random() > 0.5 ? 1 : -1
              })
              .slice(0, 10)
              .map((record) => {
                return record.metadata.mainImage.uri
              })

            this.headerBackgroundImageUrls.push(...headerBackgroundImageUrls)
          }

        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get auction house records: ${error.message}`)
          this.$router.replace({ name: 'auction-houses' })
        })
        .finally(() => {
          this.isLoading = false
          this.hasInitialRequestLoaded = true
        })

    },

    loadMore() {

      this.pageNumber += 1
      this.isLoading = true

      const limit = this.pageSize
      const offset = limit * this.pageNumber
      const order = this.selectedSortingOption

      return PublicCollection.getRecords(this.publicCollection.shareCode, { limit, offset, order, filters: this.filters })
        .then(({ totalCount, records }) => {

          const newRecords = records.filter((record) => {
            // Filter out any records that don't have metadata attached to them.
            //  These are records that were created by other providers.
            return record.metadata && !this.records.find((existingRecord) => {
              return existingRecord.tokenId === record.tokenId
            })
          })

          this.records.push(...newRecords)
          this.totalCount = totalCount

        })
        .finally(() => {
          this.isLoading = false
        })
    },

    hideAllFilterDropdowns(keepFilterOptionsOpen = false) {
      if (!keepFilterOptionsOpen) this.areFilterOptionsVisible = false
      this.filterOptions.forEach((filterOption) => {
        // eslint-disable-next-line no-param-reassign
        filterOption.isDropdownVisible = false
      })
    },

    toggleFilterDropdownVisibility(filterOption) {

      // hide any open filter dropdowns if we're about to show one
      if (!filterOption.isDropdownVisible) {
        this.hideAllFilterDropdowns(true)
      }

      // eslint-disable-next-line no-param-reassign
      filterOption.isDropdownVisible = !filterOption.isDropdownVisible

    },

    toggleFilterOptionsVisibility() {
      this.areFilterOptionsVisible = !this.areFilterOptionsVisible
      this.hideAllFilterDropdowns(true)
    },

    applyFiltersAndSorting() {
      this.hideAllFilterDropdowns()
      return this.getRecords()
    },

    resetFilters() {
      this.filterOptions.forEach((filterOption) => {
        filterOption.selectedValues = [] // eslint-disable-line no-param-reassign
        filterOption.selectedDateValues = {} // eslint-disable-line no-param-reassign
      })
      this.applyFiltersAndSorting()
    },

    getNumSelectedFilterValues(filterOption) {
      return filterOption.selectedValues.length + Object
        .keys(filterOption.selectedDateValues)
        .filter((key) => {
          return !!filterOption.selectedDateValues[key]
        })
        .length
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

header
  padding-top: 5rem
  position: relative
  padding-bottom: 2.5rem

  @media (min-width: $breakpoint-lg)
    padding-bottom: 5rem

  .action-buttons
    width: 100%
    margin-top: 1rem

    @media (min-width: $breakpoint-lg)
      margin-top: 0

    @media (min-width: $breakpoint-sm)
      display: flex
      align-items: flex-end
      flex-direction: column

    a
    button
      width: 100%
      padding: .5rem 1rem

      &+a
      &+button
        margin-top: 1rem

      img
        vertical-align: bottom

      // uncomment this to make buttons different widths with jagged edges
      // @media (min-width: $breakpoint-sm)
      //   width: auto

  .info
    border: none
    padding: 2rem
    background-color: rgba($color-dark, .9)

    .info-row
      width: 100%
      display: flex
      align-items: center
      flex-direction: column

      @media (min-width: $breakpoint-sm)
        flex-direction: row

      &+.info-row:not(:empty)
        margin-top: 1rem

      &.title
        img
          width: 5rem
          height: @width
          min-width: @width
          min-height: @height

          border-radius: 50%
          margin-bottom: 1rem

          @media (min-width: $breakpoint-sm)
            margin-bottom: 0
            margin-right: 1rem
            align-self: flex-start

        h2
          margin: 0
          font-weight: 700
          font-size: 1.5rem
          text-align: center

          @media (min-width: $breakpoint-sm)
            text-align: left

      &.social-links
        margin-top: 0
        flex-wrap: wrap
        flex-direction: row
        justify-content: space-around

        &:not(:empty)
          margin-top: 2rem

        a
          padding: 0 .5rem
          font-size: small

          @media (min-width: $breakpoint-sm)
            font-size: normal

      &.description
        font-size: small

        p
          margin: 0

        @media (min-width: $breakpoint-sm)
          font-size: normal

.flex-column-to-row
  width: 100%
  display: flex
  flex-direction: column

  @media (min-width: $breakpoint-sm)
    width: auto
    flex-direction: row

.pagination-actions
  display: flex
  margin-top: 4rem
  position: relative
  justify-content: flex-end
  flex-direction: column-reverse

  @media (min-width: $breakpoint-sm)
    flex-direction: row

  .toggle-filter-options-button
    padding: .25rem .5rem

    img
      margin-right: .25rem

  >.spacer
    min-width: 1rem
    min-height: 1rem

  .sorting-options
    width: 100%
    margin-left: 0
    margin-top: .5rem

    @media (min-width: $breakpoint-sm)
      width: 10rem
      margin-top: 0
      margin-left: .5rem

.filter-options
  flex-wrap: wrap
  padding: .5rem 1rem 1rem

  opacity: 0
  transition: opacity ease .25s, height ease .25s

  left: 0
  top: 100%
  z-index: -1
  position: absolute

  &.is-visible
    opacity: 1
    z-index: 1

  button
    width: 100%
    padding-top: .25rem
    padding-bottom: .25rem

    &.reset-filters-button
    &.apply-filters-button
      width: auto
      margin-top: .5rem

  .filter-option
    width: 100%
    margin-right: 0
    margin-top: .5rem
    position: relative

    @media (min-width: $breakpoint-sm)
      width: auto
      margin-right: .5rem

    .filter-option-button
      z-index: 2
      padding-right: 0
      padding-left: .5rem

      display: flex
      align-items: center

      img
        transition: transform ease .25s

      &.active
        img
          transform: rotateZ(90deg)

    .filter-option-dropdown
      height: 0
      opacity: 0
      width: 100%
      padding: .5rem
      overflow-x: scroll
      color: $color-light
      pointer-events: none
      backdrop-filter: blur(4px)
      text-transform: capitalize
      transition: opacity ease .25s, height ease .25s

      left: 0
      top: 100%
      z-index: -1
      position: absolute

      @media (min-width: $breakpoint-sm)
        width: 20rem

      &.is-visible
        z-index: 3
        opacity: 1
        height: 10.5rem // the extra .5 rem makes it obvious there's more in the list if it has to scroll
        pointer-events: all

.no-results
  padding: 4rem 1rem
  text-align: center

.record-list
  display: flex
  flex-wrap: wrap
  position: relative

.pagination-controls
  display: flex
  margin: 2rem 0
  justify-content: center

</style>

<style lang="stylus">

.filter-option-dropdown
  .custom-checkbox
    height: auto

  .custom-controls-stacked
    padding: 0
    height: auto

  label
    width: 100%

    &:hover
      cursor: pointer

</style>
