<template>
    <textPreview v-if="block" class="ist-theam" :content="block.content">
    </textPreview>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type blockVo } from '../EMDLab';
import textPreview from '../../textPreview/textPreview.vue';
const props = defineProps({
    blockVo: {
        type: Object,
    },
    status: Number
})

const block = ref<blockVo>()

onMounted(() => {
    block.value = <blockVo>props.blockVo
})
</script>
<style scoped></style>