<template>
    <div class="main-content">
        
        <div class="lab-container">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 ">
                <div class="flex border-b border-gray-200">
                    <button id="tab-preview" class="flex-1 py-4 px-6 text-center font-medium tab-transition border-b-2 text-gray-500"
                        :class="step == 1 ? 'border-blue-600 text-blue-600': ''" @click="setStep(1)">
                        <font-awesome-icon :icon="['fas', 'fa-book-open']" class="mr-2"></font-awesome-icon>
                        实验预习
                    </button>
                    <button id="tab-operation" class="flex-1 py-4 px-6 text-center font-medium tab-transition border-b-2 text-gray-500"
                    :class="step == 2 ? 'border-blue-600 text-blue-600': ''" @click="setStep(2)">
                        <font-awesome-icon :icon="['fas', 'fa-cogs']" class="mr-2"></font-awesome-icon>
                        实验操作
                    </button>
                    <button id="tab-assessment" class="flex-1 py-4 px-6 text-center font-medium tab-transition border-b-2 text-gray-500"
                    :class="step == 3 ? 'border-blue-600 text-blue-600': ''" @click="setStep(3)">
                        <font-awesome-icon :icon="['fas', 'fa-clipboard-check']" class="mr-2"></font-awesome-icon>
                        课后考核
                    </button>
                </div>
            </div>
        </div>
        
        <div v-if="controllerDeviceVisible" class="lab-container">
            <el-tabs v-model="activeTab" class="tabs">
                <el-tab-pane name="report">
                    <template #label>
                        <span class="text-lg font-bold">实验指导书</span>
                    </template>
                    <labDetail v-if="taskId" :taskId="parseInt(taskId)"
                        :controllerDeviceVisible="controllerDeviceVisible" />
                </el-tab-pane>
                <el-tab-pane name="code">
                    <template #label>
                        <span class="text-lg font-bold">代码部署</span>
                    </template>
                    <codeEditor></codeEditor>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-if="!controllerDeviceVisible && taskId" class="lab-container">
            <labDetail :taskId="parseInt(taskId)" />
        </div>
    </div>
</template>

<script setup>

import labDetail from './EMDLabDetail/modelView.vue';
import codeEditor from './code/codeEditor.vue';

const props = defineProps({
    taskId: String | Number,
    controllerDeviceVisible: Boolean,
});

const step = ref(1)
const canStep = ref(1)

const setStep = (v) => {
    console.log(v)
    console.log(typeof v)
    step.value = v
}

</script>

<style scoped>

</style>