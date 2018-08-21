// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueBootstrap from 'bootstrap-vue'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/custom-bootstrap.scss'

import router from './router'
import App from './App'
import store from './store'

if (process.env.SENTRY_CONFIG) {
  Raven
    .config(process.env.SENTRY_CONFIG, {
      environment: process.env.TARGET_ENV,
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = false
Vue.use(VueBootstrap)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
