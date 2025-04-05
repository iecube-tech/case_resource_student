<template>
    <div v-if="payload" ref="qaRef" :id="'block' + blockDetail.id"
        class="qa-privew mt-6 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]">
        <TextPreview :id="'block-' + generateShortUUID(blockDetail.id)" class="ist-theam scroll-mt-[80px]"
            :content="payload.question == '' ? '问题' : payload.question">
        </TextPreview>
        <div v-if="payload.cell.isInput && !payload.cell.autoGet" :id="payload.cell.id" style="padding: 5px; "
            class="scroll-mt-[80px]">
            <el-input style="width: 100%;" type="textarea" :autosize="{ minRows: 4 }" placeholder="作答区域"
                v-model="payload.cell.stuValue[payload.cell.type]" @change="cellChanged(payload.cell.id)">
            </el-input>
        </div>
        <div v-if="payload.cell.isInput && payload.cell.autoGet" :id="payload.cell.id" style="padding: 5px;"
            class="scroll-mt-[80px]">
            <el-row>
                <el-col :span="18">
                    <el-input style="width: 100%;" type="textarea" autosize placeholder="作答区域" disabled
                        v-model="payload.cell.stuValue[payload.cell.type]" @change="cellChanged(payload.cell.id)">
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button>获取数据</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { generateShortUUID, upCell, type PAYLOAD, type blockVo } from '../EMDLab';
import TextPreview from '../../textPreview/textPreview.vue';
import { useEmdStore } from '@/stores/emdLabStore';

const props = defineProps({
    blockVo: Object
})

const qaRef = ref()
const labStore = useEmdStore()
const blockDetail = ref<blockVo>({
    id: 0,
    STSId: 0,
    status: 0,
    sort: 0,
    type: '',
    title: '',
    content: '',
    catalogue: '',
    payload: ''
})

const payload = ref<PAYLOAD | null>()

const handleFocus = (cell: any) => {
}


const cellChanged = async (cellId: string) => {
    console.log("change" + cellId)
    console.log(payload.value)
    blockDetail.value.payload = JSON.stringify(payload.value)
    await upCell(blockDetail.value, labStore.getTaskId, cellId)
}


onMounted(() => {
    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value) {
        payload.value = JSON.parse(blockDetail.value.payload)
    }
})
</script>
<style scoped>
.a {
    background-color: #adf2d872;
}
</style>