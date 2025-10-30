<template>
    <div>
        <div class="flex justify-end mb-4">
            <div id="deviceStatus" class="inline-block device-status"
                :class="deviceState ? 'status-connected' : 'status-disconnected'">
                <div id="statusIndicator" class="w-3 h-3 rounded-full"
                    :class="deviceState ? 'bg-green-500' : 'bg-red-500'"></div>
                <span id="statusText" @click="open" :class="deviceState ? 'text-green-600' : 'text-red-600'">
                    {{ stateText }}
                </span>
                <button id="connectBtn" v-show="deviceIderror != ''"
                    class="ml-3 px-4 py-1 text-[14px] bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    @click="toggleDeviceConnection()">
                    {{ btnText }}
                </button>
            </div>
        </div>
    </div>

    <el-dialog v-model="deviceDialog.visible" title="设备连接" append-to-body>
        <div>
            <div v-if="deviceIderror != ''">
                <div class="flex items-center">
                    <el-input v-model="inputDeviceId" placeholder="输入设备SNID..." class="mr-2"></el-input>
                    <el-button type="primary" size="small" @click="toConnect()">连接</el-button>
                </div>
                <el-alert type="error" style="margin-top: 10px;" :show-icon="false" :closable="false">
                    {{ deviceIderror }}
                </el-alert>
            </div>
            <div v-else>
                <div class="mb-4">
                    <el-button @click="getPanels()">刷新</el-button>
                </div>
                <div v-if="allPanel" style="display: flex; flex-direction: row; align-items: flex-start;">
                    <span v-if="!allPanel.length || allPanel.length == 0">未发现开启的面板</span>
                    <el-button type="primary" v-for="item in allPanel" @click="getPanelData(item)">
                        {{ item.name }}
                    </el-button>
                </div>
                <div v-if="needShowPanel" style="margin-top: 30px;">
                    <div class="font-bold text-2xl">
                        {{ currentPanel?.label }}
                    </div>

                    <div v-if="currenGetData" style="padding: 30px;" class="flex justify-start w-full">
                        <div v-if="currenGetData.confData && currenGetData.confData.length > 0"
                            class="w-[300px] flex flex-col mr-16">
                            <span class="font-bold text-xl">配置项：</span>
                            <div v-for="item in currenGetData.confData" style="margin-top: 10px;"
                                class="flex justify-between mb-2 font-bold">
                                {{ item.name }}：{{ decodeURIComponent(item.value) }}
                                <el-button size="small" style="margin-left: 10px;" @click="setData(item.value)">
                                    获取
                                </el-button>
                            </div>
                        </div>

                        <div v-if="currenGetData.echoData && currenGetData.echoData.length > 0"
                            class="w-[300px] flex flex-col ml-16">
                            <span class="font-bold text-xl">数据项：</span>
                            <div v-for="item in currenGetData.echoData" style="margin-top: 10px;"
                                class="flex justify-between mb-2 font-bold">
                                {{ item.name }}：{{ decodeURIComponent(item.value) }}
                                <el-button size="small" style="margin-left: 10px;" @click="setData(item.value)">
                                    获取
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>

</template>

<script setup lang="ts">


const props = defineProps({
    index: Number,
    comp: Object,
})

const payload = ref(props.comp.payload)

const deviceState = ref(false)
const stateText = ref('')
const btnText = ref('')


const deviceDialog = ref({
    visible: false,
    title: '设备连接'
})


const toggleDeviceConnection = () => {
    if (deviceState.value) {
        cancelConnect()
    } else {
        open()
    }
}

const open = () => {
    // 增加 兼容 反异常代码
    deviceDialog.value.visible = true
}

const close = () => {
    deviceDialog.value.visible = false
}

defineExpose({
    open,
    close,
})

// 获取设备数据
const deviceRef = ref(null)

import { useEmdV4Store } from "@/stores/emdV4TaskStore"
const emdV4Store = useEmdV4Store()

onMounted(() => {
    emdV4Store.setDeviceOpen(open)
    emdV4Store.setDeviceClose(close)
})


// 兼容  auto-3835.vue ***************************************************
import axios from 'axios';
import { useEmdStore } from '@/stores/emdLabStore';
import { useUserStore } from '@/store/index';
import { debounce } from 'lodash';
import { emitter } from '@/ts/eventBUs';

import { updateCompPayload } from './update'

const userStore = useUserStore()
const { getUser } = userStore

const deviceId = ref('');
const inputDeviceId = ref('')
const loading = ref(false);
const setDivceIdError = (msg: any) => {
    deviceIderror.value = msg
    let link = msg == '' ? true : false; // true 表示设备已连接  false 表示设备未连接
    emdV4Store.setDeviceContect(link)
}

const deviceIderror = ref('没有检测到实验设备....');
setDivceIdError('没有检测到实验设备....') // 设置默认值

const socket = ref<WebSocket | null>()
const labStore = useEmdStore()
const needShowPanel = ref(false)
const currentPanel = ref<panel>()
const currenGetData = ref<any>()
const connectCount = ref(1)

