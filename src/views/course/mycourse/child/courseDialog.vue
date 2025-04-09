<template>
    <div class="modal-content bg-white rounded-xl shadow w-full mx-auto overflow-hidden"
        style="max-width: 600px; max-height: 90vh;">
        <!-- 模态框标题 -->
        <div class="px-6 py-4 bg-cprimary-600 text-white flex justify-between items-center">
            <div v-if="course">
                <h3 class="text-2xl font-medium">{{ course.projectName }}</h3>
                <p class="text-cprimary-100 text-xl mt-1">选择需要进行的实验项目</p>
            </div>
            <button type="button" class="text-white hover:text-cprimary-200 focus:outline-none"
                @click="closeExperimentsModal()">
                <font-awesome-icon icon="fa-solid fa-xmark" size="xl" />
            </button>
        </div>
        <component v-if="course" :is="currentPageComponent" :courseId="course.id"></component>
    </div>

</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import taskList from './taskList.vue';

import group from './group.vue';
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import { Project } from '@/apis/project/project';
import { ElMessage } from 'element-plus';
import { useTaskGroupStore } from '@/stores/taskGroupStore';

const props = defineProps({
    courseId: Number
})

const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()
const course = ref()
const pageComponents = {
    taskList: taskList,
    group: group,
};

watch(() => courseStore.currPage, (newVal) => {
    currentPage.value = <keyof typeof pageComponents>newVal
})

const currentPage = ref<keyof typeof pageComponents>('taskList');
const currentPageComponent = computed(() => pageComponents[currentPage.value]);

// 关闭实验选择模态框
function closeExperimentsModal() {
    courseStore.setCurrCourse(null)
    courseStore.setCurrPage('taskList')
    courseStore.setCurrTask(null)
    courseStore.setCurrTaskList(null)
    courseStore.setDialog(false)
    groupStore.setCurrPage("groupInit")
    groupStore.setCurrGroup(null)
}

const getCourseDetail = async () => {

    if (courseStore.getCurrCourse) {
        if (courseStore.getCurrCourse.id == props.courseId) {
            course.value = courseStore.getCurrCourse
            return
        }
    }
    await Project(<number>props.courseId).then(res => {
        if (res.state == 200) {
            course.value = res.data
            courseStore.setCurrCourse(course.value)
        } else {
            ElMessage.error(res.message)
        }
    })
}

onMounted(async () => {
    courseStore.setCurrPage("taskList")
    await getCourseDetail()
})

onUnmounted(() => {
    courseStore.setCurrCourse(null)
    courseStore.setCurrPage('taskList')
    courseStore.setCurrTask(null)
    courseStore.setCurrTaskList(null)
    courseStore.setDialog(false)
    groupStore.setCurrPage("groupInit")
    groupStore.setCurrGroup(null)
})
</script>
<style scoped></style>