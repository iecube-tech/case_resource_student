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


    <!-- 内容  -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div v-for="(item_level2, level_1_k) in roots" :key="`root_${level_1_k}`">
        <div v-show="item_level2.stage == currentStep">

          <div v-for="(item_level3, level_3_k) in (item_level2.children || [])" :key="`level_3_${level_3_k}`"
            class="section-card">
            <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div class="mb-2">
                <font-awesome-icon v-if="item_level3.icon" :icon="item_level3.icon" size="lg"
                  class="text-blue-600 mr-2"></font-awesome-icon>
                <span class="text-lg font-semibold text-gray-900 mb-2">{{ item_level3.name }}</span>
              </div>
              <p class="text-sm text-gray-600">
                {{ item_level3.description }}
              </p>
            </div>
            <sectionContent :step="level_3_k" :block="item_level3" @nextStep="handleNextCurrentChild(item_level2)">
            </sectionContent>
          </div>

          <div v-show="0 == currentStep" class="my-8 flex justify-between items-center">
            <div>
              <span class="text-sm text-gray-500">得分: </span>
              <span id="previewScore" class="text-lg font-semibold text-blue-600">0/100</span>
            </div>
            <button id="submitPreview" class="bg-blue-600 text-white px-6 py-2 rounded-lg
              hover:bg-blue-700 transition-colors disabled:bg-gray-300" @click="handleSubmit(0)">
              提交答案
            </button>
          </div>

          <div v-show="1 == currentStep" class="mt-8 mb-4 text-center">
            <button class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              @click="handleSubmit(1)">
              <font-awesome-icon icon="fas fa-check" class="mr-2"></font-awesome-icon>完成实验操作
            </button>
          </div>

          <div v-show="2 == currentStep" class="mt-8 mb-4 text-center">
            <button class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <font-awesome-icon icon="fas fa-check" class="mr-2"></font-awesome-icon>提交
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import sectionContent from './section/sectionContent.vue'
import { updateEmdV4BlockStatus } from '@/apis/emdV4/index.ts'

const props = defineProps({
  roots: {
    type: Array,
    default: () => [],
  },
})

const currentStep = ref(0); // 当前步骤索引

const initCurrentStep = () => {
  currentStep.value = 0;
  let len = props.roots.length;
  for (let i = 0; i < len; i++) {
    if (props.roots[i].status == 1) {
      currentStep.value = i + 1;
    }
  }

  if (currentStep.value > len - 1) {
    currentStep.value = len - 1;
  }
}

initCurrentStep()

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

const setStep = (index) => {
  console.log(currentStep.value)
  if (index == 0) {
    currentStep.value = index;
  } else if (props.roots[index - 1].status == 1) {
    currentStep.value = index;
  } else {
    ElMessage.warning(`请完成当前${props.roots[currentStep.value].name}步骤`)
  }
};



const handleNextCurrentChild = (block) => {
  // console.log('handleNextCurrentChild')
  // console.log(block)
  let maxIndex = block.children.length - 1
  block.currentChild = block.currentChild + 1
  if (block.currentChild >= maxIndex) {
    block.currentChild = maxIndex
  }
}

const emits = defineEmits(['nextStep'])

// level 2 status
const watchLevel2NodesStatus = () => {
  for (let i = 0; i < props.roots.length; i++) {
    let level2Node = props.roots[i]
    // console.log(level2Node)

    if (level2Node.status == 0) {
      if (level2Node.hasChildren) {
        // console.log(level2Node.children)
        let childrenLen = level2Node.children.length
        let totalComplete = 0
        for (let j = 0; j < childrenLen; j++) {
          let child = level2Node.children[j]
          if (child.status == 1) {
            totalComplete++
          }
        }

        if (totalComplete == childrenLen) {
          updateBlockStatust(level2Node.id, 1, ()=>{
            ElMessage.success('当前步骤完成！')
          })
        }
      }

    }
  }
}


const updateBlockStatust = (id, status, cb) => {
  updateEmdV4BlockStatus(id, status).then(res => {
    if (res.state == 200) {
      if(typeof cb == 'function'){
        cb()
      }
    }
  })
}



watchEffect(() => {
  watchLevel2NodesStatus()
})


const sections = ref(null)

// 提交答案 answer
const handleSubmit = async (index) => {
  console.log('handleSubmit ..................')
  let stepItem = props.roots[index]
  let itemCompleted = await isCompleted(stepItem)

  if (!itemCompleted) {
    ElMessage.warning('请完成所有步骤')
    return
  } else {
    updateBlockStatust(stepItem.id, 1, ()=>{
      ElMessage.success('当前步骤完成！')
    })
  }
}

const isCompleted = async (item) => {
  let complete = false
  if (item.status == 1) {
    complete = true;
    return complete;
  } else {
    // item.status == 0
    let hasChildren = item.hasChildren
    if (!hasChildren) {
      return complete
    } else {
      let children = item.children
      let totalChildenLens = children.length
      let childrenComplete = 0
      let allChildenComplete = false;

      for (let i = 0; i < totalChildenLens; i++) {
        let child = children[i]
        if (isCompleted(child)) {
          childrenComplete++
        }
      }

      if (childrenComplete === totalChildenLens) {
        allChildenComplete = true
        if (item.status == 0 && allChildenComplete) {
          let req = allChildenComplete ? 1 : 0
          // await updateEmdV4BlockStatus(item.id, req)
          item.status = req
        }
      }

      complete = item.status
      return complete
    }

  }
  return complete;
}


onMounted(() => {
  // console.log('---------------------> roots')
  // props.roots.forEach(_ => {
  //   console.log(_)
  // })
  // console.log('---------------------> roots end')
})

</script>

<style scoped>
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