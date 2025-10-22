<template>
  <div>
    <div v-for="(file, k) in comp.payload.fileList" :key="k" title="点击下载"
      class="text-sm font-medium cursor-pointer text-blue-500 hover:text-blue-700 hover:font-black"
      @click="handleDownload(file)">
      <font-awesome-icon icon="fa-solid fa-download" class="mr-2"></font-awesome-icon>
      <span>{{ file.originFilename }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import textPreview from '@/views/course/EMDCourse/EMDLabV4/textPreview/textPreview.vue';
import { downloadFile } from '@/apis/emdV4/index.ts'

const props = defineProps({
  comp: Object,
})

const handleDownload = (file) => {
  let filename = file.filename
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = '/local-resource/file/' + filename;
    link.click();  // 触发下载
    link.remove();
    resovle()
  }, 1000)
}
</script>

<style scoped></style>