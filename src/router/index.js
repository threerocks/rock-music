import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Station from '@/components/station/station'

Vue.use(Router)


export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend' 
  }, {
    path: '/recommend',
    component: Recommend,
  }, {
    path: '/singer',
    component: Singer,
  }, {
    path: '/rank',
    component: Rank,
  }, {
    path: '/station',
    component: Station,
  }]
})

