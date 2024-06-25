<template>
    <div class="edit_task_container">
        <div ref="quesAndAnswer" class="quesAndAnswer">
            <div v-if="taskDataTables && taskDataTables.length > 0">
                <el-row>
                    <span style="font-size: 16px; font-weight: bold; padding-left: 20px;">完善下列数据表格</span>
                </el-row>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <el-card v-for="(item, i) in taskDataTables" :key="GenNonDuplicateID()" shadow="hover"
                        style="margin-top:20px; width:90%">
                        <dataTable :table-date="item" :key="'dataTable' + GenNonDuplicateID()"
                            @tableChanged="updateTaskDetailsHandle()">
                        </dataTable>
                    </el-card>
                </div>
            </div>
            <div v-if="taskQuestions.length > 0" style="margin-top: 20px;">
                <div v-for="(item, i) in taskQuestions" :key="'qa' + i" class="question_list">
                    <MdPreview :editorId="'question_' + i" :modelValue="item.question" />
                    <div class="editor_container">
                        <MdEditor :editorId="'editor' + i" v-model="item.answer" :toolbarsExclude="<any>toolbarsExclude"
                            @onUploadImg="onUploadImg" noImgZoomIn :preview=false :footers="['markdownTotal', '=']"
                            @onSave="updateTaskDetailsHandle()" @on-blur="updateTaskDetailsHandle()" />
                    </div>
                    <!-- <div v-else class="answer">
                        <MdPreview :editorId="'answer_' + i" :modelValue="item.answer" />
                    </div> -->
                </div>
            </div>
        </div>
        <el-row v-if="taskQuestions.length > 0 || taskDataTables.length > 0"
            style="justify-content: center; margin-top: 20px;">
            <el-button v-if="myTaskIsSubmit == false || myTaskIsSubmit == null" type="primary"
                @click="SureToSubmitDialog = true">提交</el-button>
            <el-button v-else type="success">已提交</el-button>
            <!-- <el-button @click="submitHtml()">测试</el-button> -->
        </el-row>
        <el-dialog v-model="SureToSubmitDialog" title="提示" width="500" align-center>
            <span>提交后不可更改，确定提交吗?</span><br />
            <span>若涉及分组实验，确定提交后组内成员将全部提交！</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="SureToSubmitDialog = false">取消</el-button>
                    <el-button type="primary" @click="submit()">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, onMounted } from 'vue';
import dataTable from "./dataTable/table.vue";
import { GetPSTDetailDevice } from '@/apis/pstDetailDevice/getPSTDetailDevice';
import { UpdatePSTDetailDevice } from '@/apis/pstDetailDevice/updatePSTDetailDevice';
import { UpdateGroupPSTDetailDevice } from '@/apis/pstDetailDevice/updateGroupPSTDetailDevice'
import { ElMessage } from 'element-plus';
import { Submit } from '@/apis/pstDetailDevice/submit';
import { GroupSubmit } from '@/apis/pstDetailDevice/groupSubmit';
import { MdEditor } from 'md-editor-v3';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'md-editor-v3/lib/preview.css';
import { ElLoading } from 'element-plus'
// import '@/styles/mdEditor/style.css';
import axios from 'axios';
import { SubmitHtml } from '@/apis/pstDetailDevice/submitHtml';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const vditorList = ref([])

onBeforeMount(() => {
    initPage()
    setTimeout(() => {

    }, 500)
})
const a = ref('')
onMounted(() => {
    for (let i = 0; i < taskQuestions.value.length; i++) {

    }
})
const htmlValue = ref({
    html: ''
})
const quesAndAnswer = ref()
const useEditor = ref(true)
const submitHtml = () => {
    downloadPDF();
}

// 下载PDF方法
const downloadPDF = async () => {
    // 获取要复制的DOM元素
    const originalElement = quesAndAnswer.value;
    // 使用cloneNode()方法进行深拷贝
    const element = originalElement.cloneNode(true);
    element.style.width = "1120px"
    // 将复制的元素插入到DOM树中的指定位置
    document.body.appendChild(element);

    // await new Promise(resolve => window.onload = resolve);

    const canvas = await html2canvas(element, {
        logging: true,
    });


    const imgData = canvas.toDataURL('image/png', 1.0);
    console.log(canvas)
    const downloadLink = document.createElement('a');
    downloadLink.href = imgData;
    downloadLink.download = 'canvas_image.png'; // 设置保存文件的名称

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.width, canvas.height * pdf.internal.pageSize.width / canvas.width); // 数据， 图像， 0,0 width， height
    pdf.save('quesAndAnswer.pdf');
    document.body.removeChild(element)
};

const toolbarsExclude = [
    'underline',
    'italic',
    'table',
    'strikeThrough',
    'task',
    'mermaid',
    'katex',
    'htmlPreview',
    'github',
    'pageFullscreen',
    'fullscreen',
    'catalog',
]

const onUploadImg = async (files: any, callback: any) => {
    const res = await Promise.all(
        files.map((file: any) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', file);
                axios.post('/dev-api/files/e/image', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'access-control-allow-origin': '*',
                        'access-control-expose-headers': '*',
                        'access-control-expose-methods': '*',
                    }
                })
                    .then((res) => rev(res))
                    .catch((error) => rej(error));
            });
        })
    );
    // 方式一
    // callback(res.map((item) => 'http://172.27.148.103:5173/dev-api' + item.data.data.url));

    // 方式二
    callback(
        res.map((item: any) => ({
            url: 'http://www.iecube.online/dev-api' + item.data.data.url,
            alt: item.data.data.alt,
            title: item.data.data.title,
        }))
    );
};
const saveArticle = () => {
    updateTaskDetailsHandle()
    console.log()
}

