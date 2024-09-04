<template>
    <div class="table-container" style="padding-left: 2em;">
        <el-row style="justify-content: center; align-items: center; width: 100%">
            <div v-if="val.name" style="white-space: pre-wrap; word-break: break-all;" v-html="val.name"></div>
            <span>{{ '（' + thisCompose.score + '分）' }}</span>
        </el-row>

        <el-row v-if="readOver" style="min-height: 2em; width: 100%">
            <el-row v-if="readOver && !isAnswer" style="justify-content: flex-end; align-items: center; width: 100%">
                <div style="margin-right: 1em; display: flex; flex-direction: row;">
                    <span>得分：</span>
                    <span v-if="thisCompose.result != null && !thisCompose.subjective"
                        style="background-color: var(--el-color-success)">
                        已自动评判
                    </span>
                    <div v-else style="display:flex; flex-direction: row; align-items: center;">
                        <el-button type="success"
                            @click="thisCompose.result = thisCompose.score; redeOverChangeResult()" size='small'>
                            <el-icon>
                                <Check />
                            </el-icon>
                        </el-button>
                        <el-button type="danger" @click="thisCompose.result = 0; redeOverChangeResult()" size='small'>
                            <el-icon>
                                <Close />
                            </el-icon>
                        </el-button>
                    </div>
                </div>

                <el-input-number v-model="thisCompose.result" :step="1" step-strictly size="small" :min="0"
                    :max="thisCompose.score" @change="redeOverChangeResult()" />
            </el-row>
        </el-row>

        <el-row v-if="canEdit" style="align-items: center; width: 100%">
            <el-col :span="22">
                <table>
                    <tr v-for="(item, i) in val.tableData">
                        <td v-for="(cell, j) in val.tableData[i]">
                            <div v-if="initReady"
                                style="display:flex; flex-direction: row; justify-content: space-between; align-items: center;">
                                <div style="flex:1">
                                    <div v-if="val.tableData[i][j].edit">
                                        <el-input class="cell-input" v-model="val.tableData[i][j].value"></el-input>
                                    </div>

                                    <div v-else>{{ val.tableData[i][j].value }}</div>
                                </div>
                                <el-switch v-if="composeEdit" v-model="val.tableData[i][j].edit" :active-value="true"
                                    :inactive-value="false" />
                            </div>
                        </td>
                    </tr>
                </table>
            </el-col>
            <el-col :span="2">
                <el-button v-if="!composeEdit" type="primary" size="small" @click="submitVal()">保存</el-button>
            </el-col>
        </el-row>
        <el-row v-else style="width: 100%;">
            <table>
                <tr v-for="(item, i) in val.tableData">
                    <td v-for="(cell, j) in val.tableData[i]">
                        <div v-if="initReady" style="min-height: 20px; word-wrap:break-word;">
                            <div class="cannotEdit" v-if="val.tableData[i][j].edit">
                                {{ val.tableData[i][j].value }}
                            </div>
                            <div v-else>
                                {{ val.tableData[i][j].value }}
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </el-row>
        <el-row v-if="composeEdit" style="justify-content: space-between; width:100%">
            <div>
                分值：
                <el-input-number v-model="thisCompose.score" :step="1" step-strictly size="small" />
                <el-button type="warning" size="small" style="margin-left:1em" @click="saveScore">设定分值</el-button>
            </div>
            <div>
                <el-button type="warning" size="small" @click="showInitVal">显示初始值</el-button>
                <el-button type="warning" size="small" @click="showAnswer">显示答案</el-button>
                <el-button type="warning" size="small" @click="saveVal">设定为初始值</el-button>
                <el-button type="warning" size="small" @click="saveAnswer">设定为答案</el-button>
                <el-switch v-model="thisCompose.subjective" type="warning" :active-value="true" :inactive-value="false"
                    active-text="主观" inactive-text="客观" inline-prompt @change="saveSubjective"
                    style="--el-switch-on-color: var(--el-color-warning); margin-left: 1em;" />
            </div>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetComposeData } from '../../api/getCompose'
import { ComposeUpdateVal } from '../../api/composeUpdateVal'
import { ComposeUpdateAnswer } from '../../api/composeUpdateAnswer'
import { ComposeUpdateScore } from '../../api/composeUpdateScore'
import { ComposeUpdateSubjective } from '../../api/composeUpdateSubjective'
import { ComposeUpdateResult } from '../../api/composeUpdateResult'
import { SubmitVal } from '../../api/submitVal'
import { ElMessage, type MessageParamsWithType } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue';
import katex from 'katex';

const props = defineProps({
    editParam: Array<String>,
    articleId: Number,
    index: Number,
    composeEdit: Boolean,
    canEdit: Boolean,
    compose: Object,
    isAnswer: Boolean,
    readOver: Boolean,
})

interface compose {
    id: number | null,
    pstId: number | null,
    pstArticleId: number | null,
    index: number | null,
    name: string,
    val: string,
    answer: string,
    score: number | null,
    result: number | null,
    status: number | null,
    subjective: boolean | null,
}

const question = ref()
const composeEdit = ref(false)
const canEdit = ref(true)
const articleId = ref() // 组件所在文章id
const index = ref() // 组件在文章中的位置
const readOver = ref(false)

const qType = 2
const subjective = ref(false)
const val = ref({
    tableData: [
        [{ value: '', edit: true, res: false, score: 0 }]
    ],
    name: '',
    row: 0,
    col: 0,
})

