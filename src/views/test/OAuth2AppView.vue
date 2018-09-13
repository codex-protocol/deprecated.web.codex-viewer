<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="CODX Faucet" />
        <div class="content">
          <b-tabs>
            <b-tab title="Create client">
              <div class="container-fluid mt-3">
                <OAuth2AppCreateClientForm :showResult="showResult" />
              </div>
            </b-tab>
            <b-tab title="Token request">
              Token request
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
import AppHeader from '../../components/core/AppHeader'
import OAuth2AppCreateClientForm from '../../components/OAuth2AppCreateClientForm'

export default {
  name: 'OAuth2AppView',

  components: {
    AppHeader,
    OAuth2AppCreateClientForm,
  },

  data() {
    return {
      result: null,
    }
  },

  methods: {
    showResult(response) {
      // @TODO: error checking
      this.result = response.data.result
    },
  },
}
</script>

<style lang="stylus" scoped>
.json
  white-space: pre;

</style>
