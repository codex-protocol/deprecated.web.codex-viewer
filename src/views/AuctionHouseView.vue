<template>
  <div v-if="auctionHouse">
    <header>
      <CarouselBackground :urls="headerBackgroundImageUrls" />
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-lg-6">
            <div class="info glass-pane">
              <div class="info-row title">
                <img :src="auctionHouse.iconUrl">
                <h2>{{ auctionHouse.name }}</h2>
              </div>
              <div class="info-row description">
                <p>{{ auctionHouse.description }}</p>
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
          <!-- <div class="action-buttons col-12 col-lg-6">
            <b-button variant="primary" @click="viewAsSlideshow">
              <img src="../assets/icons/slideshow.svg"> View as Slideshow
            </b-button>
            <b-button variant="outline-primary" @click="copyShareLink" ref="copy-share-link-button">
              Copy Share Link
            </b-button>
          </div> -->
        </div>
      </div>
    </header>

    <section class="container-fluid">
      <div class="row">
        <div class="col-12">

          <div class="pagination-actions" v-if="records.length !== 0">

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
                :key="index"
                class="filter-option"
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
                  {{ filterOption.name | titleCase }} ({{ filterOption.selectedValues.length }} / {{ filterOption.values.length }})
                  <span class="spacer"></span>
                  <img src="../assets/icons/arrow-right.svg">
                </b-button>
                <div
                  class="filter-option-dropdown glass-pane"
                  :class="{ 'is-visible': filterOption.isDropdownVisible }"
                >
                  <b-form-checkbox-group
                    stacked
                    size="sm"
                    :options="filterOption.values"
                    v-model="filterOption.selectedValues"
                  />
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
                type="auction-house"
                :auctionHouse="auctionHouse"
              />

              <b-form class="sorting-options">
                <b-form-select
                  :options="sortingOptions"
                  @input="applyFiltersAndSorting"
                  v-model="selectedSortingOption"
                />
              </b-form>
            </div>
          </div>

          <b-card-group deck class="record-list">
            <RecordListItem
              :key="record.tokenId"
              :codex-record="record"
              v-for="record in records"
            />
          </b-card-group>

          <div class="pagination-controls" v-if="totalCount > pageSize">
            <b-button
              size="sm"
              class="load-more"
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
import AuctionHouse from '../util/api/auction-house'
import copyToClipboard from '../util/copyToClipboard'

import RecordSearch from '../components/RecordSearch'
import LoadingIcon from '../components/util/LoadingIcon'
import RecordListItem from '../components/RecordListItem'
import CarouselBackground from '../components/CarouselBackground'

export default {

  components: {
    LoadingIcon,
    RecordSearch,
    RecordListItem,
    CarouselBackground,
  },

  data() {
    return {
      records: [],
      totalCount: 0,
      isLoading: false,
      auctionHouse: null,
      isMobile: is.mobile(),
      headerBackgroundImageUrls: [],

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
    auctionHouseShareCode() {
      return this.$route.params.auctionHouseShareCode
    },

    // make sure "website" is always listed first in the social links
    orderedSocialLinks() {

      const orderedSocialLinks = {}

      Object.keys(this.auctionHouse.socialLinks)
        .sort((key) => {
          if (key === 'website') {
            return -1
          }
          return 0
        })
        .forEach((key) => {
          orderedSocialLinks[key] = this.auctionHouse.socialLinks[key]
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

    filters() {
      const filters = {}
      this.filterOptions.forEach((filterOption) => {
        filters[filterOption.name] = filterOption.selectedValues
      })
      return filters
    },
  },

  created() {
    // @TODO: Add caching for individual auction houses?
    this.getAuctionHouse()
  },

  mounted() {
    EventBus.$on('app:top-level-click', this.hideAllFilterDropdowns)
  },

  beforeDestroy() {
    EventBus.$off('app:top-level-click', this.hideAllFilterDropdowns)
  },

  methods: {

    copyShareLink() {
      copyToClipboard(window.location.href, 'Share link copied to clipboard!')
      this.$refs['copy-share-link-button'].focus()
    },

    viewAsSlideshow() {
      // @TODO: do this
    },

    viewRecord(tokenId) {
      this.$router.push({
        name: 'record-detail',
        params: {
          recordId: tokenId,
        },
      })
    },

    getAuctionHouse() {

      this.isLoading = true

      AuctionHouse.getAuctionHouse(this.auctionHouseShareCode)
        .then(({ auctionHouse, filterOptions }) => {
          this.auctionHouse = auctionHouse
          this.filterOptions = filterOptions

          this.filterOptions.forEach((filterOption) => {
            this.$set(filterOption, 'selectedValues', [])
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

      return AuctionHouse.getAuctionHouseRecords(this.auctionHouse.shareCode, { limit, offset, order, filters: this.filters })
        .then(({ totalCount, records }) => {

          // @TODO: instead of throwing an error, this needs to gracefully exit
          //  and show a "no records matching filters found" here
          if (!records || records.length === 0) {
            throw new Error(`${this.auctionHouse.name} has no Codex Records to show.`)
          }

          this.records = records
          this.totalCount = totalCount

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
        })

    },

    loadMore() {

      this.pageNumber += 1
      this.isLoading = true

      const limit = this.pageSize
      const offset = limit * this.pageNumber
      const order = this.selectedSortingOption

      return AuctionHouse.getAuctionHouseRecords(this.auctionHouse.shareCode, { limit, offset, order, filters: this.filters })
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
        filterOption.selectedValues = []
      })
      this.applyFiltersAndSorting()
    }
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

header
  padding-top: 5rem
  position: relative
  padding-bottom: 2.5rem

  @media (min-width: $breakpoint-sm)
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

    button
      width: 100%

      &+button
        margin-top: 1rem

      img
        vertical-align: bottom

      @media (min-width: $breakpoint-sm)
        width: auto

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

      &+.info-row
        margin-top: 1rem

    .title
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

    .social-links
      flex-wrap: wrap
      flex-direction: row
      justify-content: space-around

      a
        padding: 0 .5rem
        font-size: small

        @media (min-width: $breakpoint-sm)
          font-size: normal

    .description
      font-size: small

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
  z-index: 1
  position: absolute

  &.is-visible
    opacity: 1

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

.record-list
  display: flex
  flex-wrap: wrap

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
