<template>

    <!-- 我的小组页面 -->
    <div id="myGroupsContainer" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800">我的小组</h3>
            <button
                class="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-md text-xl flex items-center"
                @click="backToExperimentsList()">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
                返回实验列表
            </button>
        </div>

        <div class="p-4">
            <p class="text-3xl mb-6">{{ courseStore.getCurrTask?.taskName }}</p>
            <div class="bg-cprimary-50 border-l-4 border-cprimary-500 p-4 mb-6">
                <p class="text-cprimary-700">根据老师要求，本次实验需要
                    {{ courseStore.getCurrCourse?.groupLimit }}
                    人一组完成。
                </p>
            </div>

            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p class="text-red-700">实验开始后将不能更改小组成员
                </p>
            </div>
            <!-- 已加入的小组 -->
            <div id="myGroupsPanel" class="space-y-4">
                <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-4 ">
                    <div class="bg-neutral-50 border-neutral-200 px-4 py-3 border-b flex items-center">
                        <div class="flex-1">
                            <div class="flex">
                                <h3 class="font-medium">
                                    {{ groupStore.getCurrGroup?.groupName }}
                                </h3>
                                <div id="inviteCode" class="ml-4">
                                    {{ groupStore.getCurrGroup?.code }}
                                </div>
                                <button id="copyButton"
                                    class="ml-2 px-2 text-xg bg-cprimary-600 text-white rounded hover:bg-cprimary-700"
                                    @click="copyInviteCode()">
                                    <font-awesome-icon v-if="copyed" icon="fa-solid fa-check" />
                                    <font-awesome-icon v-else icon="fa-solid fa-copy" />
                                </button>

                                <button
                                    v-if="studentId == groupStore.currGroup?.creator && groupStore.currGroup?.submitted == 0"
                                    @click="refreshCode()"
                                    class="ml-2 px-2 text-xg bg-cprimary-600 text-white rounded hover:bg-cprimary-700">
                                    <font-awesome-icon icon="fa-solid fa-rotate-right" />
                                </button>
                            </div>
                        </div>
                        <el-popconfirm
                            v-if="studentId == groupStore.currGroup?.creator && groupStore.currGroup?.submitted == 0"
                            confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF"
                            :title="'确定删除小组吗'" @confirm="delGroup()">
                            <template #reference>
                                <button
                                    class="mr-2 p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200">
                                    <font-awesome-icon class="text-xl" icon="fa-solid fa-trash-can" />
                                </button>
                            </template>
                        </el-popconfirm>

                        <button @click="GroupAddStudent()"
                            v-if="studentId == groupStore.currGroup?.creator && groupStore.currGroup?.submitted == 0"
                            class="mr-2 p-1.5 bg-cprimary-50 text-cprimary-700 rounded hover:bg-cprimary-100 border border-cprimary-200">
                            <font-awesome-icon class="text-xl" icon="fa-solid fa-user-plus" />
                        </button>
                        <span class="text-xl bg-cprimary-100 text-cprimary-800 rounded-full px-2 py-0.5">
                            {{ groupStore.currGroup?.groupStudents.length }}/{{ groupStore.getCurrGroup?.limitNum }}人
                        </span>
                    </div>
                    <div class="p-4">
                        <div class="space-y-2 mb-4">
                            <div v-for="item in groupStore.currGroup?.groupStudents"
                                class="flex items-center justify-between p-2 bg-neutral-50 rounded border border-neutral-100">
                                <div class="flex items-center">
                                    <font-awesome-icon class="text-cprimary-600 mr-2" icon="fa-solid fa-user" />
                                    <span v-if="item.id == groupStore.getCurrGroup?.creator" class="font-medium">
                                        {{ item.studentName }}（组长）
                                    </span>
                                    <span v-else class="font-medium">{{ item.studentName }}</span>
                                </div>
                                <div class="flex items-center">
                                    <span
                                        class="text-xl bg-cprimary-100 text-cprimary-800 rounded-full px-2 py-0.5 mr-2">
                                        已就绪
                                    </span>
                                    <el-popconfirm
                                        v-if="studentId == groupStore.currGroup?.creator && groupStore.currGroup?.submitted == 0"
                                        confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                                        icon-color="#626AEF" :title="'确定从小组中移除' + item.studentName + '吗？'"
                                        @confirm="removeStudent(item.id)">
                                        <template #reference>
                                            <button v-if="item.id != groupStore.currGroup?.creator"
                                                class="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200">
                                                <font-awesome-icon class="text-xl" icon="fa-solid fa-trash-can" />
                                            </button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                        <el-popconfirm
                            v-if="studentId == groupStore.currGroup?.creator && groupStore.currGroup?.submitted == 0"
                            confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF"
                            :title="'确定开始实验吗？开始实验后将不能更改小组'" @confirm="startGroupExperiment()">
                            <template #reference>
                                <button
                                    class="w-full bg-cprimary-600 hover:bg-cprimary-700 text-white font-medium py-2 px-4 rounded">
                                    开始实验
                                </button>
                            </template>
                        </el-popconfirm>

                        <button v-else @click="startGroupExperiment()"
                            class="w-full bg-cprimary-600 hover:bg-cprimary-700 text-white font-medium py-2 px-4 rounded">
                            开始实验
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="GroupAddStudentDialog" title="选择人员添加到小组" width="50%" append-to-body>
        <el-input v-model="searchTerm" placeholder="搜索: 输入学号或姓名快速查找" @input="handleSearch" clearable />
        <el-table height="400" :data="filteredStudentList" ref="multipleTableRef"
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

