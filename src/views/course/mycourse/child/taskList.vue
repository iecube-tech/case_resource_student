<template>
    <!-- 实验列表 -->
    <div id="experimentsList" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <!-- "我的小组"按钮 -->
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800">实验项目列表</h3>
            <!-- <div v-if="course?.useGroup">
                <button id="myGroupsBtn"
                    class="px-3 py-1.5 bg-cprimary-50 hover:bg-cprimary-100 text-cprimary-700 font-medium rounded-md text-xl flex items-center"
                    @click="checkMyGroups()">
                    <font-awesome-icon icon="fa-solid fa-user-group" />
                    我的小组
                    <span id="activeGroupBadge"
                        class="ml-1 bg-cprimary-100 text-cprimary-800 text-xl font-semibold px-2 py-0.5 rounded-full">1</span>
                </button>
            </div> -->
        </div>
        <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="task in tasks" @click="toTask(task)"
                class="experiment-item rounded-md py-3 px-4 border border-neutral-200 flex justify-between items-center">
                <span class="font-medium text-neutral-800">{{ task.taskName }}</span>
                <font-awesome-icon class="text-cprimary-500 text-xl" icon="fa-solid fa-chevron-right" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


import { GetEMDTask } from '@/apis/EMDProject/getEMDTask'
import { onMounted, ref } from 'vue';
import { useCourseStore } from '@/stores/courseStore';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { UpdateTaskStatus } from '@/apis/EMDProject/updateEmdTaskStatus';
const props = defineProps({
    courseId: Number
})
const courseStore = useCourseStore()
const tasks = ref()
const course = ref<any>()
console.log(props.courseId)

const getTasks = () => {
    return new Promise<void>((resolve, reject) => {
        if (courseStore.getCurrTasks != null) {
            tasks.value = courseStore.getCurrTasks
            return resolve()
        }
        GetEMDTask(<number>props.courseId).then(res => {
            if (res.state == 200) {
                tasks.value = res.data
                courseStore.setCurrTaskList(tasks.value)
                return resolve()
            } else {
                ElMessage.error(res.message)
                return reject()
            }
        })
    })
}

const toTask = (task: any) => {
    courseStore.setCurrTask(task)
    if (course.value.useGroup > 0) {
        courseStore.setCurrPage("group")
    }
    else {
        const url = router.resolve({ name: 'emdTaskDetail', params: { id: task.taskId } }).href;
        window.open(url, '_blank');
        UpdateTaskStatus(courseStore.getCurrTask?.taskId, 1)
        courseStore.setDialog(false)
    }
}

onMounted(async () => {
    await getTasks()
    course.value = courseStore.getCurrCourse
})

</script>
<style scoped>
/* 实验项目卡片 */
.experiment-item {
    transition: all 0.2s ease;
    cursor: pointer;
}

.experiment-item:hover {
    background-color: #f0fdfa;
    border-color: #2dd4bf;
}
</style>