<template>
    <div>
        <el-button @click="send">发送</el-button>
    </div>
</template>

<script setup lang="ts">
import { UseTeachingAssistant } from '@/apis/AI/useTeachingAssistant';


const agentQo = {
    chatId: "3wtltUNAn7RN9qj99iQaZO",
    sectionPrefix: "4.2",
    question: "好的 我也连好了",
    imgDataurls: []
}

const send = () => {
    UseTeachingAssistant(agentQo).then(res => {
        console.log(res)
    })
}
</script>
<style scoped></style>