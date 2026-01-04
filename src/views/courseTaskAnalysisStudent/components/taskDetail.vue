<template>
  <div class="mt-6 space-y-6">
    <!-- 能力雷达图和问题回答统计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 能力雷达图 -->
      <div class="bg-white rounded-lg shadow p-4 hover-card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">能力标签评分</h3>
        <div class="chart-container">
          <v-chart v-if="chart1Show" ref="chart1Ref" :option="option1" class="h-[300px] w-full" />
        </div>
      </div>

      <!-- 问题回答统计 -->
      <div class="bg-white rounded-lg shadow p-4 hover-card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">问题回答统计</h3>
        <div class="chart-container">
          <v-chart ref="chart2Ref" :option="option2" class="h-[300px] w-full" />
        </div>
      </div>
    </div>

    <!-- 能力标签详情 -->
    <div class="overflow-x-auto">
      <h3 class="text-lg font-medium text-gray-900 mb-4">能力标签详情</h3>
      <el-table :data="tagList" class="w-full">
        <el-table-column prop="tagName" label="能力标签" align="left" />
        <el-table-column prop="size" label="问题数量" align="center" />
        <el-table-column prop="rage" label="标签评分" align="center">
        </el-table-column>
        <el-table-column prop="rage" label="掌握程度" align="center">
          <template #default="{ row }">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="getScoreClass(row.rage)">
              {{ getScoreLabel(row.rage) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 回答问题记录 -->
    <div class="mt-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">实验问题回答记录</h3>
        <el-select v-model="questionFilter" placeholder="筛选问题" style="width: 200px;">
          <el-option value="all" label="全部问题" />
          <el-option value="0" label="实验预习" />
          <el-option value="1" label="实验操作" />
          <el-option value="2" label="课后考核" />
        </el-select>
      </div>

      <div class="space-y-4">
        <div v-for="(section, index) in stageList" :key="index"
          v-show="questionFilter == 'all' || questionFilter == section.stage" class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-md font-medium text-gray-800 mb-2">
            {{ section.title }}
          </h4>
          <div class="space-y-3">
            <div v-for="(question, qIndex) in section.quesList" :key="qIndex" class="bg-white p-3 rounded border-l-4"
              :class="isRight(question) ? 'border-green-500' : isHalfRight(question) ? 'border-orange-500' : 'border-red-500'">
              <p class="text-sm text-gray-700 mb-2">
                <span class="font-medium">问题{{ qIndex + 1 }}:</span>
                <textpreview :content="question.payload.question.question"></textpreview>
              </p>
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">您的回答:</span>
              <ul v-for="(item, i) in getStudentAnswer(question)" :key="i">
                <li>
                  <textpreview :content="item"></textpreview>
                </li>
              </ul>
              </p>
              <p class="text-sm"
                :class="isRight(question) ? 'text-green-600' : isHalfRight(question) ? 'text-orange-600' : 'text-red-600'">
                <font-awesome-icon :icon="isRight(question) ? 'check-circle' : 'times-circle'" class="mr-1" />
                {{ isRight(question) ? '正确' : isHalfRight(question) ? '部分正确' : '错误' }}
                <span v-if="!isRight(question)">- 正确答案: {{ getRightAnswer(question) }}</span>
              </p>
              <p v-if="question.explanation" class="text-sm text-gray-600">
                <span class="font-medium">解析:</span>
                <textpreview :content="question.payload.question.analysis"></textpreview>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import textpreview from '@/components/textPreview.vue'
import { StudentTaskAnalysisTypeEnum, getStudentTaskAnalysis } from '@/apis/emdV4/analysis_student'
const route = useRoute();
const projectId = route.params.projectId;
const taskId = route.params.taskId;
const psId = route.params.psId;
// console.log(route.params)

const props = defineProps({
  name: String,
});

const chart1Show = ref(false)
const chart1Ref = ref(null);
// 雷达图配置
const option1 = ref({
  title: { show: false },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      // 处理单系列/多系列情况
      const data = Array.isArray(params) ? params[0] : params;
      let result = '<div style="margin-bottom: 4px; font-weight: 700;">能力评分</div>';

      for (let i = 0; i < data.value.length; i++) {
        // 尝试获取维度名称，失败则使用默认名称
        let dimensionName = `维度${i + 1}`;
        try {
          dimensionName = option1.value.radar.indicator[i].name;
        } catch (e) {
          // 忽略错误，使用默认名称
        }

        // 在值后面添加%符号
        result += `<div style="width: 100%;display: flex; justify-content: space-between;">
                    <div style="width:calc(100% - 60px); overflow:hidden; text-overflow: ellipsis; white-space: nowrap;">${dimensionName}:</div>
                    <div style="width: 60px;text-align: right;"> ${data.value[i]}%</div>
                  </div>`;
      }

      return result;
    },
  },
  grid: {
    top: "10%",
    bottom: 0,
    left: 0,
    right: 0,
  },
  legend: {
    top: 0,
    left: 0,
  },
  radar: {
    indicator: [
      // { name: '频率特性', max: 100 },
      // { name: '测量原理', max: 100 },
      // { name: '测量电路', max: 100 },
      // { name: '电路连接及仪器使用', max: 100 },
      // { name: '静态工作点', max: 100 },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [], //[100, 100, 50, 83, 100],
          name: '能力评分',
          itemStyle: {
            color: '#0EA5E9',
          },
          areaStyle: {
            color: '#CFEDFB',
            opacity: 0.2,
          },
        },
      ],
    },
  ],
});

