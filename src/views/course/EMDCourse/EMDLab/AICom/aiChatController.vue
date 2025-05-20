<!-- 控制设备对应 ai 聊天窗口-->
<template>
    <div class="chat-container ist-theam">
        <div class="h-8 flex flex-row p-1" v-if="socket == null">
            <div class="text-center text-red-500">
                连接已断开...
            </div>
            <div class="ml-8">
                <button class="pl-2 pr-2 shadow-md rounded bg-gray-200 hover:bg-gray-400" @click="toInit">
                    重连
                </button>
            </div>
        </div>

        <div class="chat-messages" ref="chatMessages">
            <div v-for="(item, index) in historyMessage" :key="index" :class="['message', userOrAssistent(item)]">
                <textPreview v-if="item.message != null" :id="item.id" :content="item.message" />
            </div>

            <div :class="['message', 'bot-message']" v-if="isAssistantTaking">
                {{ currentOutMessage }}
            </div>

            <!-- <div v-if="aiStore.waittingMessage" style="width: 100%;  margin-top: 1rem;">
                <el-popover placement="top">
                    <template #reference>
                        <div style="width: 100%; height: 3rem;" v-loading="true"></div>
                    </template>
<template #default>
                        <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                            <el-button type="danger" @click="sendStop">停止</el-button>
                        </div>
                    </template>
</el-popover>
</div> -->
        </div>

        <div class="chat-input">

            <div class="flex flex-col h-auto">
                <textarea ref="textareaRef"
                    v-model="inputMessage"
                    :disabled="isAssistantTaking"
                    placeholder="请输入你的问题..."
                    @input="adjustTextareaHeight"
                    @keydown.enter="handleKeyDown"
                    @keyup.enter="handleKeyUp"
                    class="resize-none outline-none border-none mb-2 max-h-[40vh]"> </textarea>
                <div class="flex  items-center justify-end pr-4">
                    <span class="text-gray-400 text-sm">{{ currentLength }}/{{ maxLength }}</span>

                    <button class="ml-3 p-1 rounded bg-gray-200 hover:bg-green-500 hover:text-white"
                        @click="sendMessage" :disabled="isAssistantTaking">
                        <font-awesome-icon icon="far fa-paper-plane" />
                        发送
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useChatStore } from '@/stores/aiStore';
import textPreview from '../textPreview/textPreview-small.vue';
import { ElMessage } from 'element-plus';
import { UseTeachingAssistant } from '@/apis/AI/useTeachingAssistant';
import { UseArtefact } from '@/apis/AI/artefact'

import { UseQuestioner } from '@/apis/AI/useQuestioner';
import { base64DecodeUnicode } from '@/utils/util';
import { UpdateModelStatus } from '@/apis/EMDProject/upModelStatus'
import { useEmdStore } from '@/stores/emdLabStore';

import { getControllerAiChartId, } from '@/apis/controllerApi/localControllerApi'

import { useRoute } from 'vue-router';
const route = useRoute()

const chatId = ref('');

const taskId = ref(null);

onMounted(() => {
    taskId.value = route.params.id;

    getControllerAiChartId(taskId.value).then(res => {
        if (res.state == 200) {
            chatId.value = res.data

            initWebsocket()
        } else {
            ElMessage.error(res.msg)
        }
    })
})

const aiStore = useChatStore();
const labStore = useEmdStore();
const chatMessages = ref();
const inputMessage = ref('');

const socket = ref<WebSocket | null>(null);

// TODO 
const historyMessage = ref<any[]>([])

const currentOutMessage = ref()

const isAssistantTaking = ref(false)
const interval = ref() //计时器
const timer = ref() //计时器
const connectCount = ref(1)
const needConnect = ref(true)

const toInit = () => {
    connectCount.value = 1
    needConnect.value = true
    initWebsocket()
}

const textareaRef = ref()
const maxLength = 600;
const currentLength = ref(0);
const adjustTextareaHeight = () => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
    }
};
watch(() => inputMessage.value, (newValue) => {
    currentLength.value = newValue.length
    if (newValue.length > maxLength) {
        inputMessage.value = newValue.slice(0, maxLength);
    }
});

