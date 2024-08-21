<template>
    <iframe ref="measurementslive" id="measurementslive_iframe" src="https://measurementslive.ni.com/measure.html"
        frameborder="0"></iframe>
    <!-- <el-button @click="getPic" type="primary">捕获</el-button> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';


const measurementslive = ref()
const screenshotStatus = ref(true)
const getPic = () => {
    screenshotStatus.value = !screenshotStatus.value
}
const destroyComponent = function (status: boolean) {
    screenshotStatus.value = status;
}

const getImg = function (base64: string) {
    console.log("截图组件传递的图片信息", base64);
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