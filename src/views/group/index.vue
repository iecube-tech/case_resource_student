<template>
    <div style="width: 50%;">
        <el-row style="margin-top: 1em; margin-bottom: 1em">
            <span style="font-size: 1.4em; font-weight: bold;">本实验课程需要学生分组实验</span>
        </el-row>
        <div v-if="groupVo.groupId == null" :key="'null-id'">
            <el-row>
                <el-button type="primary" size="small" @click="EditGroupDialog = true">创建小组</el-button>
                <el-button type="primary" size="small" @click="JoinGroupDialog = true">加入小组</el-button>
            </el-row>
        </div>
        <div v-if="groupVo.groupId != null" :key="'groupVo.groupId '">
            <el-row v-if="groupVo.groupName != ''">
                <span>组名：{{ groupVo.groupName }}</span>
                <el-button v-if="groupVo.creator == studentId" type="primary" link :icon="Edit"
                    style="margin-left: 20px" @click="GroupEditDialog = true" />
            </el-row>
            <el-row v-if="groupVo.groupStudents!.length > 0">
                <span>成员：</span>
                <span v-for="(item, i) in groupVo.groupStudents" style="margin-right: 1rem;">
                    {{ item.studentName }}
                </span>
                <el-button v-if="groupVo.creator == studentId" type="primary" link :icon="Edit"
                    style="margin-left: 20px" @click="GroupStudentDialog = true" />
                <el-button v-if="groupVo.creator == studentId" type="primary" link :icon="Plus"
                    style="margin-left: 20px" @click="GroupAddStudent" />
            </el-row>
            <el-row v-if="groupVo.code != ''">
                <span>邀请码：{{ groupVo.code }}</span>
                <el-button v-if="groupVo.creator == studentId" type="primary" link :icon="Refresh"
                    style="margin-left: 20px" @click="refresh" />
            </el-row>
        </div>

        <el-dialog v-model="EditGroupDialog" title="新建小组" width="500">
            <el-form-item label="组名：" label-width="80px">
                <el-input v-model="newGroup.name" autocomplete="off" />
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="EditGroupDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitCreateGroup()">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="JoinGroupDialog" title="加入小组" width="500">
            <el-form-item label="邀请码：" label-width="80px">
                <el-input v-model="invitationCode" autocomplete="off" />
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="JoinGroupDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitJoinGroup()">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="GroupEditDialog" title="编辑小组" width="500">
            <el-form-item label="组名：" label-width="100px">
                <el-input v-model="groupVo.groupName" autocomplete="off" @change="updateGroupName()" />
            </el-form-item>
            <el-form-item label="删除小组：" label-width="100px">
                <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF"
                    :title="'确定删除小组吗'" @confirm="delGroup()">
                    <template #reference>
                        <el-button type="danger" link :icon="Delete"></el-button>
                    </template>
                </el-popconfirm>
            </el-form-item>
        </el-dialog>

        <el-dialog v-model="GroupStudentDialog" title="成员管理" width="500">
            <el-form-item v-for="(item, i) in groupVo.groupStudents">
                <span style="margin-right: 2rem">{{ item.studentId + "_" + item.studentName }}</span>
                <el-popconfirm v-if="item.id != studentId" confirm-button-text="确定" cancel-button-text="取消"
                    :icon="InfoFilled" icon-color="#626AEF" :title="'确定从小组中移除' + item.studentName + '吗？'"
                    @confirm="removeStudent(item.id)">
                    <template #reference>
                        <el-button type="danger" link :icon="Delete"></el-button>
                    </template>
                </el-popconfirm>
            </el-form-item>
        </el-dialog>

        <el-dialog v-model="GroupAddStudentDialog" title="选择人员添加到小组" width="50%">
            <el-table height="400" :data="projectStudents" ref="multipleTableRef"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="selectable" width="40" />
                <el-table-column type="index" width="40" />
                <el-table-column prop="studentId" sortable label="学号" />
                <el-table-column prop="studentName" label="姓名" />
                <el-table-column prop="groupName" label="小组" />
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="GroupAddStudentDialog = false">取消</el-button>
                    <el-button type="primary" @click="groupAddStudentsSubmit()">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/index';
import { onBeforeMount, ref } from 'vue';
import { Edit, Refresh, Delete, InfoFilled, Plus } from '@element-plus/icons-vue';

import { MyGroup } from '@/apis/group/mygroup';
import { CreateGroup } from '@/apis/group/createGroup';
import { JoinGroup } from '@/apis/group/joinGroup';
import { ReFreshGroupCode } from '@/apis/group/refrshCode';
import { GroupRemoveStudent } from '@/apis/group/groupRemoveStudent';
import { DeleteGroup } from '@/apis/group/delGroup';
import { UpdateGroupName } from '@/apis/group/updateGroupName';
import { ProjectStudnets } from '@/apis/group/projectStuodentList'
import { GroupAddStudnets } from '@/apis/group/groupAddList'
import { ElMessage } from 'element-plus';

