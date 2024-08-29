<template>
    <div>
        <pageHeader :route=route />
        <el-row style="padding: 20px 0;">
            <el-col :span="10" style="display: flex; flex-direction: column; justify-content: center; ">
                <el-row>
                    <h1 style="font-size: 4.6rem; color: #33b8b9;">{{ thisProject.projectName }}</h1>
                </el-row>
                <el-row>
                    <p>时间：{{ formatDate(thisProject.startTime) + ' 至 ' + formatDate(thisProject.endTime) }}</p>
                </el-row>
                <!-- <el-button @click="webSocketClose()">断开</el-button> -->
                <el-row style="overflow: hidden;">
                    <p>{{ thisProject.introduction }}</p>
                </el-row>
            </el-col>
            <el-col :span="14" style="display: flex; justify-content: flex-end;">
                <img v-if="thisProject.cover" :src="'/local-resource/image/' + thisProject.cover" alt=""
                    style="width: auto; height: 31vh; object-fit: contain;">
            </el-col>
        </el-row>
        <el-row v-if="thisProject.useRemote == 1" style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
            <remote ref="remoteChild" :projectId="thisProject.id" @appointmented="remoteAppointmented"></remote>
        </el-row>

        <el-row v-if="thisProject.useRemote == 1" style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
            <appointment ref="appointmentChild" :projectId="thisProject.id" @cancelAppointment="cancelAppointment">
            </appointment>
        </el-row>

        <el-row v-if="thisProject.useGroup == 1" style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
            <projectStudentGroup v-if="thisProject.id != null" :projectId="thisProject.id"
                :groupLimit="<any>thisProject.groupLimit" @HandleGroup="getGroupId" />
        </el-row>

        <el-card shadow='never'>
            <el-row v-if="projectMdCourseId">
                <courseMapping v-if="thisProject.caseId" :caseId="thisProject.caseId" />
            </el-row>

            <el-row v-if="myTasks.length > 1" style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 30px;">
                <el-col style="display: flex;justify-content:flex-end;flex-direction: column;">
                    <el-steps align-center>
                        <el-step v-for="i in myTasks.length" :key="i" :title="getGrade(myTasks[i - 1].taskGrade)"
                            :status="getstatus(i - 1)" @click="changeCurrTask(i - 1)" />
                    </el-steps>
                </el-col>
            </el-row>

            <div v-if="project.projectDeviceId == 1 && !projectMdCourseId" class="task" key="iecube3835">
                <device3835task ref="operate3835" v-if="step1 && step2 && step3" :key="CurrTask"
                    :curr-task-index="CurrTask" :project-task="projectTaskDetail" :socket="<WebSocket>socket"
                    :my-task="myTaskDetail" :useGroup="<any>thisProject.useGroup" :groupId="<any>groupId"
                    @lock-task-page="handleLock()" @unlock-task-page="handleUnlock()">
                </device3835task>
            </div>

            <div v-if="project.projectDeviceId && projectMdCourseId">
                <mdDoc v-if="step1 && step2 && step3" :key="CurrTask" :curr-task-index="CurrTask"
                    :project-task="projectTaskDetail" :my-task="myTaskDetail" :useGroup="<any>thisProject.useGroup"
                    :groupId="<any>groupId" />
            </div>

            <div v-if="!project.projectDeviceId && !projectMdCourseId" class="task" key="nodevice">
                <div v-if="step1 && step2 && step3" class="task-module">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="task-module-title">实验{{ CurrTask + 1 }}：{{ projectTaskDetail!.taskName }}</span>

                        <div v-if="myTaskDetail!.questionListSize > 0">
                            <el-button v-if="pageNum == 0" type="primary" link
                                @click="whichPage(myTaskDetail!.questionListSize, myTaskDetail!.taskStatus, 1)">考核页面</el-button>
                            <el-button v-else type="primary" link
                                @click="whichPage(myTaskDetail!.questionListSize, myTaskDetail!.taskStatus, 0)">任务详情</el-button>
                        </div>
                    </div>
                    <div v-if="myTaskDetail != null">
                        <PSTDetail v-if="pageNum == 0" :key="CurrTask" :indexValue="CurrTask"
                            :projectTask="projectTaskDetail!" :myTask="<any>myTaskDetail"
                            :projectStartTime="thisProject.startTime" :projectEndTime="thisProject.endTime"
                            @notify="handleNotify">
                        </PSTDetail>
                        <question v-else :key="myTaskDetail.pstid" :indexValue="CurrTask"
                            :taskName="<any>projectTaskDetail!.taskName" :pstId="myTaskDetail.pstid">
                        </question>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/index';
