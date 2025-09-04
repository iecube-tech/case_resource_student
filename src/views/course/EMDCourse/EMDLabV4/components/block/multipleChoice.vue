<template>
    <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
        <textpreview :content="question"></textpreview>
        <el-checkbox-group class="flex flex-col !items-start mt-2" v-model="comp.payload.stuAnswer.answerOption"
            @change="handleChange">
            <el-checkbox class="rounded mt-2" v-for="item in comp.payload.question.options" :label="item.label">
                <div class="flex items-center justify-start">
                    <span class="mr-2">{{ item.label }}.</span>
                    <textpreview :content="item.value"></textpreview>
                </div>
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script setup lang="ts">
import textpreview from "@/components/textPreview.vue";

import { updateCompStatus, updateCompPayload } from './update'

const props = defineProps({
    index: Number,
    comp: Object,
});

const question = computed(() => {
    let prefix = ''
    if (props.index > 0) {
        prefix = props.index + '.'
    }
    let text = prefix + props.comp.payload.question.question
    return text;
})

const handleChange = () => {
    if (props.comp.payload.stuAnswer.answerOption.length > 0) {
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

<style scoped>
:deep(.el-checkbox__label) {
    height: 20px;
    line-height: 20px;
}
</style>
