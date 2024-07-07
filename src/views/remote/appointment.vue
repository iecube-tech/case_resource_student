<template>
    <div>
        <el-row style="margin-top: 1em; margin-bottom: 1em">
            <span style="font-size: 1.4em; font-weight: bold;">远程实验预约列表</span>
        </el-row>
        <div v-for="(item, i) in appointmentList" :key="item.appointmentStartTime + ' ' + item.appointmentEndTime"
            style="margin-top: 20px;">
            <el-row class="text_item">
                预约日期:
                {{ item.appointmentDate }}
                | 预约时间:
                {{ item.appointmentStartTime }} - {{ item.appointmentEndTime }}
                | 预约设备:
                {{ item.deviceName }}
            </el-row>
            <el-row style="margin-top:20px">
                <el-button disabled size="small" v-if="item.state === 'NOT_START'">未开始</el-button>
                <el-button :key="new Date().getTime()" disabled type="warning" size="small"
                    v-else-if="item.state === 'WILL_START'">
                    {{ item.gapMin }}:{{ item.gapSec }}
                </el-button>
                <el-button v-else-if="item.state === 'IN_PROGRESS'" type="primary" size="small"
                    @click="toOperation(item.id)">操作设备</el-button>
                <el-button v-else size="small" disabled>已结束</el-button>
                <el-popconfirm v-if="item.state === 'NOT_START' || item.state === 'WILL_START'" width="220"
                    confirm-button-text="确定" cancel-button-text="再想想" :icon="InfoFilled" icon-color="#626AEF"
                    title="确定要取消预约吗?" @confirm="cancelAppointment(item.id)">
                    <template #reference>
                        <el-button size="small">
                            取消预约
                        </el-button>
                    </template>
                </el-popconfirm>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, onMounted } from 'vue';
import { StudentAppointmentedList } from "@/apis/remote/studnetAppointedList"
import { StudentCancelAppointment } from "@/apis/remote/studentCancelAppointment"
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import router from '@/router';

const props = defineProps({
    projectId: Number
})

const projectId = <any>props.projectId
interface appointment {
    id: number
    studentId: number
    projectId: number
    projectName: String
    deviceId: number
    deviceName: String
    appointmentDate: String
    appointmentStartTime: String
    appointmentEndTime: String
    status: number
    state: any
    gapMin: number
    gapSec: number
}

const appointmentList = ref<appointment[] | []>([])

const appointmentListHadler = () => {
    for (let i = 0; i < appointmentList.value.length; i++) {
        const now = new Date()
        const start = new Date(appointmentList.value[i].appointmentDate + " " + appointmentList.value[i].appointmentStartTime)
        const end = new Date(appointmentList.value[i].appointmentDate + " " + appointmentList.value[i].appointmentEndTime)
        if (start.getTime() > now.getTime()) {
            appointmentList.value[i].state = "NOT_START"
            const ms = start.getTime() - new Date().getTime()
            const min = ms / 1000 / 60
            const sec = ms / 1000 % 60
            appointmentList.value[i].gapMin = <any>parseInt(min.toString()) < 0 ? 0 : parseInt(min.toString())
            appointmentList.value[i].gapSec = <any>parseInt(sec.toString()) < 0 ? 0 : parseInt(sec.toString())
            if (appointmentList.value[i].gapMin < 10) {
                appointmentList.value[i].state = "WILL_START"
            }
        }
        else if (start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) {
            appointmentList.value[i].state = "IN_PROGRESS"
        } else {
            appointmentList.value[i].state = "FINISHED"
        }
    }
}

const getStudentAppointmentedList = () => {
    StudentAppointmentedList(projectId).then(res => {
        if (res.state == 200) {
            appointmentList.value = res.data
            appointmentListHadler()
        } else {
            ElMessage.error(res.message)
        }
    })
}

const toOperation = (id: number) => {
    const url = router.resolve({
        name: 'remoteOperation',
        params: {
            id: id
        }
    })
    window.open(url.href, '_blank')
}

const cancelAppointment = (id: number) => {
    StudentCancelAppointment(id).then(res => {
        if (res.state == 200) {
            getStudentAppointmentedList()
            emits("cancelAppointment")
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

const emits = defineEmits(['cancelAppointment'])

onBeforeMount(() => {
    getStudentAppointmentedList()
})
onMounted(() => {
    setInterval(() => {
        appointmentListHadler()
    }, 1000)
})
defineExpose({
    getStudentAppointmentedList
})
</script>
<style scoped>
.text_item {
    line-height: 2em
}
</style>