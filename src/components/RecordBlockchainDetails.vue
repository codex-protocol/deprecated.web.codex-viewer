<template>
  <div>
    <section>
      <h4>Details</h4>
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