import { Project } from '@/apis/project/project'
import { MyProjectDetail } from '@/apis/project/projectDetail'
import { PST } from '@/apis/project/getPST';
import dayjs from 'dayjs'

import pageHeader from '@/components/breadcrumb/index.vue'
import PSTDetail from './taskDetail/index.vue'
import question from '@/views/queston/index.vue'
import projectStudentGroup from '@/views/group/index.vue'
import device3835task from '@/views/course/courseDetail/taskDetail/device3835task/index.vue'
import courseMapping from '@/views/course/courseDetail/courseMapping/index.vue'
import mdDoc from '@/views/course/courseDetail/mdDoc/index.vue'
import remote from "@/views/remote/remote.vue"
import appointment from "@/views/remote/appointment.vue"

const route = useRoute()
const projectId = route.params.id
const userStore = useUserStore()
const { getUser } = userStore
const userId = ref()

const CurrTask = ref(0)
const projectTaskDetail = ref<task>()
const myTaskDetail = ref<pst>()
const pageNum = ref(0)
const interval = ref()
const step1 = ref(false)
const step2 = ref(false)
const step3 = ref(false)
const pageReadyStatus = ref(false)

const operate3835 = ref<any>()

const whichPage = (questionListSize: number, taskStates: number, page?: number) => {
    // console.log(questionListSize, taskStates, page)
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

const thisProject = ref({
    id: <any>projectId,
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
    useGroup: null,
    groupLimit: null,
    deviceId: null,
    mdCourse: null,
    useRemote: null,
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

const getstatus = (index: number) => {
    if (index == CurrTask.value) {
        return 'finish'
    }
    if (!myTasks.value[index].taskStatus || myTasks.value[index].taskStatus < 2) {
        return 'wait'
    }
    else {
        return 'process'
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
const appointmentChild = ref()
const remoteChild = ref()
const remoteAppointmented = () => {
    appointmentChild.value.getStudentAppointmentedList()
}
const cancelAppointment = () => {
    remoteChild.value.getAppointmentList()
}


const changeCurrTask = (index: number) => {
    if (LockTaskPage.value == true) {
        return
    }
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
    projectDeviceId: number | null
    projectMdCourseId: number | null
    projectTaskList: [task]
}

interface task {
    id: number
    projectId: number
    num: number
    taskName: String
    taskDevice: number | null
    taskDataTables: string | null
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
    mdChapter: mdChapter | null
    taskMdDoc: number | null
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
    dataTables: string | null
}

interface message {
    from: string
    isConnecting: boolean
    userId: number
    projectId: number | null
    taskNum: number | null
    pstId: number | null
    snId: string | null
    lock: boolean
}

interface mdChapter {
    courseId: number
    id: number
    name: String
}

const project = ref<project>({
    projectName: '',
    projectCover: '',
    projectIntroduction: '',
    projectTarget: '',
    projectIntroduce: '',
    projectDeviceId: null,
    projectMdCourseId: null,
    projectTaskList: [{
        id: 0,
        projectId: 0,
        num: 0,
        taskName: '',
        taskDevice: null,
        taskDataTables: null,
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
        mdChapter: null,
        taskMdDoc: null
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
        dataTables: null,
    }
])

const groupId = ref(null)

const getGroupId = (msg: any) => {
    groupId.value = msg
}




const LockTaskPage = ref(false)

const handleLock = () => {
    // console.log('锁定')
    LockTaskPage.value = true
}

const handleUnlock = () => {
    LockTaskPage.value = false
    // console.log('解锁')
}

const socket = ref<WebSocket | null | undefined>()

watch(socket, (newValue, oldValue) => {
    console.log("变化")
    console.log("新值")
    console.log(newValue);
    console.log("旧值")
    console.log(oldValue);
    if (newValue) {
        console.log("oprate3835")
        console.log(operate3835.value)
        if (operate3835.value) {
            operate3835.value
            operate3835.value.initPage
        }
    }
    // if (oldValue !== null) {
    //     // 从正常连接状态变为错误或者断连时执行重连程序
    //     // if (newValue === null || newValue.readyState === WebSocket.CLOSED) {
    //     //     // 执行重连逻辑
    //     //     console.log()
    //     // }
    //     console.log("变化")
    // }
},
    // {
    //     sync: true,

    // }
);

const webSocketInit = () => {
    console.log('aaaa')
    webSocketClose();
    const msg = ref<message>({
        from: "online",
        isConnecting: true,
        userId: userId.value,
        projectId: null,
        taskNum: null,
        pstId: null,
        snId: null,
        lock: false
    })
    const { host } = location
    // const wsUrl = `ws://${host}/so-cket/online/` + userId.value
    const wsUrl = `wss://${host}/so-cket/online/` + userId.value
    // const wsUrl = `wss://student.iecube.online/so-cket/online/` + userId.value
    console.log(wsUrl)
    let newSocket = new WebSocket(wsUrl)
    newSocket.onopen = () => {
        socket.value = newSocket
        if (socket.value?.readyState === 1) {
            if (projectTaskDetail.value?.taskDevice) {
                msg.value.projectId = <any>projectId
                msg.value.taskNum = projectTaskDetail.value.num
                msg.value.pstId = myTaskDetail.value!.pstid
                msg.value.userId = userId.value
                socket.value?.send(JSON.stringify(msg.value))
                if (operate3835.value) {
                    setTimeout(() => {
                        console.log("1s")
                        console.log(socket.value)
                        if (operate3835.value) {
                            operate3835.value.initPage
                        }
                    }, 1000)
                }
            }

        }
    }
    newSocket.onclose = () => {
        console.log("socket断连")
        // console.log(socket.value)
    }
    newSocket.onmessage = () => {

    }
    newSocket.onerror = () => {
        ElMessage.error("连接设备错误")
        setTimeout(() => {
            webSocketInit();
        }, 4000)
    }
}


const webSocketClose = () => {
    console.log("断开")
    console.log(socket.value)
    if (socket.value) {
        socket.value.close()
    }
    console.log(socket.value)
}

const sendHeart = (ws: WebSocket | null | undefined) => {
    const heart = {
        from: "ping",
        userId: userId.value
    }
    if (!ws) {
        return
    }
    if (ws.readyState == 1) {
        ws.send(JSON.stringify(heart))
    }
}

const projectMdCourseId = ref()
watch(projectMdCourseId, (newValue, oldValue) => {
    console.log('count的值发生了变化，老值为', oldValue, ',新值为', newValue)
})

onBeforeMount(async () => {
    userId.value = getUser()?.id
    //课程信息
    await Project(Number(projectId)).then(res => {
        if (res.state == 200) {
            thisProject.value = res.data
            projectMdCourseId.value = thisProject.value.mdCourse
            step1.value = true
        } else {
            ElMessage.error("获取课程信息异常")
        }
    })

    await MyProjectDetail(Number(projectId)).then(res => {
        if (res.state == 200) {
            project.value = res.data
            // console.log(project.value);
            step2.value = true
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
                if (myTasks.value[i].taskStatus <= 1) {
                    CurrTask.value = i
                    break
                } else {
                    CurrTask.value = myTasks.value.length - 1
                }
            }
            projectTaskDetail.value = project.value.projectTaskList[CurrTask.value]
            myTaskDetail.value = myTasks.value[CurrTask.value]
            whichPage(myTaskDetail.value.questionListSize, myTaskDetail.value.taskStatus)
            step3.value = true
            // console.log("c" + CurrTask.value)
        } else {
            ElMessage.error(res.message)
        }
    })
})

onMounted(async () => {
    setTimeout(async () => {
        console.log(thisProject.value)
        console.log("deviceId:" + thisProject.value.deviceId)
        if (thisProject.value.deviceId == 1) {
            await webSocketInit();
            // 定义定时器
            interval.value = setInterval(() => {
                // 执行您的任务
                sendHeart(socket.value)
            }, 5000);
        }
    }, 1000)
})

onUnmounted(() => {
    webSocketClose();
    clearInterval(interval.value);
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