const chart2Ref = ref(null);
// 堆叠图配置
const option2 = ref({
  title: { show: false },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow', // 鼠标悬停时显示阴影效果
    },
  },
  legend: {
    data: ['正确', '错误'], // 图例显示
  },
  xAxis: {
    type: 'category',
    data: ['实验预习', '实验操作', '课后考核'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '正确',
      type: 'bar',
      barWidth: '50%',
      stack: 'total', // 使用堆叠模式
      data: [], // [3, 3, 4], // 正确答案数量
      itemStyle: {
        color: '#67E394', // 绿色
        opacity: 0.8,
      },

    },
    {
      name: '错误',
      type: 'bar',
      barWidth: '50%',
      stack: 'total', // 使用堆叠模式
      data: [], // [0, 1, 1], // 错误答案数量
      itemStyle: {
        color: '#FF7373', // 红色
        opacity: 0.8,
      },

    },
  ],
});

// 能力标签详情数据
/* const skillDetails = [
  {
    label: '频率特性',
    questionCount: 3,
    score: '100%',
    masteryLevel: '精通',
    masteryClass: 'bg-green-100 text-green-800',
  },
  {
    label: '测量原理',
    questionCount: 2,
    score: '100%',
    masteryLevel: '精通',
    masteryClass: 'bg-green-100 text-green-800',
  },
  {
    label: '测量电路',
    questionCount: 2,
    score: '50%',
    masteryLevel: '良好',
    masteryClass: 'bg-yellow-100 text-yellow-800',
  },
  {
    label: '电路连接及仪器使用',
    questionCount: 6,
    score: '83%',
    masteryLevel: '熟练',
    masteryClass: 'bg-blue-100 text-blue-800',
  },
]; */

// 筛选条件
const questionFilter = ref('all');

// 问题记录数据
/* const questionSections = [
  {
    type: 'prep',
    title: '实验预习 (3/3)',
    questions: [
      {
        label: '问题1',
        content: '以下哪项是影响BJT特征频率$f_T$的关键因素？',
        answer: 'B. 基区宽度和载流子渡越时间',
        correct: true,
      },
      {
        label: '问题2',
        content: 'BJT特征频率$f_T$的物理意义是( )？',
        answer: 'B. 电流放大系数$\\beta$下降到1时的频率',
        correct: true,
      },
      {
        label: '问题3',
        content: '在测量BJT特征频率$f_T$时，输入信号的幅度应如何设置( )？',
        answer: 'A. 尽量小，避免晶体管进入非线性区',
        correct: true,
      },
    ],
  },
  {
    type: 'operate',
    title: '实验操作 (3/4)',
    questions: [
      {
        label: '电路连接1',
        content: '测量静态工作点时的硬件电路连线状态',
        answer: '(SMU1，Vb_in)连接，对应:(1，7); (SMU2，Vc_in)连接，对应:(2，12);',
        correct: true,
      },
      {
        label: '电路连接2',
        content: '测量特征频率时的硬件电路连线状态',
        answer:
          '(SMU1，Vb_in)连接，对应:(1，7); (SMU2，Vc_in)连接，对应:(2，12); (AWG,Fb_in)连接，对应(5，14)',
        correct: false,
        correctAnswer: '缺少(0SC1,Vce_out)连接',
      },
      {
        label: '静态工作点',
        content: '$I_B$测量值是否在参考范围内',
        answer: '0.05 mA',
        correct: true,
      },
      {
        label: '静态工作点',
        content: '$I_C$测量值是否在参考范围内',
        answer: '5.2 mA',
        correct: true,
      },
    ],
  },
  {
    type: 'review',
    title: '课后考核 (4/5)',
    questions: [
      {
        label: '问题1',
        content: '实验中SMU可提供的电压范围是( )？',
        answer: 'B. $\\pm10V$',
        correct: true,
      },
      {
        label: '问题2',
        content: '静态工作点（Q点）的主要作用是（ ）？',
        answer: 'B. 避免信号在放大过程中产生截止或饱和失真',
        correct: true,
      },
      {
        label: '问题3',
        content: '若BJT的集电结电容Cμ增大，$f_{T}$将如何变化( )？',
        answer: 'A. 不变',
        correct: false,
        correctAnswer: 'B. 降低',
        explanation: '$f_{T}$与总电容（Cπ+Cμ）成反比，Cμ增大会导致分母增大，$f_{T}$下降。',
      },
      {
        label: '问题4',
        content: 'BJT的电流放大系数在高频段$\\beta$随频率升高如何变化( )？',
        answer: 'B. 单调下降',
        correct: true,
      },
      {
        label: '问题5',
        content:
          '从载流子运动的角度，分析基区渡越时间$\\tau_{b}$&ZeroWidthSpace;和集电结耗尽区渡越时间$\\tau_{c}$&ZeroWidthSpace;如何共同限制$f_{T}$。',
        answer:
          '基区渡越时间为载流子在基区的扩散时间，集电结渡越时间为载流子穿过集电结耗尽区的漂移时间，两者与$f_{T}$成反比关系。',
        correct: true,
      },
    ],
  },
]; */

