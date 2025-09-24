<template>
  <div class="mt-6 space-y-6 fade-in">
    <!-- 实验列表 -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">课程实验列表</h3>

      <!-- 使用 el-table 替代原生表格 -->
      <el-table :data="experimentData" class="w-full">
        <el-table-column prop="name" label="实验名称" width="250">
          <template #default="{ row }">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full"
                :class="row.iconBgClass">
                <font-awesome-icon :icon="row.icon" :class="row.iconClass" />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ row.name }}</div>
                <div class="text-sm text-gray-500">{{ row.subName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="completionTime" label="完成时间" width="150" />
        <el-table-column prop="score" label="分数" width="100">
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
        </el-table-column>
        <el-table-column prop="keySkills" label="关键能力">
          <template #default="{ row }">
            <span v-for="(skill, index) in row.keySkills" :key="index"
              class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-1" :class="skill.bgClass">
              {{ skill.label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="row.statusClass">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <span @click.prevent="handleViewDetails(row)" class="text-primary-600 hover:underline">
              查看详情
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 实验准备建议 -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="text-md font-medium text-gray-800 mb-3">实验准备建议</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(tip, index) in preparationTips" :key="index" class="bg-white p-3 rounded-lg md:col-span-2">
            <h5 class="text-sm font-medium text-gray-700 mb-2">
              <font-awesome-icon icon="lightbulb" class="text-yellow-500 mr-1" />
              {{ tip.title }}
            </h5>
            <p class="text-xs text-gray-600">{{ tip.description }}</p>
            <p class="mt-1">
              <a href="#" class="text-xs text-primary-600 hover:underline">{{ tip.linkText }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
const route = useRoute();
// console.log(route.params.projectId)

// 数据源
const experimentData = ref([
  {
    id: 'exp1', // Added unique ID
    name: '晶体管特性测量',
    subName: '实验1',
    completionTime: '2025-03-15',
    score: '94',
    keySkills: [
      { label: '静态特性', bgClass: 'bg-blue-100 text-blue-800' },
      { label: '参数提取', bgClass: 'bg-purple-100 text-purple-800' },
    ],
    status: '已完成',
    statusClass: 'bg-green-100 text-green-800',
    icon: 'microchip',
    iconClass: 'text-blue-600',
    iconBgClass: 'bg-blue-100',
  },
  {
    id: 'exp2', // Added unique ID
    name: '共射放大器设计',
    subName: '实验2',
    completionTime: '2025-04-12',
    score: '90',
    keySkills: [
      { label: '放大器设计', bgClass: 'bg-blue-100 text-blue-800' },
      { label: '频率响应', bgClass: 'bg-red-100 text-red-800' },
    ],
    status: '已完成',
    statusClass: 'bg-green-100 text-green-800',
    icon: 'project-diagram',
    iconClass: 'text-purple-600',
    iconBgClass: 'bg-purple-100',
  },
  {
    id: 'exp3', // Added unique ID
    name: '运算放大器应用',
    subName: '实验3',
    completionTime: '2025-04-26',
    score: '88',
    keySkills: [
      { label: '运算放大器', bgClass: 'bg-blue-100 text-blue-800' },
      { label: '电路设计', bgClass: 'bg-yellow-100 text-yellow-800' },
    ],
    status: '已完成',
    statusClass: 'bg-green-100 text-green-800',
    icon: 'sliders-h',
    iconClass: 'text-indigo-600',
    iconBgClass: 'bg-indigo-100',
  },
  {
    id: 'exp4', // Added unique ID
    name: 'BJT特征频率测量',
    subName: '实验4',
    completionTime: '2025-05-08',
    score: '92',
    keySkills: [
      { label: '频率特性', bgClass: 'bg-blue-100 text-blue-800' },
      { label: '测量方法', bgClass: 'bg-purple-100 text-purple-800' },
    ],
    status: '已完成',
    statusClass: 'bg-green-100 text-green-800',
    icon: 'wave-square',
    iconClass: 'text-green-600',
    iconBgClass: 'bg-green-100',
  },
  {
    id: 'exp5', // Added unique ID
    name: '有源滤波器设计',
    subName: '实验5',
    completionTime: '进行中',
    score: '--',
    keySkills: [
      { label: '滤波电路', bgClass: 'bg-yellow-100 text-yellow-800' },
      { label: '频率响应', bgClass: 'bg-green-100 text-green-800' },
    ],
    status: '进行中',
    statusClass: 'bg-yellow-100 text-yellow-800',
    icon: 'filter',
    iconClass: 'text-yellow-600',
    iconBgClass: 'bg-yellow-100',
  },
  {
    id: 'exp6', // Added unique ID
    name: '电源电路设计',
    subName: '实验6',
    completionTime: '未开始',
    score: '--',
    keySkills: [
      { label: '稳压电路', bgClass: 'bg-red-100 text-red-800' },
      { label: '纹波分析', bgClass: 'bg-purple-100 text-purple-800' },
    ],
    status: '未开始',
    statusClass: 'bg-gray-100 text-gray-800',
    icon: 'plug',
    iconClass: 'text-red-600',
    iconBgClass: 'bg-red-100',
  },
]);

// 实验准备建议
const preparationTips = ref([
  {
    title: '有源滤波器设计实验准备',
    description: '建议提前预习《实验名称》实验。可以通过以下资源预习：',
    linkText: '《有源滤波器设计原理》（点击跳转到对应实验的预习页面）',
  },
]);

// 查看详情逻辑
const handleViewDetails = (row) => {
  // console.log('查看详情:', row);
  router.push({
    name: 'courseTaskAnalysis',
    params: {
      projectId: route.params.projectId,
      taskId: row.id
    },
  })
};
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