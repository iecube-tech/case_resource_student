<template>
    <div class="chat-container">
        <div class="chat-messages" ref="chatMessages">
            <div v-for="(message, index) in historyMessage" :key="index" :class="['message', userOrAssistent(message)]">
                <textPreview :id="message.id" :content="message.content" />
            </div>

            <div :class="['message', 'bot-message']" v-if="isAssistantTaking">
                {{ currentOutMessage }}
            </div>
        </div>
        <div class="chat-input">
            <input type="text" v-model="inputMessage" placeholder="请输入你的问题..." />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '@/stores/aiStore';
import textPreview from '../textPreview/textPreview.vue';

const props = defineProps({
    chatId: {
        type: String,
        required: true
    }
});

const chatStore = useChatStore();
const chatMessages = ref();
const inputMessage = ref('');
const messages = ref<any[]>([]);
const socket = ref<WebSocket | null>(null);

const historyMessage = ref<any[]>([])

const currentOutMessage = ref()

const isAssistantTaking = ref(false)

const initWebsocket = () => {
    // socket.value = new WebSocket('ws://192.168.1.13:8088/ai/server/assistant/' + props.chatId);
    socket.value = new WebSocket('/ai-assistant/' + props.chatId);

    socket.value.onopen = () => {
        console.log('Connected to the server');
        // 发送 AI 角色和携带资料的初始化信息
        const aiRole = chatStore.getAIRole;
        const referenceMaterial = chatStore.getReferenceMaterial;
        const initMessage = {
            type: 'send-message',
            file_context: referenceMaterial,
            images: [],
            message: aiRole
        };
        // if (socket.value) {
        //     socket.value.send(JSON.stringify(initMessage));
        // }

    };

    socket.value.onmessage = (event) => {
        const resvMessage = JSON.parse(event.data);
        console.log(resvMessage)
        switch (resvMessage.type) {
            case "current":
                historyMessage.value = resvMessage.current.messages
                historyMessage.value.reverse();
                console.log(historyMessage.value)
                break;
            case "message-ack":
                historyMessage.value.push(resvMessage.payload)
                break;
            case 'activity-start':
                isAssistantTaking.value = true
                currentOutMessage.value = ''
                break;
            case "stream":
                if (resvMessage.kind == "chunk") {
                    currentOutMessage.value += resvMessage.payload
                }
                if (resvMessage.kind == "final") {
                    isAssistantTaking.value = false
                }
                break;
            case "message":
                historyMessage.value.push(resvMessage.payload)
                break;
            case "activity-stop":
                isAssistantTaking.value = false
                break;
        }
        // messages.value.push(message);
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    };

    socket.value.onclose = () => {
        console.log('Disconnected from the server');
    };
};

const userOrAssistent = (message: any) => {
    if (message.role == "user") {
        return "user-message"
    }
    return "bot-message"
}

onMounted(() => {
    setTimeout(() => {
        initWebsocket();
    }, 10);
});

onUnmounted(() => {
    if (socket.value) {
        socket.value.close();
    }
});

const sendMessage = () => {
    const message = {
        type: 'send-message',
        file_context: chatStore.getReferenceMaterial,
        images: [],
        message: inputMessage.value.trim()
    }

    if (message) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        if (socket.value) {
            socket.value.send(JSON.stringify(message));
        }
        inputMessage.value = '';
    }
};
</script>

<style scoped>
.chat-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.chat-messages {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.message {
    margin: 5px 0;
    padding: 8px 12px;
    border-radius: 8px;
    display: inline-flex;
    overflow-wrap: anywhere;
}

.user-message {
    background-color: #33b8b9;
    color: #fff;
    align-self: flex-end;
}

.bot-message {
    background-color: #f0f0f0;
    color: #333;
    align-self: flex-start;
}

.chat-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
}

.chat-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
}

.chat-input button {
    margin-left: 10px;
    padding: 8px 16px;
    background-color: #33b8b9;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>