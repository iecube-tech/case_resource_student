<template>
    <div>
        <pageHeader :route=route />
        <el-row style="padding: 20px 0;">
            <el-col :span="10" style="display: flex; flex-direction: column; justify-content: center; ">
                <el-row>
                    <h1 style="font-size: 46px; color: #33b8b9;">{{ thisProject.projectName }}</h1>
                </el-row>
                <el-row>
                    <p>时间：{{ formatDate(thisProject.startTime) + ' 至 ' + formatDate(thisProject.endTime) }}</p>
                </el-row>
                <el-row style="overflow: hidden;">
                    <p>{{ thisProject.introduction }}</p>
                </el-row>
            </el-col>
            <el-col :span="14" style="display: flex; justify-content: flex-end;">
                <img v-if="thisProject.cover" :src="'/local-resource/image/' + thisProject.cover" alt=""
                    style="width: auto; height: 31vh; object-fit: contain;">
            </el-col>
        </el-row>

        <el-row style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 30px;">
            <el-col style="display: flex;justify-content:flex-end;flex-direction: column;">
                <el-steps align-center>
                    <el-step v-for="i in myTasks.length" :key="i" :title="getGrade(myTasks[i - 1].taskGrade)"
                        :status="getstatus(myTasks[i - 1].taskStatus)" @click="changeCurrTask(i - 1)" />
                </el-steps>
            </el-col>
        </el-row>

        <div class="task">
            <div v-if="projectTaskDetail != null" class="task-module">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span class="task-module-title">任务{{ CurrTask + 1 }}：{{ projectTaskDetail.taskName }}</span>

                    <div v-if="myTaskDetail!.questionListSize > 0">
                        <el-button v-if="pageNum == 0" type="primary" link
                            @click="whichPage(myTaskDetail!.questionListSize, myTaskDetail!.taskStatus, 1)">考核页面</el-button>
                        <el-button v-else type="primary" link
                            @click="whichPage(myTaskDetail!.questionListSize, myTaskDetail!.taskStatus, 0)">任务详情</el-button>
                    </div>
                </div>
                <div v-if="projectTaskDetail != null && myTaskDetail != null">
                    <PSTDetail v-if="pageNum == 0" :key="CurrTask" :indexValue="CurrTask" :projectTask="projectTaskDetail"
                        :myTask="<any>myTaskDetail" :projectStartTime="thisProject.startTime"
                        :projectEndTime="thisProject.endTime" @notify="handleNotify">
                    </PSTDetail>
                    <question v-else :key="myTaskDetail.pstid" :indexValue="CurrTask"
                        :taskName="<any>projectTaskDetail.taskName" :pstId="myTaskDetail.pstid">
                    </question>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import { ElMessage } from 'element-plus';
import pageHeader from '@/components/breadcrumb/index.vue'
import PSTDetail from './taskDetail/index.vue'
import question from '@/views/queston/index.vue'
import dayjs from 'dayjs'
import { Project } from '@/apis/project/project'
import { MyProjectDetail } from '@/apis/project/projectDetail'
import { PST } from '@/apis/project/getPST'

const CurrTask = ref(0)
const projectTaskDetail = ref<task>()
const myTaskDetail = ref<pst>()

const pageNum = ref(0)

const whichPage = (questionListSize: number, taskStates: number, page?: number) => {
    console.log(questionListSize, taskStates, page)
    if (questionListSize == 0) {
        pageNum.value = 0
        return
    }
    if (page == 0) {
        pageNum.value = 0
        return
    }
    if (page == 1) {
        pageNum.value = 1
        return
    }

    if (questionListSize > 0 && taskStates >= 2) {
        pageNum.value = 1
    } else {
        pageNum.value = 0
    }
    return
}  // 0: 实验/任务页面  1: 考核页面

const route = useRoute()
const projectId = route.params.id

const thisProject = ref({
    id: projectId,
    caseId: null,
    cover: "",
    createTime: "",
    creator: null,
    creatorType: null,
    endTime: "",
    introduce: "",
    introduction: "",
    lastModifiedTime: null,
    lastModifiedUser: null,
    projectName: "",
    startTime: "",
    target: "",
})

const formatDate = (time: string | Date) => {
    if (!time) {
        return '未设置时间节点'
    }
    return dayjs(time).format('YYYY年MM月DD日 HH:mm')
}

const getGrade = (grade: number) => {
    if (grade) {
        return grade.toString()
    }
    return ''
}

const getstatus = (status: number) => {
    if (!status || status == 0) {
        return 'wait'
    }
    else if (status === 1) {
        return 'process'
    }
    else if (status >= 2) {
        return 'finish'
    }
}

// 子组件执行完成后回调
const handleNotify = async (msg: any) => {
    // console.log(msg)
    await PST(Number(projectId)).then(res => {
        if (res.state == 200) {
            myTasks.value = res.data
            myTaskDetail.value = myTasks.value[CurrTask.value]
            whichPage(myTaskDetail.value.questionListSize, myTaskDetail.value.taskStatus)
            // console.log(myTasks.value);
        } else {
            ElMessage.error(res.message)
        }
    })
}

