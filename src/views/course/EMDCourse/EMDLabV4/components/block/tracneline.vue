<template>
    <emdV4Table :index="index" :comp="comp"></emdV4Table>
    <div class="flex justify-end items-center space-x-2">
        <span>X轴：</span>
        <el-select v-model="tracneline.xIndex" placeholder="选择横轴" @change="handleChange" :disabled="blockStatusDisabled"
            style="width: 120px;">
            <el-option v-for="col in colLen" :label="`第 ${col} 列`" :value="col" />
        </el-select>
        <span>Y轴：</span>
        <el-select v-model="tracneline.yIndex" placeholder="选择纵轴" @change="handleChange" :disabled="blockStatusDisabled"
            style="width: 120px;">
            <el-option v-for="col in colLen" :label="`第 ${col} 列`" :value="col" />
        </el-select>

        <span>连线顺序：</span>
        <el-select v-model="tracneline.order" placeholder="选择连线顺序" @change="handleChange"
            :disabled="blockStatusDisabled" style="width: 120px;">
            <el-option label="表格数据顺序" value='' />
            <el-option label="沿X轴方向" value='x' />
            <el-option label="沿Y轴方向" value='y' />
        </el-select>
        <el-button type="primary" size="small" @click="handelTraceLine" :disabled="blockStatusDisabled">绘图</el-button>
    </div>
    <div ref="chartRef" class="border mt-4" style="height: 400px;"></div>
</template>

<script setup>

import { updateCompPayload } from './update'
import emdV4Table from './emdV4Table.vue';
import * as echarts from 'echarts';
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

const chartRef = ref(null)

let myChart = null
let resizeObserver = null;

const initChart = () => {
    if (myChart == null && chartRef.value) {
        myChart = echarts.init(chartRef.value)

        // Observe container resize events
        resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0 && myChart) {
                    // Container became visible, resize chart
                    myChart && myChart.resize();
                }
            }
        });
        resizeObserver.observe(chartRef.value);
    }
}

const handelTraceLine = () => {
    let isLog = props.comp.payload.tracneline.coordinateIsLog

    let table = props.comp.payload.table
    let tableRow = table.tableRow
    let row = table.row
    let col = table.col

    let chartOption = tracneline.value
    let xIndex = chartOption.xIndex - 1
    let yIndex = chartOption.yIndex - 1

    // Create data array without headers for sorting
    let rawData = []
    for (let i = 0; i < row; i++) {
        let rowArray = []
        if (tableRow[i][xIndex].stuVlaue == '' || tableRow[i][yIndex].stuVlaue == '') {
            // 过滤实验数据
            continue
        } else {
            rowArray.push(+tableRow[i][xIndex].stuVlaue, +tableRow[i][yIndex].stuVlaue)
        }
        
        rawData.push(rowArray)
    }

    // Apply sorting based on order parameter
    if (chartOption.order === 'x') {
        rawData.sort((a, b) => a[0] - b[0])
    } else if (chartOption.order === 'y') {
        rawData.sort((a, b) => a[1] - b[1])
    }

    // Create header row with column names
    let headerRow = ['列1', '列2']

    // Combine header and sorted data
    let tableArray = [headerRow, ...rawData]

    // console.log(tableArray)

    initChart()

    if (myChart) {
        // Determine axis types based on isLog value
        const xAxisType = isLog ? 'log' : 'value'
        const yAxisType = isLog ? 'log' : 'value'
        
        let option = {
            title: {
                show: false,
                text: '',
            },
            dataset: {
                source: tableArray
            },
            xAxis: {
                name: 'x 轴',
                type: xAxisType,
                axisLine: {
                    symbol: ['none', 'arrow'],  // 只在轴线末端显示箭头
                    symbolSize: [10, 15],       // 箭头大小
                }
            },
            yAxis: {
                name: 'y 轴',
                type: yAxisType,
                axisLine: {
                    symbol: ['none', 'arrow'],  // 只在轴线末端显示箭头
                    symbolSize: [10, 15],       // 箭头大小
                }
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    encode: {
                        x: 0, // 因为先push xZindx 所以是0
                        y: 1, // 因为后push yZindx 所以是1
                    },
                }
            ]
        }
        // console.log(option)
        myChart.setOption(option)
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
    if (myChart) {
        myChart.dispose();
    }
})

</script>

<style lang="scss" scoped></style>