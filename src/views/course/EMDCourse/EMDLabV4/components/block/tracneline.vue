<template>
    <emdV4Table :index="index" :comp="comp"></emdV4Table>
    <div class="flex justify-end items-center">
        <div class="chart-option-item">
            <span>X轴：</span>
            <el-select v-model="tracneline.xIndex" placeholder="选择横轴" @change="handleChange"
                :disabled="blockStatusDisabled">
                <el-option v-for="col in colLen" :label="`第 ${col} 列`" :value="col" />
            </el-select>
        </div>
        <div class="chart-option-item">
            <span>Y轴：</span>
            <el-select v-model="tracneline.yIndex" placeholder="选择纵轴" @change="handleChange"
                :disabled="blockStatusDisabled">
                <el-option v-for="col in colLen" :label="`第 ${col} 列`" :value="col" />
            </el-select>
        </div>

        <div class="chart-option-item">
            <span>连线顺序：</span>
            <el-select v-model="tracneline.order" placeholder="选择连线顺序" @change="handleChange"
                :disabled="blockStatusDisabled">
                <el-option label="表格数据顺序" value='' />
                <el-option label="沿X轴方向" value='x' />
                <el-option label="沿Y轴方向" value='y' />
            </el-select>
        </div>
        <el-button type="primary" size="small" @click="handelTraceLine"
            :disabled="blockStatusDisabled || compNotComplete">绘图</el-button>
    </div>
    <div ref="chartRef" class="border mt-4" style="height: 400px;"></div>
</template>

<script setup>
import { updateCompStatus, updateCompPayload } from './update'
import emdV4Table from './emdV4Table.vue';

import Charts from '@jiaminghi/charts'

import { useEmdV4Store } from '@/stores/emdV4TaskStore';
const emdV4Store = useEmdV4Store()

const blockStatusDisabled = computed(() => {
    let blockStatus = emdV4Store.getBlockStatusByComponentId(props.comp.id)
    let f = blockStatus == 1
    return f
})

const props = defineProps({
    index: Number,
    comp: Object,
})

const tracneline = ref()
tracneline.value = props.comp.payload.tracneline

const colLen = computed(() => {
    return props.comp.payload.table.col
})

const compNotComplete = computed(() => {
    return props.comp.status == 0
})

const chartRef = ref(null)

let myChart = null

let resizeObserver = null;
const initChart = () => {
    if (!compNotComplete.value && myChart == null) {
        myChart = new Charts(chartRef.value)

        // Observe container resize events
        if (chartRef.value) {
            resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width > 0 && height > 0 && myChart) {
                        // Container became visible, resize chart
                        myChart.resize();
                    }
                }
            });
            resizeObserver.observe(chartRef.value);
        }

    }
}

const handelTraceLine = () => {

    if (compNotComplete.value) {
        console.log('请完成填写所有选项')
        return
    }

    let table = props.comp.payload.table
    let tableRow = table.tableRow
    let row = table.row
    let col = table.col

    let tableArray = []

    for (let i = 0; i < row; i++) {
        let rowArray = []
        for (let j = 0; j < col; j++) {
            let n = +tableRow[i][j].stuVlaue
            rowArray.push(n)
        }
        tableArray.push(rowArray)
    }

    let chartData = []

    let chartOption = tracneline.value

    let xIndex = chartOption.xIndex - 1
    let yIndex = chartOption.yIndex - 1

    for (let i = 0; i < row; i++) {
        chartData.push([tableArray[i][xIndex], tableArray[i][yIndex]])
    }

    if (chartOption.order == 'x') {
        chartData = chartData.sort((a, b) => a[0] - b[0])
    }

    if (chartOption.order == 'y') {
        chartData = chartData.sort((a, b) => a[1] - b[1])
    }

    let xAxis = []
    let yAxis = []

    for (let i = 0; i < chartData.length; i++) {
        xAxis.push(chartData[i][0])
        yAxis.push(chartData[i][1])
    }

    let xData = null
    let yData = null
    let vData = null

    if (chartOption.order == '' || chartOption.order == 'x') {
        xData = xAxis
        yData = 'value'
        vData = yAxis
    } else {
        xData = 'value'
        yData = yAxis
        vData = xAxis
    }

    initChart()

    if (myChart) {
        myChart.setOption({
            title: {
                show: false,
                text: '',
            },
            xAxis: {
                name: 'x 轴',
                data: xData
            },
            yAxis: {
                name: 'y 轴',
                data: yData
            },
            series: [
                {
                    data: vData,
                    type: 'line'
                }
            ]
        })
    }
}

const handleChange = () => {
    let payloadStr = JSON.stringify(props.comp.payload)
    updateCompPayload(props.comp.id, payloadStr)
}

onMounted(() => {
    initChart()
    handelTraceLine()
})

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
})

</script>

<style lang="scss" scoped>
.chart-option-item {
    @apply mr-4;
}
</style>