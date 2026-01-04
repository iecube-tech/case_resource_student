<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="space-y-8 fade-in">
      <div class="bg-white rounded-xl shadow-md p-6">
        <!-- 课程信息栏 -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ userInfo.studentName }}的课程学习概览</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{userInfo.projectName}} | 学期: {{ userInfo.semester }} | 学号: {{ studentId }}
            </p>
          </div>
          <div class="text-sm text-gray-500 ">
            更新时间: {{ userInfo.updateTime }}
          </div>
        </div>

        <!-- 页面标签栏 -->
        <div class="mt-6 border-b border-gray-200">
          <div class="flex space-x-8">
            <button v-for="tab in tabList" :key="tab.value" @click="tabName = tab.value"
              class="py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none" :class="tabName === tab.value
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'">
              {{ tab.label }}
            </button>
          </div>
        </div>

        <course-overview v-show="tabName === 'courseOverview'" :name="tabName" />
        <course-experiments v-show="tabName === 'courseExperiments'" :name="tabName" />
        <course-targets v-show="tabName === 'courseTargets'" :name="tabName" />
        <course-suggest v-show="tabName === 'courseSuggest'" :name="tabName" />

      </div>
    </div>
  </main>
</template>

<script setup>
import courseOverview from './courseOverview.vue';
import courseExperiments from './courseExperiments.vue';
import courseTargets from './courseTargets.vue';
import courseSuggest from './courseSuggest.vue';

import {studentBaseInfo} from '@/apis/emdV4/analysis_student'

const route = useRoute();
// console.log(route.params)

const projectId = route.params.projectId
const studentId = route.params.studentId

const userInfo = ref({
  projectName: '',
  semester: '',
  studentName: '',
  studentId: '',
  updateTime: '',
})

studentBaseInfo(projectId, studentId).then(res => {
  if(res.state == 200){
    userInfo.value.projectName = res.data.projectName
    userInfo.value.semester = res.data.semester
    userInfo.value.studentName = res.data.studentName
    userInfo.value.studentId = res.data.studentId
    userInfo.value.updateTime = res.data.updateTime
  }
})

const tabName = ref('courseOverview')
tabName.value = 'courseOverview'

const tabList = ref([
  { value: 'courseOverview', label: '课程概览' },
  { value: 'courseExperiments', label: '实验列表' },
  { value: 'courseTargets', label: '课程目标' },
  { value: 'courseSuggest', label: '学习建议' },
])

</script>

<style lang="scss" scoped>
</style>

