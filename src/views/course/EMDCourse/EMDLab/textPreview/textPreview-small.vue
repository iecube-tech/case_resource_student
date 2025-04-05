<template>
    <div :id="id" v-html="rederedContent">
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { simpleMarked } from '@/ts/MyMarked';

const props = defineProps({
    id: String,
    content: String
})

const rederedContent = ref()

watch(() => props.content, (newValue, oldValue) => {
    if (newValue) {
        rederedContent.value = simpleMarked.parse(newValue)
    }
})


onMounted(() => {
    rederedContent.value = simpleMarked.parse(props.content!)
})


</script>
<style scoped></style>