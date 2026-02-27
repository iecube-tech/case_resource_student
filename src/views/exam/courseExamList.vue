<template>
    <div id="page-exams">
        <div v-if="course" class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2" id="course-title">{{ course.projectName }}</h2>
                    <div class="flex items-center space-x-4 text-gray-600">
                        <span class="text-sm">学期: <span id="course-semester">
                                {{ formatSeason(course.semester) }}
                            </span></span>
                    </div>
                </div>
                <button id="back-to-courses" @click="goBack()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                    <font-awesome-icon icon="fas fa-arrow-left" class="mr-2"></font-awesome-icon>
                    返回课程
                </button>
            </div>
        </div>

        <!-- 考试列表 -->
        <div v-if="examMap && course" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- 标签页 -->
            <div class="border-b border-gray-200">
                <div class="flex">
                    <button ref="btnActive" class="tab-button active"
                        @click="changeTab(btnActive, tabActive)">可参加的考试</button>
                    <button ref="btnCompleted" class="tab-button"
                        @click="changeTab(btnCompleted, tabCompleted)">已完成的考试</button>
                    <button ref="btuUpcoming" class="tab-button"
                        @click="changeTab(btuUpcoming, tabUpcoming)">即将开始的考试</button>
                </div>
            </div>

            <!-- 可参加的考试 -->
            <div ref="tabActive" class="tab-content p-6">
                <div class="mb-6">
                    <!-- 考试1 -->
                    <div v-for="(exam, index) in examMap['doing']"
                        class="exam-card active bg-white border border-gray-200 rounded-lg p-5 mb-4 cursor-pointer"
                        :data-exam-id="exam.examId">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <h4 class="text-lg font-bold text-gray-900 mr-3">{{ exam.examName }}</h4>
                                    <span class="exam-info-badge">{{ exam.duration }}分钟</span>
                                    <span class="status-badge status-active ml-3">
                                        <font-awesome-icon icon="fas fa-clock" class="mr-1"></font-awesome-icon>
                                        进行中
                                    </span>
                                </div>

                                <div class="flex items-center text-gray-600 text-sm mb-4">
                                    <font-awesome-icon icon="far fa-calendar" class="mr-1"></font-awesome-icon>
                                    <span class="mr-4">开始: {{ formatDate(exam.examStartTime) }}</span>
                                    <font-awesome-icon icon="far fa-clock" class="mr-1"></font-awesome-icon>
                                    <span>结束: {{ formatDate(exam.examEndTime) }}</span>
                                </div>

                                <div class="text-gray-600 text-sm">
                                    考试状态: <span class="font-medium" :class="exam.examSubmitStatus == 'notStart' ? 'text-yellow-600' :
                                        exam.examSubmitStatus == 'doing' ? 'text-blue-600' : 'text-green-600'">
                                        {{ exam.examSubmitStatus == 'notStart' ? '未开始' :
                                            exam.examSubmitStatus == 'doing' ? '进行中' : '已提交' }}
                                    </span>
                                </div>
                            </div>

                            <div class="text-right">
                                <button v-if="exam.examSubmitStatus == 'notStart'"
                                    @click="checkStartExam(<number>index, exam.esId)"
                                    class="mt-3 btn-gradient text-white px-5 py-2 rounded-lg font-medium start-exam-btn">
                                    开始考试
                                </button>
                                <button v-else @click="viewExam(exam.esId)"
                                    class="mt-3 btn-gradient text-white px-5 py-2 rounded-lg font-medium start-exam-btn">
                                    查看详情
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 已完成的考试 -->
            <div ref="tabCompleted" class="tab-content p-6 hidden">
                <div class="mb-6">
                    <!-- 考试2 -->
                    <div v-for="exam in examMap['done']"
                        class="exam-card completed bg-white border border-gray-200 rounded-lg p-5 mb-4 cursor-pointer"
                        data-exam-id="2">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <h4 class="text-lg font-bold text-gray-900 mr-3">{{ exam.examName }}</h4>
                                    <span class="exam-info-badge">{{ exam.duration }}分钟</span>
                                    <span class="status-badge ml-3"
                                        :class="exam.examSubmitStatus == 'done' ? 'status-completed' : exam.examSubmitStatus == 'doing' ? 'status-in-progress' : 'status-not-started'">
                                        {{ exam.examSubmitStatus == 'done' ? '已提交' : exam.examSubmitStatus == 'doing' ?
                                            '考试中' : '未参加' }}
                                    </span>
                                </div>

                                <div class="flex items-center text-gray-600 text-sm mb-4">
                                    <i class="far fa-calendar mr-1"></i>
                                    <span class="mr-4">开始: {{ formatDate(exam.examStartTime) }}</span>
                                    <i class="far fa-clock mr-1"></i>
                                    <span>结束: {{ formatDate(exam.examEndTime) }}</span>
                                </div>

                                <div class="flex items-center">
                                    <div class="mr-6">
                                        <div class="text-sm text-gray-500">提交时间</div>
                                        <div class="text-sm font-medium">
                                            {{ exam.endTime == null ? '-' : formatDate(exam.endTime) }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-gray-500">用时</div>
                                        <div class="text-sm font-medium">
                                            {{ exam.timeSpent == null ? '-' : exam.timeSpent + '分钟' }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="text-right">
                                <button @click="viewExam(exam.esId)"
                                    class="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 view-completed-exam">
                                    查看详情
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 即将开始的考试 -->
            <div ref="tabUpcoming" class="tab-content p-6 hidden">
                <div class="mb-6">
                    <!-- 示例：即将开始的考试 -->
                    <div v-for="exam in examMap['notStart']"
                        class="exam-card upcoming bg-white border border-gray-200 rounded-lg p-5 mb-4">
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <h4 class="text-lg font-bold text-gray-900 mr-3">{{ exam.examName }}</h4>
                                <span class="exam-info-badge">{{ exam.duration }}分钟</span>
                                <span class="status-badge status-upcoming ml-3">
                                    <i class="fas fa-clock mr-1"></i>
                                    即将开始
                                </span>
                            </div>

                            <div class="flex items-center text-gray-600 text-sm mb-4">
                                <i class="far fa-calendar mr-1"></i>
                                <span class="mr-4">开始: {{ formatDate(exam.examStartTime) }}</span>
                                <i class="far fa-clock mr-1"></i>
                                <span>结束: {{ formatDate(exam.examEndTime) }}</span>
                            </div>

                            <div class="flex items-center text-gray-600 text-sm">
                                <font-awesome-icon icon="fas fa-info-circle "
                                    class="mr-2 text-blue-500"></font-awesome-icon>
                                <span>距离考试开始还有 <span class="font-bold text-blue-600">
                                        {{ calculateTimeDuration(new Date(),
                                            new Date(exam.examStartTime)) }}
                                        天</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 考试规则确认模态框 -->
        <div ref="examRulesModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 hidden">
            <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <font-awesome-icon icon="fas fa-exclamation-triangle"
                            class="text-blue-500 text-2xl"></font-awesome-icon>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">考试规则确认</h3>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                        <div class="space-y-3">
                            <div class="flex items-start">
                                <font-awesome-icon icon="fas fa-clock"
                                    class="text-yellow-600 mt-1 mr-2"></font-awesome-icon>
                                <div>
                                    <p class="font-medium text-yellow-800">倒计时自动开始</p>
                                    <p class="text-yellow-700 text-sm">一旦进入考试页面，考试倒计时将立即开始，无法暂停或重置。</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <font-awesome-icon icon="fas fa-ban" class="text-red-600 mt-1 mr-2"></font-awesome-icon>
                                <div>
                                    <p class="font-medium text-yellow-800">禁止中途退出</p>
                                    <p class="text-yellow-700 text-sm">考试中途退出页面不会停止计时，倒计时结束后系统将自动提交试卷。</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <font-awesome-icon icon="fas fa-exclamation-circle"
                                    class="text-red-600 mt-1 mr-2"></font-awesome-icon>
                                <div>
                                    <p class="font-medium text-yellow-800">网络异常处理</p>
                                    <p class="text-yellow-700 text-sm">网络中断或浏览器关闭不会停止计时，请在稳定的网络环境下参加考试。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center mb-4">
                        <input type="checkbox" id="agreeRules" v-model="isChecked"
                            class="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2">
                        <label for="agreeRules" class="text-sm text-gray-700">我已阅读并理解上述考试规则，同意开始考试</label>
                    </div>
                    <div class="flex space-x-4">
                        <button id="cancelExamStart" @click="examRulesModal.classList.add('hidden')"
                            class="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                            取消
                        </button>
                        <button id="confirmExamStart" class="flex-1 btn-gradient py-3 rounded-lg text-white font-medium"
                            :disabled="!isChecked" @click="toExam()">
                            开始考试
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { getExamCourse, getCourseExamList, startExam } from '@/apis/exam/examView'
import { useRoute } from 'vue-router';
import router from '@/router';
import { formatSeason, formatDate } from '@/utils/util'

const route = useRoute()
const projectId = <number><any>route.params.projectId

const course = ref()

const examMap = ref()


const goBack = () => {
    router.push({
        name: <string>route.meta.parentName
    })
}

const btnActive = ref()
const btuUpcoming = ref()
const btnCompleted = ref()
const tabActive = ref()
const tabUpcoming = ref()
const tabCompleted = ref()
const examRulesModal = ref()
const isChecked = ref(false)

const currentExamEsId = ref()
const currentExamIndex = ref()
const checkStartExam = (doingIndex: number, esId: number) => {
    examRulesModal.value.classList.remove('hidden')
    currentExamEsId.value = esId
    currentExamIndex.value = doingIndex
}

const toExam = async () => {
    if (!currentExamEsId.value || currentExamIndex.value == null) {
        return
    }

    await startExam(currentExamEsId.value).then(res => {
        if (res.state == 200) {
            examMap.value['doing'][currentExamIndex.value] = res.data

            examRulesModal.value.classList.add('hidden')
            // 2. 生成目标路由的完整 URL
            const targetPath = router.resolve({
                name: 'examPaper', // 路由名称（推荐用 name 而非 path，更稳定）
                params: { projectId: projectId, esId: currentExamEsId.value }  // 路由参数
            }).href
            // 3. 在新标签页打开
            window.open(targetPath, '_blank')
        }
        else {
            ElMessage.error(res.message)
            return
        }
    })

    initPage()

    currentExamEsId.value = null
    currentExamIndex.value = null
}

const viewExam = (esId: number) => {
    const targetPath = router.resolve({
        name: 'examPaper', // 路由名称（推荐用 name 而非 path，更稳定）
        params: { projectId: projectId, esId: esId }  // 路由参数
    }).href
    // 3. 在新标签页打开
    window.open(targetPath, '_blank')
}

const removeActive = () => {
    btnActive.value.classList.remove('active')
    btuUpcoming.value.classList.remove('active')
    btnCompleted.value.classList.remove('active')
    tabActive.value.classList.add('hidden')
    tabUpcoming.value.classList.add('hidden')
    tabCompleted.value.classList.add('hidden')
}

const changeTab = (btnRef: Element, tabRef: Element) => {
    removeActive()
    btnRef.classList.add('active')
    tabRef.classList.remove('hidden')
}

const calculateTimeDuration = (startDate: Date, endDate: Date) => {
    const timeDiffMs = endDate.getTime() - startDate.getTime();
    const timeDiffMinutes = timeDiffMs / (1000 * 60 * 60 * 24);
    return timeDiffMinutes >= 0
        ? parseFloat(timeDiffMinutes.toFixed(0))
        : 0;
}

const initPage = () => {
    if (course.value == null) {
        getExamCourse().then(res => {
            if (res.state == 200) {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].projectId == projectId) {
                        course.value = res.data[i]
                    }
                }
            } else {
                ElMessage.warning("获取课程信息错误，请返回重试")
            }
        })
    }

    getCourseExamList(projectId).then(res => {
        if (res.state == 200) {
            examMap.value = res.data
        }
    })
}

