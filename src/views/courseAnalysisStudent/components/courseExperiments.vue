<template>
  <div class="mt-6 space-y-6 fade-in" >
    <!-- 实验列表 -->
    <div class="bg-white rounded-lg shadow p-4 flex flex-col" style="height: calc( 100vh - 335px );">
      <h3 class="text-lg font-medium text-gray-900 mb-4">课程实验列表</h3>

      <!-- 使用 el-table 替代原生表格 -->
      <el-table :data="experimentData" class="w-full h-0 flex-1">
        <el-table-column prop="ptName" label="实验名称" min-width="280">
          <template #default="{ row, $index }">
            <!-- <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full"
                :class="getIconStyle($index).iconBgClass">
                <font-awesome-icon icon="fa-solid fa-flask" :class="getIconStyle($index).iconClass" />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ row.ptName }}</div>
                <div class="text-sm text-gray-500"> 实验{{ $index + 1 }}</div>
              </div>
            </div> -->
            
            <div class="text-sm font-medium text-gray-900">{{ row.ptName }}</div>
            <div class="text-sm text-gray-500"> 实验{{ $index + 1 }}</div>
            
          </template>
        </el-table-column>
        <el-table-column prop="doneTime" label="完成时间" width="200">
          <template #default="{ row }">
            <span>{{ getTime(row.doneTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="score" label="分数" width="100">
          <template #default="{ row }">
            <span v-if="row.score !== '--'"
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {{ row.score }}
            </span>
            <span v-else
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              --
            </span>
          </template>
        </el-table-column> -->
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
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { StudentAnalysisTypeEnum, getStudentAnalysis } from '@/apis/emdV4/analysis_student'
const router = useRouter();
const route = useRoute();
// console.log(route.params.projectId)
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