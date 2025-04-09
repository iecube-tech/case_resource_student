<template>
    <!-- 分组选择页面 -->
    <div id="groupSelectionContainer" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800" id="selectedExperimentName">实验名称</h3>
            <button
                class="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-md text-xl flex items-center"
                @click="backToExperimentsList()">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
                返回实验列表
            </button>
        </div>

        <div class="p-4">
            <div class="bg-cprimary-50 border-l-4 border-cprimary-500 p-4 mb-6">
                <p class="text-cprimary-700">根据老师要求，本次实验需要
                    {{ courseStore.getCurrCourse?.groupLimit }}
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
                        <font-awesome-icon class="text-cprimary-600 text-3xl"
                            icon="fa-solid fa-person-walking-arrow-right" />
                    </div>
                    <h4 class="font-medium text-center mb-2">加入小组</h4>
                    <p class="text-xl text-neutral-500 text-center">通过邀请码加入其他同学创建的小组</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()

const backToExperimentsList = () => {
    courseStore.setCurrPage("taskList")
}

const showCreateGroup = () => {
    groupStore.setCurrPage("groupCreate")
}

const showJoinGroup = () => {
    groupStore.setCurrPage("groupJoin")
}


</script>
<style scoped>
/* 小组选项卡片样式 */
.group-option {
    transition: all 0.2s ease;
    cursor: pointer;
}

.group-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>