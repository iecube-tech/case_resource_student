<template>
    <div>
        <el-button v-for="item in taskList" @click="toDetail(item.taskId)">{{ item.taskName }}</el-button>
    </div>
</template>

<script setup lang="ts">
import { GetEMDTask } from '@/apis/EMDProject/getEMDTask'
import router from '@/router';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const projectId = ref()
const taskList = ref<taskvo[]>([])
interface taskvo {
    taskId: number,
    taskName: string
}
const getTaskList = (id: number) => {
    GetEMDTask(id).then(res => {
        if (res.state == 200) {
            taskList.value = res.data
        } else {
            ElMessage.error(res.message)
        }
    })
}
const toDetail = (taskId: number) => {
    // const route = useRouter();
    const url = router.resolve({ name: 'emdTaskDetail', params: { id: taskId } }).href;
    window.open(url, '_blank');
}

onMounted(() => {
    setTimeout(() => {
        projectId.value = route.params.id
        getTaskList(projectId.value)
    }, 10)
})
</script>


<style scoped></style>
