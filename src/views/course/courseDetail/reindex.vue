<template>
    <div v-if="thisProject">
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

        <el-card v-if="thisProject.useRemote == 1"
            style="max-width: calc(100% - 5px); padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
            <el-row style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
                <remote ref="remoteChild" :projectId="thisProject.id" @appointmented="remoteAppointmented"></remote>
            </el-row>

            <el-row style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
                <appointment ref="appointmentChild" :projectId="thisProject.id" @cancelAppointment="cancelAppointment">
                </appointment>
            </el-row>
        </el-card>

        <el-card v-if="thisProject.useGroup == 1"
            style="max-width: calc(100% - 5px); padding-bottom: 20px; margin-bottom: 20px; margin-top: 20px;">
            <el-row>
                <projectStudentGroup v-if="thisProject.id != null" :projectId="thisProject.id"
                    :groupLimit="<any>thisProject.groupLimit" @HandleGroup="getGroupId" />
            </el-row>
        </el-card>

        <el-card style="max-width: calc(100% - 5px)">
            <el-row v-if="projectMdCourseId !== null && thisProject.fourthType === 'map'">
                <courseMapping v-if="thisProject.caseId" :caseId="thisProject.caseId" />
            </el-row>

            <el-row v-if="projectMdCourseId !== null && thisProject.fourthType === 'video' && caseVideoList.length > 0"
                style="padding-bottom: 30px;">
                <videoPlayer :videoList="caseVideoList" />
            </el-row>

            <el-row v-if="myTasks.length > 1" style="padding-bottom: 20px; margin-bottom: 20px; margin-top: 30px;">
                <el-col style="display: flex;justify-content:flex-end;flex-direction: column;">
                    <el-steps align-center>
                        <el-step v-for="i in myTasks.length" :key="i" :title="getGrade(myTasks[i - 1].taskGrade)"
                            :status="getstatus(i - 1)" @click="changeCurrTask(i - 1)" />
                    </el-steps>
                </el-col>
            </el-row>

            <div v-if="thisProject.deviceId == 1 && !projectMdCourseId" class="task" key="iecube3835">
                <device3835task ref="operate3835" v-if="step1 && step2 && step3" :key="CurrTask"
                    :curr-task-index="CurrTask" :project-task="currentTask" :socket="<WebSocket>socket"
                    :my-task="currTaskDetail" :useGroup="<any>thisProject.useGroup" :groupId="<any>groupId"
                    @lock-task-page="handleLock()" @unlock-task-page="handleUnlock()">
                </device3835task>
            </div>

            <!-- <div v-if="thisProject.deviceId && projectMdCourseId"> -->
            <div v-if="projectMdCourseId">
                <mdDoc v-if="step1 && step2 && step3" :key="CurrTask" :curr-task-index="CurrTask"
                    :project-task="currentTask" :my-task="currTaskDetail" :useGroup="<any>thisProject.useGroup"
                    :groupId="<any>groupId" :socket="<WebSocket>socket" @lock-task-page="handleLock()"
                    @unlock-task-page="handleUnlock()" @socket-close="handleSocketClose()" />
            </div>

            <div v-if="!thisProject.deviceId && !projectMdCourseId" class="task" key="nodevice">
                <div v-if="step1 && step2 && step3" class="task-module">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="task-module-title">实验{{ CurrTask + 1 }}：{{ currentTask!.taskName }}</span>

                        <div v-if="currTaskDetail!.questionListSize > 0">
                            <el-button v-if="pageNum == 0" type="primary" link
                                @click="whichPage(currTaskDetail!.questionListSize, currTaskDetail!.taskStatus, 1)">考核页面</el-button>
                            <el-button v-else type="primary" link
                                @click="whichPage(currTaskDetail!.questionListSize, currTaskDetail!.taskStatus, 0)">任务详情</el-button>
                        </div>
                    </div>
                    <div v-if="currTaskDetail != null">
                        <PSTDetail v-if="pageNum == 0" :key="CurrTask" :indexValue="CurrTask"
                            :projectTask="currentTask!" :myTask="<any>currTaskDetail"
                            :projectStartTime="thisProject.startTime" :projectEndTime="thisProject.endTime"
                            @notify="handleNotify">
                        </PSTDetail>
                        <question v-else :key="currTaskDetail.pstid" :indexValue="CurrTask"
                            :taskName="<any>currentTask!.taskName" :pstId="currTaskDetail.pstid">
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
import videoPlayer from '@/views/video/dpPlayer.vue'
import { GetVideo } from '@/apis/video/getVideo';
import { GetCaseVideo } from '@/apis/video/getCaseVideo'

