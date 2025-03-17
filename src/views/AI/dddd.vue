<template>
    <div>
        <h1>WebSocket 示例</h1>
        <div>
            <input v-model="message" placeholder="输入消息" />
            <button @click="sendMessage">发送消息</button>
        </div>
        <div>
            <h2>收到的消息:</h2>
            <ul>
                <li v-for="(msg, index) in receivedMessages" :key="index">{{ msg }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
    setup() {
        const message = ref(''); // 用于绑定输入框的消息
        const receivedMessages = ref([]); // 存储接收到的消息
        let ws; // 存储 WebSocket 实例

        const initWebSocket = () => {
            // 创建 WebSocket 实例并连接

            ws = new WebSocket('wss://beta.megamoyo.com/api/interact/chat/56v7bhHflpzHvrHu3rhFAx'); // 替换为你的 WebSocket URL

            // 处理打开连接事件
            ws.onopen = () => {
                console.log('WebSocket 已连接');
            };

            // 处理消息事件
            ws.onmessage = (event) => {
                console.log('接收到消息:', event.data);
                receivedMessages.value.push(event.data); // 将接收到的消息存入列表
            };

            // 处理错误事件
            ws.onerror = (error) => {
                console.error('WebSocket 错误:', error);
            };

            // 处理关闭连接事件
            ws.onclose = () => {
                console.log('WebSocket 已关闭');
            };
        };

        const sendMessage = () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(message.value); // 发送消息
                message.value = ''; // 清空输入框
            } else {
                console.warn('WebSocket 未连接');
            }
        };

        onMounted(() => {
            // 在组件挂载时初始化 WebSocket 连接
            initWebSocket();
        });

        onUnmounted(() => {
            // 在组件销毁时关闭 WebSocket 连接
            if (ws) {
                ws.close();
            }
        });

        return {
            message,
            receivedMessages,
            sendMessage,
        };
    },
};
</script>