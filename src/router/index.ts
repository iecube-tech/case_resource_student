import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/components/layout/index.vue'
import MyProject from '../views/project/myproject/index.vue'
import Login from '@/views/login/index.vue'
import MyGrade from '@/views/grade/mygrade/index.vue'
import Account from '@/views/account/index.vue'
import ProjectDetail from '@/views/project/projectdetail/index.vue'
import GradeDetail from '@/views/grade/gradedetail/index.vue'


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
          meta: { title: '我的项目' },
          children: [{
            path: '/detail/:id',
            name: 'ProjectDetail',
            component: ProjectDetail,
            meta: { title: '项目详情' }
          }]
        },
        {
          path: '/grade',
          name: 'grade',
          component: MyGrade,
          meta: { title: '我的成绩' },
          children: [{
            path: '/detail/:id',
            name: 'GradeDetail',
            component: GradeDetail,
            meta: { title: '成绩详情' }
          }]
        },
        {
          path: '/account',
          name: 'account',
          component: Account,
          meta: { title: '账户管理' }
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
