import Vue from 'vue'
import Router from 'vue-router'
import Splash from '@/components/Splash'
import Demo from '@/components/Demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'splash',
      component: Splash
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    },
  ]
})
