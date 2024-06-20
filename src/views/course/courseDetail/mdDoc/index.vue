<template>
    <div>
        <el-row class="article_title" :id="article.chapterName">{{ projectTask.taskName }}</el-row>
        <MdPreview :editorId="'article' + article.articleId" :modelValue="article.content" />
        <editTaskDetails v-if="projectTask.taskDetails" :task-details="projectTask.taskDetails" :pst-id="myTask.pstid"
            :useGroup="props.useGroup" :groupId="props.groupId">
        </editTaskDetails>

    </div>

</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store/index';
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
import { GetArticleVo } from '@/apis/md_doc/getArticleVo'
import { ElMessage } from 'element-plus';
import editTaskDetails from './taskEdit/editTaskDetails.vue';


const userStore = useUserStore()
const { getUser } = userStore


const props = defineProps({
    currTaskIndex: Number,
    projectTask: Object,
    myTask: Object,
    useGroup: Number,
    groupId: Number,
})

const initPage = () => {
    userId.value = getUser()?.id
    currTaskIndex.value = props.currTaskIndex
    projectTask.value = props.projectTask
    taskMdDoc.value = projectTask.value.taskMdDoc
    myTask.value = props.myTask
    console.log(projectTask.value)
    console.log(myTask.value)
    initStats.value = true
}

const taskMdDoc = ref()
watch(taskMdDoc, (newValue, oldValue) => {
    if (newValue) {
        getArticle(newValue)
    }
})

const initStats = ref(false)
const userId = ref()
const currTaskIndex = ref()
const projectTask = ref()
const myTask = ref()

const article = ref({
    chapterId: null,
    courseId: null,
    articleId: null,
    chapterName: null,
    content: '',
    catalogue: null,
    readNum: null,
})


const getArticle = (id: number) => {
    GetArticleVo(id).then(res => {
        if (res.state == 200) {
            article.value = res.data
            article.value.content = deleteAfterChar(article.value.content, "\n# 思考题\n")
        } else {
            ElMessage.error(res.message)
        }
    })
}

const deleteAfterChar = (str: string, char: string) => {
    // 找到特定字符的位置
    var index = str.indexOf(char);
    // 如果找到了特定字符，则截取从开始到该字符位置的子串
    if (index !== -1) {
        return str.substring(0, index + 7); // 包括特定字符本身
    } else {
        return str; // 如果未找到特定字符，则返回原字符串
    }
}



onBeforeMount(() => {
    initPage()
})

onMounted(() => {

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
