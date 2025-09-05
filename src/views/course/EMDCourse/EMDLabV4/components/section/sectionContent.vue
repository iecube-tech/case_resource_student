<template>
  <div class="p-6" ref="sections">
    <video-group v-if="block.type === 'videoGroup'" :sectionDisabled="sectionDisabled" :block="block"
      @complete="handleComplete"></video-group>
    <select-group v-if="block.type === 'selectGroup'" :sectionDisabled="sectionDisabled" :block="block"
      @complete="handleComplete"></select-group>
    <common-group v-if="block.type === ''" :sectionDisabled="sectionDisabled" :block="block"></common-group>
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

const sectionDisabled = computed(() => {
  let disabled = false
  
  let currentChild = props.parentBlock.currentChild
  let compIndex = props.level3Index

  if (compIndex > currentChild) {
    disabled = true
  }
  
  // 步骤不是实验前 
  let taskStage = props.parentBlock.stage
  if(taskStage != 0) {
    disabled = false
  }
  
  return disabled
})

// console.log('currentBlock', props.level3Index, sectionDisabled.value)


const emits = defineEmits(['nextStep'])

const handleComplete = (status) => {
  updateEmdV4BlockStatus(props.block.id, status).then(res => {
    if (res.state == 200) {
      ElMessage.success('完成小章节')
      emits('nextStep')
    }
  })
}
</script>

<style scoped></style>