<template>
    <div>
        <div v-if="deviceIderror != ''">
            <span> {{ deviceIderror }}</span>
            <el-row style="align-items: center;">
                <el-input v-model="inputDeviceId" placeholder="输入设备SNID..."
                    style="width: 200px; margin-right: 20px;"></el-input>
                <el-button type="primary" size="small" @click="toConnect()">连接</el-button>
            </el-row>
        </div>
        <div v-else>
            <div v-if="allPanel" style="display: flex; flex-direction: row; align-items: flex-start;">
                <el-button type="primary" v-for="item in allPanel" @click="getPanelData(item)">
                    {{ item.label }}
                </el-button>
            </div>
            <div v-if="needShowPanel" style="margin-top: 30px;">
                <div>
                    {{ currentPanel?.label }}
                </div>

                <div v-if="currenGetData" style="padding: 30px;">
                    <div v-if="currenGetData.confData"
                        style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px;">
                        <span>配置项：</span>
                        <el-row v-for="item in currenGetData.confData" style="margin-top: 10px;">
                            {{ item.label }}：{{ item.value }} <el-button size="small" style="margin-left: 10px;"
                                @click="getData(item.value)">获取</el-button>
                        </el-row>
                    </div>

                    <div v-if="currenGetData.echoData"
                        style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px;">
                        <span>数据项：</span>
                        <el-row v-for="item in currenGetData.echoData" style="margin-top: 10px;">
                            {{ item.label }}：{{ item.value }} <el-button size="small" style="margin-left: 10px;"
                                @click="getData(item.value)">获取</el-button>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useEmdStore } from '@/stores/emdLabStore';

const deviceId = ref('');
const inputDeviceId = ref('')
const loading = ref(false);
const deviceIderror = ref('');
const socket = ref<WebSocket | null>()
const labStore = useEmdStore()
const needShowPanel = ref(false)
const currentPanel = ref<panel>()
const currenGetData = ref<any>()

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
        const response = await axios.get('http://localhost:8000/random_string');
        deviceId.value = response.data.data;
        if (deviceId.value) {
            socketInit()
        }
    } catch (err) {
        deviceIderror.value = "没有检测到实验设备...."
    } finally {
        loading.value = false;
    }
};

const socketInit = () => {
    socket.value = new WebSocket("/device-front");
    socket.value.onopen = () => {
        console.log('连接到设备' + deviceId.value)
        deviceIderror.value = ''
        const initMessage = {
            type: 'SUBSCRIBE',
            deviceId: deviceId.value
        };
        if (socket.value) {
            socket.value.send(JSON.stringify(initMessage));
        }

    };

    socket.value.onmessage = (event) => {
        const resvMessage = JSON.parse(event.data);
        console.log(resvMessage)
        if (resvMessage.type == "SUCCESS") {
            ElMessage.success("连接到设备" + deviceId.value)
            labStore.setDeviceDataDialog()
            let msg = {
                type: "DATA",
                // 可选值:"SUBSCRIBE":订阅;"UNSUBSCRIBE":取消订阅;"DATA":向被订阅方发送数据  "PING"：ping
                deviceId: deviceId.value, // type为SUBSCRIBE时，全局唯一的设备snId
                data: {
                    type: "GET", // 可选 GET, CONTROL, PIC, AUTOGET
                    panel: "ALL", // 可选 all，osc... 为ALL时返回的其它类型；为all时，返回可选的面板
                    timestamp: Date.now(),
                    interval: 200, // type为AUTOGET时，设备返回数据的时间间隔，单位毫秒
                }
            }
            if (socket.value) {
                socket.value.send(JSON.stringify(msg))
            }

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
        console.log('设备连接已断开....device: ' + deviceId.value + event.reason);
        deviceIderror.value = '设备连接已断开....device: ' + deviceId.value + event.reason
        ElMessage.error('设备连接已断开....设备: ' + deviceId.value + event.reason)
    };
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
            timestamp: Date.now(),
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
    socketInit()
}

onMounted(() => {
    setTimeout(() => {
        console.log('device')
        fetchData()
    }, 200)
})
</script>
<style scoped></style>