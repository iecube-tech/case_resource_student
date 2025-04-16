<template>
    <div v-if="payload" ref="tableRef" :id="'block' + blockDetail.id" class="ist-theam scroll-mt-[80px]">
        <div class="table-show-content" v-if="payload.question !== '' && payload.question !== null">
            <TextPreview :id="'table-view-question' + blockDetail.id" :content="payload.question"></TextPreview>
        </div>
        <table>
            <thead>
                <tr v-if="payload.table!!.tableName !== '' && payload.table!.tableName !== null">
                    <th :colspan="payload.table?.tableHeader.length">
                        <TextPreview :id="'table-view-tablename' + blockDetail.id" :content="payload.table!.tableName">
                        </TextPreview>
                    </th>
                </tr>
                <tr>
                    <th v-for="(item, i) in payload.table!.tableHeader">
                        <div style="display: flex; flex-direction: row">
                            <TextPreview :id="item.id" :content="item.colName" />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in payload.table?.tableColnum[0].length">
                    <td v-for="(col, j) in payload.table?.tableColnum">
                        <div v-if="col[i - 1].isInput && !col[i - 1].autoGet" :id="col[i - 1].id" style="padding: 2px;"
                            class="scroll-mt-[80px]">
                            <el-input v-model="col[i - 1].stuValue[col[i - 1].type]"
                                @change="cellChanged(col[i - 1].id)"></el-input>
                        </div>
                        <div v-else-if="col[i - 1].isInput && col[i - 1].autoGet" :id="col[i - 1].id"
                            class="scroll-mt-[80px]">
                            <el-input v-model="col[i - 1].stuValue[col[i - 1].type]" disabled>
                                <template #append>
                                    <button @click="getDeviceData(col[i - 1])" class="text-blue-600">获取</button>
                                </template>
                            </el-input>
                        </div>
                        <TextPreview v-else :id="col[i - 1].id"
                            :content="col[i - 1].presetValue[col[i - 1].type] == '' || col[i - 1].presetValue[col[i - 1].type] == null ? '<br />' : col[i - 1].presetValue[col[i - 1].type]" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { generateShortUUID, upCell, type PAYLOAD, type blockVo, type CELL } from '../EMDLab';
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
    // console.log(cell)
    labStore.setSelectCell(cell.id)
    if (['string', 'number'].includes(cell.type)) {
        currentCell.value = cell
        labStore.setDeviceDataDialog()
    }
}

watch(() => labStore.hasNewVal, async (newVal) => {
    if (newVal) {
        if (currentCell.value) {
            if (labStore.getCellId != currentCell.value.id) {
                return
            }
            if (currentCell.value?.type == 'string') {
                currentCell.value.stuValue.string = <string>labStore.getSelectedValue
                console.log("取到实验设备值：" + currentCell.value.stuValue.string)
                labStore.setHasNewVal(false)
                await cellChanged(currentCell.value.id)
                currentCell.value = null
            }
            else if (currentCell.value?.type == 'number') {
                currentCell.value.stuValue.number = <number>labStore.getSelectedValue
                console.log("取到实验设备值：" + currentCell.value.stuValue.number)
                labStore.setHasNewVal(false)
                await cellChanged(currentCell.value.id)
                currentCell.value = null
            }
            else {
                ElMessage.warning("不支持的数据类型。")
                console.log("不支持的数据类型。需要的数据类型：" + currentCell.value?.type)
                currentCell.value = null
            }
            currentCell.value = null
        }
    }
})

const cellChanged = async (cellId: string) => {
    console.log("change" + cellId)
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
</style>