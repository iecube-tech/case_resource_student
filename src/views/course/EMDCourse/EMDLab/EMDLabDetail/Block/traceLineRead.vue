<template>
    <div class="table-edit">
        <div class="table-show">
            <div class="table-show-content" v-if="blockDetail.content !== '' && blockDetail.content !== null">
                <emdPreview :id="'table-view-' + blockDetail.blockId" :content="blockDetail.content.toString()">
                </emdPreview>
            </div>
            <div class="table-show-title" v-if="ConfData.title !== '' && ConfData.title !== null">
                <emdPreview :id="'table-title-view-' + blockDetail.blockId" :content="ConfData.title.toString()">
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
                                        <emdPreview
                                            :id="'value-priview-' + ConfData.tableData[rowIndex - 1][colIndex - 1].id"
                                            :content="ConfData.tableData[rowIndex - 1][colIndex - 1].value.toString()">
                                        </emdPreview>
                                    </div>
                                    <div v-else>
                                        <div v-if="ConfData.tableData[rowIndex - 1][colIndex - 1].autoData">
                                            <el-button>获取数据</el-button>
                                        </div>
                                        <div v-else>
                                            <div
                                                v-if="ConfData.tableData[rowIndex - 1][colIndex - 1].valueType == ValueType.String">
                                                <el-input
                                                    v-model="dataTemplate.tableData[rowIndex - 1][colIndex - 1].stuVal"></el-input>
                                            </div>
                                            <div v-else>
                                                <el-input-number
                                                    v-model="dataTemplate.tableData[rowIndex - 1][colIndex - 1].stuVal"
                                                    controls-position="right"></el-input-number>
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
        <div class="chart-show">
            <div class="chart-tool">
                <el-form-item label="横轴">
                    <el-select v-model="dataTemplate.chartData.xname" placeholder="选择横轴">
                        <el-option v-for="(item, j) in ConfData.tableData[0]"
                            :label="'第' + (j + 1) + '列--' + item.value" :value="j" />
                    </el-select>
                </el-form-item>
                <el-form-item label="纵轴">
                    <el-select v-model="dataTemplate.chartData.yname" placeholder="选择纵轴">
                        <el-option v-for="(item, j) in ConfData.tableData[0]"
                            :label="'第' + (j + 1) + '列--' + item.value" :value="j" />
                    </el-select>
                </el-form-item>
                <el-form-item label="连线顺序">
                    <el-select v-model="dataTemplate.chartData.lineOrder" placeholder="选择连线顺序">
                        <el-option label="表格数据顺序" value='' />
                        <el-option label="沿横轴方向" value='x' />
                        <el-option label="沿纵轴方向" value='y' />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="loadChartOption()">绘图</el-button>
                </el-form-item>
            </div>
            <div class="chart-echart">
                <div :id="generateCellId(blockDetail.blockId, 999, 999)" style="width: 100%; min-height: 300px;">

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { type blockVo, type confData, type referenceData, ValueType, TableItemType, generateCellId } from '../EMDLab';
import emdPreview from './emdPreview/emdPreview.vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
const props = defineProps({
    blockVo: Object
})

const blockDetail = ref<blockVo>({
    blockId: 0,
    type: '',
    title: '',
    content: '',
    catalogue: '',
    confData: '',
    referenceData: '',
    dataTemplate: '',
    result: null,
    stuData: null
})

const ConfData = ref<confData>({
    openConfDiv: false,
    openRefDiv: false,
    rowNum: 1,
    colNum: 0,
    title: '',
    tableData: [[]]
})

const dataTemplate = ref({
    tableData: <referenceData[][]>[[]],
    chartData: {
        id: generateCellId(blockDetail.value.blockId, 999, 999),
        xname: null,
        xmin: null,
        xmax: null,
        xType: 'value',
        yname: null,
        ymin: null,
        ymax: null,
        yType: 'value',
        x: [],
        y: [],
        trace: [], // 按顺序描点连线[[x,y]]
        lineOrder: ''
    }
})

const getBlockDetail = () => {
    if (!props.blockVo) {
        ElMessage.warning("未知的块id")
        return
    }

    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value.confData !== null && blockDetail.value.confData.length !== 0) {
        ConfData.value = JSON.parse(blockDetail.value.confData)
    }
    if (blockDetail.value.referenceData !== null && blockDetail.value.referenceData.length !== 0) {

    }
    if (blockDetail.value.dataTemplate !== null && blockDetail.value.dataTemplate.length !== 0) {
        dataTemplate.value = JSON.parse(blockDetail.value.dataTemplate)
    }
}

getBlockDetail()

