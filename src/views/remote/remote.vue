<template>
    <div>
        <el-row style="margin-top: 1em; margin-bottom: 1em">
            <span style="font-size: 1.4em; font-weight: bold;">本实验已开启远程实验</span>
        </el-row>
        <el-row>
            远程实验开放时间：{{ remoteProject.startDate }} {{ remoteProject.startTime }} -
            {{ remoteProject.endDate }} {{ remoteProject.endTime }}
        </el-row>
        <el-row style="margin-top: 20px; margin-bottom: 20px;">
            <el-button type="primary" @click="appointmentDialog = true">预约</el-button>
        </el-row>
    </div>

    <el-dialog v-model="appointmentDialog" width="50%" title="远程实验预约">
        <el-row style="align-items: center; margin-top: 10px; margin-bottom: 10px">
            <el-col :span="2">
                预约日期
            </el-col>
            <el-col :span=6>
                <el-date-picker v-model="seleteDate" type="date" placeholder="请选择日期" @change="getAppointmentList"
                    :disabled-date="disabledDate" />
            </el-col>
        </el-row>
        <el-row style="align-items: center; margin-top: 10px; margin-bottom: 10px">
            <el-col :span="2">
                预约设备
            </el-col>
            <el-col :span=6>
                <el-radio-group v-model="selectDevice" @change="getAppointmentList">
                    <el-radio v-for="item in remoteDeviceList" :label="item.id">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row style="align-items: center; margin-top: 10px; margin-bottom: 10px">
            <el-col :span="2">
                选择时间
            </el-col>
            <el-col :span=6>
                <el-select v-model="selectAppointment"
                    :placeholder="(selectDevice && seleteDate) ? '请选择课时' : '请先选择日期和设备'" style="width: 240px">
                    <el-option v-for="item in appointmentList" :key="item.id" :value="item.id"
                        :label="item.appointmentStartTime + '--' + item.appointmentEndTime"
                        :disabled="item.status != 1">
                        {{ item.appointmentStartTime }} -- {{ item.appointmentEndTime }}
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <template #footer>
            <el-button @click="appointmentDialog = false">取消</el-button>
            <el-button type=primary @click="toAppointment()">提交</el-button>
        </template>

    </el-dialog>

</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import dayjs from 'dayjs'

import { GetRemoteProject } from "@/apis/remote/getRemoteProject"
import { GetAppointmentList } from "@/apis/remote/getAppointmentList"
import { StudentAppointment } from "@/apis/remote/studnetAppointment"
import { ElMessage } from 'element-plus';
const props = defineProps({
    projectId: Number
})

const projectId = <any>props.projectId

onBeforeMount(() => {
    GetRemoteProject(projectId).then(res => {
        if (res.state == 200) {
            remoteProject.value = res.data
            remoteDeviceList.value = res.data.remoteDeviceList
            remoteDate.value = res.data.appointmentDateList
        } else {
            ElMessage.error(res.message)
        }
    })
})

const formatDateToDate = (time: string | Date) => {
    if (!time) {
        dayjs(new Date).format('YYYY-MM-DD')
    }
    return dayjs(time).format('YYYY-MM-DD')
}

interface remoteDevice {
    id: number
    name: string
}

interface appointment {
    id: number
    studentId: number
    projectId: number
    deviceId: number
    appointmentDate: String
    appointmentStartTime: String
    appointmentEndTime: String
    status: number
}

const remoteProject = ref({
    id: null,
    projectId: null,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    appointmentDuration: null,
    appointmentCount: null,
    dayLimit: null,
})

const remoteDeviceList = ref<remoteDevice[] | []>([])
const remoteDate = ref([])

const appointmentDialog = ref(false)

const seleteDate = ref('')
const selectDevice = ref(null)

const appointmentList = ref<appointment[]>([])

const selectAppointment = ref()

const getAppointmentList = () => {
    let remoteAppointmentQo = {
        projectId: props.projectId,
        deviceId: selectDevice.value,
        appointmentDate: formatDateToDate(seleteDate.value)
    }
    GetAppointmentList(remoteAppointmentQo).then(res => {
        if (res.state == 200) {
            appointmentList.value = res.data
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const disabledDate = (date: Date) => {

    // 获取当前时间
    const now = new Date();

    // 创建一个新的日期对象表示昨天
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // 设置时间为昨天的最后一分钟
    yesterday.setHours(23, 59, 59);

    // 获取时间戳
    const today_0 = yesterday.getTime();

    // const today_0 = new Date(new Date().toLocaleDateString().replace(/\//g, "-")).getTime()   // 当前日期0点的时间戳
    // const today_0 = new Date().getTime()
    // console.log(today_0)
    // console.log(date)
    // console.log(date.getTime())
    // console.log(this.canNotAppointList)
    // console.log(this.list)
    // this.list  // 这个变量  包含了要禁用的日期   格式为 某个日期0点的时间戳 
    if (remoteProject.value.dayLimit) {

        // 如果限制了可预约时间段  且 可预约时间段最后一天在截止日期之前
        if ((today_0 + (remoteProject.value.dayLimit) * 24 * 60 * 60 * 1000) < new Date(remoteProject.value.endDate).getTime()) {
            // console.log(date.getTime())
            return date.getTime() < today_0 ||
                date.getTime() > (today_0 + (remoteProject.value.dayLimit) * 24 * 60 * 60 * 1000) ||
                [].includes(<never>date.getTime())
        }
        // 如果限制了可预约时间段  且 可预约时间段最后一天在截止日期那天或之后  
        else {
            return date.getTime() < today_0 ||
                date.getTime() > new Date(remoteProject.value.endDate).getTime() ||
                [].includes(<never>date.getTime())
        }
    }
    else {
        return date.getTime() < today_0 ||
            date.getTime() > new Date(remoteProject.value.endDate).getTime() ||
            [].includes(<never>date.getTime())
    }
}

const emits = defineEmits(['appointmented'])

const toAppointment = () => {
    if (!selectAppointment.value) {
        ElMessage.warning("请选择预约时间")
        return
    }
    StudentAppointment(selectAppointment.value).then(res => {
        if (res.state == 200) {
            selectAppointment.value = null
            appointmentDialog.value = false
            emits("appointmented")
            getAppointmentList()
        } else {
            ElMessage.error(res.message)
        }
    })
}

defineExpose({
    getAppointmentList
})

</script>
<style scoped></style>