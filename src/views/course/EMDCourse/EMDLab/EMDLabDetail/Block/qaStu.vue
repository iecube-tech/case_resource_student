<template>
    <div v-if="payload" ref="qaRef" :id="'block' + blockDetail.id" class="qa-privew">
        <TextPreview :id="'block-' + generateShortUUID(blockDetail.id)"
            :content="payload.question == '' ? '问题' : payload.question">
        </TextPreview>
        <div v-if="payload.cell.isInput" :id="payload.cell.id" style="padding: 5px;">
            <el-input style="width: 100%;" type="textarea" autosize placeholder="作答区域"
                v-model="payload.cell.stuValue[payload.cell.type]" @focus="handleFocus(payload.cell)">
            </el-input>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { generateShortUUID, type PAYLOAD, type blockVo } from '../EMDLab';
import TextPreview from '../../textPreview/textPreview.vue';
const props = defineProps({
    blockVo: Object
})

const qaRef = ref()

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