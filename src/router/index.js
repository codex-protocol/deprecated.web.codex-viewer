import Vue from 'vue'
import Router from 'vue-router'

import TitleList from '../components/TitleList'
import TitleDetail from '../components/TitleDetail'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    components: {
      list: TitleList,
    },
  }, {
    path: '/title/:titleId',
    name: 'title-detail',
    components: {
      detail: TitleDetail,
    },
  }],
})
