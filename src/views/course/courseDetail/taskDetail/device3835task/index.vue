<template>
    <div v-if="initStats">
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="task-module-title">实验{{ currTaskIndex + 1 }}：{{ projectTask.taskName }}</span>
            <div v-if="projectTask.taskDevice == 1">
                <span class="task-module-title" v-if="snId != null && snId != ''">设备IECUBE3835在线:{{ snId }}</span>
                <span v-else style="font-size:24px; padding:10px 0;">设备IECUBE3835离线</span>
            </div>
        </div>
        <div class="task-module-small-title">
            <span>实验时间</span>
        </div>
        <div class="task-module-small-title-item">
            <span>
                {{ formatDate(<any>projectTask?.taskStartTime) }}
                    --
                    {{ formatDate(<any>projectTask?.taskEndTime) }}
            </span>
        </div>
        <div v-if="projectTask">
            <div v-if="projectTask.backDrops.length > 0">
                <div class="task-module-small-title">
                    <span>实验背景</span>
                </div>
                <div class="task-module-small-title-item">
                    <p v-for=" j in projectTask.backDrops ">{{ j.name }}</p>
                </div>
            </div>
            <div v-if="projectTask.taskTargets.length > 0">
                <div class="task-module-small-title">
                    <span>实验目的</span>
                </div>
                <div class="task-module-small-title-item">
                    <ol>
                        <li v-for=" j in projectTask?.taskTargets ">{{ j.name }}</li>
                    </ol>
                </div>
            </div>
            <div v-if="projectTask.experimentalSubjectList.length > 0">
                <div class="task-module-small-title">
                    <span>实验对象/器件</span>
                </div>
                <div class="task-module-small-title-item">
                    <ol>
                        <li v-for=" j in projectTask.experimentalSubjectList ">{{ j.name }}</li>
                    </ol>
                </div>
            </div>
            <div v-if="projectTask.taskDeliverables.length > 0">
                <div class="task-module-small-title">
                    <span>实验要求</span>
                </div>
                <div class="task-module-small-title-item">
                    <ol>
                        <li v-for=" j in projectTask.taskDeliverables ">{{ j.name }}</li>
                    </ol>
                </div>
            </div>
            <div v-if="projectTask.attentionList.length > 0">
                <div class="task-module-small-title">
                    <span>注意事项</span>
                </div>
                <div class="task-module-small-title-item">
                    <ol>
                        <li v-for=" j in projectTask.attentionList ">{{ j.name }}</li>
                    </ol>
                </div>
            </div>

            <div v-if="projectTask.taskReferenceFiles.length > 0">
                <div class="task-module-small-title">
                    <span>参考资料</span>
                </div>
                <div class="task-module-small-title-item">
                    <el-row v-for=" j in projectTask?.taskReferenceFiles ">
                        <el-link type="primary" @click="openPage(j.type, j.filename)">
                            {{ j.originFilename }}</el-link>
                    </el-row>
                </div>
            </div>
            <div v-if="projectTask.taskReferenceLinks.length > 0">
                <div class="task-module-small-title">
                    <span>参考链接</span>
                </div>
                <div class="task-module-small-title-item">
                    <el-row v-for=" j in projectTask?.taskReferenceLinks ">
                        <span>{{ j.name }}：</span>
                        <el-link type="primary" @click="openPage2(j.url)">{{ j.url }}</el-link>
                    </el-row>
                </div>
            </div>
            <div v-if="projectTask.taskDetails">
                <div class="task-module-small-title">
                    <span>实验内容</span>
                </div>
                <div style="margin-top: 20px;">
                    <editTaskDetails :task-details="projectTask.taskDetails" :pst-id="myTask.pstid" :lock="lockStatus"
                        :useGroup="props.useGroup" :groupId="props.groupId">
                    </editTaskDetails>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/index';
import editTaskDetails from './editTaskDetails.vue';
import { ElMessage } from 'element-plus';
const userStore = useUserStore()
const { getUser } = userStore


const props = defineProps({
    currTaskIndex: Number,
    projectTask: Object,
    myTask: Object,
    socket: WebSocket,
    useGroup: Number,
    groupId: Number,
})

onBeforeMount(() => {
    initPage();
})
onMounted(() => {
    setTimeout(() => {
        socketSetting();
    }, 1000)
})

const initStats = ref(false)
const userId = ref()
const currTaskIndex = ref()
const projectTask = ref()
const myTask = ref()
const socket = ref<WebSocket>();
const socketStatus = ref<boolean>(false)
const snId = ref<string | null>('')
const recv = ref()
const lockStatus = ref(false)

const initPage = () => {
    setTimeout(() => {
        console.log("device3835task 的初始化方法")
        userId.value = getUser()?.id
        currTaskIndex.value = props.currTaskIndex
        projectTask.value = props.projectTask
        myTask.value = props.myTask
        // console.log(projectTask.value)
        // console.log(myTask.value)
        socket.value = <WebSocket>props.socket
        socketInit();
        // socketSetting();
        initStats.value = true
        socketSetting();
    }, 1000)
}

