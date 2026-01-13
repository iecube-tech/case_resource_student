<template>
  <div class="mt-6 space-y-6 fade-in">
    <!-- Personalized Learning Suggestions -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">个性化学习建议</h3>

      <div class="space-y-5">
        <!-- Areas for Improvement -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <h4 class="font-medium text-red-800">需要改进的方面</h4>
          <ul class="mt-2 space-y-2 text-sm text-gray-700">
            <li v-for="(item, index) in improvementAreas" :key="'improve-' + index" class="flex items-start space-x-2">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500 mt-1" />
              <span>
                {{ item }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Strengths -->
        <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <h4 class="font-medium text-green-800">已掌握的优势</h4>
          <ul class="mt-2 space-y-2 text-sm text-gray-700">
            <li v-for="(item, index) in strengths" :key="'strength-' + index" class="flex items-start space-x-2">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500 mt-1" />
              <span>
                {{ item }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Learning Suggestions -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 class="font-medium text-blue-800">学习建议</h4>
          <ul class="mt-2 space-y-2 text-sm text-gray-700">
            <li v-for="(item, index) in learningSuggestions" :key="'suggestion-' + index" class="flex items-start space-x-2">
              <font-awesome-icon :icon="['fas', 'book-open']" class="text-blue-500 mt-1" />
              <span>
                {{ item }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Recommended Resources -->
    <div class="bg-purple-50 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-purple-700 mb-4">相关资源推荐</h3>
      <div v-for="(item, i) in learnResources" :key="i" class="text-blue-500 text-sm cursor-pointer"
        @click="goLink(item)">
        《{{ item.name }}》
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { StudentTaskAnalysisTypeEnum, getStudentTaskAnalysis } from '@/apis/emdV4/analysis_student'
import { flattenDeep } from 'lodash'

const route = useRoute();
const projectId = route.params.projectId;
const taskId = route.params.taskId;
const psId = route.params.psId;

// Define reactive properties
const props = defineProps({
  name: String,
})

const improvementAreas = ref([]);
const strengths = ref([]);
const learningSuggestions = ref([]);

const learnResources = ref([])

onMounted(() => {
  updateChart()
})

function updateChart() {
  getStudentTaskAnalysis(projectId, taskId, psId, StudentTaskAnalysisTypeEnum.PST_SUG).then(res => {
    if (res.state == 200) {
      let suggestion = res.data.suggestion
      let learn = res.data.learn || []
      strengths.value = suggestion.strengths
      improvementAreas.value = suggestion.areas_for_improvement;
      learningSuggestions.value = suggestion.learning_suggestions;
      
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
  transition: opacity 0.3s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>