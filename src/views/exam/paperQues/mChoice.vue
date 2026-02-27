<template>
    <div class="question-card p-6 border-b border-gray-200" style="border-left-color: #3b82f6;">
        <div class="mb-4">
            <div class="flex items-center mb-2">
                <span
                    class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                    {{ index }}
                </span>
                <span class="font-bold text-gray-900 mr-3">多选题</span>
                <span class="text-sm font-bold text-blue-600">{{ question.totalScore }}分</span>
            </div>
            <div class="text-gray-900 font-medium">{{ question.title }}</div>
        </div>

        <!-- 选项 -->
        <div v-if="!isFinish" class="space-y-2" id="question-options">
            <div v-for="option in question.options" @click="selectOption(option.label)"
                class="option-item p-3 border border-blue-300 rounded-lg hover:bg-blue-50"
                :class="stuResponse.includes(option.label) ? 'selected' : ''">
                <div class="flex items-center">
                    <span
                        class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold mr-3">
                        {{ option.label }}
                    </span>
                    <span class="">
                        {{ option.value }}
                    </span>
                </div>
            </div>
        </div>

        <div v-else class="space-y-2">
            <div v-for="option in question.options" class="completed-option p-3 border border-gray-200 rounded-lg"
                :class="getOptionClass(option.label)">
                <div class="flex items-center">
                    <span
                        class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold mr-3">
                        {{ option.label }}
                    </span>
                    <span class="">
                        {{ option.value }}
                    </span>
                </div>
            </div>

            <div class="mb-4 bg-gray-50 rounded-lg p-4">
                <span class="mr-2">
                    正确答案：{{ question.answer }}
                </span>
                <span class="mr-2">
                    您的答案：{{ question.response }}
                </span>
                <span class="mr-2">
                    得分：{{ question.score }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { splitByComma, arrayToCommaString } from '@/utils/util'
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

const stuResponse = ref<Array<string>>([])

const upAnswer = () => {
    if (props.isFinish) return
    updateQues(props.question).then(res => {
        if (res.state != 200) {
            ElMessage.error("数据保存错误")
        }
    })
}

const debouncedHandle = debounce(upAnswer, 2000)

const selectOption = (label: string) => {
    if (props.isFinish) return
    if (stuResponse.value.includes(label)) {
        stuResponse.value = stuResponse.value.filter(item => item != label)
    } else {
        stuResponse.value.push(label)
    }
    props.question.response = arrayToCommaString(stuResponse.value)
    debouncedHandle()
}

const getOptionClass = (label: string) => {
    let isCorrectAnswer = splitByComma(props.question.answer).includes(label)
    let isStudentAnswer = splitByComma(props.question.response).includes(label)

    let c = ''
    if (isCorrectAnswer && isStudentAnswer) {
        c += ' correct';
    } else if (isCorrectAnswer && !isStudentAnswer) {
        c += ' incorrect';
    } else if (!isCorrectAnswer && isStudentAnswer) {
        c += ' incorrect';
    } else if (isStudentAnswer) {
        c += ' selected';
    }
    return c
}

onMounted(() => {
    if (props.question.response != null) {
        stuResponse.value = splitByComma(props.question.response)
    }
})

onUnmounted(() => {
    debouncedHandle.cancel();
});


</script>
<style scoped>
.question-card {
    border-left: 4px solid transparent;
    transition: all 0.2s ease;
}

.option-item:hover {
    background-color: #f0f9ff;
}

.option-item.selected {
    background-color: #dbeafe;
    border-color: #3b82f6;
}

.option-item.correct {
    background-color: #d1fae5;
    border-color: #10b981;
}

.option-item.incorrect {
    background-color: #fee2e2;
    border-color: #ef4444;
}

.completed-option.correct {
    border-left-color: #10b981;
    background-color: #f0fdf4;
}

.completed-option.incorrect {
    border-left-color: #ef4444;
    background-color: #fef2f2;
}

.completed-option.selected {
    border-left-color: #3b82f6;
    background-color: #f0f9ff;
}
</style>