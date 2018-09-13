<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="CODX Faucet" />
        <div class="content">
          <b-tabs>
            <b-tab title="Create client">
              <div class="container-fluid mt-3">
                Create the client
                <OAuth2AppCreateClientForm />
              </div>
            </b-tab>
            <b-tab title="Token request">
              Token request
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../../components/core/AppHeader'
import OAuth2AppCreateClientForm from '../../components/OAuth2AppCreateClientForm'

export default {
  name: 'oauth2-app',

  components: {
    AppHeader,
    OAuth2AppCreateClientForm,
  },

  methods: {
    createOAuth2Client() {

    },
  },
}
</script>

<style>

</style>
