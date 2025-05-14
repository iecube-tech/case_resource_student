<template>
    <div v-if="payload?.question"
        class="ist-theam my-4 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]" tabindex="0">
        <textpreview :content="payload.question.question"></textpreview>
        <div v-if="payload.stuAnswer" :id="payload.stuAnswer.id" class="flex flex-col">
            <el-radio-group class="flex flex-col items-start scroll-mt-[80px]" v-model="payload.stuAnswer.answer"
                @change="cellChanged(payload.stuAnswer.id)" style="align-items: start;">
                <el-radio class="rounded hover:bg-gray-100" v-for="item in payload.question.options"
                    :label="item.label">
                    <div class="flex items-center nomr">
                        <span class="mr-2">{{ item.label }}.</span>
                        <textpreview class="scroll-mt-[80px]" :content="item.value"></textpreview>
                    </div>
                </el-radio>
            </el-radio-group>
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
    blockVo: Object
})

const payload = ref<PAYLOAD>()
const labStore = useEmdStore()
const blockDetail = ref<blockVo>()

const cellChanged = async (cellId: string) => {
    console.log("change" + cellId)
    console.log(payload.value)
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