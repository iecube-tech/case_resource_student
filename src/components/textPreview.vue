<template>
    <div :id="id" v-html="afterRenderContent">
    </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { simpleMarked } from '@/ts/MyMarked';
import DOMPurify from 'isomorphic-dompurify';
const props = defineProps({
    id: String,
    content: String
})

const afterRenderContent = ref()

function postprocess(html: string) {
    return DOMPurify.sanitize(html);
}

watch(() => props.content, (newValue, oldValue) => {
    if (newValue) {
        afterRenderContent.value = postprocess(<string>simpleMarked.parse(newValue)).replace(/<p[^>]*>\s*<\/p>/g, '')
    }
})

onMounted(() => {
    afterRenderContent.value = postprocess(<string>simpleMarked.parse(<string>props.content)).replace(/<p[^>]*>\s*<\/p>/g, '')
})

</script>
<style scoped>
:deep(pre code) {
    white-space: pre-wrap;
    word-break: break-all;
}

</style>