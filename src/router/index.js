import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'
import config from '../util/config'

import LoginView from '../views/LoginView'
import GalleryView from '../views/GalleryView'
import GetCODXView from '../views/GetCODXView'
import SettingsView from '../views/SettingsView'
import ContactUsView from '../views/ContactUsView'
import RecordListView from '../views/RecordListView'
import FeatureListView from '../views/FeatureListView'
import GalleryListView from '../views/GalleryListView'
import OAuth2AppView from '../views/test/OAuth2AppView'
import ManageTokensView from '../views/ManageTokensView'
import RecordDetailView from '../views/RecordDetailView'
import TransferListView from '../views/TransferListView'
import AuctionHouseView from '../views/AuctionHouseView'
import ConfirmEmailView from '../views/ConfirmEmailView'
import ResetPasswordView from '../views/ResetPasswordView'
import AuctionHouseListView from '../views/AuctionHouseListView'

Vue.use(Router)

const router = new Router({
  routes: [

    // login routes
    {
      name: 'login',
      path: '/',
      alias: [
        '/login',
        '/signup',
      ],
      component: LoginView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        ifAuthenticatedRedirect: true,
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'confirm-email',
      path: '/confirm-email',
      component: ConfirmEmailView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        ifAuthenticatedRedirect: true,
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'reset-password',
      path: '/reset-password',
      component: ResetPasswordView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        ifAuthenticatedRedirect: true,
        allowUnauthenticatedUsers: true,
      },
    },

    // main application routes
    {
      name: 'settings',
      path: '/settings',
      component: SettingsView,
    },
    {
      name: 'collection',
      path: '/collection',
      component: RecordListView,
    },
    {
      name: 'contact',
      path: '/contact',
      component: ContactUsView,
      meta: {
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'record-detail',
      path: '/record/:recordId',
      component: RecordDetailView,
      meta: {
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'transfers',
      path: '/transfers',
      redirect: '/transfers/incoming',
    },
    {
      name: 'incoming-transfers',
      path: '/transfers/incoming',
      component: TransferListView,
      props: {
        transferDirection: 'incoming',
      },
    },
    {
      name: 'outgoing-transfers',
      path: '/transfers/outgoing',
      component: TransferListView,
      props: {
        transferDirection: 'outgoing',
      },
    },
    {
      name: 'get-codx',
      path: '/get-codx',
      component: GetCODXView,
    },

    // auction house routes
    {
      name: 'auction-houses',
      path: '/auction-houses',
      component: AuctionHouseListView,
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'auction-house',
      component: AuctionHouseView,
      meta: { allowUnauthenticatedUsers: true },
      path: '/auction-houses/:auctionHouseShareCode',
    },

    // gallery routes
    {
      name: 'galleries',
      path: '/galleries',
      component: GalleryListView,
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'gallery',
      component: GalleryView,
      path: '/galleries/:galleryShareCode',
      meta: { allowUnauthenticatedUsers: true },
    },

    // other non-application routes
    {
      name: 'extensions',
      path: '/extensions',
      component: FeatureListView,
    },

    // test routes (development only)
    {
      name: 'test-oauth2-app',
      path: '/test/oauth2-app',
      component: OAuth2AppView,
    },
  ],
})

if (config.showManageTokensPage) {
  router.addRoutes([
    { name: 'manage-tokens', path: '/manage-tokens', component: ManageTokensView },
  ])
}

router.beforeEach((to, from, next) => {

  if (to.meta.ifAuthenticatedRedirect && store.getters['auth/isAuthenticated']) {
    return next({ name: 'collection' })
  }

  const requireAuthentication = to.matched.some((route) => {
    return !route.meta.allowUnauthenticatedUsers
  })

  // if no route was matched (i.e. a 404)
  // or if the user is trying to access an authenticated page but is unauthenticated
  // then send them to the login page
  if (to.matched.length === 0 || (requireAuthentication && !store.getters['auth/isAuthenticated'])) {
    const nextRoute = { name: 'login' }

    // If a route was matched but the request is unauthenticated, then cache the original destination for post-authentication
    if (to.matched.length > 0) {
      nextRoute.query = { destination: to.fullPath }
    }

    return next(nextRoute)
  }

  return next()

})

export default router
