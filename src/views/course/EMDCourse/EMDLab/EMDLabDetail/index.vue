<template>
    <div class="lab-container">
        <div class="section-container" v-for="(item, i) in taskDetail?.sectionVoList">
            <sectionItem v-if="i === 0 || taskDetail?.sectionVoList[i - 1].status === 1" :sectionVo="item">
            </sectionItem>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { GetEMDTaskDetailVo } from '@/apis/EMDProject/getTaskDetailVo'
import { ElMessage } from 'element-plus';
import { type taskDetailVo } from './EMDLab'
import sectionItem from '@/views/course/EMDCourse/EMDLab/EMDLabDetail/sectionContainer/index.vue'
const props = defineProps({
    taskId: {
        type: Number,
        required: true
    },
})


const taskDetail = ref<taskDetailVo>()


const getTaskDetailVo = () => {
    GetEMDTaskDetailVo(props.taskId!).then(res => {
        if (res.state == 200) {
            taskDetail.value = res.data
            console.log('taskDetail')
            console.log(taskDetail.value)
        } else {
            ElMessage.error(res.message)
        }
    })
}

onBeforeMount(() => {
    getTaskDetailVo()
})
</script>
<style scoped>
.lab-container,
.section-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.lab-container {
    padding: 40px;
}
</style>