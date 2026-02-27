<template>
    <!-- 简化导航栏 -->
    <nav class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-center items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-lg font-semibold text-gray-900">我的考试</h1>
                </div>
                <div class="absolute right-4">
                    <span class="text-sm text-gray-600">欢迎，
                        <span id="student-name" v-if="examStudent">
                            {{ examStudent.stuName }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </nav>
    <div v-if="examInfo" id="page-exam-taking" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2" id="exam-taking-title">{{ examInfo.examName }}
                    </h2>
                    <div class="flex items-center space-x-4 text-gray-600">
                        <span class="text-sm">课程: <span id="exam-taking-course">{{ examInfo.projectName }}</span></span>
                        <span v-if="!isTimeout" class="text-sm">考试时长:
                            <span id="exam-taking-duration">
                                {{ examInfo.duration }}分钟
                            </span>
                        </span>


                        <div v-else class="flex items-center">
                            <div class="mr-6 flex">
                                <div class="text-sm text-gray-500 mr-2">提交时间: </div>
                                <div class="text-sm font-medium">{{ formatDate(examStudent.endTime) }}</div>
                            </div>
                            <div class="flex">
                                <div class="text-sm text-gray-500 mr-2">用时: </div>
                                <div class="text-sm font-medium">
                                    {{ calculateMin(examStudent.endTime, examStudent.startTime) }}
                                    分钟
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <!-- 倒计时 -->
                    <div v-if="!isTimeout" class="countdown-card p-4">
                        <div class="text-sm opacity-80">剩余时间</div>
                        <div id="exam-timer" class="text-2xl font-bold mt-1 timer">{{ remainingTime }}</div>
                    </div>

                    <button id="back-to-exam-list" @click="goBack()"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                        <font-awesome-icon icon="fas fa-arrow-left" class="mr-2"></font-awesome-icon>
                        返回考试列表
                    </button>
                </div>
            </div>
        </div>

        <!-- 考试说明 -->
        <div v-if="examInfo && !isTimeout" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">考试说明</h3>
            <ul class="text-gray-600 space-y-2">
                <li class="flex items-start">
                    <font-awesome-icon icon="fas fa-info-circle" class="text-blue-500 mt-1 mr-2"></font-awesome-icon>
                    <span>考试总时长为 <span class="font-bold">{{ examInfo.duration }}分钟</span>，请在规定时间内完成所有题目并提交</span>
                </li>
                <li class="flex items-start">
                    <font-awesome-icon icon="fas fa-info-circle" class="text-blue-500 mt-1 mr-2"></font-awesome-icon>
                    <span>考试一旦开始，计时器将自动启动，请合理安排时间</span>
                </li>
                <li class="flex items-start">
                    <font-awesome-icon icon="fas fa-info-circle" class="text-blue-500 mt-1 mr-2"></font-awesome-icon>
                    <span>中途离开考试页面倒计时不会停止，倒计时归零后会自动提交，请务必完成后再离开</span>
                </li>
            </ul>
        </div>

        <!-- 题目列表 -->
        <div v-if="paperList" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
            id="exam-questions-container">
            <div v-for="(item, index) in paperList">
                <qa v-if="item.quesType == 'QA'" :index="<number>index + 1" :question="item" :is-finish="isTimeout"
                    :show-stu-score="false"></qa>
                <choice v-if="item.quesType == 'CHOICE'" :index="<number>index + 1" :question="item"
                    :is-finish="isTimeout" :show-stu-score="false"></choice>
                <mChoice v-if="item.quesType == 'MultipleCHOICE'" :index="<number>index + 1" :question="item"
                    :is-finish="isTimeout" :show-stu-score="false"></mChoice>
            </div>
        </div>

        <!-- 答题进度和提交按钮 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between">
                <div class="mb-4 md:mb-0">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">答题进度</h3>
                    <div class="flex items-center">
                        <div class="w-64 bg-gray-200 rounded-full h-2.5 mr-4">
                            <div id="progress-bar" class="bg-blue-600 h-2.5 rounded-full" :style="perWidth"></div>
                        </div>
                        <span id="progress-text" class="text-sm text-gray-600">
                            {{ nonEmptyResponseCount }}/{{ paperList.length }} 题已作答
                        </span>
                    </div>
                </div>

                <div class="flex space-x-4">
                    <button v-if="!isTimeout" id="submit-exam" @click="showSubmitModal()"
                        class="btn-gradient inline-flex items-center px-8 py-2.5 rounded-lg text-white font-medium">
                        <font-awesome-icon icon="fas fa-paper-plane" class="mr-2"></font-awesome-icon>
                        提交试卷
                    </button>

                    <div v-else>
                        <span class="mr-2">
                            得分:
                        </span>
                        <span class="text-2xl font-bold text-blue-600">
                            {{ examStudent.score }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="isTimeout" class="my-4 bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-600 mb-2">教师评价：</div>
                <div class="text-gray-800 whitespace-pre-wrap">
                    {{ examStudent.remark }}
                </div>
            </div>
        </div>
    </div>

    <!-- 提交确认模态框 -->
    <div ref="submitModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 hidden">
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div class="text-center">
                <div class="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <font-awesome-icon icon="fas fa-exclamation-triangle"
                        class="text-yellow-500 text-2xl"></font-awesome-icon>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">确认提交试卷</h3>
                <p class="text-gray-600 mb-4">提交后无法再次修改答案，确定要提交吗？</p>
                <p v-if="nonEmptyResponseCount < paperList.length" id="unanswered-count"
                    class="text-red-600 font-medium mb-6">
                    还有 {{ paperList.length - nonEmptyResponseCount }} 道题未作答
                </p>
                <div class="flex space-x-4">
                    <button id="cancel-submit" @click="submitModal.classList.add('hidden')"
                        class="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        取消
                    </button>
                    <button id="confirm-submit" class="flex-1 btn-gradient py-2.5 rounded-lg text-white"
                        @click="submit()">
                        确认提交
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getExamPaper, updateQues, submitExam } from '@/apis/exam/examView';
import qa from './paperQues/qa.vue';
import choice from './paperQues/choice.vue';
import mChoice from './paperQues/mChoice.vue';
import { formatDate } from '@/utils/util'
import router from '@/router';

const route = useRoute();


const esId = <number><any>route.params.esId

const examInfo = ref()
const examStudent = ref()
const paperList = ref<any[]>([])

// 剩余时间显示
const remainingTime = ref('00:00:00')
// 新增：标识是否超时（当前时间超过开始时间+持续时长）
const isTimeout = ref(false)
// 定时器标识
let timer = <any | null>null

const submitModal = ref()


// 2. 计算属性：实时计算response非空的个数
const nonEmptyResponseCount = computed<number>(() => {
    // 过滤条件：response 不为 ''/null/undefined
    return paperList.value.filter(item => {
        return item.response !== '' && item.response !== null && item.response !== undefined;
    }).length;
});

const perWidth = computed<string>(() => {
    return "width:" + (nonEmptyResponseCount.value / paperList.value.length) * 100 + '%'
})


const showSubmitModal = () => {
    submitModal.value.classList.remove('hidden')
}

const submit = () => {
    submitExam(esId).then(res => {
        if (res.state == 200) {
            clearInterval(timer)
            timer = null
            isTimeout.value = true
            submitModal.value.classList.add('hidden')
        } else {
            ElMessage.error(res.message)
        }
    })
}

const goBack = () => {
    router.push({
        name: <string>route.meta.parentName,
        params: {
            projectId: route.params.projectId
        }
    })
}

const calculateMin = (endTime: string | Date, startTime: string | Date) => {
    let times = new Date(endTime).getTime() - new Date(startTime).getTime()
    return Math.floor(times / 60000)
}

/**
 * 格式化秒数为 HH:mm:ss 格式
 * @param {number} seconds - 总秒数
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (seconds: any) => {
    if (seconds <= 0) return '00:00:00'

    // 计算小时、分钟、秒
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    // 补零操作，确保两位数
    const format = (num: any) => num.toString().padStart(2, '0')

    return `${format(hours)}:${format(minutes)}:${format(secs)}`
}

/**
 * 计算并更新剩余时间
 * @param {Date|String} startTime - 开始时间
 * @param {number} durationMinutes - 持续时间（分钟）
 */
const calculateRemainingTime = (startTime: Date | String, durationMinutes: number) => {
    // 处理开始时间参数，统一转为 Date 对象
    let startDate
    if (typeof startTime === 'string') {
        startDate = new Date(startTime)
    } else if (startTime instanceof Date) {
        startDate = startTime
    } else {
        console.error('开始时间格式错误，必须是 Date 或 String 类型')
        remainingTime.value = '00:00:00'
        isTimeout.value = true // 格式错误时标记为超时
        return
    }

    // 计算结束时间（开始时间 + 持续分钟数）
    const endTime = new Date(startDate.getTime() + durationMinutes * 60 * 1000)

    // 定义更新剩余时间的函数
    const updateTime = () => {
        const now = new Date()
        // 计算剩余毫秒数
        let remainingMs = endTime.getTime() - now.getTime()
        // 转换为秒数（取整）
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))

        // 核心更新：实时修改 isTimeout 状态
        isTimeout.value = remainingSeconds <= 0
        // 格式化并更新剩余时间显示
        remainingTime.value = formatTime(remainingSeconds)

        // 如果已超时，清除定时器
        if (isTimeout.value && timer) {
            clearInterval(timer)
            timer = null
        }
    }

    // 立即执行一次，避免初始延迟
    updateTime()

    // 清除之前的定时器（防止重复创建）
    if (timer) clearInterval(timer)

    // 创建新的定时器，每秒更新一次
    timer = setInterval(updateTime, 1000)
}

