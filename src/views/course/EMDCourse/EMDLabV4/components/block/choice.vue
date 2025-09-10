<template>
    <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
        <textpreview :content="question"></textpreview>
        <el-radio-group v-model="comp.payload.stuAnswer.answer"
         :disabled="sectionDisabled || blockStatusDisabled"
         @change="handleChange"
            class="flex flex-col !items-start mt-2">
            <el-radio class="rounded mt-2" v-for="item in comp.payload.question.options" :label="item.label"
                :value="item.label">
                <div class="flex items-center justify-start">
                    <span class="mr-2">{{ item.label }}.</span>
                    <textpreview :content="item.value"></textpreview>
                </div>
            </el-radio>
        </el-radio-group>
        <analysis :comp="comp"></analysis>
    </div>
    
</template>

<script setup lang="ts">
import textpreview from '@/components/textPreview.vue'
import analysis from './analysis.vue'

import { updateCompStatus, updateCompPayload, updateCompScore } from './update'

import { useEmdV4Store } from '@/stores/emdV4TaskStore';
const emdV4Store = useEmdV4Store()

const props = defineProps({
    index: Number,
    comp: Object,
    sectionDisabled: Boolean,
})

const blockStatusDisabled = computed(()=> {
    let blockStatus = emdV4Store.getBlockStatusByComponentId(props.comp.id)
    let f = blockStatus == 1
    return f
})

// console.log('props.comp', props.comp.payload)

const question = computed(() => {
    let prefix = ''
    if (props.index > 0) {
        prefix = props.index + '.'
    }
    let text = prefix + props.comp.payload.question.question
    return text;
})

const handleChange = () => {
    if (props.comp.payload.stuAnswer.answer.length > 0) {
        if (props.comp.status == 0) {
            updateCompStatus(props.comp.id, 1, () => {
                props.comp.status = 1;
            })
        }
    } else {
        if (props.comp.status == 1) {
            updateCompStatus(props.comp.id, 0, () => {
                props.comp.status = 0;
            })
        }
    }

    let payloadStr = JSON.stringify(props.comp.payload)
    updateCompPayload(props.comp.id, payloadStr)

    updateScore()
}

// 单选组件得分函数
const updateScore = () => {

    let needCalculate = props.comp.needCalculate
    if (!needCalculate) {
        return
    }
    let answerOption = props.comp.payload.question.answer
    let studentAnswerOption = props.comp.payload.stuAnswer.answer
    let equal = answerOption == studentAnswerOption

    let totalScore = props.comp.totalScore
    // 学生得分
    let score = props.comp.score

    if (equal) {
        if (score != totalScore) {
            updateCompScore(props.comp.id, totalScore, () => {
                props.comp.score = totalScore;
            })
        }
    } else {
        if (score != 0) {
            updateCompScore(props.comp.id, 0, () => {
                props.comp.score = 0;
            })
        }
    }
}

</script>
<style scoped>

</style>