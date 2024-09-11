<template>
    <div class="screenctrl" @click="jietu()"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMersurementliveStore } from '@/store/measurementliveStore'
import ScreenShort from "js-web-screen-shot";
import { ElMessage } from 'element-plus';


const measurementliveStore = useMersurementliveStore();
let stateBeforeJietu = false;

const jietu = () => {
    stateBeforeJietu = measurementliveStore.getState();
    measurementliveStore.displayMersurementlive();
    try {
        new ScreenShort({
            enableWebRtc: true,  //是否显示选项框
            completeCallback: callback, // 截图成功完成的回调
            closeCallback: closeFn, // 截图取消的回调
            cancelCallback: cancelFn,
            saveCallback: saveFn,
            canvasHeight: window.innerHeight - 5,
            canvasWidth: window.innerWidth - 5,
            level: 9999,
            loadCrossImg: true,
        });
        disableScroll()
    } catch (e) {
        console.log(e)
        closeScreenGet()
    }
}
const callback = (imageInfo: any) => {
    console.log(imageInfo)
    closeScreenGet()
}

const closeFn = () => {
    ElMessage.warning('取消截图')
    closeScreenGet()
}

const cancelFn = (res: { code: number, msg: string, errorInfo: string }) => {
    // 使用webrtc模式截屏时，用户点了取消或者浏览器不支持时所触发的事件 
    // 参数 {code: number,msg: string, errorInfo: string}code为-1时代表用户未授权或者浏览器不支持webrtc。 
    console.log(res)
    if (res.code == -1) {
        ElMessage.error(res.msg)
        closeScreenGet()
        return
    }
    ElMessage.warning('取消截图')
    closeScreenGet()
}


const saveFn = (code: number, msg: string) => {
    console.log(code, msg)
    // code 状态码，number类型，为0时代表保存成功
    // msg 消息码，string类型。
    if (code == 0) {
        ElMessage.warning("已保存")
    }
    closeScreenGet()
}

const closeScreenGet = () => {
    if (stateBeforeJietu == true) {
        measurementliveStore.displayMersurementlive()
    } else {
        measurementliveStore.hiddenMersurementlie()
    }
    enableScroll()

}

const disableScroll = () => {
    // Get the current page scroll position 
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    // if any scroll is attempted, 
    // set this to the previous value 
    window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
    };
    // console.log("jinz")
}

const enableScroll = () => {
    window.onscroll = function () { };
    // console.log("qiyong")
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
