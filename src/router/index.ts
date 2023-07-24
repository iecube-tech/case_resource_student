import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/components/layout/index.vue'
import MyProject from '../views/project/myproject/index.vue'
import Login from '@/views/login/index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
      meta: { title: '首页' },
      children: [
        {
          path: '',
          redirect: '/myproject',
        },
        {
          path: '/myproject',
          name: 'myproject',
          component: MyProject,
          meta: { title: '我的项目' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    }
  ]
})

export default router
