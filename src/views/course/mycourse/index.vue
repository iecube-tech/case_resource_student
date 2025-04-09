<template>
    <div>
        <div v-if="route.name === 'mycourse'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="project in projects" :key="project.id" @click="jumpToDetail(project.id, project.emdCourse)"
                class="card-hover bg-white rounded-xl shadow-card hover:shadow-card-hover border border-neutral-300 overflow-hidden cursor-pointer">
                <div class="h-72 overflow-hidden flex items-center justify-center">
                    <img v-if="project.cover" :src="'/local-resource/image/' + project.cover" :alt="project.projectName"
                        class="w-full h-full object-cover lazy-load" loading="lazy">
                </div>
                <div class="h-36 p-6 ">
                    <p class="font-semibold text-2xl mb-2">{{ project.projectName }}</p>
                    <p class="text-neutral-600 mb-4 truncate" :title="project.introduction">
                        {{ project.introduction }}
                    </p>
                </div>
            </div>
        </div>
        <RouterView />
    </div>
    <div v-if="courseStore.dialog" id="experimentsModal"
        class="modal-container show fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div class="modal-backdrop show absolute inset-0" @click="closeExperimentsModal()"></div>

        <courseDialog v-if="currCourese" :courseId="currCourese"></courseDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, onUnmounted } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { MyCourse } from '@/apis/project/mycourses';
import { ElMessage } from 'element-plus';
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import courseDialog from './child/courseDialog.vue';

interface project {
    id: number
    projectName: string
    cover: string
    introduction: string
    emdCourse: number | null
}

const route = useRoute()
const projects = ref<[project]>([{
    id: 0,
    projectName: '',
    cover: '',
    introduction: '',
    emdCourse: null
}])

const courseStore = useCourseStore()
const currCourese = ref()
const groupStore = useTaskGroupStore()

watch(() => courseStore.dialog, (newVal) => {
    if (newVal == false) {
        courseStore.setCurrCourse(null)
        courseStore.setCurrPage('taskList')
        courseStore.setCurrTask(null)
        courseStore.setCurrTaskList(null)
        groupStore.setCurrPage("groupInit")
        groupStore.setCurrGroup(null)
    }
})

const jumpToDetail = async (id: number, emdCourse: number | null) => {
    if (emdCourse) {
        currCourese.value = id
        openExperimentsModal()
    } else {
        await router.push({
            name: 'courseDetail',
            params: {
                id: id,
            }
        })
    }

}

onBeforeMount(() => {
    MyCourse().then((res: any) => {
        if (res.state == 200) {
            projects.value = res.data
            if (projects.value.length < 1) {
                ElMessage({
                    message: '您还未参与任何课程',
                    type: 'warning'
                })
            }
        } else {
            ElMessage.error(res.message)
        }
    })
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

// 显示实验选择模态框

function openExperimentsModal() {
    courseStore.setDialog(true)
}

// 关闭实验选择模态框
function closeExperimentsModal() {
    courseStore.setDialog(false)
}

</script>
<style scoped>
/* @import "@/styles/itemList/grid.css"; */
/* 卡片悬停效果 */
.card-hover {
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-2px);
}

/* 模态框容器 */
.modal-container {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.2s, opacity 0.2s ease;
}

.modal-container.show {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
}

/* 模态框内容 */
.modal-content {
    transform: scale(0.95);
    opacity: 0;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-container.show .modal-content {
    transform: scale(1);
    opacity: 1;
}

/* 模态框背景 */
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.modal-backdrop.show {
    opacity: 1;
}
</style>
