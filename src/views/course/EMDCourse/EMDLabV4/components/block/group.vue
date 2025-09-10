<!-- 
 分组组件和设备组件需要配合使用 并同时出现在 stepBystep commonBlock 中 
 分组组件的显示 需要满足两个条件 设备已连接  或者  分组组件的block标识为 完成
 -->

<template>
  <div class="" v-if="!showGroupDetail">
    <div class="bg-cprimary-50 border-l-4 border-cprimary-500 p-4 mb-6">
      <p class="text-cprimary-700">
        根据老师要求，本次实验需要{{ emdV4Store.project.groupLimit }}人一组完成。请选择创建小组或加入已有小组。
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
        @click="openJoinGroupDialog()">
        <div class="text-center mb-2">
          <font-awesome-icon class="text-cprimary-600 text-3xl" icon="fa-solid fa-person-walking-arrow-right" />
        </div>
        <h4 class="font-medium text-center mb-2">加入小组</h4>
        <p class="text-xl text-neutral-500 text-center">通过邀请码加入其他同学创建的小组</p>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="mb-4 border-b border-neutral-200 flex justify-between items-center">
      <h3 class="font-medium text-neutral-800">我的小组</h3>
    </div>
    <div class="">

      <!-- 已加入的小组 -->
      <div id="myGroupsPanel" class="space-y-4">
        <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-4 ">
          <div class="bg-neutral-50 border-neutral-200 px-4 py-2 border-b flex items-center">
            <div class="flex-1">
              <div class="flex items-center">
                <h3 class="font-medium">
                  小组名称: {{ groupDetail.name }}
                </h3>
                <div id="inviteCode" class="ml-4">
                  邀请码: {{ groupDetail.code }}
                </div>
                <button id="copyButton" class="btn-item bg-cprimary-600 text-white hover:bg-cprimary-700"
                  @click="copyInviteCode()">
                  <font-awesome-icon v-if="copyed" icon="fa-solid fa-check" />
                  <font-awesome-icon v-else icon="fa-solid fa-copy" />
                </button>

                <button v-if="isCreator && !ensureGroup" @click="refreshCode()"
                  class="btn-item bg-cprimary-600 text-white hover:bg-cprimary-700">
                  <font-awesome-icon icon="fa-solid fa-rotate-right" />
                </button>
              </div>
            </div>

            <el-popconfirm v-if="studentId == groupDetail.creator && !ensureGroup" confirm-button-text="确定"
              cancel-button-text="取消" icon="InfoFilled" icon-color="#626AEF" :title="'确定删除小组吗'" @confirm="delGroup">
              <template #reference>
                <button class="btn-item bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
                  <font-awesome-icon icon="fa-solid fa-trash-can" />
                </button>
              </template>
            </el-popconfirm>

            <button @click="openAddStudentDialog" v-if="isCreator && !ensureGroup"
              class="btn-item bg-cprimary-50 text-cprimary-700 hover:bg-cprimary-100 border-cprimary-200">
              <font-awesome-icon icon="fa-solid fa-user-plus" />
            </button>

            <span class="ml-4 text-xl bg-cprimary-100 text-cprimary-800 rounded-full px-4 py-0.5">
              {{ groupDetail.studentList.length }}/{{ groupDetail?.limitNum }}人
            </span>
          </div>
          <div class="p-4">
            <div class="space-y-2 mb-4">
              <div v-for="item in groupDetail?.studentList"
                class="flex items-center justify-between p-2 bg-neutral-50 rounded border border-neutral-100">
                <div class="flex items-center">
                  <font-awesome-icon class="text-cprimary-600 mr-2" icon="fa-solid fa-user" />
                  <span v-if="item.id == groupDetail?.creator" class="font-medium">
                    {{ item.studentName }}（组长）
                  </span>
                  <span v-else class="font-medium">{{ item.studentName }}</span>
                </div>
                <div class="flex justify-end items-center">
                  <el-popconfirm v-if="item.id != groupDetail?.creator && isCreator && !ensureGroup" confirm-button-text="确定"
                    cancel-button-text="取消" icon="InfoFilled" icon-color="#626AEF"
                    :title="'确定从小组中移除' + item.studentName + '吗？'" @confirm="removeStudent(item.id)">
                    <template #reference>
                      <button v-if="item.id != groupDetail?.creator"
                        class="mr-2 p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200">
                        <font-awesome-icon icon="fa-solid fa-trash-can" />
                      </button>
                    </template>
                  </el-popconfirm>
                  <span class="text-xl bg-cprimary-100 text-cprimary-800 rounded-full px-2 py-0.5 mr-2">
                    已就绪
                  </span>
                </div>
              </div>
            </div>
            <el-popconfirm v-if="!ensureGroup" width="400px" confirm-button-text="确定"
              cancel-button-text="取消" icon="InfoFilled" icon-color="#626AEF" :title="'确定开始实验吗？开始实验后将不能更改小组'"
              @confirm="startGroupExperiment()">
              <template #reference>
                <button class="w-full bg-cprimary-600 hover:bg-cprimary-700 text-white font-medium py-2 px-4 rounded">
                  开始实验
                </button>
              </template>
            </el-popconfirm>
            <div v-else class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p class="text-red-700">已开始实验,不能再更改小组成员</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 创建小组 对话框 -->
  <el-dialog title="创建实验小组" v-model="createGroupDialog.visible" width="500px">
    <el-form ref="createGroupFormRef" :model="createGroupDialog.formData">
      <el-form-item label="小组名称" prop="name" :rules="[{
        required: true,
        message: '请输入小组名称',
        trigger: ['change', 'blur']
      }]">
        <el-input v-model="createGroupDialog.formData.name" placeholder="输入一个容易辨识的小组名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :disabled="createGroupDialog.formData.name == ''"
        @click="debounceCreateGroup">确定</el-button>
      <el-button @click="closeCreateGroupDialog">取消</el-button>
    </template>
  </el-dialog>

  <!-- 选择人员添加到小组 对话框 -->
  <el-dialog v-model="addStudentDialog.visible" title="选择人员添加到小组" width="50%" append-to-body>
    <el-input v-model="addStudentDialog.searchText" placeholder="搜索: 输入学号或姓名快速查找" @input="debounceFilter" clearable />
    <div class="border-b my-2"></div>
    <el-table height="400" :data="addStudentDialog.filterStudents" ref="selectStuTableRef" empty-text="暂无数据"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="canSelecte" width="50"></el-table-column>
      <el-table-column type="index" width="80" />
      <el-table-column prop="studentId" sortable label="学号" />
      <el-table-column prop="studentName" label="姓名" />
    </el-table>
    <template #footer>
      <el-button type="primary" @click="addStudents">确定</el-button>
      <el-button @click="closeAddStudentDialog">取消</el-button>
    </template>
  </el-dialog>

  <!-- 加入小组 弹窗 -->
  <el-dialog v-model="joinGroupDialog.visible" title="加入小组" width="500" append-to-body>
    <el-form :model="joinGroupDialog.formData" ref="joinGroupFormRef">
      <el-form-item label="邀请码" prop="inviteCode" :rules="[{
        required: true,
        message: '请输入邀请码',
        trigger: 'blur'
      }]">
        <el-input v-model="joinGroupDialog.formData.invitationCode" placeholder="输入6位小组邀请码"
          autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <p class="text-sm text-neutral-500">请向小组创建者获取邀请码</p>
    <template #footer>
      <el-button type="primary" @click="handleJoinGroup">加入</el-button>
      <el-button @click="closeJoinGroupDialog">取消</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">

