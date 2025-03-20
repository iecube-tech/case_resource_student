<template>
    <div :id="id" class="priview-large">
    </div>
</template>

<script setup lang="ts">
// 1.1 引入Vditor 构造函数
import Vditor from 'vditor'
import { onMounted, watch, ref } from 'vue';

const props = defineProps({
    id: String,
    content: String
})

const initVditor = () => {
    Vditor.preview(document.getElementById(props.id!) as HTMLDivElement, props.content!, {
        mode: "light", // dark or light
        anchor: 0,  // 为标题添加锚点 0：不渲染；1：渲染于标题前；2：渲染于标题后，默认 0
        lang: 'zh_CN',    // 语言，默认为 'zh_CN'
        // speech: {  // 对选中后的内容进行阅读
        //     enable: false,
        // },
        cdn: '/vditor', // 自建 CDN 地址
        // transform: (html: string) => { return '' }, // 在渲染前进行的回调方法
        // after: () => { }, // 渲染完成后的回调
        theme: { current: 'iecube-design' }, // 主题
        // render: { media: { enable: false } }
    })
}

watch(() => props.content, (newValue, oldValue) => {
    if (newValue) {
        initVditor()
    }
})


onMounted(() => {
    initVditor()
})


</script>
<style scoped></style>