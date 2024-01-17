<template>
    <div>
        <div v-for="i in questionVoList.length" style="margin-top: 20px;">
            <el-row style="display: flex; align-items: center;">
                <el-col :span="1" style="color: var(--el-color-primary);">
                    <span v-if="questionVoList[i - 1].multipleChoices">[多选]</span>
                    <span v-else>[单选]</span>
                </el-col>
                <el-col :span="23">
                    <el-input v-model="questionVoList[i - 1].name" type="primary" disabled></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-col :span="1"></el-col>
                <el-col :span="23">
                    <div v-if="questionVoList[i - 1].multipleChoices">
                        <el-checkbox-group v-model="questionVoList[i - 1].answer" :disabled="isDisabled()">
                            <el-checkbox :class="getClass(i - 1, j - 1)" v-for="j in questionVoList[i - 1].solutions.length"
                                :key="j" :label="questionVoList[i - 1].solutions[j - 1].id">
                                {{ questionVoList[i - 1].solutions[j - 1].name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div v-else>
                        <el-radio-group v-model="questionVoList[i - 1].answer[0]" :disabled="isDisabled()">
                            <el-radio :class="getClass(i - 1, j - 1)" v-for="j in questionVoList[i - 1].solutions.length"
                                :key="j" :label="questionVoList[i - 1].solutions[j - 1].id">
                                {{ questionVoList[i - 1].solutions[j - 1].name }}
                            </el-radio>

                        </el-radio-group>
                    </div>
                </el-col>
            </el-row>

            <el-row v-if="questionVoList[i - 1].result == false" style="margin-top: 20px;">
                <el-col :span="1">

                </el-col>
                <el-col :span="23">
                    <el-row>
                        <span style="color: var(--el-color-primary); margin-right: 10px;">[题目解析:] </span>
                        <span>{{ questionVoList[i - 1].solve }}</span>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <el-row v-if="questionVoList.length > 0" style="margin-top: 20px; display: flex; justify-content: center;">
            <el-button v-if="questionVoList[0].result == null" type="primary" @click="submitAnswer">提交</el-button>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { getQuestion } from '@/apis/questionBank/getQuestion';
import { ElMessage } from 'element-plus';
import { sAnswer } from '@/apis/questionBank/submitAnswer';

interface solution {
    id: number,
    questionId: number,
    name: string,
}

interface questionVo {
    id: number,
    name: string,
    solve: string,
    difficulty: number,
    multipleChoices: boolean,
    solutions: Array<solution>,
    result: boolean,
    answer: Array<Number>,
    realAnswer: Array<Number>,
}

const props = defineProps({
    indexValue: Number,
    taskName: String,
    pstId: Number,
})

const emit = defineEmits(['changePage'])

const changePage = (states: number, page?: number) => {
    emit("changePage", states, page)
}

const getQuestions = () => {
    getQuestion(<any>props.pstId).then(res => {
        questionVoList.value = res.data
    })
}

const questionVoList = ref<Array<questionVo>>([])

const isDisabled = () => {
    if (questionVoList.value[0].result == null) {
        return false
    }
    return true
}

const submitAnswer = () => {
    let answers = []
    for (let i = 0; i < questionVoList.value.length; i++) {
        if (questionVoList.value[i].answer.length == 0) {
            ElMessage.warning("请作答所有题目")
            return
        }
        let answer = {
            pstQuestionId: questionVoList.value[i].id,
            answer: questionVoList.value[i].answer
        }
        answers.push(Object.assign({}, answer))
    }
    console.log(answers)
    sAnswer(answers, <any>props.pstId).then(res => {
        if (res.state == 200) {
            questionVoList.value = res.data
        }
    })
}

const getClass = (i: number, j: number) => {
    if (questionVoList.value[i].result != null) {
        // 是正确答案 且选择了
        if (questionVoList.value[i].realAnswer.includes(questionVoList.value[i].solutions[j].id) && questionVoList.value[i].answer.includes(questionVoList.value[i].solutions[j].id)) {
            return 'aa'
        }

        // 是正确答案 没有选
        if (questionVoList.value[i].realAnswer.includes(questionVoList.value[i].solutions[j].id) && !questionVoList.value[i].answer.includes(questionVoList.value[i].solutions[j].id)) {
            return 'bb'
        }

        // 不是正确答案 选择了
        if (!questionVoList.value[i].realAnswer.includes(questionVoList.value[i].solutions[j].id) && questionVoList.value[i].answer.includes(questionVoList.value[i].solutions[j].id)) {
            return 'cc'
        }
    }

}

onBeforeMount(() => {
    getQuestions()

})
</script>
<style scoped>
.question {
    background-color: #ffffff;
    padding: 30px 3.125vw;
    display: flex;
    flex-direction: column;
}

.question-moudel {
    padding: 20px 0;
}

.question-module-title {
    color: #33b8b9;
    font-size: 24px;
    padding: 10px 0;
}

.aa :deep() .el-radio__inner {
    background-color: var(--el-color-primary) !important;
    border-color: var(--el-color-primary) !important;
}

.aa :deep() .el-radio__inner::after {
    background-color: var(--el-color-white) !important;
}

.aa :deep() .el-radio__label {
    color: var(--el-color-primary) !important;
}


.bb :deep() .el-radio__inner {
    background-color: var(--el-color-success) !important;
    border-color: var(--el-color-success) !important;
}

.bb :deep() .el-radio__inner {
    background-color: var(--el-color-white) !important;
}

.bb :deep() .el-radio__label {
    color: var(--el-color-success) !important;
}


.cc :deep() .el-radio__inner {
    background-color: var(--el-color-danger) !important;
    border-color: var(--el-color-danger) !important;
}

.cc :deep() .el-radio__inner::after {
    background-color: var(--el-color-white) !important;
}

.cc :deep() .el-radio__label {
    color: var(--el-color-danger) !important;
}



.aa :deep() .el-checkbox__inner {
    background-color: var(--el-color-primary) !important;
    border-color: var(--el-color-primary) !important;
}


.aa :deep() .el-checkbox__inner::after {
    /* background-color: var(--el-color-primary) !important; */
    border-color: var(--el-color-white) !important;
}

.aa :deep() .el-checkbox__label {
    color: var(--el-color-primary) !important;
}

.bb :deep() .el-checkbox__inner {
    background-color: var(--el-color-white) !important;
    border-color: var(--el-color-success) !important;
}

.bb :deep() .el-checkbox__label {
    color: var(--el-color-success) !important;
}

.cc :deep() .el-checkbox__inner {
    background-color: var(--el-color-danger) !important;
    border-color: var(--el-color-danger) !important;
}

.cc :deep() .el-checkbox__label {
    color: var(--el-color-danger) !important;
}
</style>