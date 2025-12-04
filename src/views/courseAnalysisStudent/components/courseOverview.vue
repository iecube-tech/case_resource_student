<template>
  <div class="mt-6 space-y-6">
    <!-- 课程完成进度 -->
    <div class="bg-white rounded-lg shadow p-4 hover-card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">课程完成进度</h3>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">整体完成度</span>
          <span class="text-sm font-medium text-green-600">{{ processPrecentage }}</span>
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
          <div class="flex justify-center items-center space-x-4">
            <template v-for="(task, i) in taskList">
              <div v-if="task.status" :title="task.ptName"
                class="flex-1 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium shadow-sm transform hover:scale-105 transition-transform">
                {{ i + 1 }}
              </div>
              <div v-else :title="task.ptName"
                class="flex-1 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-medium shadow-sm">
                {{ i + 1 }}
              </div>
            </template>
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
      <h4 class="text-md font-medium text-gray-700 mb-3">课程目标达成度对比</h4>
      <v-chart ref="chart1Ref" :option="option1" class="h-64" />
      
      <div class="mt-4 flex justify-between items-center space-x-8">
        <template v-for="(target, i) in targetList">
          <div v-if="target.difference > 0" class="flex-1 bg-gray-50 p-3 rounded-lg text-center h-[80px]">
            <div class="font-medium text-gray-900">课程目标{{ i+1 }}</div>
            <div class="text-green-600 font-medium">{{ (target.difference).toFixed(2) }}</div>
            <div class="text-xs text-gray-500">超出班级平均</div>
          </div>
          <div v-else-if="target.difference == 0" class="flex-1 bg-gray-50 p-3 rounded-lg text-center h-[80px]">
            <div class="font-medium text-gray-900">课程目标{{ i+1 }}</div>
            <div class="text-gray-600 font-medium">{{ (target.difference).toFixed(2) }}</div>
            <div class="text-xs text-gray-500">与班级平均相同</div>
          </div>
          <div v-else class="flex-1 bg-gray-50 p-3 rounded-lg text-center h-[80px]">
            <div class="font-medium text-gray-900">课程目标{{ i+1 }}</div>
            <div class="text-red-600 font-medium">{{ (target.difference).toFixed(2) }}</div>
            <div class="text-xs text-gray-500">低于班级平均</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StudentAnalysisTypeEnum, getStudentAnalysis } from '@/apis/emdV4/analysis_student'
const route = useRoute()
const projectId = route.params.projectId
const studentId = route.params.studentId

const props = defineProps({
  name: String,
})

const process = ref({
  completed: 0,
  total: 0
})

const taskList = ref([])
const targetList = ref([])

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
  grid: {
    left: "15%",
    right: "15%",
    bottom: "25%",
    top: "15%",
  },
  legend: {
    data: ["您的成绩", "班级平均"], // Legend for the two lines
    top: "0%",
  },
  xAxis: {
    type: "category",
    data: [], // Chinese experiment names
    // boundaryGap: false,
    axisLabel: {
      rotate: 5,
      margin: 15  // Optional: adds space between labels and axis
    }
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
    },
    axisTick: {
      show: true,
    },
    splitLine: {
      show: false,
    }
  },
  series: [
    {
      name: "您的成绩", // First line
      type: "bar",
      data: [], // Your scores for each experiment
      itemStyle: {
        color: "#7ADC9E",
      },
      areaStyle: {
        color: '#7ADC9E',
        opcacity: 0.2,
      },
      label: {
        show: true,
        position: "top",
        color: "#7ADC9E",
        fontSize: 12,
        fontWeight: "bold",
        formatter: function (params) {
          return params.value;
        }

      }
    },
    {
      name: "班级平均", // Second line
      type: "bar",
      data: [], // Class average scores for each experiment
      itemStyle: {
        color: "#C4C8CF",
      },
      lineStyle: {
        type: "dashed",
      },
      label: {
        show: true,
        position: "top",
        color: "#C4C8CF",
        fontSize: 12,
        fontWeight: "bold",
        formatter: function (params) {
          return params.value;
        }
      }
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

onMounted(() => {
  setTimeout(() => {
    updateChart()
  }, 200)
})

function updateChart() {
  getStudentAnalysis(projectId, studentId, StudentAnalysisTypeEnum.STU_P_OVERVIEW).then(res => {
    if (res.state == 200) {
      setOverview(res.data)
      setTaskList(res.data.taskList)
      setTargetList(res.data.target)
    }
  })
}

function setOverview(data) {
  process.value.completed = data.hadDoneSize
  process.value.total = data.taskList.length

  knowledgePoints.value.completed = data.tagDoneSize
  knowledgePoints.value.total = data.tagSize
}

function setTaskList(list) {
  list.sort((a, b) => b.status - a.status)
  taskList.value = list

  let xAxisData = list.map(_ => _.ptName)
  let data1 = list.map(_ => _.ptScore)
  let data2 = list.map(_ => _.ptAvgScore)

  option1.value.xAxis.data = xAxisData
  option1.value.series[0].data = data1
  option1.value.series[1].data = data2

  chart1Ref.value && chart1Ref.value.setOption(option1.value)
}

function setTargetList(list) {
  targetList.value = list
}


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