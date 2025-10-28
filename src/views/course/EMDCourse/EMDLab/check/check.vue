<template>
    <div id="task_ai_check">

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { GetChecktChatId } from '@/apis/AI/getCheckChatId';
import { aiCheckStore } from '@/stores/aiCheckStore';
import { UseMarker } from '@/apis/AI/useMarker';
import { UseArtefact } from '@/apis/AI/artefact'
import { base64DecodeUnicode } from '@/utils/util';
import { emitter } from '@/ts/eventBUs';

const props = defineProps({
    taskId: Number
})

const checkStore = aiCheckStore()

const checkId = ref()

const getCheckId = (taskId: number) => {
    return new Promise<void>((resolve, reject) => {
        GetChecktChatId(taskId, 3).then(res => {
            if (res.state == 200) {
                checkId.value = res.data
                checkStore.setCheckId(res.data)
                return resolve()
            }
            else {
                return reject()
            }
        })
    })
}

const socketFree = ref(true)

const socket = ref<WebSocket | null>(null);
const interval = ref() //计时器
const timer = ref() //计时器
const connectCount = ref(1) //重连次数

const historyMessage = ref<any[]>([])

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

const initWebsocket = () => {
    // socket.value = new WebSocket('ws://192.168.1.13:8088/ai/server/assistant/' + checkId);
    if (!checkId.value) {
        return
    }
    webSocketClose()
    // socket.value = new WebSocket('/ai-assistant/' + checkId, [<string>localStorage.getItem("x-access-token"), 'student']);
    socket.value = new WebSocket('/ai-assistant/' + checkId.value);
    // socket.value = new WebSocket('/ai-assistant/' + checkId + '?token=' + <string>localStorage.getItem("x-access-token"));
    socket.value.onopen = () => {
        console.log('stu answer check connect');
        if (socket.value?.readyState === 1) {
            interval.value = setInterval(() => {
                // 定时器
                sendHeart(socket.value)
            }, 5000);
        }
    };

    socket.value.onmessage = (event) => {
        connectCount.value = 1
        const resvMessage = JSON.parse(event.data);
        // console.log(resvMessage)
        switch (resvMessage.type) {
            case "current":
                historyMessage.value = resvMessage.current.messages
                historyMessage.value.reverse();
                // console.log(historyMessage.value)
                break;
            case "message-ack":

                historyMessage.value.push(resvMessage.payload)
                if (resvMessage.payload.role == "assistant" && resvMessage.payload.artefacts) {
                    getMarkerRes(resvMessage.payload.artefacts[0].id)
                }
                break;
            case 'activity-start':
                socketFree.value = false
                break;
            case "stream":
                break;
            case "message":
                historyMessage.value.push(resvMessage.payload)
                break;
            case "activity-stop":
                socketFree.value = true
                break;
            case "error":
                socketFree.value = false
                ElMessage.error("ai检查服务已断开，请刷新页面")
                socket.value?.close()
                break;
        }
        // messages.value.push(message);
        setTimeout(() => {
            // chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }, 10)
    };

    socket.value.onclose = (event) => {
        console.log('Disconnected from the server');
        socket.value = null
        console.log(event)
        if (event.code == 1001 || event.code == 1000) {
            webSocketClose()
            return
        }
        if (connectCount.value < 3) {
            timer.value = setTimeout(() => {
                initWebsocket();
                connectCount.value++
                console.log("ai对话重连" + connectCount.value + "次")
            }, 5000 * connectCount.value)
        }
    };

    socket.value.onerror = () => {
        console.log('Error from the ws');
        webSocketClose()
    }
};

const webSocketClose = () => {
    if (socket.value) {
        socket.value.close()
        socket.value = null
    }
    clearInterval(interval.value);
    clearTimeout(timer.value);
}

watch(() => checkStore.needCheekList.length, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})


const intervalId = setInterval(() => {
    // 每3秒执行的代码
    if (checkStore.needCheekList.length > 0 && socketFree.value) {
        UseMarker(checkStore.needCheekList.shift())
        console.log(checkStore.needCheekList)
    }
}, 3000)

const getMarkerRes = (artefactId: string) => {
    return new Promise<void>((resolve, reject) => {
        UseArtefact(artefactId, <number>props.taskId, "marker").then(res => {
            if (res.state == 200) {
                console.log(res.data)
                console.log(base64DecodeUnicode(res.data.content))
                const result = JSON.parse(base64DecodeUnicode(res.data.content))
                // checkStore.setCheckRes(result.question.id, result.score, result.full_mark, result.remark)
                emitter.emit("aiCheckRes", result)
                return resolve()
            }
        })
    })
}

onMounted(async () => {
    await getCheckId(<number>props.taskId)
    initWebsocket()
})

onUnmounted(() => {
    clearInterval(intervalId)
})

</script>
<style scoped></style>