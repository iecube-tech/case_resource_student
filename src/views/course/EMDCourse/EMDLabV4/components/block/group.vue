<template>
  <div class="p-4" v-if="showGroupDetail">
    <div class="bg-cprimary-50 border-l-4 border-cprimary-500 p-4 mb-6">
      <p class="text-cprimary-700">根据老师要求，本次实验需要
        {{ emdV4Store.project.groupLimit }}
        人一组完成。请选择创建小组或加入已有小组。
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 创建小组选项 -->
      <div class="group-option rounded-lg border border-neutral-200 p-4 hover:border-cprimary-300"
        @click="showCreateGroup()">
        <div class="text-center mb-2">
          <font-awesome-icon class="text-cprimary-600 text-3xl" icon="fa-solid fa-users-gear" />
        </div>
        <h4 class="font-medium text-center mb-2">创建小组</h4>
        <p class="text-xl text-neutral-500 text-center">创建一个新的实验小组并邀请其他同学加入</p>
      </div>

      <!-- 加入小组选项 -->
      <div class="group-option rounded-lg border border-neutral-200 p-4 hover:border-cprimary-300"
        @click="showJoinGroup()">
        <div class="text-center mb-2">
          <font-awesome-icon class="text-cprimary-600 text-3xl" icon="fa-solid fa-person-walking-arrow-right" />
        </div>
        <h4 class="font-medium text-center mb-2">加入小组</h4>
        <p class="text-xl text-neutral-500 text-center">通过邀请码加入其他同学创建的小组</p>
      </div>
    </div>
  </div>

  <div v-else>

  </div>

  <el-dialog title="创建实验小组" v-model="createGroupDialog.visible">

    <el-form ref="createGroupFormRef" :model="createGroupDialog.formData" label-width="120px">
      <el-form-item label="小组名称" prop="name" :rules="[{
        required: true,
        message: '请输入小组名称',
        trigger: ['change', 'blur']
      }]">
        <el-input v-model="createGroupDialog.formData.name" placeholder="输入一个容易辨识的小组名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button type="primary" :disabled="createGroupDialog.formData.name == ''" @click="createGroup">确定</el-button>
        <el-button @click="closeCreateGroupDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup>

import { useEmdV4Store } from '@/stores/emdV4TaskStore.ts';
// 分组接口
import { getEmdV4MyGroup, getEmdV4NotJoinedStudents, createEmdV4Group } from '@/apis/emdV4'
const emdV4Store = useEmdV4Store()

console.log(emdV4Store.project)

const route = useRoute()
const taskId = route.params.id

const props = defineProps({
  index: Number,
  comp: Object,
})

const payload = ref(props.comp.payload)


const groupDetail = ref(null)
const setGroupDetail = (data) => {
  groupDetail.value = data
}

const showGroupDetail = computed(()=>{
  let f = false
  f = groupDetail.value != null
  return f
})

const createGroupDialog = ref({
  visible: false,
  formData: {
    name: '', // 小组名称
  }
})

const createGroupFormRef = ref(null)

const showCreateGroup = () => {
  console.log("showCreateGroup")
  createGroupDialog.value.visible = true
}

const closeCreateGroupDialog = () => {
  createGroupDialog.value.visible = false
}


const createGroup = () => {
  createGroupFormRef.value.validate(v => {
    if (v) {
      let req = {
        id: null,
        taskId: taskId,
        name: createGroupDialog.value.formData.name,
        students: null,
      }
      createEmdV4Group(req).then(res => {
        if (res.state == 200) {
          // ElMessage.success("小组创建成功")
        }
      })

      closeCreateGroupDialog()
    }
  })
}

const showJoinGroup = () => {
}






const infoMyGroup = () => {
  getEmdV4MyGroup(taskId).then(res => {
    if (res.state == 200) {
      // console.log(res.data)
    }
  })
}

infoMyGroup()

const findNotJoinedStudents = () => {
  getEmdV4NotJoinedStudents(taskId).then(res => {
    if (res.state == 200) {
      // console.log(res.data)
    }
  })
}

findNotJoinedStudents()


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