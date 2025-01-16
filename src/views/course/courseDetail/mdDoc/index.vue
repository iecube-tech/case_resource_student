<template>
    <div v-loading="loading">
        <div v-if="initStatus">
            <el-row style="justify-content: flex-end;">
                <div v-if="projectTask.taskDevice == 1">
                    <span class="task-module-title" v-if="snId != null && snId != ''">设备IECUBE3835在线:{{ snId }}</span>
                    <span v-else
                        style="font-size:24px; padding:10px 0; color: var(--el-color-warning)">设备IECUBE3835离线</span>
                </div>
            </el-row>

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
import { onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store/index';
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus'
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
    socket: {
        type: WebSocket,
        required: true,
    },
})
console.log(props)

const userId = ref()
const currTaskIndex = ref()
const projectTask = ref()
const myTask = ref()
const initStatus = ref(false)
const loading = ref(false)
const snId = ref<string | null>('')
const socket = ref<WebSocket | null>();
const socketStatus = ref<boolean>(false)
const recv = ref()
const lockStatus = ref(false)
const initStats = ref(false)

const pstArticle = ref({
    id: null,
    pstId: null,
    chapterName: null,
    content: '',
    catalogue: null,
})

const initPage = () => {
    return new Promise<void>((resolve, reject) => {
        userId.value = getUser()?.id
        currTaskIndex.value = props.currTaskIndex
        projectTask.value = props.projectTask
        myTask.value = props.myTask //pst 详情
        pstArticle.value = myTask.value.pstArticle
        initStatus.value = true
        setTimeout(() => {
            socket.value = <WebSocket>props.socket
            socketInit();
            // socketSetting();
            initStats.value = true
            socketSetting();
        }, 500)
        resolve()
    })

}


const socketInit = () => {
    console.log("3835操作页面的socket")
    if (props.socket == null) {
        socket.value = null
        socketStatus.value = false
        return
    }
    socket.value = <WebSocket>props.socket
    console.log(socket.value)
    socketStatus.value = true
}

const msg1 = ref({
    from: "online",
    isConnecting: true,
    userId: userId.value,
    projectId: projectTask.value?.projectId,
    taskNum: projectTask.value?.num,
    pstId: myTask.value?.pstid,
    snId: null,
    lock: false,
    logup: false,
})

const webSocketSendMessage = async (Msg: string) => {
    // await waitForValue();
    socket.value?.send(Msg)
}

const emit = defineEmits(['lockTaskPage', 'unlockTaskPage', 'socketClose'])
const handlelockTaskPage = () => {
    lockStatus.value = true
    emit('lockTaskPage')
}

const handleunlockTaskPage = () => {
    lockStatus.value = false
    emit('unlockTaskPage')
}

const handleSocketClose = () => {
    emit('socketClose')
}

const socketSetting = () => {
    console.log("socket 设置")
    if (socket.value != null) {
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
            // console.log(recv.value)
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
                if (recv.value?.logup == false) {
                    msg1.value.logup = false
                    // 清除定时器
                    if (timer.value) {
                        clearInterval(timer.value)
                        timer.value = null
                    }
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
            console.log("mdDoc socket断连")
            handleSocketClose()
            socketStatus.value = false
            snId.value = null
        }

        socket.value.onerror = () => {
            console.log("mdDoc socket错误")
            handleSocketClose()
            snId.value = null
            ElMessage.error("网络错误")
        }
    }
}

const isConnected = ref(false);

// 监听 socket 连接状态
const updateConnectionStatus = () => {
    if (props.socket.readyState == 1) {
        isConnected.value = true;
    } else {
        isConnected.value = false;
    }
};

watch(() => props.socket, (newSocket) => {
    console.log("mdDoc socket更新")
    socket.value = newSocket
    initPage()
})

const submit = () => {
    if (props.useGroup) {
        ElMessageBox.confirm('提交后组内所有人将同步数据并一同提交\n提交后不可更改', '分组提交', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(() => {
            clienSubmit()
            realSubmit()
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
    } else {
        ElMessageBox.confirm('提交后页面内容将不可更改', '完成并提交', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(() => {
            clienSubmit()
            realSubmit()
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
    }
}

const timer = ref()

const clienSubmit = () => {
    msg1.value.logup = true
    webSocketSendMessage(JSON.stringify(msg1.value))
    // 创建定时器
    if (!timer.value && msg1.value.logup) {
        timer.value = setInterval(() => {
            webSocketSendMessage(JSON.stringify(msg1.value))
        }, 3000); // 每秒更新时间
    }
}

const realSubmit = async () => {
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
    }, 400)
}

defineExpose({
    initPage,
})

onMounted(async () => {
    await initPage()
    setTimeout(() => {
        if (myTask.value.taskStatus >= 2) {
            replace(pstArticle.value.id, false, false)
        } else {
            replace(pstArticle.value.id, false, true)
        }
    }, 600)
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

.task-module-title {
    color: #33b8b9;
    font-size: 24px;
    padding: 10px 0;
}
</style>

<style>
.example-showcase .el-loading-mask {
    z-index: 9;
}
</style>
