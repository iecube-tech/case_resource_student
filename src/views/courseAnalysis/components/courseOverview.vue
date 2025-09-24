<template>
  <div class="mt-6 space-y-6">
    <!-- 课程完成进度 -->
    <div class="bg-white rounded-lg shadow p-4 hover-card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">课程完成进度</h3>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">整体完成度</span>
          <span class="text-sm font-medium text-green-600">{{ processPrecentage }}%</span>
        </div>
        <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div class="process-precentage h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
        </div>
        <div class="flex justify-between mt-1 text-xs text-gray-500">
          <span>开始</span>
          <span>中期</span>
          <span>结束</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">已完成实验</span>
            <span class="text-sm font-medium text-blue-600">{{ process.completed }}/{{ process.total }}</span>
          </div>
          <div class="grid grid-cols-6 gap-2">
            <div v-for="i in process.completed" :key="i"
              class="h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-sm transform hover:scale-105 transition-transform">
              {{ i }}
            </div>
            <div v-for="i in notCompletedExperiments" :key="i"
              class="h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-medium shadow-sm">
              {{ i + process.completed }}
            </div>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">知识点掌握</span>
            <span class="text-sm font-medium text-purple-600">{{ knowledgePoints.completed }} / {{ knowledgePoints.total
              }}</span>
          </div>
          <div class="relative h-16 bg-gray-200 rounded-lg overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-purple-600 knowledgePoints-precentage">
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-white px-3 py-1 rounded-full shadow-sm">
                <span class="text-sm font-medium text-purple-600">{{ knowledgePointsPrecentage }} 已掌握</span>
              </div>
            </div>
          </div>
          <div class="mt-2 flex justify-between">
            <span class="text-xs text-gray-500">已掌握 {{ knowledgePoints.completed }} 个知识点</span>
            <span class="text-xs text-gray-500">剩余 {{ knowledgePoints.total - knowledgePoints.completed }} 个知识点</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 班级表现对比 -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">班级表现对比</h3>
      <v-chart ref="chart1Ref" :option="option1" class="h-64" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
})

const process = ref({
  completed: 4,
  total: 6
})

const notCompletedExperiments = computed(() => process.value.total - process.value.completed)
const processPrecentage = computed(() => {
  if (process.value.completed == 0) {
    return 0 + '%';
  }
  let precentage = Math.floor(process.value.completed / process.value.total * 100)
  return precentage + '%';
})

const knowledgePoints = ref({
  completed: 8,
  total: 15,
})

const knowledgePointsPrecentage = computed(() => {
  if (knowledgePoints.value.completed == 0) {
    return 0
  }
  let precentage = Math.floor(knowledgePoints.value.completed / knowledgePoints.value.total * 100)
  return precentage + '%';
})

const chart1Ref = ref(null);
const option1 = ref({
  tooltip: {
    trigger: "axis", // Use 'axis' for line charts
  },
  legend: {
    data: ["您的分数", "班级平均"], // Legend for the two lines
  },
  xAxis: {
    type: "category",
    data: ["实验1", "实验2", "实验3", "实验4", "实验5"], // Chinese experiment names
    boundaryGap: false,
  },
  yAxis: {
    type: "value",
  },

  series: [
    {
      name: "您的分数", // First line
      type: "line",
      data: [80, 90, 60, 78, 92], // Your scores for each experiment
      smooth: true, // Smooth curve
      itemStyle: {
        color: "#0EA5E9",
      },
      areaStyle: {
        color: '#CFEDFB',
        opcacity: 0.2,
      }
    },
    {
      name: "班级平均", // Second line
      type: "line",
      data: [75, 85, 80, 72, 88], // Class average scores for each experiment
      smooth: true, // Smooth curve
      itemStyle: {
        color: "#F47C7C",
      },
      lineStyle: {
        type: "dashed",
      },
    },
  ],
});

watchEffect(() => {
  if (props.name === 'courseOverview') {
    setTimeout(() => {
      chart1Ref.value && chart1Ref.value.resize()
    }, 200)
  }
})

</script>

<style scoped>
.process-precentage {
  transition: width 0.5s ease-in-out;
  width: v-bind(processPrecentage);
}

.knowledgePoints-precentage {
  width: v-bind(knowledgePointsPrecentage);
}
</style>