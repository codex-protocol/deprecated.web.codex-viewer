<template>
  <div>
    <section v-if="Object.keys(additionalMetadata).length !== 0">
      <h4>Asset Details</h4>
      <div class="details-table">
        <div :key="key" v-for="(value, key) in additionalMetadata">
          <span>{{ key | titleCase }}</span>
          <span>{{ value | formatDate }}</span>
        </div>
      </div>
    </section>

    <template v-if="showDetails">
      <section>
        <h4>Codex Record Details</h4>
        <div class="details-table">
          <div>
            <span>Privacy Setting</span>
            <span>
              {{ codexRecord.isPrivate ? 'Private' : 'Public' }}
              <!--
              <img class="privacy-icon" src="../assets/icons/lock.svg" v-if="codexRecord.isPrivate" />
              <img class="privacy-icon" src="../assets/icons/lock-open.svg" v-if="!codexRecord.isPrivate" />
              -->
            </span>
          </div>
          <div v-if="codexRecord.metadata">
            <span>Creator</span>
            <span><DisplayName :address="codexRecord.metadata.creatorAddress" /></span>
          </div>
          <div>
            <span>Current Owner</span>
            <span><DisplayName :address="codexRecord.ownerAddress" /></span>
          </div>
          <div v-if="codexRecord.approvedAddress">
            <span>Approved for Transfer To</span>
            <span><DisplayName :address="codexRecord.approvedAddress" /></span>
          </div>
          <div>
            <span>Created</span>
            <span>{{ codexRecord.createdAt | formatDate }}</span>
          </div>
          <div>
            <span>Last Updated</span>
            <span>{{ codexRecord.updatedAt | formatDate }}</span>
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
    </template>
  </div>
</template>

<script>

import DisplayName from './util/DisplayName'
import ValidHashBadge from './badges/valid-hash'

export default {
  props: {
    showDetails: {
      type: Boolean,
      default: false,
    },
    codexRecord: {
      type: Object,
      required: true,
    },
  },
  components: {
    DisplayName,
    ValidHashBadge,
  },
  computed: {

    // remove any empty values from the additional metadata, which also allows
    //  us to detect if no keys are present at all (so we can hide the metadata
    //  table alltogether)
    additionalMetadata() {

      if (!this.codexRecord.metadata) return {}

      const additionalMetadata = Object.assign({}, this.codexRecord.metadata.additionalMetadata)

      Object.keys(additionalMetadata).forEach((key) => {
        const value = additionalMetadata[key]
        if (typeof value === 'undefined' || value === null) delete additionalMetadata[key]
      })

      return additionalMetadata

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
  font-size: small

.privacy-icon
  width: 1em
  height: 1em
  vertical-align: text-bottom

</style>
