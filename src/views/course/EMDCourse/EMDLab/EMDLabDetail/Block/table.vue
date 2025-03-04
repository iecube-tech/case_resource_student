<template>
    <div>
        <div v-if="block" class="table-show">
            <div class="table-show-content" v-if="block.content !== '' && block.content !== null">
                <emdPreview :id="'table-view-' + generateShortUUID(block.blockId)" :content="block.content">
                </emdPreview>
            </div>
            <div class="table-show-title" v-if="ConfData.title !== '' && ConfData.title !== null">
                <emdPreview :id="'table-title-preview-' + generateShortUUID(block.blockId)" :content="ConfData.title">
                </emdPreview>
            </div>
            <table class="table-show-full">
                <tbody>
                    <tr v-for="rowIndex in ConfData.rowNum">
                        <td v-for="colIndex in ConfData.colNum">
                            <div class="cell" v-if="ConfData.tableData[rowIndex - 1][colIndex - 1]">
                                <div class="cell-data">
                                    <div
                                        v-if="ConfData.tableData[rowIndex - 1][colIndex - 1].itemType == TableItemType.Show">
                                        <div>
                                            <emdPreview
                                                :id="'cell-preview-' + ConfData.tableData[rowIndex - 1][colIndex - 1].id"
                                                :content="ConfData.tableData[rowIndex - 1][colIndex - 1].value.toString()">
                                            </emdPreview>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="ConfData.tableData[rowIndex - 1][colIndex - 1].autoData">
                                            <el-button>获取数据</el-button>
                                        </div>
                                        <div v-else>
                                            <div
                                                v-if="ConfData.tableData[rowIndex - 1][colIndex - 1].valueType == ValueType.String">
                                                <el-input
                                                    v-model="stuData[rowIndex - 1][colIndex - 1].value"></el-input>
                                            </div>
                                            <div v-else>
                                                <el-input-number controls-position="right"></el-input-number>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeMount } from 'vue';
import { type confData, type blockVo, type referenceData, ValueType, TableItemType, generateCellId } from '../EMDLab';
import { ElMessage } from 'element-plus';
import { generateShortUUID } from '../EMDLab';
// import { Getblock } from '@/apis/e-md/block/getblock.js';
import emdPreview from './emdPreview/emdPreview.vue';

const props = defineProps({
    blockVo: Object
})

const block = ref<blockVo | null>()
block.value = <blockVo>props.blockVo

const ConfData = ref<confData>({
    openConfDiv: false,
    openRefDiv: false,
    rowNum: 1,
    colNum: 0,
    title: '',
    tableData: [[]]
})

const stuData = ref<referenceData[][]>()

if (block.value.confData !== null && block.value.confData.length !== 0) {
    ConfData.value = JSON.parse(block.value.confData)
}
if (block.value.stuData !== null && block.value.stuData.length !== 0) {
    stuData.value = JSON.parse(block.value.stuData)
    console.log(stuData)
}

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

.table-show table td {
    border: 1px solid #ccc;
    /* 为表头和单元格添加边框 */
    padding: 8px;
    /* 为表头和单元格添加内边距，使内容有一定的间距 */
    text-align: left;
    /* 文本左对齐 */
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
    display: flex;
    flex-direction: row;
    align-items: center;
}

.cell-data {
    flex: 1;
}

.cell-conf-item {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>