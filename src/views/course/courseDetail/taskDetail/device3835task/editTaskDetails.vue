<template>
    <div>
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
            <el-row>
                <span style="font-size: 16px; font-weight: bold; padding-left: 20px;">回答下列问题</span>
            </el-row>
            <div v-for="(item, i) in taskQuestions" :key="GenNonDuplicateID()" style=" margin-top: 20px;">
                <el-row style="padding-left: 30px;">
                    <p>{{ item.question }}</p>
                </el-row>
                <el-row style="justify-content: center;">
                    <el-input style="margin-top: 10px; width: 90%;" autosize type="textarea" v-model="item.answer"
                        @change="updateTaskDetailsHandle()"></el-input>
                </el-row>
            </div>
        </div>
        <el-row style="justify-content: center; margin-top: 20px;">
            <el-button v-if="myTaskIsSubmit == false || myTaskIsSubmit == null" type="primary"
                @click="submit()">提交</el-button>
            <el-button v-else type="success">已提交</el-button>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import dataTable from "@/views/course/courseDetail/taskDetail/dataTable/table.vue";
import { GetPSTDetailDevice } from '@/apis/pstDetailDevice/getPSTDetailDevice';
import { UpdatePSTDetailDevice } from '@/apis/pstDetailDevice/updatePSTDetailDevice'
import { ElMessage } from 'element-plus';
import { Submit } from '@/apis/pstDetailDevice/submit';

onBeforeMount(() => {
    initPage()
    setTimeout(() => {

    }, 500)
})

const initPage = () => {
    pstId.value = props.pstId
    lockStatus.value = props.lock
    taskDetails.value = JSON.parse(<string>props.taskDetails)
    taskDataTables.value = JSON.parse(<string>taskDetails.value?.taskDataTables)
    taskQuestions.value = JSON.parse(<string>taskDetails.value?.taskQestion)
    getMytaskDetails()
}

const props = defineProps({
    pstId: Number,
    taskDetails: String,
    lock: Boolean,
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
    UpdatePSTDetailDevice(pstId.value, myTaskDetails.value).then(res => {
        if (res.state == 200) {
            if (res.data != null) {
                genMyTaskDetail(res.data)
                ElMessage({
                    message: '自动保存',
                    type: 'success',
                    duration: 1500
                })
            }

        } else {
            ElMessage.error(res.message)
        }
    })
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
        taskDataTables.value = JSON.parse(<string>taskDetails.value?.taskDataTables)
        taskQuestions.value = JSON.parse(<string>taskDetails.value?.taskQestion)
    }

    myTaskIsSubmit.value = myTaskDetails.value?.submit
}

const submit = () => {
    if (myTaskDetails.value.id == null) {
        ElMessage.warning("未添加内容")
        return
    }
    Submit(pstId.value).then(res => {
        if (res.state == 200) {
            if (res.data != null) {
                genMyTaskDetail(res.data)
            }
        }
        else {
            ElMessage.error(res.message)
        }
    })
}



</script>
<style scoped></style>