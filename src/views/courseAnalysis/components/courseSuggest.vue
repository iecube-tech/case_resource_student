<template>
  <div class="mt-6 space-y-6 fade-in">
    <!-- 课程学习反馈 -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ feedbackData.title }}</h3>

      <!-- 总体评价 -->
      <div :class="feedbackData.overallEvaluation.bgClass" class="p-4 rounded-lg mb-6">
        <h4 class="text-md font-medium" :class="feedbackData.overallEvaluation.textColor">
          {{ feedbackData.overallEvaluation.subtitle }}
        </h4>
        <p class="text-sm" :class="feedbackData.overallEvaluation.textColor">
          {{ feedbackData.overallEvaluation.content }}
        </p>
      </div>

      <!-- 学习策略建议 和 推荐学习资源 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          v-for="(section, index) in feedbackData.sections"
          :key="index"
          :class="section.bgClass"
          class="p-4 rounded-lg"
        >
          <h4 class="text-md font-medium" :class="section.textColor">
            <font-awesome-icon :icon="section.icon" class="mr-2" />
            {{ section.title }}
          </h4>
          <div class="space-y-3">
            <div
              v-for="(item, idx) in section.items"
              :key="idx"
              class="bg-white p-3 rounded-lg"
            >
              <h5 class="text-sm font-medium text-gray-700 mb-1">{{ item.title }}</h5>
              <p v-if="item.content" class="text-xs text-gray-600">{{ item.content }}</p>
              <ul v-if="item.links" class="text-xs text-gray-600 space-y-2">
                <li
                  v-for="(link, linkIdx) in item.links"
                  :key="linkIdx"
                  class="flex items-start"
                >
                  <font-awesome-icon :icon="link.icon" :class="link.iconColor" class="mt-0.5 mr-1" />
                  <span>
                    <a :href="link.href" class="text-primary-600 hover:underline">{{ link.text }}</a>
                    - {{ link.description }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 能力提升计划 -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ improvementPlan.title }}</h3>

      <div
        v-for="(plan, index) in improvementPlan.plans"
        :key="index"
        :class="plan.bgClass"
        class="p-4 rounded-lg mb-4"
      >
        <h4 class="text-md font-medium" :class="plan.textColor">{{ plan.title }}</h4>
        <div class="space-y-2">
          <div
            v-for="(goal, goalIdx) in plan.goals"
            :key="goalIdx"
            class="flex items-start"
          >
            <div
              :class="['flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center', goal.borderColor]"
            >
              <span class="text-xs font-medium" :class="goal.textColor">{{ goalIdx + 1 }}</span>
            </div>
            <div class="ml-3">
              <p class="text-sm" :class="plan.textColor">
                <span class="font-medium">{{ goal.title }}</span> - {{ goal.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// JSON 数据对象
const feedbackData = ref({
  title: '课程学习反馈',
  overallEvaluation: {
    subtitle: '总体学习表现',
    content:
      '在本学期的模拟电子电路课程中，您表现优秀，综合评分为91.5分（A），位于班级前15%。您在电路分析和参数测量方面展现出了突出的能力，能够熟练掌握实验操作技能，并具有良好的数据处理能力。通过已完成的4个实验，您掌握了晶体管基本特性、放大电路设计和频率特性测量等重要知识点。但在理论应用能力方面还有提升空间，尤其是对高频模型的深入理解和复杂理论的实际应用。',
    bgClass: 'bg-blue-50',
    textColor: 'text-blue-800',
  },
  sections: [
    {
      title: '学习策略建议',
      icon: 'lightbulb',
      bgClass: 'bg-green-50',
      textColor: 'text-green-800',
      items: [
        {
          title: '加深理论理解',
          content:
            '建议深入学习高频模型和非线性特性相关理论，可以通过绘制思维导图的方式梳理知识点间的联系。重点关注BJT高频等效模型中结电容的影响机制和频率特性的理论基础。',
        },
        {
          title: '理论实践结合',
          content:
            '在实验报告中增加理论分析部分，针对实验现象进行更深入的理论解释，建立理论模型与实验数据之间的对应关系，强化理论与实践的结合。',
        },
        {
          title: '实验前准备强化',
          content:
            '在即将进行的有源滤波器和电源电路实验前，建议绘制详细的电路原理图和连线图，预先思考可能遇到的问题和解决方案，减少实验中的错误。',
        },
      ],
    },
    {
      title: '推荐学习资源',
      icon: 'book',
      bgClass: 'bg-purple-50',
      textColor: 'text-purple-800',
      items: [
        {
          title: '理论深化资料',
          links: [
            {
              icon: 'file-pdf',
              iconColor: 'text-red-500',
              href: '#',
              text: '《半导体器件物理与模型》',
              description: '深入讲解BJT高频模型和工作机理',
            },
            {
              icon: 'video',
              iconColor: 'text-blue-500',
              href: '#',
              text: '《电子电路频率特性视频教程》',
              description: '生动讲解频率响应测量原理',
            },
          ],
        },
        {
          title: '实验技能提升',
          links: [
            {
              icon: 'desktop',
              iconColor: 'text-green-500',
              href: '#',
              text: '《滤波器设计虚拟仿真实验》',
              description: '交互式学习滤波器原理和设计',
            },
            {
              icon: 'tools',
              iconColor: 'text-yellow-500',
              href: '#',
              text: '《电源电路设计实用技巧》',
              description: '稳压电源设计要点和测试方法',
            },
          ],
        },
      ],
    },
  ],
});

const improvementPlan = ref({
  title: '能力提升计划',
  plans: [
    {
      title: '短期提升目标（两周内）',
      bgClass: 'bg-indigo-50',
      textColor: 'text-indigo-800',
      goals: [
        {
          title: '掌握有源滤波器设计原理',
          description: '通过预习教材第7章和推荐资料，理解各类有源滤波器的工作原理和设计方法',
          borderColor: 'border-indigo-500',
          textColor: 'text-indigo-500',
        },
        {
          title: '练习频率响应测量',
          description: '通过在线仿真工具，熟悉频率响应测量方法和数据处理技术',
          borderColor: 'border-indigo-500',
          textColor: 'text-indigo-500',
        },
      ],
    },
    {
      title: '中期提升目标（一个月内）',
      bgClass: 'bg-blue-50',
      textColor: 'text-blue-800',
      goals: [
        {
          title: '完成所有实验',
          description: '高质量完成有源滤波器和电源电路设计实验，并撰写详细实验报告',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-500',
        },
        {
          title: '加深高频模型理解',
          description: '重点学习BJT高频模型和非线性特性，构建高频特性的完整知识体系',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-500',
        },
      ],
    },
    {
      title: '长期发展方向',
      bgClass: 'bg-purple-50',
      textColor: 'text-purple-800',
      goals: [
        {
          title: '理论与实践深度结合',
          description: '培养将理论知识应用于解决实际电子电路问题的能力，提高理论应用水平',
          borderColor: 'border-purple-500',
          textColor: 'text-purple-500',
        },
        {
          title: '拓展设计能力',
          description: '尝试在基础实验上进行创新设计，如优化电路参数、增加新功能或改进电路性能',
          borderColor: 'border-purple-500',
          textColor: 'text-purple-500',
        },
        {
          title: '参与电子设计竞赛',
          description: '考虑在下学期参加学校电子设计竞赛，将课程学习与实际应用项目结合',
          borderColor: 'border-purple-500',
          textColor: 'text-purple-500',
        },
      ],
    },
  ],
});
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