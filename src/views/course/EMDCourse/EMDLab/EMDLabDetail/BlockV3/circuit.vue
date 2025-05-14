<template>
    <div
        class="ist-theam my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px] min-h-[200px] flex flex-row justify-center items-center">
        <button
            class="btn bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow-md flex items-center mx-auto">
            电路检查
        </button>
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