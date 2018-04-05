import Vue from 'vue'
import Router from 'vue-router'

import LoginView from '../views/LoginView'
import TitleListView from '../views/TitleListView'
import TitleDetailView from '../views/TitleDetailView'

Vue.use(Router)

export default new Router({
  routes: [
    { path: 'login', component: LoginView },
    { path: '/my-titles', component: TitleListView },
    { path: '/title/:titleId', component: TitleDetailView },
    { path: '/', redirect: '/my-titles' },
  ],
})
