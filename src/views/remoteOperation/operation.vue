<template>
    <div v-if="remoteOperation?.remoteUrl && remoteOperation?.remoteUrl !== ''" class="operation-iframe">
        <iframe :src="'/vnc/vnc.html' + remoteOperation?.remoteUrl" frameborder="0" class="view-iframe"></iframe>
    </div>
    <div v-if="remoteOperation?.remoteUrl == '' || !remoteOperation?.remoteUrl" class="operation-cannot-operate">
        当前不可进行远程实验
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { RemoteOperation } from "@/apis/remote/remoteOperation"
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

const route = useRoute()
const appointmentId = <any>route.params.id

interface remoteOperation {
    id: number | String | null
    studentId: number | String | null
    projectId: number | String | null
    deviceId: number | String | null
    deviceName: number | String | null
    deviceState: number | String | null
    remoteControl: number | String | null
    remoteUrl: number | String | null
    liveUrl: number | String | null
    appointmentDate: number | String | null
    appointmentStartTime: number | String | null
    appointmentEndTime: number | String | null
}

const remoteOperation = ref<remoteOperation>()

const getOperation = () => {
    RemoteOperation(appointmentId).then(res => {
        if (res.state == 200) {
            remoteOperation.value = res.data
            countDown()
        } else {
            ElMessage.error(res.message)
        }
    })
}

const residueMin = ref<number | String>()
const residueSec = ref<number | String>()
const countDown = () => {
    const end = new Date(remoteOperation.value?.appointmentDate + ' ' + remoteOperation.value?.appointmentEndTime)
    const ms = end.getTime() - new Date().getTime()
    const min = ms / 1000 / 60
    const sec = ms / 1000 % 60
    residueMin.value = parseInt(min.toString()) < 0 ? 0 : parseInt(min.toString())
    residueSec.value = parseInt(sec.toString()) < 0 ? 0 : parseInt(sec.toString())
    const warned = ref(false)
    const p = setInterval(() => {
        const ms = end.getTime() - new Date().getTime()
        const min = ms / 1000 / 60
        const sec = ms / 1000 % 60
        residueMin.value = parseInt(min.toString()) < 0 ? 0 : parseInt(min.toString())
        residueSec.value = parseInt(sec.toString()) < 0 ? 0 : parseInt(sec.toString())

        if (residueMin.value === 0 && !warned.value) {
            ElMessage.warning({
                message: '本次操作还剩1分钟',
                showClose: true,
                duration: 6000
            })
            warned.value = true
        }

        if (residueMin.value === 0 && residueSec.value === 0) {
            // player.stop()
            // player.destroy()
            remoteOperation.value!.remoteUrl = ''
            clearInterval(p)
        }
    }, 1000)
}

onBeforeMount(() => {
    getOperation()
})
</script>
<style scoped>
.operation-iframe {
    overflow: hidden;
    height: 100vh;
}

.operation-cannot-operate {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em
}

.view-iframe {
    height: 100%;
    width: 100%;
    /* margin-top: -48px; */
}
</style>