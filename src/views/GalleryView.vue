<template>
  <div
    v-if="gallery"
    class="container-fluid"
  >
    <div class="row">
      <div class="col-12">
        <AppHeader :title="gallery.name">
          <template slot="buttons">
            <b-button variant="outline-primary" @click="copyShareLink" ref="copy-share-link-button">Copy Share Link</b-button>
            <b-button variant="outline-primary" @click="viewFullscreen" v-if="browserSupportsFullscreen">
              View Fullscreen
            </b-button>
          </template>
        </AppHeader>

        <div class="carousel-container" ref="carousel-container">
          <b-carousel
            controls
            slot="header"
            v-model="slideIndex"
            class="fixed-size-carousel"
            @sliding-end="onSlideEnd"
            :interval="gallery.slideDuration"
          >
            <b-carousel-slide
              :key="codexRecord.id"
              v-for="codexRecord in records"
              :img-src="codexRecord.metadata | getMainImageUri"
            ></b-carousel-slide>
          </b-carousel>
          <p class="record-info" v-if="currentCodexRecord">
            <a href="#" @click.prevent="viewRecord(currentCodexRecord.tokenId)">
              {{ currentCodexRecord.metadata.name }}
            </a>
          </p>
        </div>

        <b-card-group deck class="record-list">
          <RecordListItem
            v-for="record in records"
            :codex-record="record"
            :key="record.tokenId"
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
  </div>
</template>

<script>

import is from 'is_js'

import EventBus from '../util/eventBus'
import Gallery from '../util/api/gallery'
import copyToClipboard from '../util/copyToClipboard'
import fullscreenHelper from '../util/fullscreenHelper'

import AppHeader from '../components/core/AppHeader'
import LoadingIcon from '../components/util/LoadingIcon'
import RecordListItem from '../components/RecordListItem'

export default {

  components: {
    AppHeader,
    LoadingIcon,
    RecordListItem,
  },

  data() {
    return {
      records: [],
      gallery: null,
      slideIndex: 0,
      pageNumber: 0,
      totalCount: 0,
      isLoading: false,
      pageSize: is.mobile() ? 4 : 16,
      browserSupportsFullscreen: fullscreenHelper.browserSupportsFullscreen,
    }
  },

  created() {
    // @TODO: Add caching for individual galleries?
    this.getGallery()
  },

  computed: {
    galleryShareCode() {
      return this.$route.params.galleryShareCode
    },

    currentCodexRecord() {
      return this.records[this.slideIndex]
    },
  },

  methods: {
    viewFullscreen() {
      fullscreenHelper.requestFullscreen(this.$refs['carousel-container'])
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

    onSlideEnd(slideIndex) {
      if (
        !this.isLoading &&
        this.records.length < this.totalCount &&
        slideIndex >= this.records.length / 2
      ) {
        this.loadMore()
      }
    },

    loadMore() {
      this.pageNumber += 1
      this.isLoading = true

      const limit = this.pageSize
      const offset = limit * this.pageNumber

      return Gallery.getGalleryRecords(this.galleryShareCode, { limit, offset })
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

    getGallery() {

      this.isLoading = true

      Gallery.getGallery(this.galleryShareCode)
        .then((gallery) => {
          this.gallery = gallery
        })
        .then(() => {
          this.pageNumber = 0
          const limit = this.pageSize
          const offset = limit * this.pageNumber
          return Gallery.getGalleryRecords(this.galleryShareCode, { limit, offset })
        })
        .then(({ totalCount, records }) => {
          if (!records || records.length === 0) {
            throw new Error(`${this.gallery.name} has no Codex Records to show.`)
          }
          this.records = records
          this.totalCount = totalCount
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get gallery: ${error.message}`)
          this.$router.replace({ name: 'galleries' })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.row
  display: block // turn off default `.row` flex display for fullscreen.

// a lot of these .carousel-container styles are mainly here for the fullscreen
//  view
.carousel-container
  width: 100%
  height: 100%
  display: flex
  align-items: center
  flex-direction: column
  justify-content: center
  background-color: $color-dark

.carousel
  width: 100%
  height: 100%
  padding: 1rem

  @media screen and (min-width: $breakpoint-md)
    width: 50%
    height: 50vh
    max-width: 50%

.record-info
  width: 50%
  padding: 1em
  margin 0 auto
  font-weight: 700
  text-align: center
  background-color: rgba(white, .01)

.record-list
  padding: 1rem
  display: none
  margin-top:  4rem

  @media screen and (min-width: $breakpoint-md)
    display: flex
    flex-wrap: wrap

.pagination-controls
  display: none

  @media screen and (min-width: $breakpoint-md)
    display: flex
    margin: 2rem 0
    justify-content: center

</style>
