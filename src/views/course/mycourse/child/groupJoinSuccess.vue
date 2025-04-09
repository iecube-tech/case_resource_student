<template>
    <!-- 成功加入小组页面 -->
    <div id="joinedGroupContainer" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800">成功加入小组</h3>
            <button
                class="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-md text-xl flex items-center"
                @click="backToGroupInit()">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
                返回
            </button>
        </div>

        <div class="p-4">
            <div class="text-center mb-4">
                <font-awesome-icon class="text-cprimary-600 text-4xl" icon="fa-solid fa-circle-check" />
                <h3 class="font-medium text-2xl mt-2">成功加入小组!</h3>
                <p class="text-neutral-500 text-xl mt-1" id="joinedGroupInfo">您已成功加入小组</p>
            </div>

            <div class="bg-neutral-50 rounded-lg p-4 mb-6">
                <h4 class="font-medium text-neutral-800 mb-2">{{ groupStore.getCurrGroup?.groupName }}
                    ({{ groupStore.getCurrGroup?.groupStudents.length }}/{{ groupStore.getCurrGroup?.limitNum }})</h4>
                <div class="space-y-2">
                    <div v-for="item in groupStore.getCurrGroup?.groupStudents"
                        class="flex items-center justify-between p-2 bg-white rounded border border-neutral-200">
                        <div class="flex items-center">
                            <font-awesome-icon class="text-cprimary-600 mr-2" icon="fa-solid fa-user-check" />
                            <span v-if="item.id == groupStore.getCurrGroup?.creator" class="font-medium">{{
                                item.studentName }}（组长）</span>
                            <span v-else class="font-medium">{{ item.studentName }}</span>
                        </div>
                        <span class="text-xl bg-cprimary-100 text-cprimary-800 rounded-full px-2 py-0.5">已就绪</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import router from '@/router';
import { ElMessage } from 'element-plus';
const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()

const backToGroupInit = () => {
    groupStore.setCurrPage("groupDetail")
}
</script>
<style scoped></style>