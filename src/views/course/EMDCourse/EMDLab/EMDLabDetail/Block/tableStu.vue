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
                        <div class="cell-preview">
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
                        <el-row v-else-if="cell.isInput && cell.autoGet" :id="cell.id">
                            <el-col :span="18">
                                <el-input v-model="cell.stuValue[cell.type]" disabled></el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-button size="small" @click="getDeviceData(cell)">获取数据 </el-button>
                            </el-col>
                        </el-row>
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
import { generateShortUUID, type PAYLOAD, type blockVo, type CELL } from '../EMDLab';
import TextPreview from '../../textPreview/textPreview.vue';
import { useEmdStore } from '@/stores/emdLabStore';
import { ElMessage } from 'element-plus';
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

const currentCell = ref<CELL | null>()

const getDeviceData = (cell: CELL) => {
    if (['string', 'number'].includes(cell.type)) {
        currentCell.value = cell
        labStore.setDeviceDataDialog()
    }
}
watch(() => labStore.hasNewVal, (newVal) => {
    if (newVal) {
        if (currentCell) {
            if (currentCell.value?.type == 'string') {
                currentCell.value.stuValue.string = <string>labStore.getSelectedValue()
                console.log("取到值：" + currentCell.value.stuValue.string)
                labStore.setHasNewVal(false)
                currentCell.value = null
            }
            else if (currentCell.value?.type == 'number') {
                currentCell.value.stuValue.number = <number>labStore.getSelectedValue()
                console.log("取到值：" + currentCell.value.stuValue.number)
                labStore.setHasNewVal(false)
                currentCell.value = null
            }
            else {
                ElMessage.warning("不支持的数据类型。")
            }
        }
    }
})

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

.cell-preview {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.cell-preview .vditor-reset {
    overflow: unset;
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

.cell .vditor-reset {
    overflow: unset;
}
</style>