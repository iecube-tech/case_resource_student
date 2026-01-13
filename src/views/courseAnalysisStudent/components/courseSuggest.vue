<template>
  <div class="mt-6 space-y-6 fade-in">
    <!-- 课程学习反馈 -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">课程学习反馈</h3>

      <!-- 总体评价 -->
      <div class="p-4 rounded-lg mb-4 bg-blue-50 text-blue-800 space-y-2">
        <h4 class="text-md font-medium">
          总体学习表现
        </h4>
        <div class="text-sm" v-for="(item, i) in overall_performance" :key="i">
          {{ item }}
        </div>
      </div>

      <!-- 学习策略建议 和 推荐学习资源 -->
      <div class="grid grid-cols-2 gap-6 mb-4">
        <div class="p-4 bg-green-50 space-y-2 rounded-lg">
          <h4 class="text-md font-medium text-green-800">
            <font-awesome-icon icon="fas fa-lightbulb" class="mr-2" />学习策略建议</h4>
          <div v-for="(item, i) in learning_strategies" :key="i" class="text-sm bg-white p-2 rounded-lg text-gray-700 text-justify">{{ item }}</div>
        </div>
        
         <div class="p-4 bg-purple-50 space-y-2 rounded-lg">
          <h4 class="text-md font-medium text-purple-800">
            <font-awesome-icon icon="fas fa-book" class="mr-2" />推荐学习资源</h4>
            <div v-for="(item, i) in learnResources" :key="i" class="text-blue-500 text-sm cursor-pointer" @click="goLink(item)">
              《{{ item.name }}》
            </div>
        </div>
      </div>
    </div>

    <!-- 能力提升计划 -->
    <div class="bg-white rounded-lg shadow p-4 space-y-2">
      <h3 class="text-lg font-medium text-gray-900 mb-4">能力提升计划</h3>

      <div class="bg-indigo-50 text-indigo-800 p-4 rounded-lg">
        <h4 class="text-md font-medium mb-2">短期提升目标(两周内)</h4>
        <div v-for="(item, i) in short_term_goals" :key="i" class="text-sm">{{ item }}</div>
      </div>
      
      <div class="bg-blue-50 text-blue-800 p-4 rounded-lg">
        <h4 class="text-md font-medium mb-2">中期提升目标(一个月内)</h4>
        <div v-for="(item, i) in medium_term_goals" :key="i" class="text-sm">{{ item }}</div>
      </div>
      
      <div class="bg-purple-50 text-purple-800 p-4 rounded-lg">
        <h4 class="text-md font-medium mb-2">长期发展方向</h4>
        <div v-for="(item, i) in long_term_direction" :key="i" class="text-sm">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {flattenDeep} from 'lodash'

import { StudentAnalysisTypeEnum, getStudentAnalysis } from '@/apis/emdV4/analysis_student'
const route = useRoute();
const projectId = route.params.projectId
const studentId = route.params.studentId

const overall_performance = ref([])
const learning_strategies = ref([])

const short_term_goals = ref([])
const medium_term_goals = ref([])
const long_term_direction = ref([])

const learnResources = ref([])

onMounted(() => {
  updateChart();
})

function updateChart() {
  getStudentAnalysis(projectId, studentId, StudentAnalysisTypeEnum.STU_P_SUG).then(res => {
    // TODO 学生课程 教学建议数据处理
    console.log(res.data)
    if (res.state == 200) {
      let report = res.data.report
      let suggestion = res.data.suggestion
      let learn = res.data.learn || []
      overall_performance.value = report.overall_performance || []
      learning_strategies.value = report.learning_strategies || []
      long_term_direction.value = suggestion.long_term_direction || []
      medium_term_goals.value = suggestion.medium_term_goals || []
      short_term_goals.value = suggestion.short_term_goals || []
      
      learnResources.value = flattenDeep(learn)
    }
  })
}

function goLink(item) {
  window.open(item.link, '_blank')
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>