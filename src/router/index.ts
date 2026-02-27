import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/components/layout/index.vue'
import MyProject from '../views/project/myproject/index.vue'
import Login from '@/views/login/index.vue'
import MyGrade from '@/views/grade/mygrade/index.vue'
import Account from '@/views/account/index.vue'
import ProjectDetail from '@/views/project/projectdetail/index.vue'
import GradeDetail from '@/views/grade/gradedetail/index.vue'


const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Index,
      meta: { title: '首页' },
      children: [
        {
          path: '',
          redirect: '/mycourse',
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
          path: '/mycourse',
          name: 'mycourse',
          component: () => import("@/views/course/mycourse/index.vue"),
          meta: { title: '我的课程' },
          children: [
            {
              path: '/mycourse/detail/:id',
              name: 'courseDetail',
              component: () => import("@/views/course/courseDetail/reindex.vue"),
              meta: { title: '课程详情' },
            },
          ]
        },
        {
          path: '/mycourse/:id/tasklist/',
          name: "TheTaskListOfCourse",
          component: () => import('@/views/course/EMDCourse/TaskList/index.vue'),
          meta: { title: '实验列表' },
        },
        {
          path: '/grade',
          name: 'grade',
          component: MyGrade,
          meta: { title: '我的成绩' },
          children: [{
            path: '/grade/:id',
            name: 'GradeDetail',
            component: GradeDetail,
            meta: { title: '成绩详情' }
          }]
        },
        {
          path: '/exam',
          name: 'exam',
          component: () => import('@/views/exam/index.vue'),
          meta: { title: '考试' },
          children: [
            {
              path: '',
              name: 'examCourseList',
              component: () => import('@/views/exam/courseList.vue'),
              meta: { title: '考试课程', parentName: 'exam' }
            },
            {
              path: ':projectId',
              name: 'examList',
              component: () => import('@/views/exam/courseExamList.vue'),
              meta: { title: '考试列表', parentName: 'examCourseList' }
            },
          ]
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
      path: '/mycourse/task/:id',
      name: 'emdTaskDetail',
      component: () => import('@/views/course/EMDCourse/EMDLab/labview.vue'),
      meta: { title: '实验详情' }
    },
    {
      path: '/mycourse/taskV4/:projectId/:id',
      name: 'emdTaskDetailV4',
      component: () => import('@/views/course/EMDCourse/EMDLabV4/index.vue'),
      meta: { title: '实验详情' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/3login',
      name: '3login',
      component: () => import('@/views/3login/index.vue')
    },
    {
      path: '/remote/operation/:id',
      name: 'remoteOperation',
      component: () => import("@/views/remoteOperation/operation.vue"),
      meta: { title: "远程操作" }
    },
    {
      path: '/test',
      name: 'Test',
      // component: () => import('@/views/test/input.vue')
      component: () => import('@/views/test/markerTest/marker.vue')
    },
    // 学生端 课程分析
    {
      path: '/course/analysis/:projectId/:studentId',
      name: 'courseAnalysisStudent',
      component: () => import("@/views/courseAnalysisStudent/index.vue")
    },
    // 学生端 任务分析
    {
      path: '/task/analysis/:projectId/:studentId/:taskId/:psId/:ptName',
      name: 'courseTaskAnalysisStudent',
      component: () => import("@/views/courseTaskAnalysisStudent/index.vue")
    },
    {
      path: '/exam/paper/:projectId/:esId',
      name: 'examPaper',
      component: () => import('@/views/exam/examPaper.vue'),
      meta: { title: '考试试卷', parentName: 'examList' }

    }
  ]
})

export default router
