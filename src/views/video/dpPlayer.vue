<template>
    <div style="width: 100%;">
        <el-row>
            <el-col :span="20">
                <div v-if="currentVideo">
                    <div ref="playVideoRef" class="play-video"></div>
                </div>
            </el-col>
            <el-col :span="4">
                <el-row v-for="(item, i) in videoList" style="overflow: hidden;">
                    <el-button :title="item.name.slice(0, -4)" link @click="changeVideoSource(i)">
                        {{ item.name.slice(0, -4) }}
                    </el-button>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import DPlayer from 'dplayer';
import { onBeforeMount, onMounted, ref } from 'vue';
import Hls from 'hls.js';
import { ElMessage } from 'element-plus';

const props = defineProps({
    videoList: Array
})
const playVideoRef = ref(null);

const BaseUrl = '/dev-api/video/m3u8/'

const currentVideo = ref()

const videoList = ref([])
const dp = ref()

const changeVideoSource = (index: any) => {
    if (videoList.value.length > index) {
        currentVideo.value = videoList.value[index]
        if (currentVideo.value.isReady == 0) {
            ElMessage.warning("视频尚未准备就绪，请稍候重试")
            return
        }
        if (dp.value) {
            dp.value.switchVideo(
                {
                    url: BaseUrl + currentVideo.value.filename + '.m3u8',
                    type: 'customHls',
                    customType: {
                        customHls: (video: any, player: any) => {
                            const hls = new Hls();
                            hls.loadSource(video.src);
                            hls.attachMedia(video);
                        },
                    },
                },
            );
        }
    }
}

const initDplayer = () => {
    dp.value = new DPlayer({
        container: playVideoRef.value,
        autoplay: false,
        theme: '#FADFA3',
        loop: false,
        lang: 'zh-cn',
        hotkey: true,
        preload: 'auto',
        volume: 0.5,
        mutex: true,
        video: {
            url: '',
            type: 'customHls',
            customType: {
                customHls: (video: any, player: any) => {
                    const hls = new Hls();
                    hls.loadSource(video.src);
                    hls.attachMedia(video);
                },
            },
        },
    });
    if (dp.value) {
        changeVideoSource(0)
    }
}

onBeforeMount(() => {
    videoList.value = <any>props.videoList
    currentVideo.value = videoList.value[0]
})
onMounted(() => {
    initDplayer()
})



</script>
<style scoped>
.play-video {
    width: 100%;
    height: 100%;

    :deep(.dplayer-menu),
    :deep(.dplayer-mask) {
        display: none !important;
    }
}
</style>