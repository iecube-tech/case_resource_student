<template>
  <div v-show="_state == 0" id="labModeGrouping"
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center mb-6">
    <font-awesome-icon icon="fas fa-users" class="text-4xl text-teal-600 mb-4"></font-awesome-icon>
    <h4 class="text-xl font-semibold text-gray-900 mb-4">实验分组</h4>
    <p class="text-gray-600 mb-6">设备已连接！请先进行分组后开始实验操作。</p>
    <button class="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
      @click="openGroupModal">
      <font-awesome-icon icon="fas fa-plus" class=" mr-2"></font-awesome-icon>创建/加入小组
    </button>
  </div>

  <div v-show="_state >= 1" id="groupStatusDisplay" class="mb-6">
    <div id="groupStatusCard" class="group-status-active p-4 rounded-lg flex items-center justify-between">
      <div class="flex items-center">
        <i class="fas fa-users mr-3 text-xl"></i>
        <div>
          <div class="font-medium">当前小组</div>
          <div class="text-sm" id="groupStatusSubtitle">
            小组名称：<span id="displayGroupName">{{ payload.group.name }}</span> | 成员：<span id="memberCount">{{ _members
              }}</span>人</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="editGroupBtn" v-if="_state == 1"
          class="px-4 py-2 text-sm bg-white bg-opacity-80 rounded-lg hover:bg-opacity-100 transition-colors"
          @click="openGroupModal()" style="display: inline-flex;">
          <i class="fas fa-edit mr-1"></i>编辑小组
        </button>
      </div>
    </div>
  </div>

  <el-dialog v-model="groupDialog.visible" :title="groupDialog.title" width="500px">
    <el-form :model="groupDialog.formData" label-position="top">
      <el-form-item label="小组名称" prop="name">
        <el-input v-model="groupDialog.formData.name"></el-input>
      </el-form-item>
      <el-form-item label="小组成员" prop="members">
        <div class="flex flex-col w-full space-y-2">
          <div class="flex items-center justify-between bg-teal-50 border-teal-200 p-2 rounded border">
            <span>当前用户（组长）</span>
            <font-awesome-icon icon="fas fa-crown" class=" text-yellow-500"></font-awesome-icon>
          </div>
          <div v-for="(member, i) in groupDialog.formData.members" :key="i"
            class="flex items-center justify-between bg-gray-50 p-2 rounded ">
            <span>{{ member }}</span>
            <button class="text-red-500 hover:text-red-700" @click="groupDialog.formData.members.splice(i, 1)">
              <font-awesome-icon icon="fas fa-times"></font-awesome-icon></button>
          </div>
        </div>
        <el-input v-model="newMember" class="mt-2">
          <template #append>
            <el-button icon="Plus" @click="addMember"></el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="close">确定</el-button>
    </template>
  </el-dialog>

</template>

<script setup>

// import { updateCompStatus } from './update'

const props = defineProps({
  index: Number,
  comp: Object,
})

const payload = ref(props.comp.payload)
// console.log(payload.value)

const _state = computed(() => {
  let state = 0
  state = payload.value.group.state
  return state
})

const _members = computed(() => {
  let n = 0
  n = payload.value.group.members.length
  return n
})

const groupDialog = ref({
  visible: false,
  title: '实验分组',
  formData: {
    name: '', // 分组名称
    members: [], // 成员列表
  }
})

const newMember = ref('')

const addMember = () => {
  if (newMember.value == '') {
    return
  }
  groupDialog.value.formData.members.push(newMember.value)
  newMember.value = ''
}
const openGroupModal = () => {
  groupDialog.value.visible = true
}


const close = () => {
  groupDialog.value.visible = false
  payload.value.group.state = 1;

  payload.value.group.name = groupDialog.value.formData.name
  payload.value.group.members = groupDialog.value.formData.members
}





onMounted(() => {
  // updateCompStatus(props.comp.id, 1, () => {
  //   props.comp.status = 1;
  // })
})
</script>

<style scoped>
.group-status-active {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}
</style>