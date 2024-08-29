<template>
    <div ref="draggable" class="draggable" @mousedown="startDrag"
        :style="{ left: `${position.x}px`, top: `${position.y}px` }">
        <div id="video-container" class="video" v-if="remoteOperation.liveUrl"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import EZUIKit from "ezuikit-js";
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
    remoteOperation: Object
})

interface remoteOperation {
    liveUrl: string,
    ysAccessToken: string
}

const remoteOperation = ref<remoteOperation>({
    liveUrl: '',
    ysAccessToken: ''
})

const player = ref();

const playerInit = () => {
    try {
        player.value = new EZUIKit.EZUIKitPlayer({
            id: 'video-container', // 视频容器ID
            accessToken: remoteOperation.value.ysAccessToken,
            url: remoteOperation.value.liveUrl,
            // simple - 极简版; pcLive-pc直播；pcRec-pc回放；mobileLive-移动端直播；mobileRec-移动端回放;security - 安防版;voice-语音版;
            // 使用自定义模板
            template: '92d46ddc8f45417ab373131145645794',
            // plugin: ['talk'], // 加载插件，talk-对讲
            width: window.innerWidth * 0.4,
            height: window.innerHeight * 0.4,
        });
        // window.player = player;
    } catch (e: any) {
        console.error(e.message)
        ElMessage.error(e.message)
    }
}

onBeforeMount(() => {
    remoteOperation.value = <any>props.remoteOperation

})
onMounted(() => {
    playerInit();
})

onUnmounted(() => {
    if (player.value != null) {
        player.value.stop()
        player.value.destroy()
        player.value = null
    }
})

// 拖动程序
const position = ref({ x: 0, y: 0 });
const draggable = ref(null);
const boundary = { left: 0, top: 0, right: window.innerWidth - window.innerWidth * 0.4, bottom: window.innerHeight - window.innerHeight * 0.4 }; // Adjust based on div size
let isDragging = false;

const startDrag = (event: any) => {
    isDragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
};

const onMouseMove = (event: any) => {
    if (!isDragging) return;
    let newX = position.value.x + event.movementX;
    let newY = position.value.y + event.movementY;

    // Apply boundary checks
    newX = Math.max(boundary.left, Math.min(newX, boundary.right));
    newY = Math.max(boundary.top, Math.min(newY, boundary.bottom));

    position.value.x = newX;
    position.value.y = newY;
};

const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
};

// Update boundary on window resize
window.addEventListener('resize', () => {
    boundary.right = window.innerWidth - window.innerWidth * 0.4;
    boundary.bottom = window.innerHeight - window.innerHeight * 0.4;
});
</script>

<style scoped>
.draggable {
    position: absolute;
    width: 40%;
    height: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #33b8b9;
    cursor: pointer;
}
</style>