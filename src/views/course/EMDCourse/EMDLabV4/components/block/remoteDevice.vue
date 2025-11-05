<template>
  <div>
    <div v-if="emdV4Store.project.useRemote == 1">
      <!-- <remote :projectId="projectId"></remote>
    <appointment :projectId="projectId"></appointment> -->
      <div class="mb-2">
        <span class="font-bold text-lg text-gray-900">本实验已开启远程实验</span>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm text-gray-700">
          远程实验开放时间：
          <span class="text-blue-500">{{ remoteProject.startDate }} {{ remoteProject.startTime }} - {{
            remoteProject.endDate }} {{ remoteProject.endTime }}</span>
        </span>
        <button class="blue_btn" style="width: 120px;" @click="openDialog">预约设备</button>
      </div>

      <el-dialog class="emdV4Dialog" v-model="appointmentDialog.visible" width="600px" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <div class="flex justify-between items-center">
            <span class="text-xl">远程实验预约</span>
            <font-awesome-icon icon="fa-solid fa-xmark" @click="closeDialog" class="text-white"></font-awesome-icon>
          </div>
        </template>

        <el-form ref="appointmentFormDataRef" :model="appointmentDialog.formData" label-width="80px" class="mx-6 mt-4"
          :rules="rules">
          <el-form-item label="预约设备" prop="deviceId">
            <el-select v-model="appointmentDialog.formData.deviceId" placeholder="请选择设备" @change="handleChange">
              <el-option v-for="(item, k) in remoteProject.remoteDeviceList" :key="k" :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预约日期" prop="appointmentDate">
            <el-date-picker v-model="appointmentDialog.formData.appointmentDate" type="date" placeholder="请选择预约日期"
              :disabled-date="disabledDate" @change="handleChange" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="预约时间" prop="appointmentId">
            <el-select v-model="appointmentDialog.formData.appointmentId" placeholder="请选择预约时间段"
              @visible-change="handleVisibleChange"
              :disabled="appointmentDialog.formData.deviceId == '' || appointmentDialog.formData.appointmentDate == ''">
              <el-option v-for="item in appointmentTimeList" :key="item.id" :value="item.id"
                :label="item.appointmentStartTime + '--' + item.appointmentEndTime" :disabled="item.status != 1">
                {{ item.appointmentStartTime }} -- {{ item.appointmentEndTime }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type=primary @click="submitAppointment">确认</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </template>
      </el-dialog>

      <!-- 预约列表 -->
      <table v-if="appointmentList.length">
        <thead>
          <tr>
            <th style="width: 240px;">预约时间</th>
            <th style="width: 240px;">预约设备</th>
            <th style="width: 240px;">预约状态</th>
            <th style="width: 240px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, k) in appointmentList" :key="k" class="text-sm text-gray-500">
            <td>
              <span>{{ `${row.appointmentDate} ${row.appointmentStartTime} - ${row.appointmentEndTime}` }}</span>
            </td>
            <td>{{ row.deviceName }}</td>
            <td>
              <el-tag v-if="row.state === 'NOT_START'" type="info" size="small">未开始</el-tag>
              <el-tag v-else-if="row.state === 'WILL_START'" type="warning" size="small">
                即将开始 {{ row.gapMin }}:{{ row.gapSec }}
              </el-tag>
              <el-tag v-else-if="row.state === 'IN_PROGRESS'" type="primary" size="small">
                进行中
              </el-tag>
              <el-tag v-else type="danger" size="small">已结束</el-tag>
            </td>
            <td>
              <el-button v-if="row.state === 'IN_PROGRESS'" type="primary" size="small"
                @click="toOperation(row.id)">操作设备</el-button>
              <el-popconfirm v-if="['NOT_START', 'WILL_START'].includes(row.state)" width="220" confirm-button-text="确定"
                cancel-button-text="再想想" :icon="InfoFilled" icon-color="#626AEF" title="确定要取消预约吗?"
                @confirm="cancelAppointment(row.id)">
                <template #reference>
                  <el-button size="small" type="danger"> 取消预约 </el-button>
                </template>
              </el-popconfirm>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="py-2 border-t flex justify-center items-center">
        <span class="text-sm text-gray-500">暂无预约记录</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import remote from "@/views/remote/remote.vue"
import appointment from "@/views/remote/appointment.vue"

import dayjs from 'dayjs'
import { GetRemoteProject } from "@/apis/remote/getRemoteProject"
import { GetAppointmentList } from "@/apis/remote/getAppointmentList"
import { StudentAppointment } from "@/apis/remote/studnetAppointment"
//
import { StudentAppointmentedList } from "@/apis/remote/studnetAppointedList"
import { StudentCancelAppointment } from "@/apis/remote/studentCancelAppointment"
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import router from '@/router';

import { useEmdV4Store } from '@/stores/emdV4TaskStore'

const emdV4Store = useEmdV4Store()
// console.log(emdV4Store.project)

const route = useRoute()
// console.log(route.params)
const projectId = ref(route.params.projectId)

// 格式化时间
const formatDateToDate = (time: string | Date) => {
  if (!time) {
    dayjs(new Date).format('YYYY-MM-DD')
  }
  return dayjs(time).format('YYYY-MM-DD')
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
  remoteDeviceList: [],
})