</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import { ref } from 'vue';
import { useUserStore } from '@/store/index';
import { InfoFilled } from '@element-plus/icons-vue';
import { ProjectStudnets } from '@/apis/group/projectStuodentList'
import { GroupAddStudnets } from '@/apis/group/groupAddList'
import { ElMessage } from 'element-plus';
import { GroupRemoveStudent } from '@/apis/group/groupRemoveStudent';
import { DeleteGroup } from '@/apis/group/delGroup';
import router from '@/router';
import { ReFreshGroupCode } from '@/apis/group/refrshCode';
import { GroupUpdateSubmitted } from '@/apis/group/groupUpSubmit';
import { MyGroup } from '@/apis/group/mygroup';
import { UpdateTaskStatus } from '@/apis/EMDProject/updateEmdTaskStatus';
const userStore = useUserStore()
const { getUser } = userStore
const studentId = getUser()?.id

const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()

const backToExperimentsList = () => {
    courseStore.setCurrPage("taskList")
}

const copyed = ref(false)
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

const GroupAddStudentDialog = ref(false)
const searchTerm = ref()
const projectStudents = ref<Array<any>>([])
const filteredStudentList = ref<Array<any>>([])
const multipleSelection = ref()
const selectable = (row: any) => !row.groupId

const handleSelectionChange = (val: Array<any>) => {
    multipleSelection.value = val
}
const handleSearch = () => {
    filteredStudentList.value = projectStudents.value.filter(student => {
        return (student.studentId.includes(searchTerm.value) || student.studentName.includes(searchTerm.value))
    })
}

const refreshCode = () => {
    ReFreshGroupCode(<any>groupStore.getCurrGroup?.groupId).then(res => {
        if (res.state == 200) {
            groupStore.setCurrGroupCode(res.data.code)
            ElMessage.success("邀请码刷新成功")
        } else {
            ElMessage.error(res.message)
        }
    })
}

const GroupAddStudent = () => {
    ProjectStudnets(<any>courseStore.getCurrCourse?.id, <any>courseStore.getCurrTask?.taskId).then(res => {
        if (res.state == 200) {
            projectStudents.value = res.data
            filteredStudentList.value = res.data
            searchTerm.value = ''
        } else {
            ElMessage.error("获取学生信息失败")
            return
        }
    })
    GroupAddStudentDialog.value = true
}

const groupAddStudentsSubmit = () => {
    if (multipleSelection.value == null) {
        return
    }
    GroupAddStudnets(multipleSelection.value, <any>groupStore.getCurrGroup?.groupId).then(res => {
        if (res.state == 200) {
            groupStore.setCurrGroup(res.data)
            GroupAddStudentDialog.value = false
            multipleSelection.value = null
            ElMessage.success("已添加")
        } else {
            ElMessage.error(res.message)
        }
    })
}

const removeStudent = (id: number) => {
    GroupRemoveStudent(<any>groupStore.getCurrGroup?.groupId, id).then(res => {
        if (res.state == 200) {
            groupStore.setCurrGroup(res.data)
            ElMessage.success("操作成功")
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

const delGroup = () => {
    DeleteGroup(<any>groupStore.getCurrGroup?.groupId).then(res => {
        if (res.state == 200) {
            ElMessage.success("删除成功")
            groupStore.setCurrGroup(res.data)
            groupStore.setCurrPage("groupInit")
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

const startTask = () => {
    UpdateTaskStatus(courseStore.getCurrTask?.taskId, 1)
    GroupUpdateSubmitted(<any>groupStore.getCurrGroup?.groupId, 1).then(res => {
        if (res.state == 200) {
            const url = router.resolve({ name: 'emdTaskDetail', params: { id: courseStore.getCurrTask?.taskId }, query: { courseId: courseStore.getCurrCourse?.id } }).href;
            window.open(url, '_blank');
            courseStore.setDialog(false)
        } else {
            ElMessage.error(res.data)
        }
    })

}

const startGroupExperiment = async () => {
    if (!courseStore.getCurrTask) {
        return
    }
    await getStudentTaskGroup()
    if (groupStore.getCurrGroup?.submitted < 1 && groupStore.getCurrGroup?.creator != studentId) {
        ElMessage.warning("请等待组长确认开始实验后方可进入实验")
        return
    }
    if (groupStore.getCurrGroup?.submitted < 1 && groupStore.getCurrGroup?.creator == studentId) {
        startTask()
        return
    }
    const url = router.resolve({ name: 'emdTaskDetail', params: { id: courseStore.getCurrTask?.taskId }, query: { courseId: courseStore.getCurrCourse?.id } }).href;
    window.open(url, '_blank');
    courseStore.setDialog(false)

}

const getStudentTaskGroup = () => {
    return new Promise<void>((resolve, reject) => {
        if (!courseStore.getCurrTask?.taskId) {
            groupStore.setCurrPage("groupInit")
            return reject()
        }
        MyGroup(courseStore.getCurrTask?.taskId!, studentId!).then(res => {
            if (res.state == 200) {
                if (res.data != null) {
                    groupStore.setCurrGroup(res.data)
                    groupStore.setCurrPage("groupDetail")
                    return resolve()
                } else {
                    console.log("groupInit")
                    groupStore.setCurrPage("groupInit")
                    return resolve()
                }
            }
            else {
                ElMessage.error(res.message)
                groupStore.setCurrPage("groupInit")
                return reject()
            }
        })
    })
}
</script>
<style scoped></style>