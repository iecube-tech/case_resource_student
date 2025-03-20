<template>
    <div v-if="payload" ref="tableRef" :id="'block' + blockDetail.id" class="table-show">
        <div class="table-show-content" v-if="payload.question !== '' && payload.question !== null">
            <TextPreview :id="'table-view-question' + blockDetail.id" :content="payload.question"></TextPreview>
        </div>
        <div class="table-show-title" v-if="payload.table!!.tableName !== '' && payload.table!.tableName !== null">
            <TextPreview :id="'table-view-tablename' + blockDetail.id" :content="payload.table!.tableName">
            </TextPreview>
        </div>
        <table class="table-show-full">
            <thead>
                <td v-for="(item, i) in payload.table!.tableHeader">
                    <div style="display: flex; flex-direction: row">
                        <div style="flex:1; display: flex; flex-direction: row; 
                                    justify-content: center; align-items: center;">
                            <TextPreview :id="item.id" :content="item.colName" />
                        </div>
                    </div>
                </td>
            </thead>
            <tbody>
                <td v-for="(cols, i) in payload.table!.tableColnum">
                    <div class="cell" v-for="(cell, j) in cols">
                        <div v-if="cell.isInput && !cell.autoGet" :id="cell.id" style="padding: 2px;">
                            <el-input v-model="cell.stuValue[cell.type]"></el-input>
                        </div>
                        <div v-else-if="cell.isInput && cell.autoGet" :id="cell.id">
                            <el-input v-model="cell.stuValue[cell.type]" disabled></el-input>
                            <el-button size="small" @click="getDeviceData(cell)">获取数据 </el-button>
                        </div>
                        <TextPreview v-else :id="cell.id"
                            :content="cell.presetValue[cell.type] == '' || cell.presetValue[cell.type] == null ? '<br />' : cell.presetValue[cell.type]" />
                    </div>
                </td>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { generateShortUUID, type CELL, type PAYLOAD, type blockVo } from '../EMDLab';
import TextPreview from '../../textPreview/textPreview.vue';
import { useEmdStore } from '@/stores/emdLabStore';
const props = defineProps({
    blockVo: Object
})

const isReady = ref(false)
const tableRef = ref()
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

const getDeviceData = (cell: CELL) => {
    if (['string', 'number'].includes(cell.type)) {
        labStore.setDeviceDataDialog()
    }
}


onMounted(() => {
    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value) {
        payload.value = JSON.parse(blockDetail.value.payload)
    }
})
</script>
<style scoped>
.table-show {
    display: flex;
    flex-direction: column;
    padding: 20px 20px;
}

.table-show table {
    width: 100%;
    /* 使表格宽度铺满屏幕 */
    border-collapse: collapse;
    /* 合并相邻单元格的边框 */
}

.table-show thead {
    width: 100%;
    /* 使表格宽度铺满屏幕 */
    border-collapse: collapse;
    /* 合并相邻单元格的边框 */

}

.table-show thead td {
    border: 1px solid #000;
    /* 为表头和单元格添加边框 */
    padding: 8px;
    /* 为表头和单元格添加内边距，使内容有一定的间距 */
    text-align: left;
    /* 文本左对齐 */
    background-color: #cccccc4c;
}

.table-show table tbody td {
    border: 1px solid #000;
    /* 为表头和单元格添加边框 */
    /* padding: 8px; */
    /* 为表头和单元格添加内边距，使内容有一定的间距 */
    text-align: top;
    /* 文本左对齐 */
    vertical-align: unset;
    unicode-bidi: unset;

}

.table-show table tbody tr {
    display: flex;
    border-bottom: 1px solid #ccc;
    border-left: none;
    border-right: none;
    /* 为表头和单元格添加边框 */
    /* padding: 8px; */
    /* 为表头和单元格添加内边距，使内容有一定的间距 */
    text-align: left;
    /* 文本左对齐 */
    vertical-align: unset;
    unicode-bidi: unset;
}

.table-show-title {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.table-show-title {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.table-show-full {
    /* opacity: 0; */
    transition: opacity 0.5s;
}

.cell {
    height: 60px;
    padding: 3px;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>