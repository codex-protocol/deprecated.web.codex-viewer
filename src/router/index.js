import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'
import config from '../util/config'

// Always include LoginView in the main bundle
import LoginView from '../views/LoginView'

const ConfirmEmailView = () => { return import('../views/ConfirmEmailView') }
const FeatureListView = () => { return import('../views/FeatureListView') }
const TransferListView = () => { return import('../views/TransferListView') }
const RecordListView = () => { return import('../views/RecordListView') }
const RecordDetailView = () => { return import('../views/RecordDetailView') }
const SettingsView = () => { return import('../views/SettingsView') }
const ManageTokensView = () => { return import('../views/ManageTokensView') }
const FaucetView = () => { return import('../views/FaucetView') }
const GalleryView = () => { return import('../views/GalleryView') }
const GalleryListView = () => { return import('../views/GalleryListView') }
const OAuth2AppView = () => { return import('../views/test/OAuth2AppView') }
const ContactUsView = () => { return import('../views/ContactUsView') }

Vue.use(Router)

const router = new Router({
  routes: [

    // login routes
    {
      name: 'login',
      path: '/login',
      alias: '/',
      component: LoginView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        allowUnauthenticatedUsers: true,
        ifAuthenticatedRedirect: true,
      },
    },
    {
      name: 'confirm-email',
      path: '/confirm-email',
      component: ConfirmEmailView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        allowUnauthenticatedUsers: true,
        ifAuthenticatedRedirect: true,
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

    // gallery routes
    {
      name: 'galleries',
      path: '/galleries',
      component: GalleryListView,
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'gallery',
      path: '/galleries/:galleryShareCode',
      component: GalleryView,
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

if (config.showFaucet) {
  router.addRoutes([
    { name: 'faucet', path: '/faucet', component: FaucetView, meta: { allowUnauthenticatedUsers: true } },
  ])
}

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
  }

  return next()

})

export default router
