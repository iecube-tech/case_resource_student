<template>
    <div v-if="!readOver" style="margin: 2em 0;">
        <el-row v-if="val.filename && val.filename != ''">
            <div v-if="video != null && video.isReady === 1" key="ready" class="video">
                <div class="video_container" :title="question">
                    <VideoPlayer class="video-player" :video="video" />
                </div>
            </div>
            <div v-else key="notready" class="video">
                视频转码中，请稍候刷新...
                <el-button link type="primary" @click="getVideo(video.filename)" :icon="Refresh"></el-button>
            </div>
        </el-row>
        <el-row v-else style="margin-top: 1em; margin-bottom: 1em; justify-content: center;">
            <div v-if="!canEdit" style="background-color: #33b8b9;">
                视频组件：暂未上传视频；请在答案预设页面上传视频
            </div>
        </el-row>

        <el-row v-if="composeEdit" style="margin-top: 1em; margin-bottom: 1em; justify-content: center;">
            <el-upload class="upload-demo" drag action="/dev-api/video/n/up" :headers="headers" multiple
                :on-success="UpVideoSuccess" :show-file-list="false" :before-upload="beforeVideoUpload">
                <el-icon class="el-icon--upload">
                    <UploadFilled />
                </el-icon>
                <div class="el-upload__text">
                    将视频拖入 或 <em>点击上传</em>
                </div>
            </el-upload>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { GetComposeData } from '../../api/getCompose'
import { ComposeUpdateVal } from '../../api/composeUpdateVal'
import { GetVideo } from '../../api/getVideo'
import type { MessageParamsWithType, UploadProps } from 'element-plus'
import { UploadFilled, Delete, Refresh } from '@element-plus/icons-vue'
import katex from 'katex';
import VideoPlayer from "../child/video.vue"

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
    onlyShow: boolean | null
}

interface val {
    filename: string
}

const headers = ref({
    'x-access-token': localStorage.getItem("x-access-token"),
    'x-access-type': localStorage.getItem("x-access-type")
})

const question = ref()
const composeEdit = ref(false)
const canEdit = ref(false)
const articleId = ref() // 组件所在文章id
const index = ref() // 组件在文章中的位置
const readOver = ref(false)
const args = ref([])

const qType = 7
const subjective = ref(true)
const val = ref<val>({
    filename: ''
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
    onlyShow: true
})

const paramsInit = () => {
    if (props.editParam) {
        if (typeof props.editParam[1] !== 'undefined' && props.editParam[1] !== null) {
            question.value = (props.editParam[1]).replace(/\${2}(.+?)\${2}/g, (match, p1) => {
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
            ElMessage.success("已设定")
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const UpVideoSuccess = (res: { data: { filename: string; }; }) => {
    val.value.filename = res.data.filename
    saveVal()
    setTimeout(() => { getVideo(val.value.filename) }, 1000)
}

const beforeVideoUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'video/mp4') {
        ElMessage.error('请确认视频格式为 MP4')
        return false
    } else if (rawFile.size / 1024 / 1024 > 200) {
        ElMessage.error('请确认视频小于200MB!')
        return false
    }
    return true
}




const initThisCompose = () => {
    if (articleId.value && typeof (index.value) == 'number') {
        GetComposeData(articleId.value, index.value).then((res: { state: number; data: compose; message: MessageParamsWithType; }) => {
            if (res.state == 200) {
                thisCompose.value = res.data
                val.value = JSON.parse(thisCompose.value.val)
                // console.log(val.value)
                getVideo(val.value.filename)
            } else {
                ElMessage.warning("视频数据初始化失败")
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

const video = ref()
const getVideo = (filename: string) => {
    if (filename && filename != '') {
        GetVideo(filename).then(res => {
            if (res.state == 200) {
                video.value = res.data
            } else {
                ElMessage.warning(res.message)
            }
        })
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
.upload-demo {
    width: 100%;
}

.el-upload-dragger:deep() {
    padding: 0 0;
}

.video {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 1s ease-in-out, transform 0.5s ease-in-out;
    opacity: 1;
}

.video_container {
    width: 80%;
    position: relative;
    overflow: hidden;
    transition: opacity 1s ease-in-out, transform 0.5s ease-in-out;
    opacity: 1;
}

.video_container::after {
    display: block;
    padding-top: 56.25%;
    /* 16:9 的比例 (9 / 16 = 0.5625 = 56.25%) */
}
</style>