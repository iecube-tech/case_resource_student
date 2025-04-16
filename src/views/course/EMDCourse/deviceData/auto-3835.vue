<template>
    <div>
        <div v-if="deviceIderror != ''">
            <el-row>
                <div>
                    <span> {{ deviceIderror }}</span>
                </div>
                <el-button type="primary" size="small" @click="cancelConnect()">取消</el-button>
            </el-row>
            <el-row style="align-items: center; margin-top: 2rem;">
                <el-input v-model="inputDeviceId" placeholder="输入设备SNID..."
                    style="width: 200px; margin-right: 20px;"></el-input>
                <el-button type="primary" size="small" @click="toConnect()">连接</el-button>
            </el-row>
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
                    <!-- <el-button @click="getImg">截图</el-button> -->
                </div>

                <div v-if="currenGetData" style="padding: 30px;" class="flex justify-start w-full">
                    <div v-if="currenGetData.confData && currenGetData.confData.length > 0"
                        class="w-[300px] flex flex-col mr-16">
                        <span class="font-bold text-xl">配置项：</span>
                        <div v-for="item in currenGetData.confData" style="margin-top: 10px;"
                            class="flex justify-between mb-2 font-bold">
                            {{ item.name }}：{{ decodeURIComponent(item.value) }}
                            <el-button size="small" style="margin-left: 10px;" @click="getData(item.value)">
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
                            <el-button size="small" style="margin-left: 10px;" @click="getData(item.value)">
                                获取
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useEmdStore } from '@/stores/emdLabStore';
import { useUserStore } from '@/store/index';
const userStore = useUserStore()
const { getUser } = userStore
const deviceId = ref('');
const inputDeviceId = ref('')
const loading = ref(false);
const deviceIderror = ref('');
const socket = ref<WebSocket | null>()
const labStore = useEmdStore()
const needShowPanel = ref(false)
const currentPanel = ref<panel>()
const currenGetData = ref<any>()
const connectCount = ref(1)

interface panel {
    name: string,
    label: string
}

const allPanel = ref<panel[]>()

const fetchData = async () => {
    loading.value = true;
    deviceIderror.value = '';
    try {
        axios.defaults.withCredentials = true
        const response = await axios.get('http://localhost:8003/WebService/DeviceId');
        deviceId.value = response.data.deviceId;
        if (deviceId.value) {
            socketInit()
        }
    } catch (err) {
        deviceIderror.value = "没有检测到实验设备...."
    } finally {
        loading.value = false;
    }
};

const interval = ref() //计时器
const timer = ref()
const socketInit = () => {
    if (deviceId.value == null || deviceId.value == '' || !deviceId.value) {
        return
    }
    webSocketClose()
    socket.value = new WebSocket("/device-front/");
    socket.value.onopen = () => {
        console.log('连接到设备' + deviceId.value)
        deviceIderror.value = ''
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
            }, 20000);
        }

    };

    socket.value.onmessage = (event) => {
        const resvMessage = JSON.parse(event.data);
        // console.log(resvMessage)
        if (resvMessage.type == "SUCCESS") {
            connectCount.value = 1
            ElMessage.success("连接到设备" + deviceId.value)
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
        deviceIderror.value = '设备连接已断开....device: ' + deviceId.value + event.reason
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
        deviceIderror.value = "连接超时"
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
    console.log(msg)
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
    console.log(msg)
    if (socket.value) {
        socket.value.send(JSON.stringify(msg))
    }
}

const getPanels = () => {
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
    console.log(msg)
    if (socket.value) {
        socket.value.send(JSON.stringify(msg))
    }
    if (currentPanel.value) {
        getPanelData(currentPanel.value)
    }
}

const getPanelData = (panel: panel) => {
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
}

const showData = (data: any) => {
    console.log(data)
    if (data.name == currentPanel.value?.name) {
        currenGetData.value = data
        needShowPanel.value = true
    }
}

const getData = (value: any) => {
    labStore.setHasNewVal(true)
    labStore.setSelectedValue(value)
    labStore.setDeviceDataDialog()
}

const toConnect = () => {
    deviceId.value = inputDeviceId.value
    connectCount.value = 1
    socketInit()
}

const cancelConnect = () => {
    inputDeviceId.value = ''
    deviceId.value = ''
    webSocketClose()
}

onMounted(() => {
    setTimeout(() => {
        console.log('device')
        console.log(userStore.getUser())
        fetchData()
    }, 200)
})

onUnmounted(() => {
    webSocketClose()
})
</script>
<style scoped></style>