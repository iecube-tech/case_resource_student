<template>
    <div class="question-card p-6 border-b border-gray-200" style="border-left-color: #8b5cf6;">
        <div class="mb-4">
            <div class="flex items-center mb-2">
                <span
                    class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">
                    {{ index }}
                </span>
                <span class="font-bold text-gray-900 mr-3">简答题</span>
                <span class="text-sm font-bold text-purple-600">{{ question.totalScore }}分</span>
            </div>
            <div class="text-gray-900 font-medium">{{ question.title }}</div>
        </div>

        <!-- 答案输入框 -->
        <div class="mb-4">
            <textarea id="short-answer"
                class="w-full h-40 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入您的答案..." v-model="question.response" :readonly="isFinish"
                @change="debouncedHandle"></textarea>
        </div>

        <!-- 学生答案 -->
        <div v-if="isFinish" class="mb-4 bg-gray-50 rounded-lg p-4">
            <div>
                得分：{{ question.score }}
            </div>
            <div class="text-sm text-gray-600 mb-2">参考答案</div>
            <div class="text-gray-800 whitespace-pre-wrap">
                {{ question.answer }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { updateQues } from '@/apis/exam/examView';
import { debounce } from 'lodash'
const props = defineProps({
    index: {
        type: [Number, String],
        required: true
    },
    question: {
        type: Object,
        required: true
    },
    isFinish: {
        type: Boolean,
        required: true
    },
    showStuScore: {
        type: Boolean,
        required: false
    }
})


const upAnswer = () => {
    if (props.isFinish) return
    updateQues(props.question).then(res => {
        if (res.state != 200) {
            ElMessage.error("数据保存错误")
        }
    })
}

const debouncedHandle = debounce(upAnswer, 2000)

onUnmounted(() => {
    debouncedHandle.cancel()
})

</script>
<style scoped>
.question-card {
    border-left: 4px solid transparent;
    transition: all 0.2s ease;
}
</style>