<template>
    <textPreview v-if="block" :id="'preview' + generateShortUUID(block.id)" :content="block.content">
    </textPreview>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { generateShortUUID, type blockVo } from '../EMDLab';
import textPreview from '../../textPreview/textPreview.vue';
const props = defineProps({
    blockVo: {
        type: Object,
    }
})

const block = ref<blockVo>()

onMounted(() => {
    block.value = <blockVo>props.blockVo
})
</script>
<style scoped></style>