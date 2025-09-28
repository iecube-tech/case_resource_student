<!-- 问答组件答案分析 -->
<template>
  <div v-show="comp.payload.result.showCheck">
    <div class="mt-2 p-3  rounded" :class="comp.score == comp.totalScore ? 'answer-correct' :
      (comp.score > 0 && comp.score < comp.totalScore) ? 'answer-half-correct' : 'answer-error'">
      <!-- {{ comp.score}} {{  comp.totalScore }} -->
      <div v-if="comp.score == comp.totalScore" class="font-medium text-green-800 mb-1">
        <font-awesome-icon icon="fas fa-check-circle" class="text-green-600 mr-1"></font-awesome-icon>
        <span class="text-green-800">回答正确！</span>
      </div>
      <div v-else-if="comp.score > 0 && comp.score < comp.totalScore" class="font-medium text-orange-800 mb-1">
        <font-awesome-icon icon="fas fa-circle-exclamation" class="text-orange-600 mr-1"></font-awesome-icon>
        <span class="text-orange-800">回答部分正确！</span>
      </div>
      <div v-else class="font-medium text-red-800 mb-1">
        <font-awesome-icon icon="fa-solid fa-xmark" class="text-red-600 mr-1"></font-awesome-icon>
        <span class="text-red-800">回答错误！</span>
      </div>
      <textpreview :content="comp.payload.question.analysis"></textpreview>
    </div>
  </div>
</template>

<script setup>

import textpreview from "@/components/textPreview.vue";
const props = defineProps({
  comp: Object,
})
</script>

<style scoped></style>