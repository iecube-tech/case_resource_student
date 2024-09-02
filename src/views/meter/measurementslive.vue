<template>
    <iframe ref="measurementslive" id="measurementslive_iframe" src="https://measurementslive.ni.com/measure.html"
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
    var node = document.getElementById('measurementslive_iframe');
    htmlToImage.toPng(<any>node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
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