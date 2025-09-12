<template>
  <el-dialog class="emdV4Dialog" v-model="dialog.visible" :append-to-body="true" :show-close="false" width="600px"
    top="40vh">
    <template #header="{ close, titleId, titleClass }">
      <div class="flex justify-between items-center">
        <div>
          <div class="text-2xl font-medium">选择实验项目</div>
          <div class="text-cprimary-100 text-xl mt-1">选择需要进行的实验项目</div>
        </div>
        <font-awesome-icon class="text-white" style="font-size: 24px;" icon="fa-solid fa-xmark"
          @click="close"></font-awesome-icon>
      </div>
    </template>
    <div>
      <div class="p-4 text-neutral-800" style="font-size: 16px; font-weight: 500; border-bottom: 1px #e5e5e5 solid;">
        实验项目列表
      </div>
      <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="(task, k) in dialog.taskList" :key="k" class="experiment-item rounded-md py-3 px-4
            border border-neutral-200
            flex justify-between items-center" @click="toTask(task)">
          <span class=" font-medium text-neutral-800">{{ task.name }}</span>
          <font-awesome-icon class="text-cprimary-500 text-xl" icon="fa-solid fa-chevron-right" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>

import { getEmdV4Task } from '@/apis/emdV4/index.ts'

const router = useRouter()
const dialog = ref({
  visible: false,
  taskList: [],
  projectId: '',
})

const open = async (projectId) => {
  getEmdV4Task(projectId).then(res => {
    if (res.state == 200) {
      dialog.value.taskList = res.data || []
      dialog.value.projectId = projectId
      dialog.value.visible = true
    } else {
      ElMessage.error(res.message)
    }
  })
}

const close = () => {
  dialog.value.visible = false
}

const toTask = (task) => {
  // console.log(task)
  // const url = router.resolve({
  //   name: 'emdTaskDetailV4',
  //   params: { id: task.id },
  //   // query: {taskName: task.name}
  // }).href;
  // window.open(url, '_blank');
  // close()

  const url = router.resolve({
    name: 'emdTaskDetailV4',
    params: {
      projectId: dialog.value.projectId,
      id: task.id
    },
  })
  window.open(url.href, '_blank');
  close()
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.emdV4Dialog {
  :deep(.el-dialog__header) {
    padding: 0;
  }
}



/* 实验项目卡片 */
.experiment-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.experiment-item:hover {
  background-color: #f0fdfa;
  border-color: #2dd4bf;
}
</style>