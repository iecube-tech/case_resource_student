<template>
  <div class="p-6" ref="sections">
    <video-group v-if="block.type === 'videoGroup'" :block="block" @complete="handleComplete"></video-group>
    <select-group v-if="block.type === 'selectGroup'" :block="block" @complete="handleComplete"></select-group>
    <common-group v-if="block.type === ''" :block="block"></common-group>
  </div>
</template>

<script setup>
import videoGroup from '../group/videoGroup.vue'
import selectGroup from '../group/selectGroup.vue'
import commonGroup from '../group/commonGroup.vue'

import { updateEmdV4BlockStatus } from '@/apis/emdV4/index.ts'

const props = defineProps({
  block: Object,
  step: Number
})

const emits = defineEmits(['nextStep'])

const handleComplete = (status) => {
  updateEmdV4BlockStatus(props.block.id, status).then(res => {
    if (res.state == 200) {
      ElMessage.success('当前步骤完成！')
      emits('nextStep')
    }
  })
}
</script>

<style scoped></style>