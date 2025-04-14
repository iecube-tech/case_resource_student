<template>
    <!-- 加入小组页面 -->
    <div id="joinGroupContainer" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800">加入实验小组</h3>
            <button
                class="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-md text-xl flex items-center"
                @click="backToGroupSelection()">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
                返回
            </button>
        </div>

        <div class="p-4">
            <div class="bg-cprimary-50 border-l-4 border-cprimary-500 p-4 mb-6">
                <p class="text-cprimary-700">您正在为“{{ courseStore.getCurrTask?.taskName }}”加入小组</p>
            </div>

            <div class="mb-6">
                <label for="inviteCodeInput" class="block text-2xl font-medium text-neutral-700 mb-2">输入邀请码</label>
                <el-input type="text" v-model="invitationCode"
                    class="w-full border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-cprimary-500 focus:border-cprimary-500"
                    placeholder="输入6位小组邀请码" />
                <p class="mt-1 text-xl text-neutral-500">请向小组创建者获取邀请码</p>
            </div>

            <div class="flex justify-end">
                <button type="button"
                    class="px-4 py-2 bg-cprimary-600 text-white rounded-md shadow-sm text-xl font-medium hover:bg-cprimary-700"
                    @click="submitJoinGroup()">
                    加入小组
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import { JoinGroup } from '@/apis/group/joinGroup';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()

const invitationCode = ref('')
const backToGroupSelection = () => {
    groupStore.setCurrPage("groupInit")
}

const submitJoinGroup = () => {
    JoinGroup(invitationCode.value, <any>courseStore.getCurrTask?.taskId).then(res => {
        if (res.state == 200) {
            ElMessage.success("加入成功")
            groupStore.setCurrGroup(res.data)
            groupStore.setCurrPage("groupDetail")
        }
        else {
            ElMessage.error(res.message)
        }
    })
}
</script>
<style scoped></style>