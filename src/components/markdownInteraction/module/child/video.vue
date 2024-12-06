<template>
    <video ref="myPlayer" class="video-js vjs-default-skin video" preload="auto">
    </video>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeMount, onUnmounted } from 'vue'
import videojs from '@/utils/videoHeader'
import 'video.js/dist/video-js.min.css'

const props = defineProps({
    video: Object
})

// videojs 语言设置
const BaseUrl = '/dev-api/video/m3u8/'
const myPlayer = ref()
const playVideo = reactive({
    videoUrl: '',
})
const player = ref()

onMounted(() => {
    setTimeout(() => {
        initVideoSource()
    }, 1000)
})

function initVideoSource() {
    playVideo.videoUrl = BaseUrl + props.video.filename + '.m3u8'

    player.value = videojs(myPlayer.value, {
        controls: true, // 是否显示控制条
        preload: 'auto',
        autoplay: false,
        fluid: true, // 自适应宽高`
        language: 'zh-CN', // 设置语言
        muted: true, // 是否静音
        inactivityTimeout: false,
        controlBar: { // 设置控制条组件
            children: [
                { name: 'playToggle' }, // 播放按钮
                { name: 'currentTimeDisplay' }, // 当前已播放时间
                { name: 'progressControl' }, // 播放进度条
                { name: 'durationDisplay' }, // 总时间
                {
                    name: 'volumePanel', // 音量控制
                    inline: false, // 不使用水平方式
                },
                { name: 'FullscreenToggle' }, // 全屏
            ],
        },
        aspectRatio: "16:9",
        sources: [   // 视频播放资源
            {
                src: playVideo.videoUrl,
                type: 'application/x-mpegURL',
            },
        ],
    })
}

onUnmounted(() => {
    if (myPlayer.value) {
        myPlayer.value.dispose()
    }
    myPlayer.value = null
})

</script>