interface project {
    id: Number
    caseId: Number
    caseType: Number   // case表中的third  区分是 课程还是案例
    projectName: String
    introduction: String //简介
    introduce: String // 介绍
    cover: String   //封面
    target: String //项目目标
    startTime: String
    endTime: String
    grade: Number
    deviceId: Number
    useGroup: Number
    groupLimit: Number
    hidden: Number
    mdCourse: Number
    useRemote: Number
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
    logup: boolean | null
}

interface mdChapter {
    courseId: number
    id: number
    name: String
}

const userStore = useUserStore()
const { getUser } = userStore
const route = useRoute()
const projectId = route.params.id
const userId = ref()
const CurrTask = ref(0)
const pageNum = ref(0)
const step1 = ref(true)
const step2 = ref(false)
const step3 = ref(false)
const LockTaskPage = ref(false)
const pageReadyStatus = ref(false)
const groupId = ref(null)
const interval = ref()
const timer = ref()


const operate3835 = ref<any>()
const appointmentChild = ref()
const remoteChild = ref()
const socket = ref<WebSocket | null | undefined>()
const projectMdCourseId = ref()

const thisProject = ref<project | any>()

const projectTaskList = ref<Array<task> | []>([])
const currentTask = ref<task>()

const myTasks = ref<pst[] | [] | any>([])
const currTaskDetail = ref<pst | any>()

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

const changeCurrTask = (index: number) => {
    if (LockTaskPage.value == true) {
        return
    }
    CurrTask.value = index
    currentTask.value = projectTaskList.value[index]
    currTaskDetail.value = myTasks.value[index]
    whichPage(currTaskDetail.value.questionListSize, currTaskDetail.value.taskStatus)
}

const handleLock = () => {
    // console.log('锁定')
    LockTaskPage.value = true
}

const handleUnlock = () => {
    LockTaskPage.value = false
    // console.log('解锁')
}

// 子组件执行完成后回调
const handleNotify = async (msg: any) => {
    await PST(Number(projectId)).then(res => {
        if (res.state == 200) {
            myTasks.value = res.data
            currTaskDetail.value = myTasks.value[CurrTask.value]
            whichPage(currTaskDetail.value.questionListSize, currTaskDetail.value.taskStatus)
        } else {
            ElMessage.error(res.message)
        }
    })
}

const remoteAppointmented = () => {
    appointmentChild.value.getStudentAppointmentedList()
}
const cancelAppointment = () => {
    remoteChild.value.getAppointmentList()
}

const getGroupId = (msg: any) => {
    groupId.value = msg
}

watch(socket, (newValue, oldValue) => {
    console.log("socket值改变")
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
},
);

