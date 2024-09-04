<template>
    <iframe ref="measurementslive" id="measurementslive_iframe" src="/measurementslive/index.html"
        frameborder="0"></iframe>
    <el-button @click="getPic" type="primary" size="small">捕获</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as htmlToImage from 'html-to-image';

const measurementslive = ref()
const screenshotStatus = ref(true)
const getPic = () => {
    // screenshotStatus.value = !screenshotStatus.value
    console.log(measurementslive.value)
    const mea = measurementslive.value.contentDocument || measurementslive.value.contentWindow.document;
    console.log(mea)
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