const emit = defineEmits(['lockTaskPage', 'unlockTaskPage'])
const handlelockTaskPage = () => {
    lockStatus.value = true
    emit('lockTaskPage')
}

const handleunlockTaskPage = () => {
    lockStatus.value = false
    emit('unlockTaskPage')
}
const msg1 = ref({
    from: "online",
    isConnecting: true,
    userId: userId.value,
    projectId: projectTask.value?.projectId,
    taskNum: projectTask.value?.num,
    pstId: myTask.value?.pstid,
    snId: null,
    lock: false
})

const socketInit = () => {
    console.log("3835操作页面的socket")
    socket.value = <WebSocket>props.socket
    console.log(socket.value)
    socketStatus.value = true
}
const webSocketSendMessage = async (Msg: string) => {
    // await waitForValue();
    socket.value?.send(Msg)
}
const socketSetting = () => {
    console.log("socket 设置")
    if (socket.value) {
        // console.log(projectTask.value.taskDevice)
        if (projectTask.value.taskDevice) {
            msg1.value.projectId = projectTask.value?.projectId
            msg1.value.taskNum = projectTask.value?.num
            msg1.value.pstId = myTask.value?.pstid
            msg1.value.userId = userId.value
            webSocketSendMessage(JSON.stringify(msg1.value));
        } else {
            msg1.value.projectId = null
            msg1.value.taskNum = null
            msg1.value.pstId = null
            msg1.value.userId = userId.value
            webSocketSendMessage(JSON.stringify(msg1.value));
        }

        socket.value.onmessage = (event) => {
            recv.value = (JSON.parse(event.data))
            if (recv.value?.from == '3835') {
                if (recv.value?.isConnecting == true && recv.value?.lock == true) {
                    ElMessage.warning("设备已连接")
                    msg1.value.lock = true
                    msg1.value.snId = recv.value.snId
                    msg1.value.userId = userId.value
                    snId.value = <any>recv.value.snId
                    handlelockTaskPage()
                    webSocketSendMessage(JSON.stringify(msg1.value))
                }
            }
            if (recv.value!.from == 'server') {
                if (recv.value?.isConnecting == false && recv.value?.lock == true) {
                    //设备被动掉线
                    snId.value = null
                    ElMessage.warning("设备掉线")
                }
                if (recv.value?.isConnecting == false && recv.value?.lock == false) {
                    //设备完成实验 主动断开连接
                    ElMessage.warning("设备断开连接")
                    msg1.value.lock = false
                    msg1.value.snId = null
                    msg1.value.userId = userId.value
                    snId.value = null
                    handleunlockTaskPage()
                    webSocketSendMessage(JSON.stringify(msg1.value))
                }
            }
        }
        socket.value.onclose = () => {
            socketStatus.value = false
        }
    }
}

watch(socket, (newValue, oldValue) => {
    console.log("操作页面变化")
    console.log("操作页面新值")
    console.log(newValue);
    console.log("操作页面旧值")
    console.log(oldValue);
},
);


const openPage = (type: String, filename: String) => {
    let href = ''
    if (type.includes("image")) {
        href = '/local-resource/image/' + filename
    } else if (type.includes('pdf')) {
        href = '/pdf/web/viewer.html?file=/local-resource/file/' + filename;
        window.open(href)
        return
    } else {
        href = '/local-resource/file/' + filename
    }
    window.open(href, '_blank')
}

const openPage2 = (href: string) => {
    if (href.includes('http://') || href.includes('https://')) {
        window.open(href, '_blank')
    } else {
        window.open('https://' + href, '_blank')
    }
}


const formatDate = (time: string | Date) => {
    if (!time) {
        return "未设置时间节点"
    }
    return dayjs(time).format('YYYY年MM月DD日 HH:mm')
}

defineExpose({
    initPage,
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

.summary {
    min-height: 30vh;
    background-color: #ffffff;
    /* padding-top: 20px; */
    padding: 20px 20px;
    flex-direction: column;
}

.summary_title {
    font-size: 36px;
    color: #33b8b9;
}

.summary_detail {
    padding-top: 10px;
    /* flex-grow: 1; */
    font-size: 16px;
}

.task-title {
    padding: 20px 20px;
    font-size: 36px;
    color: #33b8b9;
}

.task-info {
    padding: 20px 20px;
    font-size: 24px;
}

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

.task-module-small-title span {
    font-size: 18px;
    font-weight: bold;
    padding: 10px 0;
}

.task-module-small-title-item {
    font-size: 16px;
    padding: 10px 0;
}

ol {
    padding-inline-start: 20px;
}


.task-module-img {
    margin-top: 5vh;
    position: relative;
}

.task-module-content {
    height: 200px;
}

.task-module-content h1 {
    color: #33b8b9;
    font-size: 24px;
    font-weight: bold;
}

.task-module-content span {
    font-size: 24px;
}

/* .task-module-deliverable {} */

.task-module-deliverable h1 {
    color: #33b8b9;
    font-size: 24px;
    font-weight: bold;
}

.task-module-deliverable span {
    font-size: 24px;
}
</style>
