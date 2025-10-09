<template>
    <div class="ist-theam p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]" tabindex="0">
        <textpreview :content="comp.payload.question.question"></textpreview>
        <div class="scroll-mt-[80px]">
            <el-input class="w-full" type="textarea" :autosize="{ minRows: 4 }" placeholder="作答区域"
                :readonly="comp.payload.aiWaiting" :disabled="blockStatusDisabled"
                v-model="comp.payload.stuAnswer.answer" @input="debounceAnswerChange" @blur="aiCheck">
            </el-input>
        </div>
        <div class="h-8 py-2 flex items-cneter space-2" v-if="comp.payload.aiWaiting">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25 text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                </circle>
                <path class="opacity-75 text-blue-500" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <span class="text-sm text-blue-600">AI正在进行校验,请稍等...</span>
        </div>
        <anallysisQa :comp="comp" v-if="comp.needCalculate"></anallysisQa>
    </div>

</template>

<script setup lang="ts">
import textpreview from '@/components/textPreview.vue'
import anallysisQa from './analysisQa.vue'

import { emitter } from '@/ts/eventBUs';

import { debounce } from 'lodash';

import { updateCompStatus, updateCompPayload, updateCompScore } from './update'

import { useEmdV4Store } from '@/stores/emdV4TaskStore';
const emdV4Store = useEmdV4Store()

import { aiCheckStore } from '@/stores/aiCheckStore';
const checkStore = aiCheckStore()

const props = defineProps({
    index: Number,
    comp: Object,
})

const blockStatusDisabled = computed(() => {
    let blockStatus = emdV4Store.getBlockStatusByComponentId(props.comp.id)
    let f = blockStatus == 1
    return f
})

const aiCheck = () => {
    // 组件不需要计算分数，直接保存学生回答内容，
    if (props.comp.needCalculate == false || props.comp.totalScore == 0) {
        let payloadStr = JSON.stringify(props.comp.payload)
        updateCompPayload(props.comp.id, payloadStr)

        if (props.comp.status == 0) {
            updateCompStatus(props.comp.id, 1, () => {
                props.comp.status = 1;
            })
        }
        return
    }

    props.comp.payload.aiWaiting = true

    // console.log("使用ai进行QA检查")
    let answer = props.comp.payload.stuAnswer.answer.trim() || ''
    if (answer == '') {
        resetCompParams()
        return
    }

    const markerQuestion = {
        id: props.comp.id,
        stage: getStageText(props.comp.stage),
        question: props.comp.payload!.question.question,
        images: [],
        answer: props.comp.payload!.question.answer,
        tag: props.comp.payload!.question.tag,
        analysis: props.comp.payload!.question.analysis,
        hint_when_wrong: props.comp.payload!.question.hintWhenWrong,
    }
    const markerQo = {
        chatId: checkStore.getCheckId,
        sectionPrefix: checkStore.getSectionPrefix,
        stuInput: answer,
        imgDataurls: [],
        scene: markerQuestion.stage,
        question: markerQuestion
    }

    checkStore.addNeedCheckItem(markerQo)  //添加到队列中
}


const getStageText = (stage) => {
    let map = {
        0: 'before-class',
        1: 'experiment',
        2: 'after-class'
    }
    let text = map[stage] || '';
    return text;
}

const handleCheckRes = (result: any) => {
    // console.log(result)
    let { question, score, full_mark, student_answer, remark } = result
    if (question.id == props.comp.id) {
        props.comp.payload.question.analysis = remark
        props.comp.payload.aiWaiting = false

        let payloadStr = JSON.stringify(props.comp.payload)
        updateCompPayload(props.comp.id, payloadStr)

        let newScore = Math.floor(score / full_mark * props.comp.totalScore)
        updateCompScore(props.comp.id, newScore, () => {
            props.comp.score = newScore
        })

        if (props.comp.status == 0) {
            updateCompStatus(props.comp.id, 1, () => {
                props.comp.status = 1;
            })
        }
    }
}
const handleAnswerChange = (v) => {
    let str = v.trim()
    if (str == '') {
        resetCompParams();
    }
}

const debounceAnswerChange = debounce(handleAnswerChange, 200)
const resetCompParams = () => {
    props.comp.payload.stuAnswer.answer = ''
    props.comp.payload.question.analysis = ''
    props.comp.payload.aiWaiting = false
    let payloadStr = JSON.stringify(props.comp.payload)

    updateCompPayload(props.comp.id, payloadStr)

    if (props.comp.score != 0) {
        updateCompScore(props.comp.id, 0, () => {
            props.comp.score = 0
        })
    }

    if (props.comp.status == 1) {
        updateCompStatus(props.comp.id, 0, () => {
            props.comp.status = 0
        })
    }
}


onMounted(() => {
    emitter.on("aiCheckRes", handleCheckRes)
})


</script>
<style scoped></style>