<template>
    <iframe ref="measurementslive" id="measurementslive_iframe" src="https://measurementslive.ni.com/measure.html"
        frameborder="0"></iframe>
    <el-button @click="jietu()">截图</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScreenShot from "js-web-screen-shot"

const measurementslive = ref()
const jietu = () => {
    new ScreenShot({ enableWebRtc: false })
}
</script>
<style scoped>
iframe {
    width: 100%;
    height: 100%;
}
</style>

<style>
#usernameInputDialog {
    display: none
}
</style>