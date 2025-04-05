<template>
    <div class="section-item mb-6" v-if="blockVoList">
        <div v-for="(item, i) in blockVoList" class="block-container ">
            <contentStu v-if="item.type == blockType.TEXT" :blockVo="item" />
            <qaStu v-if="item.type == blockType.QA" :blockVo="item" />
            <choiceStu v-if="item.type == blockType.CHOICE" :blockVo="item" />
            <tableStu v-if="item.type == blockType.TABLE" :blockVo="item" />
            <tracelineStu v-if="item.type == blockType.TRACELINE" :blockVo="item" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type sectionVo, type blockVo, blockType } from '../EMDLab'
import { ElMessage } from 'element-plus';
import contentStu from '../Block/contentStu.vue';
import qaStu from '../Block/qaStu.vue';
import choiceStu from '../Block/choiceStu.vue';
import tableStu from '../Block/tableStu.vue';
import tracelineStu from '../Block/tracelineStu.vue';

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