import Vue from 'vue'
import Router from 'vue-router'

import TitleViewer from '../components/TitleViewer'
import TitleDetail from '../components/TitleDetail'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: TitleViewer,
  }, {
    path: '/title/:titleId',
    name: 'title-detail',
    component: TitleDetail,
  }],
})
