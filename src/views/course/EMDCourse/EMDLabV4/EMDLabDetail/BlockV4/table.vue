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
                                    <el-input readonly v-model="cell.stuVlaue" @change="cellStuAnswerChanged(i, j)">
                                        <template #append>
                                            <button class="text-blue-600" @click="getDeviceData(i, j)">获取</button>
                                        </template>
                                    </el-input>
                                </div>
                                <div v-else>
                                    <el-input v-model="cell.stuVlaue" @change="cellStuAnswerChanged(i, j)"
                                        :readonly="props.status == 1"></el-input>
                                </div>
                            </div>
                            <div v-if="payload.table.tableHeader[j].question">
                                <div v-if="cell.stuVlaue">
                                    <button v-if="cellidList.has(cell.id)">
                                        <font-awesome-icon icon="fa-solid fa-spinner" />
                                    </button>
                                    <div v-if="!cellidList.has(cell.id) && cell.result?.score != null">
                                        <el-popover v-if="cell.result?.score == 0" placement="top-start" :width="200"
                                            trigger="hover">
                                            <template #reference>
                                                <button class="text-red-400">
                                                    <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
                                                </button>
                                            </template>
                                            <textpreview
                                                :content="payload.table.tableHeader[j].question.hintWhenWrong" />
                                        </el-popover>
                                        <button v-else-if="cell.result?.score > 0" class="text-emerald-400">
                                            <font-awesome-icon icon="fa-solid fa-circle-check" />
                                        </button>
                                    </div>
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
import { ref, onMounted } from 'vue';
import { type PAYLOAD, type blockVo, upCell } from '../EMDLabV4';
import textpreview from '../../textPreview/textPreview.vue'
import { useEmdStore } from '@/stores/emdLabStore';
import { aiCheckStore } from '@/stores/aiCheckStore';
const props = defineProps({
    blockVo: Object,
    status: Number
})

const checkStore = aiCheckStore()

const payload = ref<PAYLOAD>()
const labStore = useEmdStore()
const blockDetail = ref<blockVo>()

const genChenkQo = (row: number, col: number) => {
    if (payload.value!.table?.tableHeader[col].question == null) {
        return
    }

    const markerQuestion = {
        id: payload.value!.table?.tableRow[row][col].id,
        stage: payload.value!.table?.tableHeader[col].question.stage,
        question: payload.value!.table?.tableHeader[col].question.question,
        images: [],
        answer: payload.value!.table?.tableHeader[col].question.answer,
        tag: payload.value!.table?.tableHeader[col].question.tag,
        analysis: payload.value!.table?.tableHeader[col].question.analysis,
        hint_when_wrong: payload.value!.table?.tableHeader[col].question.hintWhenWrong,
    }
    const markerQo = {
        chatId: checkStore.getCheckId,
        sectionPrefix: checkStore.getSectionPrefix,
        stuInput: payload.value!.table?.tableRow[row][col].stuVlaue,
        imgDataurls: [],
        scene: payload.value!.table?.tableHeader[col].question.stage,
        question: markerQuestion
    }
    return markerQo
}

const cellidList = ref<Map<string, Array<number>>>(new Map())
const timestampCell = ref<Map<string, string>>(new Map())

const cellStuAnswerChanged = async (row: number, col: number) => {
    console.log(row, col)


    //todo
    console.log(payload.value!.table?.tableHeader[col])
    // 决定是否校验该值
    if (payload.value!.table?.tableHeader[col].question != null) {
        // 默认问答形式采用ai校验
        // console.log("校验")
        // const markerQo = genChenkQo(row, col)
        // if (!markerQo) {
        //     return
        // }
        // console.log(markerQo)
        // // 有单元格的id 建立单元格id的列表（同时还要 row col） 向里push 
        // const newId = new Date().getTime().toString()
        // timestampCell.value.set(newId, payload.value?.table.tableRow[row][col].id!)
        // cellidList.value.set(payload.value?.table.tableRow[row][col].id!, [row, col])
        // markerQo.question.id = newId
        // checkStore.addNeedCheckItem(markerQo)
        // console.log(timestampCell.value)

        // 默认范围值 程序校验
        const min = payload.value!.table?.tableHeader[col].question.min
        const max = payload.value!.table?.tableHeader[col].question.max
        if (isNaN(payload.value!.table?.tableRow[row][col].stuVlaue)) {
            payload.value!.table!.tableRow[row][col].result!.score = 0
        }
        if (min <= <number>payload.value!.table?.tableRow[row][col].stuVlaue && <number>payload.value!.table?.tableRow[row][col].stuVlaue <= max) {
            payload.value!.table!.tableRow[row][col].result!.score = payload.value!.table?.tableHeader[col].question.score
        } else {
            payload.value!.table!.tableRow[row][col].result!.score = 0
        }

    }
    // updateCell
    blockDetail.value!.payload = JSON.stringify(payload.value)
    upCell(blockDetail.value, labStore.getTaskId, payload.value!.table!.tableRow[row][col].id)
}

const cRow = ref()
const cCol = ref()
const getDeviceData = (row: number, col: number) => {
    console.log(payload.value?.table?.tableRow[row][col])
    labStore.setSelectCell(payload.value?.table?.tableRow[row][col].id)
    cRow.value = row
    cCol.value = col
    labStore.setDeviceDataDialog()
}

watch(() => labStore.hasNewVal, async (newVal) => {
    //获取设备数据
    if (newVal) {
        if (cRow.value != null && cCol.value !== null) {
            if (labStore.getCellId != payload.value?.table?.tableRow[cRow.value][cCol.value].id) {
                return
            }
            payload.value!.table!.tableRow[cRow.value][cCol.value].stuVlaue = labStore.getSelectedValue
            console.log("取到实验设备值：" + payload.value!.table!.tableRow[cRow.value][cCol.value].stuVlaue)
            labStore.setHasNewVal(false)
            await cellStuAnswerChanged(cRow.value, cCol.value)
            cRow.value = null
            cCol.value = null
        }
    }
})

watch(() => checkStore.checkRes.id, (newVal) => {
    //校验结果
    if (newVal && timestampCell.value.has(newVal)) {
        let cellId = timestampCell.value.get(newVal)!
        const rc = <Array<number>>cellidList.value.get(cellId)
        console.log(rc)
        // rc[0] rc[1]
        // 更新表格的值
        console.log(checkStore.getCheckRes.score)
        payload.value!.table!.tableRow[rc[0]][rc[1]].result!.score = checkStore.getCheckRes.score
        cellidList.value.delete(cellId)
        timestampCell.value.delete(newVal)
        blockDetail.value!.payload = JSON.stringify(payload.value)
        upCell(blockDetail.value, labStore.getTaskId, payload.value!.table!.tableRow[rc[0]][rc[1]].id)
    }
})

onMounted(() => {
    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value) {
        payload.value = JSON.parse(blockDetail.value.payload)
    }
})
</script>
<style scoped></style>