<template>
    <div class="ist-theam p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]" tabindex="0">
        <textpreview :content="comp.payload.question.question"></textpreview>
        <div class="scroll-mt-[80px]">
            <el-input class="w-full" type="textarea" :autosize="{ minRows: 4 }" placeholder="作答区域"
                v-model="comp.payload.stuAnswer.answer" @change="handleChange">
            </el-input>
        </div>
    </div>
</template>

<script setup lang="ts">
import textpreview from '@/components/textPreview.vue'

import { updateCompStatus, updateCompPayload } from './update'

const props = defineProps({
    index: Number,
    comp: Object,
})

const handleChange = () => {
    if (comp.payload.stuAnswer.answer.length > 0) {
        if (props.comp.status == 0) {
            updateCompStatus(props.comp.id, 1, () => {
                props.comp.status = 1;
            })
        }
    } else {
        if (props.comp.status == 1) {
            updateCompStatus(props.comp.id, 0, () => {
                props.comp.status = 1;
            })
        }
    }

    let payloadStr = JSON.stringify(props.comp.payload)
    updateCompPayload(props.comp.id, payloadStr)
}


</script>
<style scoped></style>