<template>
    <div class="main">

        <div class="message-div">
            <div v-for="(item, index) in chatList" style="width: 100%; margin: 0 2em;">
                <el-row v-if="item.role === 'user'" style="justify-content: flex-end; align-items: center;">
                    <div class="user-question-div">{{ item.content }}</div>
                </el-row>
                <el-row v-else>
                    <div style="max-width: 80%;">
                        <MdPreview :editorId="'assistant_' + index" :modelValue="item.content" />
                    </div>
                </el-row>
            </div>
            <!-- <el-row v-for="item in (100)" style="width: 100%; margin: 2em 0;">
                <div>{{ "哦啊哈哈啊哈哈哈哈" + item }}</div>
            </el-row> -->
        </div>

        <div class="quession-div">
            <el-input v-model="newQuestion.content" placeholder="输入您的问题" class="input-div" size="large"
                @keyup.enter="handleSendMessage()">
                <template #append>
                    <el-button type="primary" @click="handleSendMessage()"> 发送 </el-button>
                </template>
            </el-input>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';

const URL = "http://172.194.22.155:11434/api/chat"

interface messageRes {
    role: string
    content: string
    create_at: string
}

interface messageSend {
    role: string
    content: string
}

const chatList = ref<Array<messageRes>>([])

const messageList = ref<Array<messageSend>>([])


const newQuestion = ref<messageSend>({
    role: 'user',
    content: '',
})

const handleSendMessage = async () => {

    messageList.value.push(JSON.parse(JSON.stringify(newQuestion.value)))
    chatList.value.push(JSON.parse(JSON.stringify(newQuestion.value)))
    newQuestion.value.content = ''

    const resMsg = ref<messageRes>({
        role: "assistant",
        content: '',
        create_at: Date.now().toString()
    })
    chatList.value.push(resMsg.value)
    console.log(chatList.value)
    console.log(messageList.value)
    for await (let res of getChatgpt_Multurn_qa(messageList.value)) {
        chatList.value[chatList.value.length - 1].content += res.toString()
    }
    messageList.value.pop()
    messageList.value.push({
        role: 'assistant',
        content: chatList.value[chatList.value.length].content
    })
    ElMessage.success(newQuestion.value.content)

}




async function* getChatgpt_Multurn_qa(list: Array<messageSend>) {
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // model: 'qwen2.5:7b-instruct-fp16',
            model: 'qwen2.5:3b',
            stream: true,
            messages: list
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!response.body || response.body == null) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    let resultData = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        resultData += decoder.decode(value);
        while (resultData.includes('\n')) {
            const messageIndex = resultData.indexOf('\n'); // \n 出现的位置
            const message = resultData.slice(0, messageIndex);
            resultData = resultData.slice(messageIndex + 1);
            try {
                if (JSON.parse(message).done) {
                    break
                }
                yield JSON.parse(message).message.content
            } catch (error) {
                console.log(error)
                break
            }
            // if (message.startsWith('message: ')) {
            //     const jsonMessage = JSON.parse(message.substring(8));
            //     if (resultData.includes('[DONE]')) {
            //         break
            //     }
            //     // yield {
            //     //     content: jsonMessage.choices[0]?.delta?.content || '',
            //     //     role: "assistant",
            //     // };
            // }
        }
    }
}


</script>
<style scoped>
.main {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.message-div {
    flex: 1;
    padding: 0 2em;
    width: 100%;
    background-color: #f2faff;
}

.user-question-div {
    min-height: 3em;
    border-radius: 20%;
    padding: 10px 10px;
    background-color: #fff;
}

.quession-div {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    padding: 20px 40px;
    background-color: #fff;
    box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.2);
    /* 上阴影 */
}

.input-div {
    height: 100%;
}
</style>
