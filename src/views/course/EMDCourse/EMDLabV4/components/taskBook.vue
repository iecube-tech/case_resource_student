<!-- emb V4 Document show-->
<template>

  <!-- 步骤条 -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="flex border-b border-gray-200">
        <button v-for="(item_level2, k) in roots" :key="k"
          class="step-btn flex-1 py-4 px-6 text-center font-medium tab-transition border-b-2 border-transparent text-gray-500"
          :class="{ 'is-active': k == currentStep }" @click="setStep(k)">
          <font-awesome-icon v-if="item_level2.icon" :icon="item_level2.icon" class="mr-2" />
          <span>{{ item_level2.name }}</span>
        </button>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="font-medium text-gray-700">实验进度</span>
        <span id="progressText" class="text-gray-500">
          {{ roots[currentStep].name }}完成
        </span>
      </div>
      <el-progress color="#2563eb" :percentage="progressPercentage" :show-text="false" />
    </div>


    <!-- 核心内容  item_level2.stage 和  leve1_1_k 的值都相同用于表示 实验前 实验中 实验后-->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div v-for="(item_level2, level_1_k) in roots" :key="`root_${level_1_k}`">

        <div v-show="item_level2.stage == currentStep">
          <div v-if="item_level2.stepByStep" class="section-card-step-by-step">
            <div v-for="(item_level3, level_3_k) in (item_level2.children || [])" :key="`level_3_${level_3_k}`">
              <sectionContent v-show="item_level3.status == 1 || level_3_k <= item_level2.currentChild"
                :block="item_level3" :parentBlock="item_level2" :level3Index="level_3_k"
                @nextStep="handleNextCurrentChild(item_level2)" class="section-card">
              </sectionContent>
            </div>
          </div>

          <div v-else>
            <div v-for="(item_level3, level_3_k) in (item_level2.children || [])" :key="`level_3_${level_3_k}`"
              class="section-card">
              <sectionContent :block="item_level3" :parentBlock="item_level2" :level3Index="level_3_k"
                @nextStep="handleNextCurrentChild(item_level2)">
              </sectionContent>
            </div>
          </div>

          <div class="task-lab-footer">

            <div v-if="item_level2.needPassScore" class="my-8 flex justify-between items-center">
              <div>
                <span class="text-sm text-gray-500">得分: </span>
                <span id="previewScore" class="text-lg font-semibold text-blue-600">{{ blockScorePrecent }}/100</span>
              </div>
              <div>
                <div v-show="currentStepAssistParams.check" class="flex gap-3">
                  <button class="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    @click="retryPreviewTest(item_level2)">
                    <font-awesome-icon icon="fas fa-redo" class="mr-2"></font-awesome-icon>重新测试
                  </button>
                </div>
                <div v-show="!currentStepAssistParams.check">
                  <button :disabled="currentStepBtnDisabled || item_level2.status == 1"
                    @click="handleStepSubmit(item_level2)" class="bg-blue-600 text-white px-6 py-2 rounded-lg
                    hover:bg-blue-700 transition-colors disabled:bg-gray-300">
                    <font-awesome-icon icon="fas fa-check" class="mr-2"></font-awesome-icon>
                    <span>{{ level_1_k == roots.length - 1 ? '提交完成' : '下一步' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else>
              <div v-show="showStepBtn" class="mt-8 mb-4 text-center">
                <button :disabled="item_level2.status == 1"
                  class="text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  :class="item_level2.status == 1 ? 'disabled:bg-gray-300 cursor-not-allowed' : 'bg-green-600'"
                  @click="handleStepSubmit(item_level2)">
                  <font-awesome-icon icon="fas fa-check" class="mr-2"></font-awesome-icon>
                  <span>{{ level_1_k == roots.length - 1 ? '提交完成' : '下一步' }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import sectionContent from './section/sectionContent.vue'
import { useEmdV4Store } from '@/stores/emdV4TaskStore'
import { updateCompStatus, updateCompScore, updateCompPayload } from './block/update'
import { updateBlockStatust, updateBlockScore } from './api/blockApi'

const emdV4Store = useEmdV4Store()

const props = defineProps({
  roots: {
    type: Array,
    default: () => [],
  },
})


// 当前步骤索引
const currentStep = ref(0);
// 初始化 当前实验步骤
currentStep.value = emdV4Store.currentStage;

// 进度条变量
const progressPercentage = computed(() => {
  let total = props.roots.length;
  let step = currentStep.value + 1;
  if (total == 0) {
    return 0;
  } else {
    return step / total * 100;
  }
})


// 下一步按钮（目前支持 三个步骤）
const setStep = (index) => {
  if (index == 0) {
    currentStep.value = index;
  } else if (props.roots[index - 1].status == 1) {
    currentStep.value = index;
  } else {
    ElMessage.warning(`请完成当前${props.roots[currentStep.value].name}步骤`)
  }
};

const showStepBtn = computed(() => {
  let showBtn = false
  let block = props.roots[currentStep.value]
  if (block.stepByStep) {
    let children = block.children
    let endChildBlock = children[children.length - 1]
    if (endChildBlock.status == 1) {
      showBtn = true
    } else {
      showBtn = false
    }
  } else {
    showBtn = true
  }
  return showBtn
})

// 前端处理下一步 currentChild, 后端同步处理  
const handleNextCurrentChild = (parentBlock) => {
  let maxIndex = parentBlock.children.length - 1
  parentBlock.currentChild = parentBlock.currentChild + 1
  if (parentBlock.currentChild >= maxIndex) {
    parentBlock.currentChild = maxIndex
  }
}

const currentStepAssistParams = ref({
  check: false,
  pass: false,
  score: 0
})

const currentStepBtnDisabled = computed(() => {
  let f = true
  let block = props.roots[currentStep.value]
  let lastChildBlock = block.children[block.children.length - 1]
  if (!block.children) {
    return false
  }
  if (lastChildBlock.status == 1) {
    f = false
  } else {
    f = true
  }
  return f
})

const resetStepAssisParams = () => {
  currentStepAssistParams.value.check = false
  currentStepAssistParams.value.pass = false
  currentStepAssistParams.value.score = 0
}

const resetStuAnswer = (comp) => {
  comp.payload.stuAnswer.answer = ''
  comp.payload.stuAnswer.answerOption = []

  updateCompStatus(comp.id, 0, () => {
    comp.status = 0
  })
  let payloadStr = JSON.stringify(comp.payload)
  updateCompPayload(comp.id, payloadStr)
  updateCompScore(comp.id, 0, () => {
    comp.score = 0
  })
}

// 第一步提交未通过
const retryPreviewTest = (block) => {
  resetStepAssisParams()

  if (block.hasChildren) {
    let children = block.children
    let scoreComps = []
    for (let i = 0; i < children.length; i++) {
      let childBlock = children[i]
      if (['selectGroup'].includes(childBlock.type)) {
        if (childBlock.hasChildren == false) {
          for (let j = 0; j < childBlock.components.length; j++) {
            scoreComps.push(childBlock.components[j])
          }
        }
      }
    }

    for (let i = 0; i < scoreComps.length; i++) {
      let comp = scoreComps[i]
      resetStuAnswer(comp)
    }
  }
}

// 提交答案 answer
const handleStepSubmit = (block) => {
  if (block.needPassScore) {
    let children = block.children
    let scoreComps = []
    for (let i = 0; i < children.length; i++) {
      let childBlock = children[i]

      if (['selectGroup'].includes(childBlock.type)) {
        if (childBlock.hasChildren == false) {
          for (let j = 0; j < childBlock.components.length; j++) {
            scoreComps.push(childBlock.components[j])
          }
        }
      }
    }

    let studentScore = 0;
    let sumScore = 0;
    for (let i = 0; i < scoreComps.length; i++) {
      studentScore += scoreComps[i].score
      sumScore += scoreComps[i].totalScore
    }

    let f = parseFloat(studentScore / sumScore).toFixed(2) * 100
    if (f < block.passScore) {
      currentStepAssistParams.value.check = true
      currentStepAssistParams.value.pass = false
      currentStepAssistParams.value.score = f
    } else {
      // 提交通过
      resetStepAssisParams()

      updateBlockStatust(block.id, 1, () => {
        block.status = 1
        emdV4Store.setTaskBookChildren(props.roots)
      })

      updateBlockScore(block.id, studentScore, () => {
        block.score = studentScore
      })

      for (let i = 0; i < scoreComps.length; i++) {
        let comp = scoreComps[i]
        comp.payload.result.showCheck = true
        let payloadStr = JSON.stringify(comp.payload)
        updateCompPayload(comp.id, payloadStr)
      }
    }
  } else {
    updateBlockStatust(block.id, 1, () => {
      block.status = 1
      emdV4Store.setTaskBookChildren(props.roots)
    })
  }

}

const blockScorePrecent = computed(() => {
  let block = props.roots[currentStep.value]

  let children = block.children
  let scoreComps = []
  for (let i = 0; i < children.length; i++) {
    let childBlock = children[i]
    if (['selectGroup'].includes(childBlock.type)) {
      if (childBlock.hasChildren == false) {
        for (let j = 0; j < childBlock.components.length; j++) {
          scoreComps.push(childBlock.components[j])
        }
      }
    }
  }

  let studentScore = 0;
  let sumScore = 0;
  for (let i = 0; i < scoreComps.length; i++) {
    studentScore += scoreComps[i].score
    sumScore += scoreComps[i].totalScore
  }

  let f = Math.floor(parseFloat(studentScore / sumScore).toFixed(2) * 100)
  return f
})


</script>

<style scoped>
.section-card-step-by-step {
  background: white;
  overflow: hidden;
  margin-bottom: 24px;
}

.section-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.step-btn.is-active {
  @apply border-blue-600 text-blue-600;
}
</style>