watchEffect(() => {
    let f = deviceIderror.value == ''
    deviceState.value = f
    // console.log('deviceState.value', f)
    stateText.value = f ? '设备已连接' : deviceIderror.value
    btnText.value = f ? '设备已连接' : '连接设备'
})

interface panel {
    name: string,
    label: string
}

const allPanel = ref<panel[]>()

const fetchData = async () => {
    loading.value = true;
    try {
        axios.defaults.withCredentials = true
        const response = await axios.get('http://localhost:8003/WebService/DeviceId');
        deviceId.value = response.data.deviceId;
        if (deviceId.value) {

            setDivceIdError('')
            socketInit()
        }
    } catch (err) {
        setDivceIdError('没有检测到实验设备....')
    } finally {
        loading.value = false;
    }
};

const interval = ref() //计时器
const timer = ref()

// 跟新block 开始时间
const udateBlockStartTime = () => {
    let block = emdV4Store.getRootBlockByComponentId(props.comp.id)
    if (!block.startTime) {
        // console.log('更新block开始时间')
        let payloadStr = JSON.stringify(props.comp.payload)
        updateCompPayload(props.comp.id, payloadStr)
    }

}

const socketInit = () => {
    if (deviceId.value == null || deviceId.value == '' || !deviceId.value) {
        return
    }

    udateBlockStartTime()

    webSocketClose()
    socket.value = new WebSocket("/device-front/");
    socket.value.onopen = () => {
        console.log('连接到设备' + deviceId.value)
        setDivceIdError('')
        const subMessage = {
            type: 'SUBSCRIBE',
            deviceId: deviceId.value
        };
        if (socket.value) {
            socket.value.send(JSON.stringify(subMessage));
        }
        if (socket.value?.readyState === 1) {
            interval.value = setInterval(() => {
                // 定时器
                sendHeart(socket.value)
            }, 5000);
        }

    };

    socket.value.onmessage = (event) => {
        const resvMessage = JSON.parse(event.data);
        // console.log(resvMessage)
        if (resvMessage.type == "SUCCESS") {
            connectCount.value = 1
            // ElMessage.success("连接到设备" + deviceId.value)
            labStore.setDeviceDataDialog()
            setInfoMsg()
            getPanels()
        }
        if (resvMessage.type == "DATA") {
            switch (resvMessage.data.type) {
                case "GET":
                    switch (resvMessage.data.name) {
                        case "all":
                            allPanel.value = resvMessage.data.panel
                            break;
                        case "SFP-BCM":
                            circuitCheckEchoData(resvMessage.data.echoData)
                        // break;
                        default:
                            showData(resvMessage.data)
                            return
                    }
                case "CONTROL":
                    break
                case "PIC":
                    break
                case "AUTOGET":
                    break
                default:
                    break
            }
        }
    };

    socket.value.onclose = (event) => {
        console.log(connectCount.value + '设备连接已断开....device: ' + deviceId.value + event.reason);
        let text = '设备连接已断开....设备: ' + deviceId.value + event.reason
        setDivceIdError(text)
        // ElMessage.error('设备连接已断开....设备: ' + deviceId.value)
        socket.value = null
        labStore.deviceDataDialog = true
        timer.value = setTimeout(() => {
            socketInit();
            connectCount.value++
        }, 5000 * connectCount.value)
    };

    socket.value.onerror = () => {
        console.log('Error from the device ws');
        webSocketClose()
    }
}

watch(() => connectCount.value, (newVal) => {
    if (newVal > 5) {
        webSocketClose()
        setDivceIdError('连接超时')
        deviceId.value = ''
        inputDeviceId.value = ''
        connectCount.value = 1
    }
})

const sendHeart = (ws: WebSocket | null | undefined) => {
    let heart = {
        type: "PING"
    }
    if (!ws) {
        return
    }
    if (ws.readyState == 1) {
        ws.send(JSON.stringify(heart))
    }
}

const webSocketClose = () => {
    if (socket.value) {
        socket.value.close()
        socket.value = null
    }
    clearInterval(interval.value);
    clearTimeout(timer.value);
}


const setInfoMsg = () => {
    let msg = {
        type: "INIT",
        deviceId: deviceId.value,
        data: {
            studentId: getUser()?.id.toString(),
            studentName: getUser()?.studentName,
            taskId: <number>labStore.getTaskId,
            taskName: labStore.getTaskName
        }
    }
    // console.log(msg)
    if (socket.value) {
        socket.value.send(JSON.stringify(msg))
    }
}
const getImg = () => {
    let msg = {
        type: "DATA",
        // 可选值:"SUBSCRIBE":订阅;"UNSUBSCRIBE":取消订阅;"DATA":向被订阅方发送数据  "PING"：ping
        deviceId: deviceId.value, // type为SUBSCRIBE时，全局唯一的设备snId
        data: {
            type: "PIC", // 可选 GET, CONTROL, PIC, AUTOGET
            panel: currentPanel.value?.name, // 可选 all，osc... 为ALL时返回的其它类型；为all时，返回可选的面板
            timestamp: Date.now().toString(),
            interval: 200, // type为AUTOGET时，设备返回数据的时间间隔，单位毫秒
        }
    }
    // console.log(msg)
    if (socket.value) {
        socket.value.send(JSON.stringify(msg))
    }
}

