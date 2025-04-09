<template>
    <!-- 小组创建成功页面 -->
    <div id="groupCreatedContainer" class="custom-scrollbar overflow-y-auto" style="max-height: calc(90vh - 130px);">
        <div class="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 class="font-medium text-neutral-800">小组创建成功</h3>
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
                <h3 class="font-medium text-2xl mt-2">小组创建成功!</h3>
                <p class="text-neutral-500 text-xl mt-1" id="groupCreatedInfo">您已成功创建了小组</p>
            </div>

            <div class="bg-cprimary-50 rounded-lg p-4 mb-6">
                <h4 class="font-medium text-neutral-800 mb-2">小组邀请码</h4>
                <div class="flex items-center">
                    <div id="inviteCode"
                        class="bg-white px-4 py-3 rounded border border-cprimary-200 text-2xl font-medium text-cprimary-800 flex-grow text-center">
                        {{ groupStore.getCurrGroup?.code }}
                    </div>
                    <button id="copyButton" class="ml-2 p-2 bg-cprimary-600 text-white rounded hover:bg-cprimary-700"
                        @click="copyInviteCode()">
                        <font-awesome-icon v-if="copyed" icon="fa-solid fa-check" />
                        <font-awesome-icon v-else icon="fa-solid fa-copy" />
                    </button>
                </div>
                <p class="mt-2 text-xl text-cprimary-700">分享此邀请码给你的组员，他们可以通过此代码加入您的小组</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import { ref } from 'vue';
const courseStore = useCourseStore()
const groupStore = useTaskGroupStore()
const copyed = ref(false)

const backToGroupInit = () => {
    groupStore.setCurrPage("groupDetail")
}


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
</script>
<style scoped></style>