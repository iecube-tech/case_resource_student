<template>
    <div :style="readOver ? 'padding-left:2em; min-height: 2em' : 'padding:0 2em;min-height: 2em'">
        <el-row>
            <div v-if="question" style="white-space: pre-wrap; word-break: break-all;" v-html="question"></div>
            <span>{{ '（' + thisCompose.score + '分）' }}</span>
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

        <div v-if="val.picList" class="cannotEdit">
            <el-row v-for="(item, i) in val.picList" style="justify-content:center;">
                <div class="image-container">
                    <img :src="'/dev-api/files/image/' + item" />
                    <el-button v-if="canEdit" size="small" class="delete-button" type="danger" :icon="Delete"
                        @click="deleteImage(i)"></el-button>
                </div>
            </el-row>
        </div>
        <el-row v-if="canEdit">
            <el-upload class="upload-demo" drag action="/dev-api/files/upimage" multiple :on-success="UpImageSuccess"
                :show-file-list="false" :before-upload="beforeImageUpload">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    将图片拖入 或 <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip"
                        style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                        <span>jpg/png 文件请小于 500kb</span>
                        <el-button v-if="!composeEdit" type="success" size="small" link
                            @click="getOSIPic()">获取示波器图像</el-button>
                    </div>
                </template>
            </el-upload>
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
                    style="--el-switch-on-color: var(--el-color-warning); margin-left: 1em;" disabled />
            </div>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import type { MessageParamsWithType, UploadProps } from 'element-plus'
import { DeleteImage } from '../../api/deleteImage'
import { GetComposeData } from '../../api/getCompose'
import { ComposeUpdateVal } from '../../api/composeUpdateVal'
import { ComposeUpdateAnswer } from '../../api/composeUpdateAnswer'
import { ComposeUpdateScore } from '../../api/composeUpdateScore'
import { ComposeUpdateSubjective } from '../../api/composeUpdateSubjective'
import { ComposeUpdateResult } from '../../api/composeUpdateResult'
import { SubmitVal } from '../../api/submitVal'
import katex from 'katex';
import { Check, Close } from '@element-plus/icons-vue';
// import html2canvas from 'html2canvas';

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

interface val {
    picList: Array<String>
}

const question = ref()
const composeEdit = ref(false)
const canEdit = ref(true)
const articleId = ref() // 组件所在文章id
const index = ref() // 组件在文章中的位置
const readOver = ref(false)

const paramsInit = () => {
    if (props.editParam) {
        if (typeof props.editParam[1] !== 'undefined' && props.editParam[1] !== null) {
            question.value = props.editParam[1].replace(/\${2}(.+?)\${2}/g, (match, p1) => {
                try {
                    return katex.renderToString(p1, { throwOnError: false });
                } catch (e) {
                    console.error('KaTeX error:', e);
                    return match; // 如果渲染失败，返回原始文本
                }
            });
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

const qType = 3
const subjective = ref(true)
const val = ref<val>({
    picList: []
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
    subjective: true,
})
const SIGEX = {}

const UpImageSuccess = (res: { data: { filename: string; }; }) => {
    val.value.picList.push(res.data.filename)
    SubmitVal(thisCompose.value.id, JSON.stringify(val.value), null).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value = res.data
            val.value = JSON.parse(thisCompose.value.val)
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
        ElMessage.error('请确认图片格式问 jpg/png/gif')
        return false
    } else if (rawFile.size / 1024 > 500) {
        ElMessage.error('请确认图片小于500kb!')
        return false
    }
    return true
}

const deleteImage = (index: number) => {
    DeleteImage(val.value.picList[index])
    val.value.picList.splice(index, 1)
    ComposeUpdateVal(thisCompose.value.id, JSON.stringify(val.value)).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
        if (res.state == 200) {
            thisCompose.value = res.data
            val.value = JSON.parse(thisCompose.value.val)
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const getOSIPic = async () => {
    // const element = document.getElementById('measurementslive_iframe').contentWindow.document;
    // console.log(element)
    //     if (!element) {
    //         ElMessage.warning("请确认measurementslive中已开启Oscilloscope")
    //     } else {
    //         const canvas = await html2canvas(element, {
    //             logging: true,
    //             allowTaint: false, // 是否允许跨域图像污染画布
    //             useCORS: true // 是否使用 CORS 处理跨域问题
    //         });
    //         console.log(canvas)
    //         const imgData = canvas.toDataURL('image/png');
    //         console.log(canvas)
    //         const downloadLink = document.createElement('a');
    //         downloadLink.href = imgData;
    //         downloadLink.download = 'measurementslive.png'; // 设置保存文件的名称
    //         document.body.appendChild(downloadLink);
    //         downloadLink.click();
    //         document.body.removeChild(downloadLink);
    //     }
}


const initThisCompose = () => {
    if (articleId.value && typeof (index.value) == 'number') {
        GetComposeData(articleId.value, index.value).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
            if (res.state == 200) {
                thisCompose.value = res.data
                val.value = JSON.parse(thisCompose.value.val)
                // console.log(val.value)
            } else {
                ElMessage.warning("上传图片组件数据初始化失败")
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
        if (props.compose.answer) {
            val.value = JSON.parse(props.compose.answer)
        }
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
.upload-demo {
    width: 100%;
}

.el-upload-dragger:deep() {
    padding: 0 0;
}

.image-container {
    position: relative;
    display: inline-block;
    /* 确保容器大小适合内容 */
}

.delete-button {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
}
</style>