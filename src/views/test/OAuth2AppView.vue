<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="OAuth2 Test App API Interface" />
        <div class="content">
          <p>This page is for developers that have registered an OAuth2 application with the Codex API.</p>
          <p>
            See <a href="https://dev.codexprotocol.com" target="_blank">dev.codexprotocol.com</a> for more details on how to register.
          </p>
          <b-tabs class="mt-3">
            <b-tab
              v-for="(tab, i) in tabs"
              :key="i"
              :title="tab.title"
              v-if="!tab.requiresAdmin || (tab.requiresAdmin && isAdmin)"
            >
              <div class="container-fluid mt-3">
                <component :is="tab.component" :showResult="showResult" :accessToken="accessToken" />
              </div>
            </b-tab>
          </b-tabs>
          <div class="container-fluid mt-3">
            <div class="json" v-text="result">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import AppHeader from '../../components/core/AppHeader'
import OAuth2AppCreateClientForm from '../../components/OAuth2AppCreateClientForm'
import OAuth2AppTokenRequestForm from '../../components/OAuth2AppTokenRequestForm'
import OAuth2AppCreateRecordForm from '../../components/OAuth2AppCreateRecordForm'
import OAuth2AppReadRecordForm from '../../components/OAuth2AppReadRecordForm'
import OAuth2AppUpdateRecordForm from '../../components/OAuth2AppUpdateRecordForm'
import OAuth2AppTransferRecordForm from '../../components/OAuth2AppTransferRecordForm'

export default {
  name: 'OAuth2AppView',

  components: {
    AppHeader,
  },

  data() {
    return {
      tabs: [
        {
          title: 'Create client',
          component: OAuth2AppCreateClientForm,
          requiresAdmin: true,
        },
        {
          title: 'Token request',
          component: OAuth2AppTokenRequestForm,
        },
        {
          title: 'Create record',
          component: OAuth2AppCreateRecordForm,
        },
        {
          title: 'Read record',
          component: OAuth2AppReadRecordForm,
        },
        {
          title: 'Update record',
          component: OAuth2AppUpdateRecordForm,
        },
        {
          title: 'Transfer record',
          component: OAuth2AppTransferRecordForm,
        },
      ],

      result: null,
      accessToken: null,
    }
  },

  computed: {
    ...mapGetters('auth', ['isAdmin']),
  },

  methods: {
    showResult(response) {
      // @TODO: error checking
      this.result = response.data.result

      if (this.result.accessToken) {
        this.accessToken = this.result.accessToken
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.json
  white-space: pre

</style>
