<template>
    <div v-if="block?.blockId" class="block-item">
        <content v-if="block?.type == blockType.TEXT" :blockVo="block"></content>
        <tableBlock v-if="block.type == blockType.TABLE" :blockVo="block"></tableBlock>
        <traceLine v-if="block.type == blockType.TRACELINE" :blockVo="block"></traceLine>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { type blockVo, blockType } from '../EMDLab'
import content from '@/views/course/EMDCourse/EMDLab/EMDLabDetail/Block/content.vue'
import tableBlock from '@/views/course/EMDCourse/EMDLab/EMDLabDetail/Block/table.vue'
import traceLine from '@/views/course/EMDCourse/EMDLab/EMDLabDetail/Block/traceLineRead.vue'

const props = defineProps({
    blockVo: Object
})
const block = ref<blockVo>()
block.value = <blockVo>props.blockVo




</script>
<style scoped>
.block-item {
    width: 100%;
}
</style>