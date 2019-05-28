import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/index').default
    },
    {
      path: '/loading',
      name: 'loading',
      component: require('@/page/loading').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
