<template>
    <div :id="id" v-html="afterRenderContent" @click="handleImageClick">
    </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { simpleMarked } from '@/ts/MyMarked';
import DOMPurify from 'isomorphic-dompurify';
import Show from '@/components/markdownInteraction/markdown/show.vue';
import { useEmdStore } from '@/stores/emdLabStore';
const labStore = useEmdStore()

const props = defineProps({
    id: String,
    content: String
})

const afterRenderContent = ref()
const handleImageClick = (event) => {
  if (event.target.tagName === 'IMG') {
    labStore.showZoomed = true
    labStore.setimageSrc(event.target.currentSrc)
  }
}

function postprocess(html: string) {
    return DOMPurify.sanitize(html);
}

watch(() => props.content, (newValue, oldValue) => {
    if (newValue) {
        afterRenderContent.value = postprocess(<string>simpleMarked.parse(newValue)).replace(/<p[^>]*>\s*<\/p>/g, '')
    }
})

onMounted(() => {
    afterRenderContent.value = postprocess(<string>simpleMarked.parse(props.content==null?'':props.content)).replace(/<p[^>]*>\s*<\/p>/g, '')
})

</script>
<style scoped></style>