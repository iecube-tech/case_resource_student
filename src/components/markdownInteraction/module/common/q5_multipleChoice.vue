<template>
    <div style="padding-left: 2em; padding-top: 1em">
        <el-row>
            <div v-if="question" style="white-space: pre-wrap; word-break: break-all;" v-html="question"></div>
            <span>
                {{ '（' + thisCompose.score + '分）' }}
            </span>
        </el-row>

        <div v-if="readOver" style="min-height: 2em">
            <el-row v-if="readOver && !isAnswer" style="justify-content: flex-end; align-items: center;">
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
        </div>

        <el-row style="align-items: center; margin-top: 1em">
            <el-col :span="22">
                <el-checkbox-group v-model="val.val" :disabled="!canEdit">
                    <el-checkbox v-for="(item, i) in options" :key="i" :label="i">
                        <template #default>
                            <div v-html="item">
                            </div>
                        </template>
                    </el-checkbox>
                </el-checkbox-group>
            </el-col>
            <el-col :span="2" style="text-align:center">
                <el-button v-if="!composeEdit && canEdit" type="primary" size="small"
                    @click="submitVal()">保存</el-button>
            </el-col>
        </el-row>

        <el-row v-if="composeEdit" style="justify-content: space-between; width: 100%;">
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
import { onMounted, ref, watch } from 'vue';
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
const options = ref<string[]>([])
const a = ref(0)
const composeEdit = ref(false)
const canEdit = ref(true)
const articleId = ref() // 组件所在文章id
const index = ref() // 组件在文章中的位置
const readOver = ref(false)
const args = ref([])

const subjective = ref(false)
const val = ref({
    val: []
})
const qType = 5
const showVal = ref('')
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
const SIGEX = {}

const coverArgs = (params: Array<String>) => {
    for (let i = 0; i < params.length; i++) {
        let res = params[i].replace(/\${2}(.+?)\${2}/g, (match, p1) => {
            try {
                return katex.renderToString(p1, { throwOnError: false });
            } catch (e) {
                console.error('KaTeX error:', e);
                return match; // 如果渲染失败，返回原始文本
            }
        })
        args.value.push(res)
    }
}

const paramsInit = () => {
    // console.log(props)
    if (props.editParam) {
        // console.log(props.editParam)
        if (typeof props.editParam[1] !== 'undefined' && props.editParam[1] !== null) {
            question.value = (props.editParam[1] + '(多选)').replace(/\${2}(.+?)\${2}/g, (match, p1) => {
                try {
                    return katex.renderToString(p1, { throwOnError: false });
                } catch (e) {
                    console.error('KaTeX error:', e);
                    return match; // 如果渲染失败，返回原始文本
                }
            });
            if (props.editParam.length > 2) {
                for (let i = 2; i < props.editParam.length; i++) {
                    options.value.push(
                        props.editParam[i].replace(/\${2}(.+?)\${2}/g, (match, p1) => {
                            try {
                                return katex.renderToString(p1, { throwOnError: false });
                            } catch (e) {
                                console.error('KaTeX error:', e);
                                return match; // 如果渲染失败，返回原始文本
                            }
                        })
                    )
                }
            }
        }

    }
    if (typeof props.composeEdit !== 'undefined' && props.composeEdit !== null) {
        composeEdit.value = props.composeEdit
    }
    if (typeof props.canEdit !== 'undefined' && props.canEdit !== null) {
        canEdit.value = props.canEdit
    }
    articleId.value = props.articleId
    index.value = props.index
    readOver.value = props.readOver
    coverArgs(props.editParam)
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
    if (!thisCompose.value.subjective) {
        // 客观题
        const answer = JSON.parse(thisCompose.value.answer)
        // console.log(answer)
        if (JSON.stringify(val.value.val) == JSON.stringify(answer.val)) {
            return thisCompose.value.score
        }
        else {
            return 0
        }
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
    // console.log(props)
    if (articleId.value && typeof (index.value) == 'number') {
        GetComposeData(articleId.value, index.value).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
            if (res.state == 200) {
                thisCompose.value = res.data
                val.value = JSON.parse(res.data.val)
            } else {
                ElMessage.warning("问答组件数据初始化失败")
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




defineExpose({
    val,
    subjective,
    question,
    qType,
    args,
})
onMounted(() => {
    initThisCompose()
})
</script>
<style scoped>
.summing-unit {
    padding-bottom: 20px;
}

.summing-unit .image {
    text-align: center
}

.summing-unit .operation {
    display: flex;
    justify-content: center;
    align-items: center;
}

img:deep() {
    border: 0;
}
</style>