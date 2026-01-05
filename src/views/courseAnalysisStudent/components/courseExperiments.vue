<template>
  <div class="mt-6 space-y-6 fade-in" >
    <!-- 实验列表 -->
    <div class="bg-white rounded-lg shadow p-4 flex flex-col" style="height: calc( 100vh - 335px );">
      <h3 class="text-lg font-medium text-gray-900 mb-4">课程实验列表</h3>
      <el-table :data="experimentData" class="w-full h-0 flex-1">
        <el-table-column prop="ptName" label="实验名称" min-width="280">
          <template #default="{ row, $index }">        
            <div class="text-sm font-medium text-gray-900">{{ row.ptName }}</div>
            <div class="text-sm text-gray-500"> 实验{{ $index + 1 }}</div>        
          </template>
        </el-table-column>
        <el-table-column prop="doneTime" label="完成时间" width="200">
          <template #default="{ row }">
            <span>{{ getTime(row.doneTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tagList" label="关键能力" width="260">
          <template #default="{ row }">
            <span v-for="(tag, index) in row.tagList" :key="index"
              class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-1"
              :class="getTagStyle(index)">
              {{ tag.tagName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="row.statusClass">
              {{ row.status ? '已完成' : '未完成' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <span @click.prevent="handleViewDetails(row)" class="text-primary-600 hover:underline cursor-pointer">
              查看详情
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="notDoneExperiment.length" class="mt-6 p-4 bg-gray-50 rounded-lg" >
      <h4 class="text-md font-medium text-gray-800 mb-3">实验准备建议</h4>
      <div class="text-gray-500 text-sm">
        <font-awesome-icon icon="fas fa-lightbulb" class="text-yellow-500 mr-1"></font-awesome-icon>
        <span>建议提前预习实验</span>
      </div>
      <ul>
        <li v-for="(item, i) in notDoneExperiment" :key="i">
          <span class="text-xs text-blue-500 hover:underline cursor-pointer" @click="goPreview(item)">《{{item.ptName}}》</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { StudentAnalysisTypeEnum, getStudentAnalysis } from '@/apis/emdV4/analysis_student'
const router = useRouter();
const route = useRoute();

const projectId = route.params.projectId
const studentId = route.params.studentId

const iconClassList = [
  {
    iconClass: 'text-blue-600',
    iconBgClass: 'bg-blue-100',
  },
  {
    iconClass: 'text-purple-600',
    iconBgClass: 'bg-purple-100',
  },
  {
    iconClass: 'text-indigo-600',
    iconBgClass: 'bg-indigo-100',
  },
  {
    iconClass: 'text-green-600',
    iconBgClass: 'bg-green-100',
  },
  {
    iconClass: 'text-yellow-600',
    iconBgClass: 'bg-yellow-100',
  },
  {
    iconClass: 'text-red-600',
    iconBgClass: 'bg-red-100',
  }
]

function getIconStyle(index) {
  let i = index % 6
  return iconClassList[i]
}

function getTagStyle(index) {
  let n = Math.floor(Math.random() * 5) + index
  n = n % 6
  let s = iconClassList[n]
  return `${s.iconClass} ${s.iconBgClass}`
}

function getTime(time) {
  return dayjs(time).format('YYYY年MM月DD日 HH:mm')
}

// 数据源
const experimentData = ref([])

const notDoneExperiment = computed(()=>{
  return experimentData.value.filter(item => !item.status)
})

// 查看详情逻辑
const handleViewDetails = (row) => {
  // console.log('查看详情:', row);
  router.push({
    name: 'courseTaskAnalysisStudent',
    params: {
      projectId: projectId,
      studentId: studentId,
      taskId: row.ptId,
      psId: row.psId,
      ptName: row.ptName,
    },
  })
};

onMounted(() => {
  updateChart();
})

function updateChart() {
  getStudentAnalysis(projectId, studentId, StudentAnalysisTypeEnum.STU_P_TASK).then(res => {
    if (res.state == 200) {
      // console.log(res.data)
      experimentData.value = res.data.task || []
    }
  })
}

// 跳转需要提供  pst 值 (教师端跳转的批改页面)
const toScoreCheck = (pst) => {
    console.log(pst)
    localStorage.removeItem("teacherRedover-" + pst)
    const routePath = router.resolve({
        path: "/emdv4/task/score/" + pst
    })
    window.open(routePath.href, '_blank');
}

const goPreview = (row)=>{
  const url = router.resolve({
    name: 'emdTaskDetailV4',
    params: {
      projectId: projectId,
      id: row.ptId
    },
  })
  window.open(url.href, '_blank');
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