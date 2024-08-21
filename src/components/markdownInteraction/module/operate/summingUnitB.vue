<template>
    <div class="summing-unit">
        <div class="image">
            <img src="../svg/b.svg" alt="">
        </div>
        <div class="operation">
            <div>
                <span>
                    b<sub>0</sub>&nbsp
                </span>
            </div>
            <el-input-number v-model="val.b0" :precision="3" :step="0.002" size="small" :max="2" :min="-2" />
            <div style="margin-left: 20px;">
                <span>
                    b<sub>1</sub>&nbsp
                </span>
            </div>
            <el-input-number v-model="val.b1" :precision="3" :step="0.002" size="small" :max="2" :min="-2" />
            <div style="margin-left: 20px;">
                <span>
                    b<sub>2</sub>&nbsp
                </span>
            </div>
            <el-input-number v-model="val.b2" :precision="3" :step="0.002" size="small" :max="2" :min="-2" />
            <el-button type="primary" style="margin-left: 20px;" size="small">执行</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetComposeData } from '../../api/getCompose'
import { ElMessage } from 'element-plus';
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

const val = ref({
    b0: 1.000,
    b1: 0.000,
    b2: 0.000,
})
const question = ref()
const qType = 0

const thisCompose = ref<compose | null>()
const SIGEX = {}


const initThisCompose = () => {
    if (articleId.value && index.value) {
        GetComposeData(articleId.value, index.value).then(res => {
            if (res.state == 200) {
                thisCompose.value = res.data
                val.value = JSON.parse(thisCompose.value.val)
            } else {
                ElMessage.warning("加法器b组件数据初始化失败")
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
    question,
    qType,
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