const webSocketInit3835 = () => {
    console.log('设备连接初始化')
    webSocketClose();
    const msg = ref<message>({
        from: "online",
        isConnecting: true,
        userId: userId.value,
        projectId: null,
        taskNum: null,
        pstId: null,
        snId: null,
        lock: false,
        logup: false,
    })
    const { host } = location
    // const wsUrl = `wss://${host}/so-cket/online/` + userId.value
    const wsUrl = "/so-cket/online/" + userId.value
    console.log(wsUrl)
    let newSocket = new WebSocket(wsUrl)
    newSocket.onopen = () => {
        socket.value = newSocket
        if (socket.value?.readyState === 1) {
            if (currentTask.value?.taskDevice) {
                msg.value.projectId = <any>projectId
                msg.value.taskNum = currentTask.value.num
                msg.value.pstId = currTaskDetail.value!.pstid
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
            interval.value = setInterval(() => {
                // 定时器
                sendHeart(socket.value)
            }, 5000);
        }
    }

    if (socket.value) {
        socket.value.onclose = () => {
            console.log("1111, 断连")
        }

        socket.value.onerror = () => {
            console.log("1111, 错误")
        }
    }

    newSocket.onclose = () => {
        console.log("socket断连")
        console.log("尝试断连重连....")
        timer.value = setTimeout(() => {
            webSocketInit3835();
        }, 5000)
        // console.log(socket.value)
    }
    newSocket.onmessage = () => {

    }
    newSocket.onerror = () => {
        // ElMessage.error("连接设备错误")
        console.log("尝试错误重连....")
        timer.value = setTimeout(() => {
            webSocketInit3835();
        }, 5000)
    }


}


const handleSocketClose = () => {
    console.log("尝试错误重连....")
    timer.value = setTimeout(() => {
        webSocketInit3835();
    }, 5000)
}

const webSocketClose = () => {
    console.log("断开设备连接，初始化socketValue：")
    if (socket.value) {
        socket.value.close()
    }
    console.log(socket.value)
    clearInterval(interval.value);
    clearTimeout(timer.value);
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

const video = ref()
const getVideo = (filename: any) => {
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

const caseVideoList = ref([])
const getCaseVideoList = (id: any) => {
    GetCaseVideo(id).then(res => {
        if (res.state == 200) {
            caseVideoList.value = res.data
        }
    })
}


const initPageBaseData = async () => {
    userId.value = getUser()?.id

    await Project(Number(projectId)).then(res => {
        if (res.state == 200) {
            thisProject.value = res.data
            projectMdCourseId.value = thisProject.value.mdCourse
            step1.value = true
        } else {
            ElMessage.error("获取课程信息异常")
        }
    })

    //课程信息 包含课程的实验列表
    await MyProjectDetail(Number(projectId)).then(res => {
        if (res.state == 200) {
            projectTaskList.value = res.data.projectTaskList
            projectMdCourseId.value = thisProject.value?.mdCourse
            step2.value = true
        } else {
            ElMessage.error(res.message)
        }
    })
    console.log(thisProject.value)

    // 获取pst列表， pst信息
    await PST(Number(projectId)).then(res => {
        if (res.state == 200) {
            myTasks.value = res.data
            // 确定当前是那个实验
            for (let i = 0; i < myTasks.value.length; i++) {
                if (myTasks.value[i].taskStatus <= 1) {
                    CurrTask.value = i
                    break
                } else {
                    CurrTask.value = myTasks.value.length - 1
                }
            }
            currentTask.value = projectTaskList.value[CurrTask.value]
            currTaskDetail.value = myTasks.value[CurrTask.value]
            whichPage(currTaskDetail.value.questionListSize, currTaskDetail.value.taskStatus)
            step3.value = true
        } else {
            ElMessage.error(res.message)
        }
    })

    await GetCaseVideo(thisProject.value.caseId).then(res => {
        if (res.state == 200) {
            caseVideoList.value = res.data
        }
    })
}

const initCourseDevice = async () => {
    if (thisProject.value.deviceId == 1) {
        await webSocketInit3835();
    }
}

watch(thisProject, (newValue, oldValue) => {
    if (newValue) {
        initCourseDevice()
    }
})

onBeforeMount(async () => {
    await initPageBaseData()
})

onUnmounted(() => {
    console.log("unmount")
    webSocketClose();
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

<style>
:deep() .el-card__header {
    display: none;
}
</style>
