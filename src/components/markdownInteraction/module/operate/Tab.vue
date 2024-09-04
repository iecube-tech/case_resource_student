<!-- Tab -->
<template>
    <div class="summing-unit">
        <el-row style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
            <span style="background-color: #33b8b9;margin-right: 1em;"> Tab-{{ SIGEX['tab'] }} </span>
            <el-button type="primary" size="small" @click="zhixin()">执行</el-button>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetComposeData } from '../../api/getCompose'
import { ElMessage } from 'element-plus';
import { SendToSIGEX } from '../../socket/send'
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
    id: number,
    pstId: number,
    pstArticleId: number,
    index: number
    name: string,
    val: string,
    answer: string,
    score: number,
    result: number,
    status: number,
}

const composeEdit = ref(false)
const canEdit = ref(true)
const articleId = ref(null) // 组件所在文章id
const index = ref(null) // 组件在文章中的位置
const readOver = ref(false)

const val = ref({
    "tab": 1,
})
const question = ref()
const qType = 0

const thisCompose = ref<compose | null>()

const SIGEX = ref({
    "tab": 1,
})

const paramsInit = () => {
    if (props.editParam) {
        if (typeof props.editParam[1] !== 'undefined' && props.editParam[1] !== null) {
            if (!isNaN(<number><unknown>props.editParam[1].trim())) {
                val.value['tab'] = Number(<number><unknown>props.editParam[1].trim())
                SIGEX.value['tab'] = Number(<number><unknown>props.editParam[1].trim())
            } else {
                val.value['tab'] = 1
                SIGEX.value['tab'] = 1
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
}

paramsInit()

const initThisCompose = () => {
    if (articleId.value && index.value) {
        GetComposeData(articleId.value, index.value).then(res => {
            if (res.state == 200) {
                thisCompose.value = res.data
                val.value = JSON.parse(thisCompose.value.val)
            } else {
                ElMessage.warning("Tab组件数据初始化失败")
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

const zhixin = () => {
    try {
        SendToSIGEX(SIGEX.value).then(res => {
            if (res == undefined) {
                ElMessage.error("指令未执行成功")
            } else {
                // console.log(res)
                ElMessage.success("指令已下发")
            }
        })
    } catch (e) {
        ElMessage.error("指令未执行成功")
    }
}

const autoSend = () => {
    if (typeof props.editParam[2] !== 'undefined' && props.editParam[2] !== null) {
        console.log(props.editParam[2].trim())
        console.log(props.editParam[2].trim() == 'auto')
        if (props.editParam[2].trim() == 'auto') {
            zhixin()
        }
    }
    return
}


defineExpose({
    val,
    question,
    qType,
})
onMounted(() => {
    initThisCompose()
    autoSend()
})
</script>
<style scoped>
.summing-unit {
    margin-top: 1em;
    margin-bottom: 1em;
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