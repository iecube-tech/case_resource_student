<template>
    <div class="screenctrl" @click="jietu()"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMersurementliveStore } from '@/store/measurementliveStore'
import ScreenShort from "js-web-screen-shot";
import { ElMessage } from 'element-plus';


const measurementliveStore = useMersurementliveStore()
const jietu = () => {
    measurementliveStore.displayMersurementlive();
    try {
        new ScreenShort({
            enableWebRtc: true,  //是否显示选项框
            completeCallback: callback, // 截图成功完成的回调
            closeCallback: closeFn // 截图取消的回调
        });

    } catch (e) {
        console.log(e)
    }
}
const callback = (msg: any) => {
    console.log(msg)
}

const closeFn = () => {
    ElMessage.warning('取消截图')
}
</script>
<style scoped>
.screenctrl {
    position: fixed;
    z-index: 5000;
    cursor: pointer;
    transition: transform 0.1s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    top: 20px;
    left: 20px;
    background-color: red;
}

.screenctrl:hover {
    filter: brightness(80%);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
</style>
