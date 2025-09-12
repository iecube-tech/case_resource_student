<template>
    <div class="ist-theam p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]" tabindex="0">
        <textpreview :content="comp.payload.question.question"></textpreview>
        <div class="scroll-mt-[80px]">
            <el-input class="w-full" type="textarea" :autosize="{ minRows: 4 }" placeholder="作答区域"
                :disabled="blockStatusDisabled"
                v-model="comp.payload.stuAnswer.answer" @blur="aiCheck">
            </el-input>
        </div>
    </div>
    <anallysisQa :comp="comp"></anallysisQa>
</template>

<script setup lang="ts">
import textpreview from '@/components/textPreview.vue'
import anallysisQa from './analysisQa.vue'

import { emitter } from '@/ts/eventBUs';

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
    // console.log("使用ai进行QA检查")
    let answer = props.comp.payload.stuAnswer.answer.trim() || ''
    if (answer == '') {
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
    console.log(result)
    let { score, full_mark, student_answer, remark } = result

    // props.comp.payload.result.showCheck = false
    props.comp.payload.question.analysis = remark
    
    let payloadStr = JSON.stringify(props.comp.payload)
    updateCompPayload(props.comp.id, payloadStr)
    
    let newScore = Math.floor(score / full_mark * props.comp.totalScore)
    updateCompScore(props.comp.id, newScore, ()=>{
        props.comp.score = newScore
    })

    if (props.comp.status == 0) {
        updateCompStatus(props.comp.id, 1, () => {
            props.comp.status = 1;
        })
    }
}


onMounted(() => {
    emitter.on("aiCheckRes", handleCheckRes)
})


</script>
<style scoped></style>