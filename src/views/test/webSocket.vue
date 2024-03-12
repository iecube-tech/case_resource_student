<template>
    <div>
        <div>
            <el-form>
                <el-form-item label="设备类型" label-width="160px">
                    <el-input v-model="types"></el-input>
                </el-form-item>

                <el-form-item label="(登录)输入学生id" label-width="160px">
                    <el-input-number v-model="userId"></el-input-number>
                </el-form-item>
                <el-form-item label-width="160px">
                    <el-button type="primary" @click="connectWebSocket()" size="small">连接</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="socketStatus == true">
            <span>发送消息：</span>
            <el-form>
                <el-form-item label="from" label-width="200px">
                    <el-input v-model="msg.from"></el-input>
                </el-form-item>
                <el-form-item label="isConnecting" label-width="200px">
                    <el-switch v-model="msg.isConnecting" />
                </el-form-item>
                <el-form-item label="userId" label-width="200px">
                    <el-input v-model="msg.userId"></el-input>
                </el-form-item>
                <el-form-item label="projectId" label-width="200px">
                    <el-input-number v-model="msg.projectId"></el-input-number>
                </el-form-item>
                <el-form-item label="taskNum" label-width="200px">
                    <el-input-number v-model="msg.taskNum"></el-input-number>
                </el-form-item>
                <el-form-item label="pstId" label-width="200px">
                    <el-input-number v-model="msg.pstId"></el-input-number>
                </el-form-item>
                <el-form-item label="snId" label-width="200px">
                    <el-input v-model="msg.snId"></el-input>
                </el-form-item>
                <el-form-item label="lock" label-width="200px">
                    <el-switch v-model="msg.lock" />
                </el-form-item>
                <el-form-item label-width="200px">
                    <el-button type="primary" @click="sendMsg()" size="small">发送</el-button>
                </el-form-item>
            </el-form>

        </div>

        <div v-if="socketStatus == true">
            <span>已发送消息：</span>
            <p v-for="(item, i) in sentMessage" :key="i">{{ item }}</p>

        </div>

        <div v-if="socketStatus == true">
            <span>接收到消息：</span>
            <p v-for="(item, i) in messages" :key="i">{{ item }}</p>
        </div>

        <!-- <div>
            <tableTest />
        </div> -->


        <div>
            <el-input v-model="password" @change="encryptPassword"></el-input>
            <p>{{ encryptedPassword }}</p>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import tableTest from '@/views/test/tableTest.vue'
import { SHA256 } from 'crypto-js';

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


const password = ref<null | string>()
const encryptedPassword = ref<null | string>()
const encryptPassword = () => {
    encryptedPassword.value = SHA256(<string>password.value).toString()
}

const types = ref('')
const userId = ref(0)
const msg = ref<message>({
    from: '3835',
    isConnecting: true,
    userId: 35,
    projectId: null,
    taskNum: null,
    pstId: null,
    snId: null,
    lock: false
})

const messages = ref<Array<string>>([])
const sentMessage = ref<Array<string>>([])
const socketStatus = ref<boolean>()
// WebSocket 相关变量
const socket = ref<WebSocket | null>(null);
const message = ref<string>('');

// 初始化 WebSocket 连接
const connectWebSocket = () => {
    // 请替换成你的 WebSocket 服务器地址
    const wsUrl = 'ws://192.168.1.24:8088/' + types.value + '/' + userId.value;

    // 创建 WebSocket 实例
    const ws = new WebSocket(wsUrl);

    // 监听 WebSocket 事件
    ws.onopen = () => {
        socketStatus.value = true
        console.log('WebSocket 连接已打开');
        // 在连接建立后，可以发送初始化消息或执行其他操作
    };

    ws.onmessage = (event) => {
        // 处理从服务器接收到的消息
        messages.value.push(event.data)
    };

    ws.onclose = () => {
        socketStatus.value = false
        console.log('WebSocket 连接已关闭');
    };

    // 将 WebSocket 实例保存到 ref 变量中
    socket.value = ws;
};

const sendMsg = () => {
    handelSendMessage(JSON.stringify(msg.value))
}


const handelSendMessage = (msg: string) => {
    if (socket.value) {
        socket.value.send(msg)
        sentMessage.value.push(msg)
    }
}


// 在组件挂载时建立连接
// onMounted(() => {
//   connectWebSocket();
// });

// 在组件销毁前关闭连接
// onBeforeUnmount(() => {
//   if (socket.value) {
//     socket.value.close();
//   }
// });
</script>

<style scoped></style>