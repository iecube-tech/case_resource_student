<template>
    <div id="page-courses">
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">选择课程</h2>
            <p class="text-gray-600">请选择要查看考试的课程</p>
        </div>

        <!-- 课程卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 课程1 -->
            <div v-for="(course, i) in examCourseList" @click="goCourseExamList(course.projectId)"
                class="course-card bg-white rounded-xl shadow-md border border-gray-200 p-6"
                :data-course-id="course.projectId">
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ course.projectName }}</h3>
                    <p class="text-gray-600 text-sm">学期: {{ formatSeason(course.semester) }}</p>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">点击查看考试</div>
                    <button class="text-blue-600 hover:text-blue-800 font-medium">
                        查看考试
                        <font-awesome-icon icon="fas fa-arrow-right" class="ml-1"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { getExamCourse } from '@/apis/exam/examView'
import { formatSeason } from '@/utils/util'
import router from '@/router';

const examCourseList = ref<any[]>([])

const goCourseExamList = (projectId: number) => {
    router.push({
        name: 'examList',
        params: {
            projectId: projectId
        }
    })
}

onBeforeMount(() => {
    getExamCourse().then(res => {
        if (res.state == 200) {
            examCourseList.value = res.data
        }
    })
})
</script>
<style scoped>
.course-card {
    transition: all 0.3s ease;
    /* border-left: 4px solid #3b82f6; */
    cursor: pointer;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-left-color: #2563eb;
}
</style>