import { useEmdV4Store } from '@/stores/emdV4TaskStore.ts';
import { useUserStore } from '@/store/index';
import { debounce, cloneDeep, add, } from 'lodash';

const userStore = useUserStore()
const { getUser } = userStore
const studentId = getUser()?.id

// 控制一些操作权限
const isCreator = computed(() => {
  return studentId == groupDetail.value.creator
})

const ensureGroup = computed(()=>{
  return groupDetail.value.status == 1
})

// 分组接口
import {
  getEmdV4MyGroup, getEmdV4NotJoinedStudents,
  createEmdV4Group, refreshEmdV4GroupCode, deleteEmdV4Group,
  addEmdV4GroupStudents, removeEmdV4GroupStudent, applyJoinGroup,
  finishEmdV4Group,
} from '@/apis/emdV4'


const emdV4Store = useEmdV4Store()

// console.log(emdV4Store.project)

const route = useRoute()
const taskId = route.params.id

const props = defineProps({
  index: Number,
  comp: Object,
})

const payload = ref(props.comp.payload)

const groupDetail = ref(null)

const copyed = ref(false)

// 设置分组信息
const setGroup = (data) => {
  groupDetail.value = data
}

const showGroupDetail = computed(() => {
  let f = false
  f = groupDetail.value != null
  return f
})


// 复制邀请码
function copyInviteCode() {
  const inviteCode = document.getElementById('inviteCode')?.textContent;
  navigator.clipboard.writeText(<string>inviteCode).then(() => {
    // 复制成功后的动画效果
    copyed.value = true
    setTimeout(() => {
      copyed.value = false
    }, 1500);
  });
}

function refreshCode() {
  refreshEmdV4GroupCode(groupDetail.value.id).then(res => {
    if (res.state == 200) {
      setGroup(res.data)
    }
  })
}

function delGroup() {
  deleteEmdV4Group(groupDetail.value.id).then(res => {
    if (res.state == 200) {
      getEmdV4MyGroup(taskId).then(res => {
        if (res.state == 200) {
          setGroup(res.data)
        }
      })
    }
  })
}

const addStudentDialog = ref({
  visible: false,
  searchText: '',
  filterStudents: [],
  allNotJoinedStudents: [],
  selections: [],
  canAddN: 0,
})

