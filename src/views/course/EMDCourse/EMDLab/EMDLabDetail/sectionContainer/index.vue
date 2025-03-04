<template>
    <div class="section-item">
        <div v-if="section?.blockVoList != null" class="block-container">
            <blockItem v-for="(item, i) in section?.blockVoList" :blockVo="item"></blockItem>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type sectionVo } from '../EMDLab'
import blockItem from '@/views/course/EMDCourse/EMDLab/EMDLabDetail/blockContainer/index.vue'
const props = defineProps({
    sectionVo: Object
})
const section = ref<sectionVo>()
section.value = <sectionVo>props.sectionVo
console.log(section.value)
</script>
<style scoped>
.section-item,
.block-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>