watchEffect(() => {
  if (props.name == 'taskDetail') {
    setTimeout(() => {
      chart1Ref.value && chart1Ref.value.resize();
      chart2Ref.value && chart2Ref.value.resize();
    }, 200)
  }
})

onMounted(() => {
  setTimeout(_ => {
    updateChart()
  }, 200)
})

const tagList = ref([])
const stageList = ref([])

function updateChart() {
  getStudentTaskAnalysis(projectId, taskId, psId, StudentTaskAnalysisTypeEnum.PST_DETAIL)
    .then(res => {
      if (res.state == 200) {
        // console.log(res.data)
        setTagList(res.data.tag)
        setStageList(res.data.stage)
      }
    })
}

function setTagList(list) {
  let indicator = list.map(_ => {
    return {
      name: _.tagName,
      max: 100
    }
  })
  let data = list.map(_ => _.rage)
  option1.value.radar.indicator = indicator
  option1.value.series[0].data[0].value = data
  // chart1Ref.value && chart1Ref.value.setOption(option1.value)
  chart1Show.value = true
  tagList.value = list
}

function setStageList(list) {
  let rightData = list.map(_ => _.quesCorrectSize)
  let errorData = list.map(_ => _.quesErrorSize)
  option2.value.series[0].data = rightData
  option2.value.series[1].data = errorData

  list.forEach((_, index) => {
    _.title = index == 0 ? '课前预习' : index == 1 ? '实验操作' : '课后考核';
    let quesList = _.quesList
    quesList.forEach(ques => {
      ques.payload = JSON.parse(ques.compPayload)
    })
  })

  stageList.value = list
  // console.log(list)
}

function getScoreClass(rage) {
  if (rage > 90) {
    return 'bg-green-100 text-green-800'
  } else if (rage > 80) {
    return 'bg-blue-100 text-blue-800'
  } else if (rage > 70) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (rage > 60) {
    return 'bg-orange-100 text-orange-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}

function getScoreLabel(rage) {
  if (rage > 90) {
    return '优秀'
  } else if (rage > 80) {
    return '良好'
  } else if (rage > 70) {
    return '一般'
  } else if (rage > 60) {
    return '及格'
  } else {
    return '不及格'
  }
}

function getStudentAnswer(question) {
  let option = question.payload.question.options
  let answer = []
  let compType = question.compType
  if (compType == 'CHOICE') {
    let stuA = question.payload.stuAnswer.answer
    let filtes = option.filter(_ => stuA == _.label)
    answer.push(`${filtes[0].label}. ${filtes[0].value}`)
  } else if (compType == 'MULTIPLECHOICE') {
    let stuA = question.payload.stuAnswer.answerOption
    let filtes = option.filter(_ => stuA.includes(_.label))
    filtes.forEach(_ => {
      answer.push(`${_.label}. ${_.value}`)
    })
  } else {
    let stuA = question.payload.stuAnswer.answer
    answer.push(stuA)
  }
  return answer
}

function getRightAnswer(question) {
  let compType = question.compType
  if (compType == 'MULTIPLECHOICE') {
    return question.payload.question.answerOption
  } else {
    return question.payload.question.answer
  }
}

function isRight(comp) {
  return comp.compScore == comp.compTotalScore
}

function isHalfRight(comp) {
  return comp.compScore > 0
}


</script>

<style scoped>
.chart-container {
  @apply h-[300px] w-full;
}

.hover-card {
  @apply transition-shadow duration-300 ease-in-out hover:shadow-lg;
}
</style>