const searchStudent = () => {
  let searchText = addStudentDialog.value.searchText

  addStudentDialog.value.filterStudents = addStudentDialog.value.allNotJoinedStudents.filter((student) => {
    if (searchText == '') {
      return true
    } else {
      return student.studentName.includes(searchText) || student.studentId.includes(searchText)
    }
  })
}

const debounceFilter = debounce(searchStudent, 200)



const closeAddStudentDialog = () => {
  addStudentDialog.value.visible = false
  addStudentDialog.value.searchText = ''
  addStudentDialog.value.filterStudents = []
  addStudentDialog.value.allNotJoinedStudents = []
  addStudentDialog.value.selections = []
  addStudentDialog.value.canAddN = 0
}

const addStudents = () => {
  let req = {
    id: groupDetail.value.id,
    students: addStudentDialog.value.selections
  }
  addEmdV4GroupStudents(req).then(res => {
    if (res.state == 200) {
      setGroup(res.data)
      closeAddStudentDialog()
    }
  })
}

const removeStudent = (studentId) => {
  removeEmdV4GroupStudent(groupDetail.value.id, studentId).then(res => {
    if (res.state == 200) {
      setGroup(res.data)
    }
  })
}

const selectStuTableRef = ref(null)

const openAddStudentDialog = () => {
  if (groupDetail.value.studentList.length == groupDetail.value.limitNum) {
    ElMessage.warning('小组人数已满！')
    return
  }

  try {
    getEmdV4NotJoinedStudents(taskId).then(res => {
      if (res.state == 200) {
        addStudentDialog.value.allNotJoinedStudents = res.data
        searchStudent()
      }
    })
  } catch (e) {

  } finally {
    addStudentDialog.value.visible = true
    addStudentDialog.value.canAddN = emdV4Store.project.groupLimit - groupDetail.value.studentList.length
  }
}

// 处理选中学生
const handleSelectionChange = async (v) => {
  let checkedStu = addStudentDialog.value.selections
  let n = addStudentDialog.value.canAddN
  if (n <= 0) {
    selectStuTableRef.value.clearSelection()
    addStudentDialog.value.selections = []
  } else {
    if (v.length <= n) {
      addStudentDialog.value.selections = v
    } else {

      for (let i = 0; i < v.length; i++) {
        let row = v[i]
        if (i < n) {
          addStudentDialog.value.selections.push(v[i])
          selectStuTableRef.value.toggleRowSelection(row, true, true)
        } else {
          selectStuTableRef.value.toggleRowSelection(row, false, true)
        }
      }
    }
  }
}

const canSelecte = (row) => {
  let limit = emdV4Store.project.groupLimit
  let selected = addStudentDialog.value.selections.length
  let added = groupDetail.value.studentList.length
  let f = false
  if (selected + added < limit) {
    f = true
  } else {
    f = false
    let rowId = row.id
    let selectionsId = addStudentDialog.value.selections.map(item => item.id)
    if (selectionsId.includes(rowId)) {
      f = true
    }
  }
  return f;
}


// 加入组
const joinGroupFormRef = ref(null)

const joinGroupDialog = ref({
  visible: false,
  formData: {
    invitationCode: "",
  }
})

const openJoinGroupDialog = () => {
  joinGroupDialog.value.formData.invitationCode = ''
  joinGroupDialog.value.visible = true
}

const closeJoinGroupDialog = () => {
  joinGroupFormRef.value.clearValidate()
  joinGroupDialog.value.formData.invitationCode = ''
  joinGroupDialog.value.visible = false
}

const handleJoinGroup = () => {
  joinGroupFormRef.value.validate(v => {
    if (v) {
      applyJoinGroup(taskId, joinGroupDialog.value.formData.invitationCode).then(res => {
        if (res.state == 200) {
          setGroup(res.data)
          closeJoinGroupDialog()
        }
      })
    }
  })
}

// 实验开始 确认分组信息
const startGroupExperiment = () => {
  finishEmdV4Group(groupDetail.value.id).then(res => {
    if (res.state == 200) {
      setGroup(res.data)
    }
  })
}

const createGroupDialog = ref({
  visible: false,
  formData: {
    name: '', // 小组名称
  }
})

const createGroupFormRef = ref(null)

const showCreateGroup = () => {
  // console.log("showCreateGroup")
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
          setGroup(res.data)
          closeCreateGroupDialog()
        }
      })
    }
  })
}

const debounceCreateGroup = debounce(createGroup, 200)


const infoMyGroup = () => {
  getEmdV4MyGroup(taskId).then(res => {
    if (res.state == 200) {
      setGroup(res.data)
    }
  })
}

infoMyGroup()

onMounted(() => {
  // updateCompStatus(props.comp.id, 1, () => {
  //   props.comp.status = 1;
  // })
})
</script>

<style lang="scss" scoped>
.group-status-active {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}


.btn-item {
  @apply h-[30px] w-[30px] flex justify-center items-center ml-2 px-2 rounded border;
}
</style>