<template>
    <emdPreview v-if="block?.blockId" :id="'preview' + generateShortUUID(<any>block!.blockId)"
        :content="<string>block!.content"></emdPreview>
</template>

<script setup lang="ts">
import 'vditor/dist/index.css';
import { ref, onBeforeMount, onMounted } from 'vue';
import { generateShortUUID, type blockVo } from '../EMDLab';
import emdPreview from './emdPreview/emdPreview.vue';
const props = defineProps({
    blockVo: {
        type: Object,
    }
})

const block = ref<blockVo>()
block.value = <blockVo>props.blockVo
</script>
<style scoped></style>