GetRemoteProject(projectId.value).then(res => {
  if (res.state == 200) {
    remoteProject.value = res.data
    // console.log(remoteProject.value)
  } else {
    ElMessage.error(res.message)
  }
})

const remoteDeviceList = ref([])

const appointmentFormDataRef = ref(null)

const appointmentDialog = ref({
  visible: false,
  formData: {
    deviceId: '', // 设备id
    appointmentDate: '', // 预约日期
    appointmentId: '',  // 预约id
  }
})

const submitAppointment = () => {
  appointmentFormDataRef.value.validate(v => {
    if (v) {
      StudentAppointment(appointmentDialog.value.formData.appointmentId).then(res => {
        if (res.state == 200) {
          ElMessage.success("预约成功")
          closeDialog()
          getStudentAppointmentedList()
        } else {
          ElMessage.error(res.message)
        }
      })
    }
  })
}

const setDefaultFormData = () => {
  appointmentDialog.value.formData.deviceId = ''  // 设备id
  appointmentDialog.value.formData.appointmentDate = ''  // 预约日期
  appointmentDialog.value.formData.appointmentId = '' // 预约id
}

const rules = ref({
  deviceId: [
    { required: true, message: '请选择设备', trigger: ['change', 'blur'] }
  ],
  appointmentDate: [
    { required: true, message: '请选择预约日期', trigger: ['change', 'blur'] }
  ],
  appointmentId: [
    { required: true, message: '请选择预约时间段', trigger: ['change', 'blur'] }
  ],
})

const openDialog = async () => {
  appointmentDialog.value.visible = true
  await nextTick()
  appointmentFormDataRef.value.clearValidate()
}

const closeDialog = () => {
  appointmentDialog.value.visible = false
  setDefaultFormData()
}

const resetDefaultFormData = () => {

}

const appointmentTimeList = ref([])


// 预约时间列表
const getAppointmentTimeList = () => {
  if (appointmentDialog.value.formData.deviceId && appointmentDialog.value.formData.appointmentDate) {
    let remoteAppointmentQo = {
      projectId: projectId.value,
      deviceId: appointmentDialog.value.formData.deviceId,
      appointmentDate: formatDateToDate(appointmentDialog.value.formData.appointmentDate)
    }
    GetAppointmentList(remoteAppointmentQo).then(res => {
      if (res.state == 200) {
        appointmentTimeList.value = res.data
      } else {
        ElMessage.warning(res.message)
      }
    })
  }
}

const handleChange = () => {
  appointmentDialog.value.formData.appointmentId = ''
  appointmentTimeList.value = []
}

const handleVisibleChange = (v) => {
  if (v) {
    getAppointmentTimeList()
  }
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

// ****************************************************************************

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
    } else if (start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) {
      appointmentList.value[i].state = "IN_PROGRESS"
    } else {
      appointmentList.value[i].state = "FINISHED"
    }
  }
}

const getStudentAppointmentedList = () => {
  StudentAppointmentedList(projectId.value).then(res => {
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
    }
    else {
      ElMessage.error(res.message)
    }
  })
}

getStudentAppointmentedList()

onMounted(() => {
  setInterval(() => {
    appointmentListHadler()
  }, 1000)
})


</script>

<style scoped lang="scss">
.blue_btn {
  @apply ml-3 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors;
}

.el-scrollbar__bar .is-horizontal {
  display: none !important;
}
</style>