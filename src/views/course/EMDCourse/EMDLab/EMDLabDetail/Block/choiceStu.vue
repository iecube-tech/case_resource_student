<template>
    <div v-if="payload" ref="choiceRef" :id="'block' + blockDetail.id"
        class="ist-theam mt-6 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500 scroll-mt-[80px]" tabindex="0"
        @focus="handleFocus(payload.cell)">
        <TextPreview :id="'block-' + generateShortUUID(blockDetail.id)"
            :content="payload.question == '' ? '问题' : payload.question">
        </TextPreview>
        <div v-if="payload.isMultiple">
            <el-checkbox-group class="select-item scroll-mt-[80px]" :id="payload.cell.id"
                v-model="payload.cell.stuValue.array" @change="cellChanged(payload.cell.id)">
                <el-checkbox class=" rounded hover:bg-gray-100" v-for="(item, i) in payload.options"
                    :key="'check-' + blockDetail.id + '-' + i" :label="item" style="height: auto;">
                    <TextPreview :id="'option-' + blockDetail.id + '-check-' + i" :content="item"
                        class="scroll-mt-[80px]" />
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div v-else>
            <el-radio-group class="select-item scroll-mt-[80px]" :id="payload.cell.id"
                v-model="payload.cell.stuValue.array[0]" @change="cellChanged(payload.cell.id)">
                <el-radio class="rounded hover:bg-gray-100" v-for="(item, i) in payload.options" :label="item"
                    style="height: auto;">
                    <TextPreview :id="'option-' + blockDetail.id + '-radio-' + i" :content="item"
                        class="scroll-mt-[80px]" />
                </el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { generateShortUUID, type PAYLOAD, type blockVo, upCell } from '../EMDLab';
import TextPreview from '../../textPreview/textPreview.vue';
import { useEmdStore } from '@/stores/emdLabStore';

const props = defineProps({
    blockVo: Object
})

const choiceRef = ref()
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

const cellChanged = (cellId: string) => {
    blockDetail.value.payload = JSON.stringify(payload.value)
    upCell(blockDetail.value, labStore.getTaskId, cellId)
}


onMounted(() => {
    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value) {
        payload.value = JSON.parse(blockDetail.value.payload)
    }
})
</script>
<style scoped>
.select-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    word-wrap: break-word;
    padding-left: 20px;
}
</style>