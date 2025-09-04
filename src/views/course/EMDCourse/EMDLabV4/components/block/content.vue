<template>
  <div v-html="htmlStr"></div>
</template>

<script setup lang="ts">
import { parseHtml } from "@/utils/htmlTools";



const props = defineProps({
    index: Number,
    comp: Object,
})

const htmlStr = ref();

watchEffect(() => {
  htmlStr.value = parseHtml(props.comp.payload.content);
});

onMounted(()=>{

})
</script>

<style scoped></style>
