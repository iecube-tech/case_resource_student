<template>
    <div class="section-item mb-6" v-if="section && blockVoList">
        <div v-for="(item, i) in blockVoList" class="block-container ">
            <contentStu v-if="item.type == BlockType.TEXT" :blockVo="item" :key="'block_detail_' + item.id"
                :id="'block_detail_' + item.id" :status="section.status!" />
            <qaStu v-if="item.type == BlockType.QA" :blockVo="item" :key="'block_detail_' + item.id"
                :id="'block_detail_' + item.id" :status="section.status!" />
            <choiceStu v-if="item.type == BlockType.CHOICE" :blockVo="item" :key="'block_detail_' + item.id"
                :id="'block_detail_' + item.id" :status="section.status!" />
            <multipleChoice v-if="item.type == BlockType.MULTIPLECHOICE" :blockVo="item"
                :key="'block_detail_' + item.id" :id="'block_detail_' + item.id" :status="section.status!" />
            <circuit v-if="item.type == BlockType.CIRCUIT" :blockVo="item" :key="'block_detail_' + item.id"
                :id="'block_detail_' + item.id" :status="section.status!" />
            <tableStu v-if="item.type == BlockType.TABLE" :blockVo="item" :key="'block_detail_' + item.id"
                :id="'block_detail_' + item.id" :status="section.status!" />
            <tracelineStu v-if="item.type == BlockType.TRACELINE" :blockVo="item" :key="'block_detail_' + item.id"
                :id="'block_detail_' + item.id" :status="section.status!" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type sectionVo, type blockVo, BlockType } from '../EMDLabV4'
import { ElMessage } from 'element-plus';
import contentStu from '../BlockV4/contentStu.vue';
import qaStu from '../BlockV4/qa.vue';
import choiceStu from '../BlockV4/choice.vue';
import multipleChoice from '../BlockV4/multipleChoice.vue';
import circuit from '../BlockV4/circuit.vue';
import tableStu from '../BlockV4/table.vue';
import tracelineStu from '../BlockV4/tracneline.vue';

const props = defineProps({
    section: Object
})
const section = ref<sectionVo>()
const blockVoList = ref<blockVo[]>([])

onMounted(() => {
    section.value = <sectionVo>props.section
    if (section.value && section.value.blockVoList) {
        blockVoList.value = section.value.blockVoList
        console.log(section.value)
    } else {
        ElMessage.error("数据加载失败")
    }
})
</script>