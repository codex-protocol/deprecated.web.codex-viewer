import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

import LoginView from '../views/LoginView'
import TitleListView from '../views/TitleListView'
import TitleDetailView from '../views/TitleDetailView'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

// TODO: Add some logic to catch unhandled routes and redirect them to / or show some error

export default new Router({
  routes: [
    { path: '/login', component: LoginView, beforeEnter: ifNotAuthenticated },
    { path: '/my-titles', component: TitleListView, beforeEnter: ifAuthenticated },
    { path: '/title/:titleId', name: 'title-detail', component: TitleDetailView },
    { path: '/', redirect: '/my-titles' },
  ],
})