onBeforeMount(async () => {
    await getExamPaper(esId).then(res => {
        if (res.state == 200) {
            examInfo.value = res.data.examInfo
            examStudent.value = res.data.examStudent
            paperList.value = res.data.examPapers
            if (examStudent.value.endTime == null) {
                calculateRemainingTime(examStudent.value.startTime, examInfo.value.duration)
            } else {
                isTimeout.value = true
            }

            // 关键：等待 DOM 渲染完成后，手动更新 html 高度
            nextTick(() => {
                const htmlEl = document.documentElement;
                // 让 html 高度等于内容的实际滚动高度
                htmlEl.style.height = `${htmlEl.scrollHeight + 40}px`;
            });
        }
    })
})


// 组件挂载时示例调用
onMounted(() => {
    // 示例1：开始时间为当前时间，持续1分钟（便于测试超时状态）
    // calculateRemainingTime(new Date(), 1)

    // 示例2：开始时间为字符串格式，持续2分钟
    // calculateRemainingTime('2026-02-25 15:30:00', 2)
})

// 组件卸载时清除定时器
onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})



</script>
<style scoped>
.btn-gradient {
    background: linear-gradient(to right, #3b82f6, #2563eb);
    transition: all 0.3s ease;
}

.btn-gradient:hover {
    background: linear-gradient(to right, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

.countdown-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
}
</style>