<template>
  <span class="px-2 inline-flex text-xs leading-5  "
  :class="[`bg-${color}-100`, `text-${color}-800`]">{{ text }}</span>
</template>

<script setup>
const props = defineProps({
  color: String, //green, yellow, gray, red, blue, purple, indigo, pink, orange
  text: {
    type: [String , Number],
    default: ''
  }
  
})

</script>

<style scoped>

</style>