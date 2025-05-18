<template>
    <div class="section-item mb-6" v-if="blockVoList">
        <div v-for="(item, i) in blockVoList" class="block-container ">
            <contentStu v-if="item.type == BlockType.TEXT" :blockVo="item" />
            <qaStu v-if="item.type == BlockType.QA" :blockVo="item" />
            <choiceStu v-if="item.type == BlockType.CHOICE" :blockVo="item" />
            <multipleChoice v-if="item.type == BlockType.MULTIPLECHOICE" :blockVo="item" />
            <circuit v-if="item.type == BlockType.CIRCUIT" :blockVo="item" />
            <tableStu v-if="item.type == BlockType.TABLE" :blockVo="item" />
            <tracelineStu v-if="item.type == BlockType.TRACELINE" :blockVo="item" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type sectionVo, type blockVo, BlockType } from '../EMDLabV3'
import { ElMessage } from 'element-plus';
import contentStu from '../BlockV3/contentStu.vue';
import qaStu from '../BlockV3/qa.vue';
import choiceStu from '../BlockV3/choice.vue';
import multipleChoice from '../BlockV3/multipleChoice.vue';
import circuit from '../BlockV3/circuit.vue';
import tableStu from '../BlockV3/table.vue';
import tracelineStu from '../BlockV3/tracneline.vue';

const props = defineProps({
    section: Object
})
const section = ref<sectionVo>()
const blockVoList = ref<blockVo[]>([])

onMounted(() => {
    section.value = <sectionVo>props.section
    if (section.value && section.value.blockVoList) {
        blockVoList.value = section.value.blockVoList
    } else {
        ElMessage.error("数据加载失败")
    }
})
</script>