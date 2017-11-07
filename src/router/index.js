import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import('@/components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('@/components/singer/singer').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('@/components/rank/rank').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('@/components/search/search').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('@/components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const DiskDetail = (resolve) => {
  import('@/components/disk-detail/disk-detail').then((module) => {
    resolve(module)
  })
}
const RankDetal = (resolve) => {
  import('@/components/rank-detail/rank-detail').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => {
  import('@/components/user-center/user-center').then((module) => {
    resolve(module)
  })
}


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
  },{
    path: '/user',
    component: UserCenter
  }]
})

