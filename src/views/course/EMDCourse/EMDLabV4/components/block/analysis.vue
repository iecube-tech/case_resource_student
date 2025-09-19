<template>
  <div v-show="comp.payload.result.showCheck">
    <div class="mt-2 p-3  rounded" :class="comp.score > 0 ? 'answer-correct' : 'answer-error'">
      <div v-if="comp.score > 0" class="font-medium text-green-800 mb-1">
        <font-awesome-icon icon="fas fa-check-circle" class="text-green-600 mr-1"></font-awesome-icon>
        <span class="text-green-800">回答正确！</span>
      </div>
      <div v-else class="font-medium text-red-800 mb-1">
        <font-awesome-icon icon="fa-solid fa-xmark" class="text-red-600 mr-1"></font-awesome-icon>
        <span class="text-red-800">回答错误！</span>
      </div>
      <textpreview :content="comp.payload.question.analysis"></textpreview>
      
      <div v-show="( Number(comp.payload.statics.right) + Number(comp.payload.statics.error)) > 0"
         class="text-xs text-gray-500 mt-2 border-t-gray-200 border-t-[1px] pt-2">
        答对 {{ comp.payload.statics.right }} 次，打错 {{ comp.payload.statics.error }} 次
      </div>
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