const getPanels = debounce(() => {
    let msg = {
        type: "DATA",
        // 可选值:"SUBSCRIBE":订阅;"UNSUBSCRIBE":取消订阅;"DATA":向被订阅方发送数据  "PING"：ping
        deviceId: deviceId.value, // type为SUBSCRIBE时，全局唯一的设备snId
        data: {
            type: "GET", // 可选 GET, CONTROL, PIC, AUTOGET
            panel: "ALL", // 可选 all，osc... 为ALL时返回的其它类型；为all时，返回可选的面板
            timestamp: Date.now().toString(),
            interval: 200, // type为AUTOGET时，设备返回数据的时间间隔，单位毫秒
        }
    }
    // console.log(msg)
    if (socket.value) {
        socket.value.send(JSON.stringify(msg))
    } else {
        emitter.emit("deviceError", { id: queryId.value })
        ElMessage.error("设备未连接")
        labStore.setDeviceDataDialog()
    }
    if (currentPanel.value) {
        getPanelData(currentPanel.value)
    }
}, 600)

const getPanelData = debounce((panel: panel) => {
    needShowPanel.value = false
    currentPanel.value = panel
    let msg = {
        type: "DATA",
        // 可选值:"SUBSCRIBE":订阅;"UNSUBSCRIBE":取消订阅;"DATA":向被订阅方发送数据  "PING"：ping
        deviceId: deviceId.value, // type为SUBSCRIBE时，全局唯一的设备snId
        data: {
            type: "GET", // 可选 GET, CONTROL, PIC, AUTOGET
            panel: panel.name, // 可选 all，osc... 为ALL时返回的其它类型；为all时，返回可选的面板
            timestamp: Date.now().toString(),
            interval: 200, // type为AUTOGET时，设备返回数据的时间间隔，单位毫秒
        }
    }
    if (socket.value) {
        socket.value.send(JSON.stringify(msg))
    }
}, 600)


const showData = (data: any) => {
    if (data.name == currentPanel.value?.name) {
        currenGetData.value = data
        needShowPanel.value = true
    }
}

// TODO 获取设备数据
const setData = (value: any) => {
    emitter.emit('setCellData', {
        currentComponentIndex: emdV4Store.currentComponentIndex,
        currentCellId: emdV4Store.currentCellId,
        value: value
    })
    emdV4Store.deviceClose();
}

const toConnect = () => {
    deviceId.value = inputDeviceId.value
    // localStorage.setItem('deviceId', deviceId.value)
    connectCount.value = 1
    socketInit()
}

const cancelConnect = () => {
    inputDeviceId.value = ''
    deviceId.value = ''
    webSocketClose()
}

//以下用于电路检查
const circuitCheckEchoData = (echoData: Array<any>) => {
    const resList = ref<any[]>([])
    echoData.forEach(item => {
        resList.value.push(decodeURIComponent(item.value))
    })
    if (resList.value.length == 0) {
        emitter.emit("deviceError", { id: queryId.value })
        ElMessage.warning("请确保“电路板连线图”已经开始运行")
        return
    }
    if (queryId.value) {
        emitter.emit("3835CircuitData", { id: queryId.value, data: resList.value })
    }
}

const circuitCheck = () => {
    const SFPPanel = ref<panel | null>(null)
    // 刷新数据
    getPanels();
    setTimeout(() => {
        if (allPanel.value?.length == 0 || allPanel.value == null) {
            emitter.emit("deviceError", { id: queryId.value })
            ElMessage.warning("未检测到3835设备的“电路板连线图”面板，请先开启“IECUBE-3835仪器软件面板”中的“电路板连线图”并点击“开始”")
            return
        }
        allPanel.value?.forEach(item => {
            if (item.name == "SFP-BCM") {
                SFPPanel.value = item
            }
        })
        if (SFPPanel.value == null) {
            emitter.emit("deviceError", { id: queryId.value })
            ElMessage.warning("未检测到3835设备的“电路板连线图”面板，请先开启“IECUBE-3835仪器软件面板”中的“电路板连线图”并点击“开始”")
            return
        }
        getPanelData(SFPPanel.value)
    }, 500)

}

const queryId = ref<string | null>(null)

/**
 *
 * @param query {id:电路检查组件的question的Id} 电路检查组件的question的Id
                    */
const handleGetSFBData = (query: any) => {
    console.log("获取SFB数据")
    if (query.id) {
        queryId.value = query.id
    }
    circuitCheck()
}

onMounted(() => {
    setTimeout(() => {
        fetchData()
        emitter.on("getSFBData", handleGetSFBData)
    }, 200)
})

onUnmounted(() => {
    webSocketClose()
})
</script>

<style lang="scss" scoped>
.device-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-disconnected {
    border-color: #f87171;
}

.status-connected {
    border-color: #34d399;
}
</style>
