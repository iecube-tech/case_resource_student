<template>
  <div class="p-6" ref="sections">
    <div v-if="block.hasChildren == false">
      <video-group v-if="block.type === 'videoGroup'" :sectionDisabled="sectionDisabled" :block="block"
        @complete="handleComplete"></video-group>
      <select-group v-if="block.type === 'selectGroup'" :sectionDisabled="sectionDisabled" :block="block"
        @complete="handleComplete"></select-group>
      <common-group v-if="block.type === 'commonGroup'" :sectionDisabled="sectionDisabled"
        :block="block"></common-group>
    </div>

    <div v-else class="sub-block-container">
      <div v-for="(child, index) in block.children" :key="child.id">
        <div v-if="parentBlock.stepByStep">
          <div v-if="block.status == 1 || index == parentBlock.currentChild">
            <section-content :parentBlock="block" :block="child" :level3Index="index" @nextStep="handleNextStep">
            </section-content>
            <div>
              currentChild: {{ parentBlock.currentChild }}
              <el-button color="#2563eb" @click="showNextChild(block)"> 下一步</el-button>
            </div>
          </div>
        </div>
        <div v-else>
          <section-content :parentBlock="block" :block="child" :level3Index="index" @nextStep="handleNextStep">
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

import { updateEmdV4BlockStatus } from '@/apis/emdV4/index.ts'

const props = defineProps({
  parentBlock: Object, // 当前 section 的父Block
  block: Object,
  level3Index: Number,
})

if (props.parentBlock.stage == 1 || props.block.hasChildren) {
  console.log(props.parentBlock)
}

// console.log(props.block.type)

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

const emits = defineEmits(['nextStep'])

const handleComplete = (status) => {
  updateEmdV4BlockStatus(props.block.id, status).then(res => {
    if (res.state == 200) {
      ElMessage.success('完成小章节')
      emits('nextStep')
    }
  })
}

const handleNextStep = () => {
  console.log('下一步')
}

const showNextChild = (block) => {
  // 循环遍历内部 积分组件
}
</script>

<style scoped></style>