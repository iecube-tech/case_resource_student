<template>
    <div :id="props.parentId">
        <MdPreview :editorId="id" :modelValue="content" />
    </div>
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
import { ref } from 'vue';
import { replace } from '@/components/markdownInteraction/script/relpace'

const props = defineProps({
    id: String,
    content: String,
    element: String,
    parentId: String,
})

const id = ref('')
const content = ref('')
const element = ref([])

id.value = props.id
content.value = props.content
try {
    element.value = JSON.parse(props.element)
} catch (e) {
    element.value = []
}

setTimeout(() => {
    replace(null, null, null, id.value)
}, 400)

</script>
<style scoped></style>