const props = defineProps({
    projectId: Number,
    groupLimit: Number
})
interface student {
    id: number
    studentId: string
    studentName: string
}
interface GroupVo {
    groupId: number | null
    groupName: string | null
    limitNum: number | null
    creator: number | null
    code: string | null
    codeUnableTime: Date | null
    groupStudents: Array<student> | null
}
interface group {
    id: number | null
    name: string | null
    limitNum: number | null
    projectId: number | null
}
const EditGroupDialog = ref(false)
const JoinGroupDialog = ref(false)
const GroupStudentDialog = ref(false)
const GroupEditDialog = ref(false)
const GroupAddStudentDialog = ref(false)

const userStore = useUserStore()
const { getUser } = userStore
const studentId = getUser()?.id
const groupVo = ref<GroupVo>({
    groupId: null,
    groupName: '',
    limitNum: null,
    creator: null,
    code: '',
    codeUnableTime: null,
    groupStudents: []
})

const newGroup = ref<group>({
    id: null,
    name: '',
    limitNum: <any>props.groupLimit,
    projectId: <any>props.projectId
})

const invitationCode = ref('')

const emits = defineEmits(['HandleGroup'])

const sendGroupId = (id: number | null) => {
    emits("HandleGroup", id)
}

const submitCreateGroup = () => {
    CreateGroup(newGroup.value).then(res => {
        if (res.state == 200) {
            ElMessage.success("创建成功")
            groupVo.value = res.data
            sendGroupId(groupVo.value.groupId)
            EditGroupDialog.value = false
        } else {
            ElMessage.error(res.message)
        }
    })

}

const updateGroupName = () => {
    if (groupVo.value.groupName != null || groupVo.value.groupName != '') {
        UpdateGroupName(<any>groupVo.value.groupId, <any>groupVo.value.groupName).then(res => {
            if (res.state == 200) {
                ElMessage.success("修改成功")
                groupVo.value = res.data
            } else {
                ElMessage.error(res.message)
            }
        })
    }

}

const delGroup = () => {
    DeleteGroup(<any>groupVo.value.groupId).then(res => {
        if (res.state == 200) {
            ElMessage.success("删除成功")
            groupVo.value = res.data
            sendGroupId(groupVo.value.groupId)
            GroupEditDialog.value = false
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

const removeStudent = (id: number) => {
    GroupRemoveStudent(<any>groupVo.value.groupId, id).then(res => {
        if (res.state == 200) {
            groupVo.value = res.data
            ElMessage.success("操作成功")
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

const refresh = () => {
    ReFreshGroupCode(<any>groupVo.value.groupId).then(res => {
        if (res.state == 200) {
            groupVo.value.code = res.data.code
            groupVo.value.codeUnableTime = res.data.unableTime
            ElMessage.success("邀请码刷新成功")
        } else {
            ElMessage.error(res.message)
        }
    })
}

const submitJoinGroup = () => {
    JoinGroup(invitationCode.value, props.projectId!).then(res => {
        if (res.state == 200) {
            ElMessage.success("加入成功")
            groupVo.value = res.data
            sendGroupId(groupVo.value.groupId)
            JoinGroupDialog.value = false
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

const projectStudents = ref()

const multipleSelection = ref()

const handleSelectionChange = (val: Array<any>) => {
    multipleSelection.value = val
}

const GroupAddStudent = () => {
    ProjectStudnets(<any>props.projectId).then(res => {
        if (res.state == 200) {
            projectStudents.value = res.data
        } else {
            ElMessage.error("获取学生信息失败")
            return
        }
    })
    GroupAddStudentDialog.value = true
}

const selectable = (row: any) => !row.groupId

const groupAddStudentsSubmit = () => {
    if (multipleSelection.value == null) {
        return
    }
    GroupAddStudnets(multipleSelection.value, <any>groupVo.value.groupId).then(res => {
        if (res.state == 200) {
            groupVo.value = res.data
            GroupAddStudentDialog.value = false
            multipleSelection.value = null
            ElMessage.success("已添加")
        } else {
            ElMessage.error(res.message)
        }
    })
}


onBeforeMount(() => {
    MyGroup(props.projectId!, studentId!).then(res => {
        if (res.state == 200) {
            if (res.data != null) {
                groupVo.value = res.data
                newGroup.value.id = groupVo.value.groupId
                newGroup.value.name = groupVo.value.groupName
            }
            sendGroupId(groupVo.value.groupId)
        }
    })
})
</script>
<style scoped></style>