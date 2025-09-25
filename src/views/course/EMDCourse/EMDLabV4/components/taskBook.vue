<!-- emb V4 Document show-->
<template>
  <div class="taskbook-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 步骤条 -->
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
                  <span class="cusor-not-allowed bg-red-300 text-white px-6 py-2 rounded-lg transition-colors">
                    未通过
                  </span>
                </div>
                <div v-show="!currentStepAssistParams.check">
                  <button :disabled="currentStepBtnDisabled || item_level2.status == 1"
                    @click="handleStepSubmit(item_level2)" class="bg-blue-600 text-white px-6 py-2 rounded-lg
                    hover:bg-blue-700 transition-colors disabled:bg-gray-300">
                    <font-awesome-icon icon="fas fa-check" class="mr-2"></font-awesome-icon>
                    <span> {{ item_level2.status == 0 ? '提交' : '已提交' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else>
              <div v-show="showStepBtn" class="mt-8 mb-4 text-center">
                <el-popconfirm placement="top" confirm-button-text="确定" cancel-button-text="取消" icon="InfoFilled"
                  icon-color="#626AEF" title="请注意，点击提交后数据不可修改。" width="280px" @confirm="handleStepSubmit(item_level2)">
                  <template #reference>
                    <button :disabled="item_level2.status == 1"
                      class="text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      :class="item_level2.status == 1 ? 'disabled:bg-gray-300 cursor-not-allowed' : 'bg-green-600'">
                      <font-awesome-icon icon="fas fa-check" class="mr-2"></font-awesome-icon>
                      <span> {{ item_level2.status == 0 ? '提交' : '已提交' }}</span>
                    </button>
                  </template>
                </el-popconfirm>
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
import { updateBlockStatust, updateBlockScore, updateBlockTime } from './api/blockApi'


const emdV4Store = useEmdV4Store()

const props = defineProps({
  roots: {
    type: Array,
    default: () => [],
  },
})

const emist = defineEmits(['scrollToTop'])


// 当前步骤索引
const currentStep = ref(0);

// 辅助参数
const currentStepAssistParams = ref({
  check: false,
  pass: false,
  score: 0
})

const resetStepAssisParams = () => {
  setCurrentStepAssistParamsChecked(false)
  currentStepAssistParams.value.pass = false
  currentStepAssistParams.value.score = 0
}

const setCurrentStepAssistParamsChecked = (checked) => {
  currentStepAssistParams.value.check = checked
  emdV4Store.setCurrentStepAssistParamsChecked(checked)
}

const setCurrentStep = (currentStage) => {
  currentStep.value = currentStage
  resetStepAssisParams()

  let firstBlock = props.roots[0]
  // console.log(firstBlock)
  if (firstBlock.status == 0 && currentStage == 0 && !firstBlock.startTime) {
    setTimeout(() => {
      openTips(firstBlock)
    }, 200)
  }
}

const openTips = (block) => {
  ElMessageBox.alert('您已进入实验预习阶段，请认真观看相关教学视频，并按时完成预习题目，为后续实验做好准备。', '提示', {
    customClass: 'c-message-box',
    showClose: false,
    confirmButtonText: '确认',
    confirmButtonClass: '!bg-cprimary-600 text-white px-6 py-2 rounded-lg !hover:bg-cprimary-700 transition-colors !outline-none',
    callback: (action) => {
      updateBlockTime({ id: block.id, startTime: true, endTime: false }, (res) => {
        console.log(res)
      })
    },
  })
}


// 初始化 当前实验步骤
setCurrentStep(emdV4Store.currentStage)

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
  if (index == 0 || props.roots[index - 1].status == 1) {
    setCurrentStep(index)
  } else {
    ElMessage.warning(`请完成当前${props.roots[currentStep.value].name}步骤`)
  }
};

const autoNextStep = () => {
  let maxLenIndex = props.roots.length - 1
  if (currentStep.value < maxLenIndex) {
    setStep(currentStep.value + 1)
    // 页面滚动到顶部
    emist('scrollToTop')
  } else {
    ElMessage.success('恭喜，实验已完成')
  }
}

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

  let scoreComps = []
  scoreComps = loopChildren(block.children)
  for (let i = 0; i < scoreComps.length; i++) {
    let comp = scoreComps[i]
    resetStuAnswer(comp)
  }
}


