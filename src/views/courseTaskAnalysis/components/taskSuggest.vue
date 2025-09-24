<template>
  <div v-show="experimentStudentTab === 'improvement'" class="mt-6 space-y-6 fade-in">
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
                <strong>{{ item.title }}</strong> - {{ item.description }}
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
                <strong>{{ item.title }}</strong> - {{ item.description }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Learning Suggestions -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 class="font-medium text-blue-800">学习建议</h4>
          <div class="mt-2 space-y-4">
            <div v-for="(item, index) in learningSuggestions" :key="'suggestion-' + index">
              <h5 class="text-sm font-medium text-gray-900">{{ item.title }}</h5>
              <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Resources -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">相关资源推荐</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(resource, index) in resources" :key="'resource-' + index" class="bg-gray-50 p-3 rounded-lg hover-card">
          <div class="flex items-center space-x-3">
            <div :class="resource.iconContainerClass">
              <font-awesome-icon :icon="resource.icon" :class="resource.iconClass" />
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900">{{ resource.title }}</h4>
              <a :href="resource.link" class="text-blue-600 hover:underline text-sm">{{ resource.linkText }}</a>
            </div>
          </div>
          <p class="mt-2 text-xs text-gray-600">{{ resource.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Define reactive properties
const experimentStudentTab = ref('improvement');

// Data for "Areas for Improvement"
const improvementAreas = ref([
  {
    title: '特征频率计算理解不足',
    description:
      '对Cμ增大时fT变化规律理解有误，需要深入理解BJT的高频等效模型及参数关系。',
  },
  {
    title: '电路连接不完整',
    description:
      '在测量特征频率时，没有正确连接示波器到Vce_out，需要养成检查电路连接的习惯。',
  },
]);

// Data for "Strengths"
const strengths = ref([
  {
    title: '频率特性基础知识',
    description: '对BJT基本频率特性理解充分，能够解释高频下β随频率变化的规律。',
  },
  {
    title: '测量原理',
    description: '理解BJT特征频率的物理意义和测量方法，能够正确计算fβ和fT。',
  },
  {
    title: '静态工作点设置',
    description: '掌握了静态工作点的概念和重要性，能够分析环境变化对Q点的影响。',
  },
]);

// Data for "Learning Suggestions"
const learningSuggestions = ref([
  {
    title: '1. 加强BJT高频模型学习',
    description:
      '重点复习BJT高频小信号等效模型，理解结电容对高频特性的影响。推荐阅读教材第5章第3节，并做相关习题。',
  },
  {
    title: '2. 改进实验操作流程',
    description:
      '建立实验前的电路连接检查清单，养成实验开始前进行全面检查的习惯，避免因连接不完整导致的问题。',
  },
  {
    title: '3. 深入理解与应用',
    description:
      '尝试通过改变BJT的工作状态（如静态电流）观察fT的变化，加深对理论与实践关系的理解。',
  },
]);

// Data for "Recommended Resources"
const resources = ref([
  {
    icon: ['fab', 'youtube'],
    iconClass: 'text-red-600',
    iconContainerClass: 'bg-red-100 p-2 rounded-lg',
    title: '视频讲解',
    link: '#',
    linkText: '《BJT特征频率测量方法详解》',
    description: '详细讲解BJT高频参数测量原理和方法，包含实操演示和常见问题分析。',
  },
  {
    icon: ['fas', 'file-pdf'],
    iconClass: 'text-blue-600',
    iconContainerClass: 'bg-blue-100 p-2 rounded-lg',
    title: '补充资料',
    link: '#',
    linkText: '《晶体管高频特性分析与测量》',
    description: '包含详细的理论推导、测量电路分析和不同器件参数对比。',
  },
  {
    icon: ['fas', 'tasks'],
    iconClass: 'text-green-600',
    iconContainerClass: 'bg-green-100 p-2 rounded-lg',
    title: '强化练习',
    link: '#',
    linkText: '《BJT特性计算题集》',
    description: '针对BJT特征频率计算的专项练习，包含多种难度题目和详解。',
  },
  {
    icon: ['fas', 'laptop-code'],
    iconClass: 'text-purple-600',
    iconContainerClass: 'bg-purple-100 p-2 rounded-lg',
    title: '互动仿真',
    link: '#',
    linkText: '《BJT频率特性虚拟实验室》',
    description: '通过仿真工具可视化BJT的频率响应，探索不同参数变化的影响。',
  },
]);
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