onBeforeMount(() => {
    initPage()
})

</script>
<style scoped>
.tab-button {
    position: relative;
    padding: 12px 24px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.tab-button.active {
    color: #3b82f6;
}

.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: #3b82f6;
    border-radius: 3px 3px 0 0;
}

.tab-button:hover:not(.active) {
    background-color: #f9fafb;
    color: #4b5563;
}

.exam-card.active {
    border-left-color: #3b82f6;
    background-color: #f0f9ff;
}

.exam-card.upcoming {
    border-left-color: #f59e0b;
}

.exam-card.completed {
    border-left-color: #10b981;
}

.exam-card:hover {
    background-color: #f9fafb;
    transform: translateX(2px);
}

.btn-gradient {
    background: linear-gradient(to right, #3b82f6, #2563eb);
    transition: all 0.3s ease;
}

.btn-gradient:hover {
    background: linear-gradient(to right, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
}

.status-active {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-upcoming {
    background-color: #fef3c7;
    color: #92400e;
}

.status-completed {
    background-color: #d1fae5;
    color: #065f46;
}

.status-in-progress {
    background-color: #fef3c7;
    color: #92400e;
}

.status-not-started {
    background-color: #e5e7eb;
    color: #6b7280;
}

.status-submitted {
    background-color: #dbeafe;
    color: #1e40af;
}
</style>