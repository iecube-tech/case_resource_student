<template>
    <div v-if="payload" class="ist-theam my-4 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]"
        tabindex="0">
        <textpreview :id="payload.question?.id" :content="payload.question?.question"></textpreview>
        <div v-if="payload.stuAnswer" class="scroll-mt-[80px]">
            <el-input :id="payload.stuAnswer.id" class="w-full" type="textarea" :autosize="{ minRows: 4 }"
                :readonly="props.status == 1" placeholder="作答区域" v-model="payload.stuAnswer.answer"
                @change="cellChanged(payload.stuAnswer.id)">
            </el-input>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type PAYLOAD, type blockVo, upCell } from '../EMDLabV4';
import textpreview from '../../textPreview/textPreview.vue'
import { useEmdStore } from '@/stores/emdLabStore';
const props = defineProps({
    blockVo: Object,
    status: Number
})

const payload = ref<PAYLOAD>()
const labStore = useEmdStore()
const blockDetail = ref<blockVo>()
// {
//     id:0,
//     STSId: 0,
//     status:0,
//     sort:0,
//     type: '',
//     title: '',
//     content: '',
//     catalogue: '',
//     payload: '',
// }

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