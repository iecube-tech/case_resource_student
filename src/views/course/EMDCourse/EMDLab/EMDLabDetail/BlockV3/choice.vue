<template>
    <div v-if="payload?.question"
        class="ist-theam my-4 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]" tabindex="0">
        <textpreview :content="payload.question.question"></textpreview>
        <div v-if="payload.stuAnswer" :id="payload.stuAnswer.id" class="flex flex-col">
            <el-radio-group class="flex flex-col items-start scroll-mt-[80px]" v-model="payload.stuAnswer.answer"
                @change="cellChanged(payload.stuAnswer.id)" style="align-items: start;" :disabled="props.status == 1">
                <el-radio class="rounded hover:bg-gray-100" v-for="item in payload.question.options"
                    :label="item.label">
                    <div class="flex items-center nomr">
                        <span class="mr-2">{{ item.label }}.</span>
                        <textpreview class="scroll-mt-[80px]" :content="item.value"></textpreview>
                    </div>
                </el-radio>
            </el-radio-group>
        </div>
        <div v-if="props.status == 1 && payload.result?.score != null">
            <div v-if="payload.result.score == payload.result.full_mark"
                class="w-full bg-green-100 p-4 border-l-4 border-green-500 text-green-900">
                <font-awesome-icon icon="fa-solid fa-check-double" class="mr-4" />
                <span>
                    回答正确！
                </span>
            </div>
            <div v-if="payload.result.score < payload.result.full_mark"
                class="w-full bg-red-100 p-4 border-l-4 border-red-500">
                <div class="mb-4 flex flex-row items-center text-red-900">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="mr-4" />
                    <span>
                        回答错误！
                    </span>
                </div>
                <div class="mb-4 text-red-700">
                    <textpreview :content="payload.question.analysis"></textpreview>
                </div>
            </div>
        </div>
        <div v-else-if="props.status == 1 && payload.result?.score == null && !payload.stuAnswer?.answer">
            <div class="w-full bg-red-100 p-4 border-l-4 border-red-500">
                <div class="mb-4 flex flex-row items-center text-red-900">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="mr-4" />
                    <span>
                        回答错误！
                    </span>
                </div>
                <div class="mb-4 text-red-700">
                    <textpreview :content="payload.question.analysis"></textpreview>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type PAYLOAD, type blockVo } from '../EMDLabV3';
import { upCell } from '../EMDLab';
import textpreview from '../../textPreview/textPreview.vue'
import { useEmdStore } from '@/stores/emdLabStore';
const props = defineProps({
    blockVo: Object,
    status: Number
})

const payload = ref<PAYLOAD>()
const labStore = useEmdStore()
const blockDetail = ref<blockVo>()

const cellChanged = async (cellId: string) => {
    // 校验答案
    payload.value!.result!.datetime = Date.now().toLocaleString()
    payload.value!.result!.student_answer = payload.value!.stuAnswer!.answer
    payload.value!.result!.full_mark = payload.value!.question?.score
    payload.value!.result!.remark = ''
    if (payload.value?.question?.answer == payload.value?.stuAnswer?.answer) {
        payload.value!.result!.score = payload.value!.question?.score
    } else {
        payload.value!.result!.score = 0
    }
    payload.value!.stuAnswer!.datetime = Date.now().toLocaleString()
    blockDetail.value!.payload = JSON.stringify(payload.value)
    await upCell(blockDetail.value, labStore.getTaskId, cellId)
}

onMounted(() => {
    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value) {
        payload.value = JSON.parse(blockDetail.value.payload)
    }
})
</script>
<style scoped></style>