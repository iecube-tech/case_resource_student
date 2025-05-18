<template>
    <div v-if="payload?.table" class="ist-theam scroll-mt-[80px] my-4 rounded-lg border-l-4 border-blue-500">
        <table>
            <thead>
                <tr v-if="payload.table.tableName">
                    <th :colspan="payload.table.tableHeader.length">
                        <textpreview :content="payload.table.tableName"></textpreview>
                    </th>
                </tr>
                <tr>
                    <th v-for="(item, i) in payload.table.tableHeader">
                        <div class="flex flex-row ">
                            <textpreview :content="item.value"></textpreview>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in payload.table.tableRow">
                    <td v-for="(cell, j) in payload.table.tableRow[i]">
                        <div :id="cell.id" v-if="cell.isNeedInput">
                            <div v-if="cell.isAutoGet">
                                <el-input disabled v-model="cell.stuVlaue">
                                    <template #append>
                                        <button class="text-blue-600">获取</button>
                                    </template>
                                </el-input>
                            </div>
                            <el-input v-else v-model="cell.stuVlaue"></el-input>
                        </div>
                        <div v-else>
                            <textpreview :content="cell.value"></textpreview>
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
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