<template>
  <div>
    <section>
      <h4>Details</h4>
      <div class="details-table">
        <div v-if="codexRecord.metadata">
          <span>Creator</span>
          <span><DisplayName :name="codexRecord.metadata.creatorAddress" /></span>
        </div>
        <div>
          <span>Current Owner</span>
          <span><DisplayName :name="codexRecord.ownerAddress" /></span>
        </div>
        <div v-if="codexRecord.approvedAddress">
          <span>Approved for Transfer To</span>
          <span><DisplayName :name="codexRecord.approvedAddress" /></span>
        </div>
        <div>
          <span>Created</span>
          <span>{{ formatDate(codexRecord.createdAt) }}</span>
        </div>
        <div>
          <span>Last Updated</span>
          <span>{{ formatDate(codexRecord.updatedAt) }}</span>
        </div>
      </div>
    </section>

    <section>
      <h4>Blockchain Hashes</h4>
      <div class="details-table">
        <div>
          <span>Name Hash</span>
          <span>
            {{ codexRecord.nameHash }}
            <ValidHashBadge
              v-if="codexRecord.metadata"
              :hash="codexRecord.nameHash"
              :string="codexRecord.metadata.name"
            />
          </span>
        </div>
        <div>
          <span>Description Hash</span>
          <span>
            {{ codexRecord.descriptionHash }}
            <ValidHashBadge
              v-if="codexRecord.metadata"
              :hash="codexRecord.descriptionHash"
              :string="codexRecord.metadata.description"
            />
          </span>
        </div>
        <div>
          <span>File Hashes</span>
          <span>
            <!--
              @TODO: add ValidHashBadge for file hashes, which is a little more complicated...
            -->

            <span
              class="file-hash"
              :key="index" v-for="(fileHash, index) in codexRecord.fileHashes"
            >
              {{ fileHash }}
            </span>
          </span>
        </div>
      </div>
    </section>

    <section v-if="codexRecord.metadata && codexRecord.metadata.additionalMetadata">
      <h4>Auction House Metadata</h4>
      <div class="details-table">
        <div :key="key" v-for="(value, key) in codexRecord.metadata.additionalMetadata">
          <span>{{ key | titleCase }}</span>
          <span>{{ value }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import DisplayName from './util/DisplayName'
import ValidHashBadge from './badges/valid-hash'
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
    ValidHashBadge,
  },

  methods: {
    formatDate(date) {
      return formatDate(date)
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

section
  &+section
    margin-top: 2rem

.details-table
  display: flex
  font-size: small
  flex-direction: column
  border: 1px solid rgba($color-primary, .1)

  >div
    width: 100%
    display: flex

    &+div
      border-top: 1px solid rgba($color-primary, .1)

    >span
      padding: .5rem
      overflow-wrap: break-word

      &:nth-of-type(1)
        width: 33%
        background-color: rgba($color-primary, .05)

      &:nth-of-type(2)
        flex-grow: 1
        width: 67%

  .file-hash
    width: 100%
    display: inline-block
    overflow-wrap: break-word

    &+.file-hash
      margin-top: .5rem

</style>