const thisCompose = ref<compose>({
    id: null,
    pstId: null,
    pstArticleId: null,
    index: null,
    name: '',
    val: '',
    answer: '',
    score: null,
    result: null,
    status: null,
    subjective: false,
})
const initReady = ref(false)
const SIGEX = {}


const paramsInit = () => {
    if (typeof props.composeEdit !== 'undefined' && props.composeEdit !== null) {
        composeEdit.value = props.composeEdit
    }
    if (typeof props.canEdit !== 'undefined' && props.canEdit !== null) {
        canEdit.value = props.canEdit
    }
    articleId.value = props.articleId
    index.value = props.index
    readOver.value = props.readOver
}

paramsInit()

const saveVal = () => {
    ComposeUpdateVal(thisCompose.value.id, JSON.stringify(val.value)).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value = res.data
            val.value = JSON.parse(thisCompose.value.val)
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const showInitVal = () => {
    val.value = JSON.parse(thisCompose.value.val)
}

const showAnswer = () => {
    if (!thisCompose.value.answer) {
        ElMessage.warning("未设定答案")
        return
    }
    val.value = JSON.parse(thisCompose.value.answer)
}

const saveAnswer = () => {
    ComposeUpdateAnswer(thisCompose.value.id, JSON.stringify(val.value)).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value = res.data
            val.value = JSON.parse(thisCompose.value.val)
            ElMessage.success("已设定")
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const saveScore = () => {
    ComposeUpdateScore(thisCompose.value.id, thisCompose.value.score).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value.score = res.data.score
            ElMessage.success("已设定")
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const saveSubjective = () => {
    ComposeUpdateSubjective(thisCompose.value.id, thisCompose.value.subjective).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value.subjective = res.data.subjective
            ElMessage.success("已设定")
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const submitVal = () => {
    const result = computResult()
    SubmitVal(thisCompose.value.id, JSON.stringify(val.value), result).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value = res.data
            val.value = JSON.parse(thisCompose.value.val)
            ElMessage.success("已保存")
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const computResult = () => {
    if (!thisCompose.value.subjective && thisCompose.value.answer && thisCompose.value.score) {
        // 客观题
        // 所有需要输入的格子平分总分
        let answer = null
        try {
            answer = JSON.parse(thisCompose.value.answer)
        } catch {
            return null
        }
        let valList = []
        // let answerList = []
        let trueNum = 0
        for (let i = 0; i < val.value.tableData.length; i++) {
            for (let j = 0; j < val.value.tableData[i].length; j++) {
                if (val.value.tableData[i][j].edit) {
                    valList.push(val.value.tableData[i][j].value)
                    if (val.value.tableData[i][j].value.toString().replace(/\s+/g, '').trim() === answer.tableData[i][j].value.toString().replace(/\s+/g, '').trim()) {
                        trueNum++
                        val.value.tableData[i][j].res = true
                    }
                }
            }
        }
        let score = trueNum * (thisCompose.value.score / valList.length)
        return score
    }
    return null
}

const redeOverChangeResult = () => {
    // console.log(thisCompose.value.result)
    ComposeUpdateResult(thisCompose.value.id, thisCompose.value.result).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value = res.data
            val.value = JSON.parse(thisCompose.value.val)
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const initThisCompose = () => {
    init()
    if (articleId.value && typeof (index.value) == 'number') {
        GetComposeData(articleId.value, index.value).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
            if (res.state == 200) {
                thisCompose.value = res.data
                val.value = JSON.parse(thisCompose.value.val)
            } else {
                ElMessage.warning("组件数据初始化失败")
            }
        })
    }
    if (props.compose && !props.isAnswer) {
        thisCompose.value = <compose>props.compose
        val.value = JSON.parse(props.compose.val)
    }
    if (props.isAnswer && !canEdit.value && !composeEdit.value) {
        if (props.compose) {
            thisCompose.value = <compose>props.compose
        }
        if (props.compose?.answer) {
            val.value = JSON.parse(props.compose.answer)
        }
    }
}
const init = () => {
    if (props.editParam) {
        let rowNum = Number(<any>props.editParam[1].trim().split('*')[0])
        let colNum = Number(<any>props.editParam[1].trim().split('*')[1])
        let tableName = <any>props.editParam[2]
        // console.log(rowNum, colNum)
        // console.log(!isNaN(rowNum), !isNaN(colNum))
        if (tableName) {
            val.value.name = tableName.replace(/\${2}(.+?)\${2}/g, (match: any, p1: any) => {
                try {
                    return katex.renderToString(p1, { throwOnError: false });
                } catch (e) {
                    console.error('KaTeX error:', e);
                    return match; // 如果渲染失败，返回原始文本
                }
            });
            question.value = val.value.name

        }
        if (!isNaN(rowNum) && !isNaN(<number>colNum)) {
            val.value.row = rowNum
            val.value.col = colNum
            val.value.tableData = []
            for (let i = 0; i < rowNum; i++) {
                let rowArray = []
                for (let j = 0; j < colNum; j++) {
                    rowArray.push({ value: '', edit: true, res: false, score: 0 })
                }
                val.value.tableData.push(rowArray)
            }
        }
        initReady.value = true
        // console.log(val)
    }
}

defineExpose({
    val,
    subjective,
    question,
    qType,
})

onMounted(() => {
    initThisCompose()
})
</script>
<style scoped>
.table-container {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

table {
    width: 100%;
}

td {
    min-height: 35px;

}

.cell-input {
    width: 100%;
    height: 100%;
}
</style>