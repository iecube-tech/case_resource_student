<template>
    <div>
        <div ref="screenshotArea" class="screenshot-area">
            <!-- 这里放置你想要截图的内容 -->
            <p>这里是你想要截图的内容。</p>
        </div>
        <button @click="takeScreenshot">截图</button>
        <canvas v-if="screenshot" ref="canvas" class="screenshot-canvas"></canvas>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const screenshotArea = ref(null);
        const canvas = ref(null);
        const screenshot = ref(null);

        const takeScreenshot = () => {
            if (screenshotArea.value) {
                const width = screenshotArea.value.offsetWidth;
                const height = screenshotArea.value.offsetHeight;

                canvas.value.width = width;
                canvas.value.height = height;
                const context = canvas.value.getContext('2d');
                context.clearRect(0, 0, width, height);
                context.drawWindow(screenshotArea.value, 0, 0, width, height, 'white');
                screenshot.value = canvas.value.toDataURL('image/png');
            }
        };

        return {
            screenshotArea,
            canvas,
            screenshot,
            takeScreenshot,
        };
    },
};
</script>

<style>
.screenshot-area {
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 10px;
}

.screenshot-canvas {
    border: 1px solid #000;
    margin-top: 10px;
}
</style>