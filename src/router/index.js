import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

import LoginView from '../views/LoginView'
import OfferListView from '../views/OfferListView'
import TransferIncomingListView from '../views/TransferIncomingListView'
import TitleListView from '../views/TitleListView'
import TitleDetailView from '../views/TitleDetailView'
import SettingsView from '../views/SettingsView'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

// TODO: Add some logic to catch unhandled routes and redirect them to / or show some error

const router = new Router({
  routes: [
    { path: '/login', component: LoginView, beforeEnter: ifNotAuthenticated },
    { path: '/transfers', redirect: '/transfers/incoming', meta: { requiresAuth: true } },
    { path: '/transfers/incoming', component: TransferIncomingListView, meta: { requiresAuth: true } },
    { path: '/my-offers', component: OfferListView, meta: { requiresAuth: true } },
    { path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
    { path: '/collection', component: TitleListView, meta: { requiresAuth: true } },
    { path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
    { path: '/title/:titleId', name: 'title-detail', component: TitleDetailView },
    { path: '/', redirect: '/collection' },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => { return record.meta.requiresAuth })) {
    if (!store.getters.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