let traceLineChart: echarts.ECharts | null = null
const initChats = () => {
    let id = generateCellId(blockDetail.value.blockId, 999, 999)
    if (traceLineChart == null) {
        traceLineChart = echarts.init(document.getElementById(id))
    }
    window.addEventListener('resize', function () {
        if (traceLineChart) {
            console.log('resize')
            traceLineChart.resize()
        }
    })
    window.addEventListener('popstate', function () {
        if (traceLineChart) {
            traceLineChart.dispose()
            traceLineChart = null
        }
    })
}
const setCharts = (value: any) => {
    let option = {
        tooltip: {
            formatter: function (params: { data: number[]; }) {
                var data = params.data || [0, 0];
                return data[0].toFixed(2) + ', ' + data[1].toFixed(2);
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            min: value.xmin,
            max: value.xmax,
            type: value.xType,
        },
        yAxis: {
            min: value.ymin,
            max: value.ymax,
            type: value.yType,
        },
        series: [
            {
                id: 'a',
                type: 'line',
                smooth: true,
                symbolSize: 10,
                data: value.trace
            }
        ]
    };
    if (traceLineChart != null) {
        traceLineChart.setOption(option)
    } else {
        ElMessage.error("绘图区加载失败")
    }
}

const loadChartOption = () => {
    if (dataTemplate.value.chartData.yname == null || dataTemplate.value.chartData.xname == null) {
        ElMessage.error("请选择数据源")
        return
    }
    //初始化数据
    dataTemplate.value.chartData.xmin = null
    dataTemplate.value.chartData.xmax = null
    dataTemplate.value.chartData.xType = 'value'
    dataTemplate.value.chartData.ymin = null
    dataTemplate.value.chartData.ymax = null
    dataTemplate.value.chartData.yType = 'value'
    dataTemplate.value.chartData.x = []
    dataTemplate.value.chartData.y = []
    dataTemplate.value.chartData.trace = [] // 按顺序描点连线[[x,y]]

    let x = dataTemplate.value.chartData.xname
    let y = dataTemplate.value.chartData.yname
    let xIsNaN = []
    let yIsNaN: boolean[] = []
    //处理横轴数据
    for (let i = 1; i < ConfData.value.tableData.length; i++) {
        let ix = ConfData.value.tableData[i][x]
        let x_v
        if (ix.itemType == TableItemType.Edit) {
            x_v = dataTemplate.value.tableData[i][x].stuVal
        }
        if (ix.itemType == TableItemType.Show) {
            x_v = ConfData.value.tableData[i][x].value
        }

        if (isNaN(<any>x_v)) {//不是一个number  是个字符串
            xIsNaN.push(true)
            dataTemplate.value.chartData.x.push(x_v)
        } else {
            // if (x_v.trim() === '') {
            //     xIsNaN.push(true)
            //     dataTemplate.value.chartData.x.push('')
            // } else {
            //     xIsNaN.push(false)
            //     dataTemplate.value.chartData.x.push(Number(<any>x_v))
            // }
            xIsNaN.push(false)
            dataTemplate.value.chartData.x.push(x_v)
        }
    }
    if (xIsNaN.includes(true)) {
        dataTemplate.value.chartData.xType = 'category'
    } else {
        dataTemplate.value.chartData.xmax = <any>Math.max.apply(null, dataTemplate.value.chartData.x);
        dataTemplate.value.chartData.xmin = <any>Math.min.apply(null, dataTemplate.value.chartData.x);
    }

    //处理y
    for (let i = 1; i < ConfData.value.tableData.length; i++) {
        let iy = ConfData.value.tableData[i][y]
        let y_v
        if (iy.itemType == TableItemType.Edit) {
            y_v = dataTemplate.value.tableData[i][y].stuVal
        }
        if (iy.itemType == TableItemType.Show) {
            y_v = ConfData.value.tableData[i][y].value
        }

        if (isNaN(y_v)) {//不是一个number  是个字符串
            xIsNaN.push(true)
            dataTemplate.value.chartData.y.push(y_v)
        } else { //是个数字
            // if (y_v.trim() === '') {
            //     xIsNaN.push(true)
            //     dataTemplate.value.chartData.y.push('')
            // } else 
            // {
            //     xIsNaN.push(false)
            //     dataTemplate.value.chartData.y.push(Number(<any>y_v))
            // }
            xIsNaN.push(false)
            dataTemplate.value.chartData.y.push(Number(<any>y_v))
        }
    }

    if (yIsNaN.includes(true)) {
        dataTemplate.value.chartData.yType = 'category'
    } else {
        dataTemplate.value.chartData.ymax = <any>Math.max.apply(null, dataTemplate.value.chartData.y)
        dataTemplate.value.chartData.ymin = <any>Math.min.apply(null, dataTemplate.value.chartData.y)
    }

    let minLength = Math.min(dataTemplate.value.chartData.x.length, dataTemplate.value.chartData.y.length)

    // 处理trace
    for (let i = 0; i < minLength; i++) {
        dataTemplate.value.chartData.trace.push([dataTemplate.value.chartData.x[i], dataTemplate.value.chartData.y[i]])
    }

    if (dataTemplate.value.chartData.lineOrder == 'x') {
        dataTemplate.value.chartData.trace.sort((a, b) => a[0] - b[0])
    }

    if (dataTemplate.value.chartData.lineOrder == 'y') {
        dataTemplate.value.chartData.trace.sort((a, b) => a[1] - b[1])
    }

    setCharts(dataTemplate.value.chartData)
}

onMounted(() => {
    initChats()
})

</script>
<style scoped>
.table-edit {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #FAFCFF;
}

.table-conf {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 设置过渡效果 */
    transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.table-conf-item {
    padding: 20px 20px;
}

.table-conf-fold {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: var(--el-color-primary-light-9);
}

.table-conf-fold button {
    width: 100%;
}

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

.value-reference-fold {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: var(--el-color-success-light-9);
}

.value-reference-fold button {
    width: 100%;
}

.value-reference {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    /* 设置过渡效果 */
    transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;

    padding: 20px;
}

.value-reference-main {
    flex: 1;
    height: 300px;
    display: flex;
    flex-direction: row;
    border: 1px solid #ccc;
}

.value-reference-main .value-reference-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.chart-show {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}

.chart-tool {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.chart-echart {
    width: 100%;
}

.chart-tool div {
    padding: 0 20px;
    flex: 1
}

.chart-tool .el-select {
    max-width: 300px;
}
</style>