<template>
    <!-- 创建小组页面 -->
    <div id="createGroupContainer" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800">创建实验小组</h3>
            <button
                class="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-md text-xl flex items-center"
                @click="backToGroupSelection()">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
                返回
            </button>
        </div>

        <div class="p-4">
            <div class="bg-cprimary-50 border-l-4 border-cprimary-500 p-4 mb-6">
                <p class="text-cprimary-700">
                    您正在为“{{ courseStore.getCurrTask?.taskName }}”创建一个{{ courseStore.getCurrCourse?.groupLimit }}人小组</p>
            </div>

            <div class="mb-6">
                <label class="block text-xl font-medium text-neutral-700 mb-2">小组名称</label>
                <el-input type="text" v-model="groupName"
                    class="w-full border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-cprimary-500 focus:border-cprimary-500"
                    placeholder="输入一个容易辨识的小组名称" />
            </div>

            <div class="flex justify-end">
                <button type="button"
                    class="px-4 py-2 bg-cprimary-600 text-white rounded-md shadow-sm text-xl font-medium hover:bg-cprimary-700"
                    @click="createGroup()">
                    创建小组
                </button>
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import { ref } from 'vue';
import { CreateGroup } from '@/apis/group/createGroup';
import { ElMessage } from 'element-plus';

const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()

const groupName = ref('')
const backToGroupSelection = () => {
    groupStore.setCurrPage("groupInit")
}

const createGroup = () => {
    if (groupName.value.trim() == '') {
        ElMessage.warning("请输入小组名称")
        return
    }
    let group = {
        id: null,
        name: groupName.value,
        limitNum: courseStore.getCurrCourse?.groupLimit,
        taskId: courseStore.getCurrTask?.taskId,
        submitted: 0
    }
    CreateGroup(group).then(res => {
        if (res.state == 200) {
            groupStore.setCurrGroup(res.data)
            groupStore.setCurrPage("groupDetail")
        } else {
            ElMessage.error(res.message)
        }
    })
}



</script>
<style scoped></style>