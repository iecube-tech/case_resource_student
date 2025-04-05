<template>
    <!-- 顶部导航栏 -->
    <nav ref="nav" class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center">
                <img src="/logo.ico" alt="IECUBE Logo" class="w-10 h-10 mr-3">
                <h2 class="text-xl font-bold text-gray-800">{{ task?.taskName }}</h2>
            </div>
            <div v-if="labModelList" class="hidden md:flex items-center space-x-6">
                <button v-for="model in labModelList"
                    :class="['nav-btn', 'text-sm', 'py-1', 'px-3', 'rounded-full', 'bg-gray-200', 'text-gray-700', 'hover:bg-blue-300', 'hover:text-white']">
                    {{ model.name }}
                </button>
            </div>
            <div class="hidden md:flex items-center space-x-4">
                <span class="text-sm text-gray-600"
                    :title="'实验日期:' + formatDate(task?.taskStartTime) + '--' + formatDate(task?.taskEndTime)">
                    {{ '实验日期:' + formatDate(<any>Date.now(), false) }}
                </span>
            </div>
            <button id="mobile-menu-btn" class="md:hidden text-gray-700" @click="openMobileMenu">
                <i class="fas fa-bars"></i>
            </button>
        </div>
        <!-- 移动端导航菜单 -->
        <div id="mobile-menu" class="md:hidden hidden bg-white shadow-md">
            <div v-if="labModelList" class="container mx-auto py-3 px-4 flex flex-col space-y-2">
                <button v-for="model in labModelList"
                    :class="['nav-btn', 'text-sm', 'py-1', 'px-3', 'text-left', 'rounded', 'bg-gray-200', 'text-gray-700']">
                    {{ model.name }}
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/util';
import { ref, watch } from 'vue';
import { useEmdStore } from '@/stores/emdLabStore';
const labStore = useEmdStore()

const props = defineProps({
    task: Object
})

const labModelList = ref()

watch(() => labStore.labModelList, (newVal) => {
    labModelList.value = newVal
})

const openMobileMenu = () => {
    if (document.getElementById('mobile-menu')?.classList.contains('hidden')) {
        document.getElementById('mobile-menu')?.classList.remove('hidden')
    } else {
        document.getElementById('mobile-menu')?.classList.add('hidden')
    }
}
</script>
<style scoped></style>