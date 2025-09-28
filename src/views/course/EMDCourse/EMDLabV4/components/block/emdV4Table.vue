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
                        <div class="flex flex-row justify-between">
                            <textpreview :content="item.value"></textpreview>
                            <el-tooltip v-if="item.question" content="本列单元格数据填写后自动检查" placement="top" effect="light">
                                <button class="text-blue-400">
                                    <font-awesome-icon icon="fa-solid fa-circle-info" />
                                </button>
                            </el-tooltip>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in payload.table.tableRow">
                    <td v-for="(cell, j) in payload.table.tableRow[i]">
                        <div :id="cell.id" v-if="cell.isNeedInput" class="flex flex-row justify-between items-center">
                            <div class="w-[calc(100%-40px)]">
                                <div v-if="cell.isAutoGet">
                                    <el-input readonly v-model="cell.stuVlaue" :disabled="blockStatusDisabled"
                                        @change="cellStuAnswerChanged(i, j)">
                                        <template #append>
                                            <button
                                                :class="blockStatusDisabled ? 'text-gay-500 cursor-not-allowed' : 'text-blue-600'"
                                                :disabled="blockStatusDisabled" @click="getDeviceData(i, j)">获取</button>
                                        </template>
                                    </el-input>
                                </div>
                                <div v-else>
                                    <el-input v-model="cell.stuVlaue" :disabled="blockStatusDisabled"
                                        @change="cellStuAnswerChanged(i, j)" :readonly="props.status == 1"></el-input>
                                </div>
                            </div>
                            <div v-if="payload.table.tableHeader[j].question">
                                <div v-if="cell.stuVlaue">
                                    <el-popover v-if="cell.result?.score == 0" placement="top-start" :width="200"
                                        trigger="hover">
                                        <template #reference>
                                            <button class="text-red-400">
                                                <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
                                            </button>
                                        </template>
                                        <textpreview :content="payload.table.tableHeader[j].question.hintWhenWrong" />
                                    </el-popover>
                                    <button v-else-if="cell.result?.score > 0" class="text-emerald-400">
                                        <font-awesome-icon icon="fa-solid fa-circle-check" />
                                    </button>
                                </div>
                            </div>
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

import textpreview from '@/components/textPreview.vue'
import { useEmdV4Store } from '@/stores/emdV4TaskStore'
import { emitter } from '@/ts/eventBUs';

import { updateCompPayload, updateCompScore, updateCompStatus } from './update'
import _ from 'lodash'

const emdV4Store = useEmdV4Store()

const props = defineProps({
    index: Number,
    comp: Object,
    // TODO 是否可以编辑
    status: false,
})

const blockStatusDisabled = computed(() => {
    let blockStatus = emdV4Store.getBlockStatusByComponentId(props.comp.id)
    let f = blockStatus == 1
    return f
})

// console.log(props.comp)

const payload = ref()


const cellStuAnswerChanged = async (row: number, col: number) => {
    // 决定是否校验该值
    let question = payload.value!.table?.tableHeader[col].question
    if (question != null) {
        let cellObj = payload.value!.table?.tableRow[row][col]
        // 默认范围值 程序校验
        const min = question.min
        const max = question.max
        if (isNaN(cellObj.stuVlaue)) {
            payload.value!.table!.tableRow[row][col].result!.score = 0
        }
        if (min <= <number>cellObj.stuVlaue && <number>cellObj.stuVlaue <= max) {
            payload.value!.table!.tableRow[row][col].result!.score = question.score
        } else {
            payload.value!.table!.tableRow[row][col].result!.score = 0
        }

        if (payload.value!.table!.tableRow[row][col].result!.score == 0) {
            payload.value.table.tableHeader[col].question.hintWhenWrong = `请选择正确类型，取值超出范围[${min}, ${max}]`
        }
    }

    let payloadStr = JSON.stringify(payload.value)
    updateCompPayload(props.comp.id, payloadStr, () => {
        setDefaultCurrentCell()
    })

    let rowLen = payload.value.table.row
    let colLen = payload.value.table.col
    let total = rowLen * colLen // 总格数
    let count = 0; // 已填格数
    for (let i = 0; i < rowLen; i++) {
        for (let j = 0; j < colLen; j++) {
            let numValue = payload.value.table.tableRow[i][j].stuVlaue
            if ((numValue != '' && _.isNumber(+numValue))) {
                count++
            }
        }
    }

    if (count == total) { // 全填
        if (props.comp.status == 0) {
            updateCompStatus(props.comp.id, 1, () => {
                props.comp.status = 1;
            })
        }
    } else {
        if (props.comp.status == 1) {
            updateCompStatus(props.comp.id, 0, () => {
                props.comp.status = 0;
            })
        }
    }

    updateScore()
}

// 表格组件得分函数
const updateScore = () => {
    let needCalculate = props.comp.needCalculate
    if (!needCalculate) {
        return
    }

    let rowLen = payload.value.table.row
    let colLen = payload.value.table.col
    let totalScore = props.comp.totalScore

    let count = 0
    let total = 0
    // let total = rowLen * colLen

    for (let col = 0; col < colLen; col++) {
        let needRange = false
        let q = payload.value.table.tableHeader[col].question
        let min = 0
        let max = 0

        if (q != null) {
            needRange = true
            min = q.min
            max = q.max
        } else {
            needRange = false
        }

        for (let row = 0; row < rowLen; row++) {
            let cellItem = payload.value.table.tableRow[row][col]
            let stuVlaue = cellItem.stuVlaue
            if (payload.value.table.tableRow[row][col].isNeedInput) {
                total++
            }

            if (stuVlaue == '' || isNaN(Number(stuVlaue))) {
                continue;
            } else if (needRange) {
                if (stuVlaue >= min && stuVlaue <= max) {
                    count++;
                }
            } else {
                count++;
            }
        }
    }
    console.log(totalScore * count / total)
    let score = Math.round(totalScore * count / total)
    console.log(score)
    console.log(payload.value.table)
    updateCompScore(props.comp.id, score, () => {
        props.comp.score = score
    })
}

const currentCell = ref({
    id: '',
    row: -1,
    col: -1
})

const setDefaultCurrentCell = () => {
    currentCell.value = {
        id: '',
        row: -1,
        col: -1
    }
}

const setCurrentCell = (row: number, col: number) => {
    let cellObj = payload.value!.table!.tableRow[row][col];
    currentCell.value = {
        id: cellObj.id,
        row: row,
        col: col
    }
}

const getDeviceData = (row: number, col: number) => {
    setCurrentCell(row, col)
    emdV4Store.setCurrentComponentIndex(props.index)
    emdV4Store.setCurrentCellId(currentCell.value.id)
    emdV4Store.deviceOpen()
}

// 通过设备获取数据
const updateCell = (res) => {
    let { currentComponentIndex, currentCellId, value } = res
    if (currentComponentIndex === props.index && currentCellId === currentCell.value.id) {
        // console.log('setCellData', value)
        let row = currentCell.value.row
        let col = currentCell.value.col
        payload.value!.table!.tableRow[row][col].stuVlaue = value
        cellStuAnswerChanged(row, col)
    }
}

onMounted(() => {
    payload.value = props.comp.payload
    // console.log(props.comp.payload.table)

    emitter.on('setCellData', (res) => {
        updateCell(res)
    })
})
</script>
<style scoped></style>