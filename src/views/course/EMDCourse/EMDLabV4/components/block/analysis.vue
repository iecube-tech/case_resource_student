<template>
  <div v-show="comp.payload.result.showCheck">
      <div class="mt-2 p-3  rounded" :class="comp.score > 0 ? 'answer-correct' : 'answer-error'">
          <div v-if="comp.score > 0" class="font-medium text-green-800 mb-1" >
              <font-awesom icon="fas fa-check-circle" class="text-green-600 mr-1"></font-awesom>
              <span class="text-green-800">回答正确！</span>
          </div>
          <div v-else class="font-medium text-red-800 mb-1">
              <font-awesom icon="fa-solid fa-xmark" class="text-red-600 mr-1"></font-awesom>
              <span class="text-red-800">回答正确！</span>
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

<style scoped>

</style>