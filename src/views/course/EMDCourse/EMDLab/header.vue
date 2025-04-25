<template>
    <!-- 顶部导航栏 -->
    <nav ref="nav" class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center">
                <img src="/logo.ico" alt="IECUBE Logo" class="w-10 h-10 mr-3">
                <h2 class="text-xl font-bold text-gray-800">{{ task?.taskName }}</h2>
            </div>
            <div v-if="labModelList" class="hidden lg:flex items-center space-x-6">
                <button v-for="(model, i) in labModelList" @click="toModel(i)"
                    :class="['nav-btn', 'text-sm', 'py-1', 'px-3', 'rounded-full', 'bg-gray-200', 'text-gray-700', 'hover:bg-blue-300', 'hover:text-white']">
                    {{ model.name }}
                </button>
            </div>
            <div class="hidden xl:flex items-center space-x-4">
                <div v-if="groupVo" class="flex items-center">
                    <span v-for="(student, i) in groupVo.groupStudents" class="mx-1">{{ student.studentName }}</span>
                </div>
                <div v-else>
                    <span>{{ userStore.getUser()?.studentName }}</span>
                </div>
                <span class="text-sm text-gray-600"
                    :title="'实验日期:' + formatDate(task?.taskStartTime) + '--' + formatDate(task?.taskEndTime)">
                    {{ formatDate(emdStudentTask?.startTime, true) }} - {{ formatDate(emdStudentTask?.endTime, true) }}
                </span>
            </div>
            <button id="mobile-menu-btn" class="lg:hidden text-gray-700" @click="openMobileMenu">
                <font-awesome-icon icon="fas fa-bars"></font-awesome-icon>
            </button>
        </div>
        <!-- 移动端导航菜单 -->
        <div id="mobile-menu" class="md:hidden hidden bg-white shadow-md">
            <div v-if="labModelList" class="container mx-auto py-3 px-4 flex flex-col space-y-2">
                <button v-for="(model, i) in labModelList" @click="toModel(i)"
                    :class="['nav-btn', 'text-sm', 'py-1', 'px-3', 'text-left', 'rounded', 'bg-gray-200', 'text-gray-700']">
                    {{ model.name }}
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/util';
import { onMounted, ref, watch } from 'vue';
import { useEmdStore } from '@/stores/emdLabStore';
import { useUserStore } from '@/store';
import { MyGroup } from '@/apis/group/mygroup';
const labStore = useEmdStore()
const userStore = useUserStore()

const props = defineProps({
    task: Object
})
const studentId = userStore.getUser()?.id

const labModelList = ref()
const emdStudentTask = ref()

watch(() => labStore.labModelList, (newVal) => {
    labModelList.value = newVal
})

watch(() => labStore.emdStudentTask, (newVal) => {
    emdStudentTask.value = newVal
})

const openMobileMenu = () => {
    if (document.getElementById('mobile-menu')?.classList.contains('hidden')) {
        document.getElementById('mobile-menu')?.classList.remove('hidden')
    } else {
        document.getElementById('mobile-menu')?.classList.add('hidden')
    }
}

const toModel = (i: any) => {
    window.location.hash = 'module-' + i
}

const groupVo = ref<any>()

const getGroupVo = () => {
    MyGroup(props.task?.id, studentId!).then(res => {
        if (res.state == 200) {
            groupVo.value = res.data
        }
    })
}

onMounted(() => {
    getGroupVo()
})

</script>
<style scoped></style>