const initPage = () => {
    pstId.value = props.pstId
    lockStatus.value = false
    if (props.lock) {
        lockStatus.value = props.lock
    }
    taskDetails.value = JSON.parse(<string>props.taskDetails)
    if (taskDetails.value?.taskDataTables && taskDetails.value?.taskDataTables != '') {
        taskDataTables.value = JSON.parse(<string>taskDetails.value?.taskDataTables)
    } else {
        taskDataTables.value = null
    }
    if (taskDetails.value?.taskQestion && taskDetails.value?.taskQestion != '') {
        taskQuestions.value = JSON.parse(<string>taskDetails.value?.taskQestion)
        for (let i = 0; i < taskQuestions.value.length; i++) {
            if (!taskQuestions.value[i].answer) {
                taskQuestions.value[i].answer = ''
            }
        }
    } else {
        taskQuestions.value = null
    }
    getMytaskDetails()
}

const props = defineProps({
    pstId: Number,
    taskDetails: String,
    lock: Boolean,
    useGroup: Number,
    groupId: Number,
})

const taskDetails = ref()
const taskDataTables = ref()
const taskQuestions = ref()
const pstId = ref()
const lockStatus = ref(false)
const myTaskDetails = ref({
    id: null,
    pstId: null,
    data: null,
    submit: null,
})
const myTaskIsSubmit = ref()

function GenNonDuplicateID() {
    return (Date.now() * Math.random()).toString(36).substring(5, 9)
}

const updateTaskDetailsHandle = () => {
    if (myTaskIsSubmit.value == true) {
        ElMessage.warning("您已提交，将不做保存")
        return
    }
    let updatedDetails = {
        taskDataTables: '',
        taskQestion: ''
    }
    updatedDetails.taskDataTables = JSON.stringify(taskDataTables.value)
    updatedDetails.taskQestion = JSON.stringify(taskQuestions.value)
    myTaskDetails.value.data = <any>JSON.stringify(updatedDetails)
    if (props.useGroup == 1) {
        if (!props.groupId) {
            ElMessage.warning("本实验为分组实验，请先创建或加入小组")
            return
        }
        UpdateGroupPSTDetailDevice(props.groupId, pstId.value, myTaskDetails.value).then(res => {
            if (res.state == 200) {
                if (res.data != null) {
                    genMyTaskDetail(res.data)
                    ElMessage({
                        message: '已保存',
                        type: 'success',
                        duration: 1500
                    })
                }

            } else {
                ElMessage.error(res.message)
            }
        })

    } else {
        UpdatePSTDetailDevice(pstId.value, myTaskDetails.value).then(res => {
            if (res.state == 200) {
                if (res.data != null) {
                    genMyTaskDetail(res.data)
                    ElMessage({
                        message: '已保存',
                        type: 'success',
                        duration: 1500
                    })
                }

            } else {
                ElMessage.error(res.message)
            }
        })
    }
}

const getMytaskDetails = () => {
    GetPSTDetailDevice(pstId.value).then(res => {
        if (res.state == 200) {
            if (res.data != null) {
                genMyTaskDetail(res.data)
            }
        } else {
            ElMessage.error(res.message)
        }
    })
}

const genMyTaskDetail = (data: object) => {
    myTaskDetails.value = <any>data
    if (myTaskDetails.value.data && myTaskDetails.value.data != '') {
        taskDetails.value = JSON.parse(<string>myTaskDetails.value?.data)
        if (taskDetails.value?.taskDataTables && taskDetails.value?.taskDataTables != '') {
            taskDataTables.value = JSON.parse(<string>taskDetails.value?.taskDataTables)
        } else {
            taskDataTables.value = null
        }
        if (taskDetails.value?.taskQestion && taskDetails.value?.taskQestion != '') {
            taskQuestions.value = JSON.parse(<string>taskDetails.value?.taskQestion)
            for (let i = 0; i < taskQuestions.value.length; i++) {
                if (!taskQuestions.value[i].answer) {
                    taskQuestions.value[i].answer = ''
                }
            }
        } else {
            taskQuestions.value = null
        }
    }

    myTaskIsSubmit.value = myTaskDetails.value?.submit
}
const SureToSubmitDialog = ref(false)
const submit = () => {
    if (myTaskDetails.value.id == null) {
        ElMessage.warning("未添加内容或请先保存编辑框内容")
        SureToSubmitDialog.value = false
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    if (props.useGroup == 1) {
        if (!props.groupId) {
            ElMessage.warning("本实验为分组实验，请先创建或加入小组")
            loading.close();
            return
        }
        GroupSubmit(props.groupId, pstId.value).then(res => {
            if (res.state == 200) {
                if (res.data != null) {
                    genMyTaskDetail(res.data)
                    loading.close();
                }
            }
            else {
                ElMessage.error(res.message)
                loading.close();
            }
        })
    } else {
        Submit(pstId.value).then(res => {
            if (res.state == 200) {
                if (res.data != null) {
                    ElMessage.success("提交成功")
                    loading.close();
                    genMyTaskDetail(res.data)
                }
            }
            else {
                ElMessage.error(res.message)
                loading.close();
            }
        })
    }
    SureToSubmitDialog.value = false
}



</script>
<style scoped>
.question_list {
    padding-left: 30px;
}

.editor_container {
    padding-left: 2em;
}

.edit_task_container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.quesAndAnswer {
    width: 100%;
    /* max-width: 1120px; */
}
</style>