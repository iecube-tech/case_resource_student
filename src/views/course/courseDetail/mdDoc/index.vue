<template>
    <div v-loading="loading">
        <div v-if="initStatus">
            <el-row class="article_title" :id="projectTask.taskName">{{ projectTask.taskName }}</el-row>
            <MdPreview :editorId="'article' + pstArticle.id" :modelValue="pstArticle.content" />
            <el-row v-if="initStatus" style="flex-direction: row; align-items: center; justify-content: center;">
                <el-button v-if="myTask.taskStatus >= 2" type="success">已提交</el-button>
                <el-button v-else type="primary" @click="submit()">提交</el-button>
            </el-row>
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/index';
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
import { ElMessage } from 'element-plus';
import { replace } from '@/components/markdownInteraction/script/relpace'
import '@/components/markdownInteraction/style/replaced.css'
import { PSTSubmite } from '@/apis/project/task/submit'

const userStore = useUserStore()
const { getUser } = userStore


const props = defineProps({
    currTaskIndex: Number,
    projectTask: Object,
    myTask: Object,
    useGroup: Number,
    groupId: Number,
})
console.log(props)

const userId = ref()
const currTaskIndex = ref()
const projectTask = ref()
const myTask = ref()
const initStatus = ref(false)
const loading = ref(false)

const pstArticle = ref({
    id: null,
    pstId: null,
    chapterName: null,
    content: '',
    catalogue: null,
})

const initPage = () => {
    userId.value = getUser()?.id
    currTaskIndex.value = props.currTaskIndex
    projectTask.value = props.projectTask
    myTask.value = props.myTask //pst 详情
    pstArticle.value = myTask.value.pstArticle
    initStatus.value = true
}

const submit = async () => {
    // console.log(currTaskIndex.value)
    // console.log(projectTask.value)
    console.log(myTask.value)
    console.log(myTask.value.taskStatus)
    loading.value = true
    initStatus.value = false
    await PSTSubmite(myTask.value.pstid).then(res => {
        if (res.state == 200) {
            myTask.value = res.data
            initStatus.value = true
            loading.value = false
        }
        else {
            ElMessage.error(res.message)
            initStatus.value = true
            loading.value = false
        }
    })
    setTimeout(() => {
        replace(pstArticle.value.id, false, false)
    }, 300)
}

onMounted(async () => {
    await initPage()
    await setTimeout(() => {
        if (myTask.value.taskStatus >= 2) {
            replace(pstArticle.value.id, false, false)
        } else {
            replace(pstArticle.value.id, false, true)
        }

    }, 300)
})

</script>

<style scoped>
.article_title {
    padding-top: 1.5em;
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 2.2em;
    color: #33b8b9;
}
</style>

<style>
.example-showcase .el-loading-mask {
    z-index: 9;
}
</style>
