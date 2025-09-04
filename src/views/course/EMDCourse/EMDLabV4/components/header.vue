<template>
    <!-- 顶部导航栏 -->
    <nav ref="nav" class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center">
                <!-- <img src="/logo.ico" alt="IECUBE Logo" class="w-10 h-10 mr-3"> -->
                <font-awesome-icon icon="fas fa-flask" class="text-blue-600 text-2xl mr-3"></font-awesome-icon>
                <h2 class="text-xl font-bold text-gray-800">{{ name }}</h2>
            </div>
            
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">欢迎您，学生{{ studentName }}</span>
                <div class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <font-awesome-icon icon="fas fa-user" class="text-white text-sm"></font-awesome-icon>
                </div>
            </div>
           
            <!-- <div class="hidden xl:flex items-center space-x-4">
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
            </div> -->
            
        </div>
        
    </nav>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/util';
import { useUserStore } from '@/store';
import { useEmdStore } from '@/stores/emdLabStore';
import { MyGroup } from '@/apis/group/mygroup';

const userStore = useUserStore()

const student = userStore.getUser()
const studentName = student?.studentName

const props = defineProps({
    name: String,
})

/* const studentId = userStore.getUser()?.id

const groupVo = ref<any>()
const getGroupVo = () => {
    MyGroup(props.task?.id, studentId!).then(res => {
        if (res.state == 200) {
            groupVo.value = res.data
        }
    })
} */

onMounted(() => {
    
})

</script>
<style scoped></style>