const initWebsocket = () => {
    if (chatId.value == null || !chatId.value) {
        return
    }
    if (!needConnect.value) {
        return
    }
    webSocketClose()
    socket.value = new WebSocket('/2830-assistant/' + chatId.value);
    socket.value.onopen = () => {
        if (socket.value?.readyState === 1) {
            interval.value = setInterval(() => {
                // 定时器
                sendHeart(socket.value)
            }, 20000);
        }
    };

    socket.value.onmessage = (event) => {
        // console.log(historyMessage.value)
        connectCount.value = 1
        const resvMessage = JSON.parse(event.data);
        switch (resvMessage.type) {
            case "current":
                let filterItem = resvMessage.msgList.filter(item => {
                    return item.message != null || item.message != ''
                })
                historyMessage.value = filterItem
                break;
            case "message-ack":
                if (resvMessage.message.message !== null) {
                    historyMessage.value.push(resvMessage.message)
                }
                break;
            case 'activity-start':
                isAssistantTaking.value = true
                currentOutMessage.value = ''
                aiStore.setChangeRightPaneVisible(true)
                inputMessage.value = '';
                break;
            case "stream":
                let msgSplit = resvMessage.message.message || '';
                currentOutMessage.value += msgSplit;
                break;
            case "message":
                historyMessage.value.push(resvMessage.message)
                break;
            case "activity-stop":
                isAssistantTaking.value = false
                break;
            case "error":
                ElMessage.error("ai服务断开连接...")
                socket.value?.close()
                break;
        }
        // messages.value.push(message);
        setTimeout(() => {
            chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }, 10)
    };

    socket.value.onclose = (event) => {
        socket.value = null
        if (event.code == 1001 || event.code == 1000) {
            webSocketClose()
            return
        }
        if (connectCount.value < 3) {
            timer.value = setTimeout(() => {
                initWebsocket();
                connectCount.value++
                // console.log("ai对话重连" + connectCount.value + "次")
            }, 5000 * connectCount.value)
        }
    };

    socket.value.onerror = () => {
        // console.log('Error from the ws');
        webSocketClose()
    }
};

const sendHeart = (ws: WebSocket | null) => {
    let heart = {
        type: "ping"
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

// watch(() => socket.value, (newVal) => {
//     console.log('ai-socket-ready->' + socket.value?.readyState)
// })

watch(() => connectCount.value, (newVal) => {
    if (newVal > 3) {
        webSocketClose()
        needConnect.value = false
    }
})

const userOrAssistent = (message: any) => {
    if (message.direction == "user") {
        return "user-message"
    }
    return "bot-message"
}

onUnmounted(() => {
    webSocketClose()
});

// 拦截默认Enter行为
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault(); // 阻止默认换行
  }
};

// 处理按键释放
const handleKeyUp = (e) => {
  if (e.key === 'Enter') {
    if (e.ctrlKey || e.shiftKey) {
      insertNewline(); // 组合键：换行
    } else {
      sendMessage();   // 单独Enter：发送
    }
  }
};

// 插入换行符
const insertNewline = () => {
  const textarea = textareaRef.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  inputMessage.value = 
    inputMessage.value.substring(0, start) + 
    '\n' + 
    inputMessage.value.substring(end);
  
  nextTick(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    adjustTextareaHeight(); // 换行后重新计算高度
  });
};



const sendMessage = () => {
    if (isAssistantTaking.value) {
        ElMessage.warning("请等待当前对话结束")
        return
    }
    if (!inputMessage.value) {
        ElMessage.warning("请输入您的问题。")
        return
    }

    let msg = {
        "message": inputMessage.value,
        "course_id": "2830",
        "teacher_type": "assistant",
    };

    if (socket.value) {
        socket.value.send(JSON.stringify(msg));
    }

};

const sendStop = () => {
    const msg = {
        type: 'stop'
    }
    if (socket.value) {
        socket.value.send(JSON.stringify(msg));
    }
}





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
    scroll-behavior: smooth;
}

.message {
    margin: 5px 0;
    padding: 8px 12px;
    border-radius: 8px;
    display: inline-flex;
    overflow-wrap: anywhere;
}

.user-message {
    background-color: #15803d;
    /* background-color: #6cd383; */
    align-self: flex-end;
}

.ist-theam .user-message p {
    color: #fff;
}

.bot-message {
    background-color: #f0f0f0;
    color: #333;
    align-self: flex-start;
}

.chat-input {
    height: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-right: 0;
    border-top: 1px solid #ccc;
}

.chat-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
}
</style>