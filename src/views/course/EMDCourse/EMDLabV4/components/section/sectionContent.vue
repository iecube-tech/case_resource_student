<template>
  <div>
    <div v-if="block.level == 3" class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div class="mb-2">
        <font-awesome-icon v-if="block.icon" :icon="block.icon" size="lg"
          class="text-blue-600 mr-2"></font-awesome-icon>
        <span class="text-lg font-semibold text-gray-900 mb-2">{{ block.name }}</span>
      </div>
      <p class="text-sm text-gray-600">
        {{ block.description }}
      </p>
    </div>

    <div class="p-6" ref="sections">

      <!-- 渲染comp组件 -->
      <div v-if="block.hasChildren == false">

        <!-- 组件按步骤显示 -->
        <div v-if="parentBlock.stepByStep">
          <!-- <div>
            parentBlok name: {{ parentBlock.name }} status: {{ parentBlock.status }} currentChild: {{ parentBlock.currentChild }} ----------- {{ level3Index }}
          </div> -->

          <div v-show="block.status == 1 || level3Index == parentBlock.currentChild">
            <video-group v-if="block.type === 'videoGroup'" :sectionDisabled="sectionDisabled" :block="block"
              @complete="handleCompComplete"></video-group>
            <select-group v-if="block.type === 'selectGroup'" :sectionDisabled="sectionDisabled" :block="block"
              @complete="handleCompComplete"></select-group>
            <common-group v-if="block.type === 'commonGroup'" :sectionDisabled="sectionDisabled"
              :block="block"></common-group>
          </div>

          <div v-show="parentBlock.status == 0"
            class="w-full flex justify-center mt-4">
            <el-button v-if="block.status == 0 && level3Index < (parentBlock.children.length - 1) && level3Index == parentBlock.currentChild"
             color="#2563eb" plain @click="showNextChild(block, parentBlock, false)">
                下一步
            </el-button>
            <el-button v-if="block.status == 0 && level3Index == (parentBlock.children.length - 1) && level3Index == parentBlock.currentChild"
             color="#2563eb" plain @click="showNextChild(block, parentBlock, level3Index == (parentBlock.children.length - 1))">
                步骤完成
            </el-button>
          </div>
        </div>

        <!-- 组件全部显示 -->
        <div v-else>
          <!-- {{ parentBlock.currentChild }} -->
          <video-group v-if="block.type === 'videoGroup'" :sectionDisabled="sectionDisabled" :block="block"
            @complete="handleCompComplete"></video-group>
          <select-group v-if="block.type === 'selectGroup'" :sectionDisabled="sectionDisabled" :block="block"
            @complete="handleCompComplete"></select-group>
          <common-group v-if="block.type === 'commonGroup'" :sectionDisabled="sectionDisabled"
            :block="block"></common-group>
        </div>
      </div>

      <!-- 包含子组件 -->
      <div v-else class="sub-block-container">
        <div v-for="(child, index) in block.children" :key="child.id">
          <section-content :block="child" :parentBlock="block" :level3Index="index" @innerBlockComplete="handleBlockComplete">
          </section-content>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import videoGroup from '../group/videoGroup.vue'
import selectGroup from '../group/selectGroup.vue'
import commonGroup from '../group/commonGroup.vue'

import { updateBlockStatust } from '../api/blockApi'

const emits = defineEmits(['nextStep', 'innerBlockComplete'])

const props = defineProps({
  parentBlock: Object, // 当前 section 的父Block
  block: Object,
  level3Index: Number,
})

// if (props.parentBlock.stage == 1 || props.block.hasChildren) {
//   console.log(props.parentBlock)
// }

const sectionDisabled = computed(() => {
  // 步骤不是实验前 
  let taskStage = props.parentBlock.stage
  if (taskStage != 0) {
    return false
  }

  let disabled = false

  let currentChild = props.parentBlock.currentChild
  let compIndex = props.level3Index

  if (compIndex > currentChild) {
    disabled = true
  }

  return disabled
})

const showNextChild = (child, parentBlock, isEnd) => {
  // 循环遍历内部 积分组件
  // TODO 校验当前组件是否符合完成标准 ，判断是否包含chidlren 循环遍历，
  updateBlockStatust(child.id, 1, () => {
    child.status = 1
    parentBlock.currentChild += 1
    if (parentBlock.children.length - 1 <= parentBlock.currentChild) {
      parentBlock.currentChild = parentBlock.children.length - 1
    }
    if(isEnd){
      emits('innerBlockComplete') // 内部block 全部 status 设置为 1 通知 父组件更新 parentBlock 状态
    }
  })

}

// 视频学习， 选择题组  全部组件 status从 0 变到 1 时触发 。comp 完成触发 可以更新block 状态
const handleCompComplete = (status) => {
  console.log(props.parentBlock)
  console.log(props.block)
  updateBlockStatust(props.block.id, status, () => {
    props.block.status = status;
    emits('nextStep')
  })
}
const showNextBlock = () => {
  console.log('下一步。。。。。。。。。。')
  console.log(props.parentBlock)
  console.log(props.block)
  updateBlockStatust(props.block.id, 1, () => {
    props.block.status = 1
    props.parentBlock.currentChild += 1
    if (props.parentBlock.children.length - 1 <= props.parentBlock.currentChild) {
      props.parentBlock.currentChild = props.parentBlock.children.length - 1
    }
  })
  // emits('nextBlock')
}

// 子block 完成更新父 block 状态
const handleBlockComplete = () => {
  console.log('包含子组件 显示下一个block')
  console.log(props.block)
  console.log(props.parentBlock)
  updateBlockStatust(props.block.id, 1, () => {
    props.block.status = 1
    props.parentBlock.currentChild += 1
    if (props.parentBlock.children.length - 1 <= props.parentBlock.currentChild) {
      props.parentBlock.currentChild = props.parentBlock.children.length - 1
      emits('innerBlockComplete')
    }
  })
}
</script>

<style scoped></style>