<template>
    <div style="display: flex; flex-direction: row; height: 100%;">
        <el-col :span="12" style="height: 100%;">
            <el-input type="textarea" v-model="content"></el-input>
        </el-col>

        <el-col :span="12">
            <div class="ist-theam" v-html="renderedContent"> </div>
        </el-col>

    </div>
</template>

<script setup lang="ts">
import '@/styles/stuTask/stuLab.css'
import { simpleMarked } from '@/ts/MyMarked';
import { ref, watch } from 'vue';
import DOMPurify from 'isomorphic-dompurify';
//  ![图1](/dev-api//files/image/0e61cca89ceb4c83864f87db178ca215.png "title")

const content = ref('')
const renderedContent = ref()

function postprocess(html: string) {
    return DOMPurify.sanitize(html);
}
watch(() => content.value, (newVal) => {
    renderedContent.value = postprocess(<string>simpleMarked.parse(newVal)).replace(/<p[^>]*>\s*<\/p>/g, '')
})

// })
</script>
<style scoped></style>