const changeCurrTask = (index: number) => {
    CurrTask.value = index
    projectTaskDetail.value = project.value.projectTaskList[index]
    myTaskDetail.value = myTasks.value[index]
    whichPage(myTaskDetail.value.questionListSize, myTaskDetail.value.taskStatus)
    // console.log(CurrTask.value)
    // console.log(projectTaskDetail.value)
    // console.log(myTaskDetail.value)
}


interface project {
    projectName: String
    projectCover: String
    projectIntroduction: String
    projectTarget: String
    projectIntroduce: String
    projectTaskList: [task]
}

interface task {
    id: number
    projectId: number
    num: number
    taskName: String
    backDrops: [{
        id: number
        name: String
    }]
    taskTargets: [{
        id: number
        name: String
    }]
    taskDeliverables: [{
        id: number
        name: String
    }]
    taskReferenceFiles: [resource]
    taskReferenceLinks: [{
        id: number
        name: String
        url: string
    }]
    taskStartTime: Date
    taskEndTime: Date
    questionListSize: number
}
interface resource {
    createTime: Date
    creator: number
    filename: String
    id: number
    lastModifiedTime: Date
    lastModifiedUser: number
    name: String
    originFilename: String
    type: String
}

interface pst {
    pstid: number
    resources: [
        {
            id: number
            pstId: number
            readOver: resource
            resource: resource

        }
    ]
    taskContent: String
    taskEvaluate: String
    taskGrade: number
    taskImprovement: String
    taskName: String
    taskNum: number
    taskResubmit: number
    taskStatus: number
    taskTags: String
    questionListSize: number
}

const project = ref<project>({
    projectName: '',
    projectCover: '',
    projectIntroduction: '',
    projectTarget: '',
    projectIntroduce: '',
    projectTaskList: [{
        id: 0,
        projectId: 0,
        num: 0,
        taskName: '',
        taskTargets: [{
            id: 0,
            name: '',
        }],
        backDrops: [{
            id: 0,
            name: ''
        }],
        taskDeliverables: [{
            id: 0,
            name: '',
        }],
        taskReferenceFiles: [{
            createTime: new Date,
            creator: 0,
            filename: '',
            id: 0,
            lastModifiedTime: new Date,
            lastModifiedUser: 0,
            name: '',
            originFilename: '',
            type: '',
        },],
        taskReferenceLinks: [{
            id: 0,
            name: '',
            url: '',
        }],
        taskStartTime: new Date,
        taskEndTime: new Date,
        questionListSize: 0,
    }],
})

const myTasks = ref<[pst]>([
    {
        pstid: 0,
        resources: [
            {
                id: 0,
                pstId: 0,
                readOver: {
                    createTime: new Date,
                    creator: 0,
                    filename: '',
                    id: 0,
                    lastModifiedTime: new Date,
                    lastModifiedUser: 0,
                    name: '',
                    originFilename: '',
                    type: '',
                },
                resource: {
                    createTime: new Date,
                    creator: 0,
                    filename: '',
                    id: 0,
                    lastModifiedTime: new Date,
                    lastModifiedUser: 0,
                    name: '',
                    originFilename: '',
                    type: '',
                },
            }
        ],
        taskContent: '',
        taskEvaluate: '',
        taskGrade: 0,
        taskImprovement: '',
        taskName: '',
        taskNum: 0,
        taskResubmit: 0,
        taskStatus: 0,
        taskTags: '',
        questionListSize: 0,
    }
])

onBeforeMount(async () => {
    //课程信息
    await Project(Number(projectId)).then(res => {
        if (res.state == 200) {
            thisProject.value = res.data
        } else {
            ElMessage.error("获取课程信息异常")
        }
    })

    await MyProjectDetail(Number(projectId)).then(res => {
        if (res.state == 200) {
            project.value = res.data
            // console.log(project.value);
        } else {
            ElMessage.error(res.message)
        }

    })

    await PST(Number(projectId)).then(res => {
        if (res.state == 200) {
            // console.log(res);
            myTasks.value = res.data
            // console.log(myTasks.value);
            for (let i = 0; i < myTasks.value.length; i++) {
                if (myTasks.value[i].taskStatus >= 1) {
                    CurrTask.value = i
                }
            }
            projectTaskDetail.value = project.value.projectTaskList[CurrTask.value]
            myTaskDetail.value = myTasks.value[CurrTask.value]
            whichPage(myTaskDetail.value.questionListSize, myTaskDetail.value.taskStatus)
            // console.log("c" + CurrTask.value)
        } else {
            ElMessage.error(res.message)
        }
    })
})

</script>
<style scoped>
.task {
    background-color: #ffffff;
    padding: 30px 3.125vw;
    display: flex;
    flex-direction: column;
}

.task-module {
    padding: 20px 0;
}


.task-module-title {
    color: #33b8b9;
    font-size: 24px;
    padding: 10px 0;
}
</style>