let scoreCompTypes = ['QA', 'MULTIPLECHOICE', 'CHOICE', 'TABLE', 'CIRCUIT', 'TRACELINE'];
// loopChildren 循环遍历 firstLevelBlcok 中的 chilldren, 拿到计算得分的所有组件
const loopChildren = (children) => {
  let res = []
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (!child.hasChildren) {
      for (let i = 0; i < child.components.length; i++) {
        let comp = child.components[i]
        // 是否需要判断  needCalculate 待定
        if (scoreCompTypes.includes(comp.type)) {
          res.push(comp)
        }
      }
    } else {
      res = res.concat(loopChildren(child.children))
    }
  }
  return res
}

const isCompsNotCompeleted = (comps) => {
  let types = ['QA']
  let filterComps = comps.filter(item => {
    return types.includes(item.type)
  })

  let notOver = false
  let len = filterComps.length
  for (let i = 0; i < len; i++) {
    let comp = filterComps[i]
    if ('QA' === comp.type) {
      if (comp.status == 0 || comp.payload.aiWaiting == true) {
        notOver = true
        break
      }
    }
  }

  return notOver;
}

// 大步骤提交时 更新结束时间
const updateBlockEndTime = (block) => {
  updateBlockTime({ id: block.id, startTime: false, endTime: true }, (res) => {
    console.log(res)
  })
}


// 提交答案 answer
const handleStepSubmit = (block) => {
  let scoreComps = []
  scoreComps = loopChildren(block.children)

  if (isCompsNotCompeleted(scoreComps)) {
    ElMessage.warning('请等待系统校验完成！')
    return
  }

  if (block.needPassScore) {

    let studentScore = 0;
    let sumScore = 0;
    for (let i = 0; i < scoreComps.length; i++) {
      let comp = scoreComps[i]
      studentScore += comp.score
      let statics = comp.payload.statics
      if (comp.score > 0) {
        comp.payload.statics.right++
      } else {
        comp.payload.statics.error++
      }
      // comp.payload.statics = {right: 0, error: 0}
      let payloadStr = JSON.stringify(comp.payload)
      updateCompPayload(comp.id, payloadStr)
      sumScore += comp.totalScore
    }

    let f = parseFloat(studentScore / sumScore).toFixed(2) * 100

    if (isNaN(f)) {
      return
    }

    if (f < block.passScore) {
      setCurrentStepAssistParamsChecked(true)
      currentStepAssistParams.value.pass = false
      currentStepAssistParams.value.score = f
      ElMessage.error('未通过！')
    } else {
      ElMessage.success('恭喜通过！')
      // 提交通过
      resetStepAssisParams()

      updateBlockStatust(block.id, 1, () => {
        block.status = 1
        emdV4Store.setTaskBookChildren(props.roots)
        autoNextStep()
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
      
      updateBlockEndTime(block)
    }
  } else {
    updateBlockStatust(block.id, 1, () => {
      block.status = 1
      emdV4Store.setTaskBookChildren(props.roots)
      autoNextStep()

      for (let i = 0; i < scoreComps.length; i++) {
        let comp = scoreComps[i]
        comp.payload.result.showCheck = true
        let payloadStr = JSON.stringify(comp.payload)
        updateCompPayload(comp.id, payloadStr)
      }
    })
    
    updateBlockEndTime(block)
  }

}

const blockScorePrecent = computed(() => {
  // console.log('计算得分...')
  let block = props.roots[currentStep.value]

  if (block.status == 0 && !currentStepAssistParams.value.check) {
    return 0
  }

  let children = block.children
  let scoreComps = []
  scoreComps = loopChildren(block.children)

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

<style lang="scss" scoped>
:deep(.el-message-box) {
  padding: 0;
}


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