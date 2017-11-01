import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import SingerDetail from '@/components/singer-detail/singer-detail'
import DiskDetail from '@/components/disk-detail/disk-detail'
import RankDetal from '@/components/rank-detail/rank-detail'

Vue.use(Router)


export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend' 
  }, {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: DiskDetail
      },
    ]
  }, {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      },
    ]
  }, {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: RankDetal
      },
    ]
  }, {
    path: '/search',
    component: Search,
  }]
})

