<template>
    <iframe ref="measurementslive" id="measurementslive_iframe" src="https://measurementslive.ni.com/measure.html"
        frameborder="0"></iframe>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const measurementslive = ref()
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