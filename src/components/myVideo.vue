<template>
  <video ref="videoPlayer" class="video-js vjs-default-skin"></video>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from '@/utils/videoHeader' // Changed to use your custom videoHeader
import 'video.js/dist/video-js.css'
import videoLanguage from 'video.js/dist/lang/zh-CN.json'

const props = defineProps({
  video: Object,
})

// console.log(props.video)

// Video player instance
const player = ref<any>(null)
const videoPlayer = ref<HTMLVideoElement | null>(null)

// Add Chinese language support
videojs.addLanguage('zh-CN', videoLanguage)

// Initialize the player
const initPlayer = () => {
  if (videoPlayer.value) {
    player.value = videojs(videoPlayer.value, {
      controls: true,
      preload: 'auto',
      autoplay: false,
      fluid: true, // 自适应宽高
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
      sources: [{  // 视频播放资源
        src: `/dev-api/video/m3u8/${props.video.filename}.m3u8`,
        type: 'application/x-mpegURL'
      }]
    })
  }
}

// Initialize the player with delay like in video.vue
onMounted(() => {
  setTimeout(() => {
    initPlayer()
  }, 1000)
})

// Cleanup when component is unmounted
onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
  }
})

</script>

<style scoped>
.video-js {
  width: 100%;
  height: 100%;
}
</style>