<template>
    <div v-if="payload" class="ist-theam my-4 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500" tabindex="0">
        <textpreview :id="payload.question?.id" :content="payload.question?.question"></textpreview>
        <el-upload :show-file-list="false" :before-upload="beforeUpload">
            <button
                class="btn bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex justify-center items-center mx-8">
                <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="mr-2"></font-awesome-icon>
                <span>{{ reUpload ? '重新上传' : '上传文件' }}</span>
            </button>
            <template #tip>
                <div class="el-upload__tip">
                    大小不超过 10 MB , 单个 PDF 格式的文件
                </div>
            </template>
        </el-upload>
        <div v-if="payload.uploadFile" class="text-gray-500 mt-2 text-sm">
            已上传文件:
            <div>
                <el-link v-for="(item, i) in payload.uploadFile" class="mr-4"
                    @click="openPage(item.resource.type, item.resource.filename)">
                    {{ item.resource.originFilename }}
                </el-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type PAYLOAD, type blockVo } from '../EMDLabV3';
import { upCell } from '../EMDLab';
import textpreview from '../../textPreview/textPreview.vue'
import { useEmdStore } from '@/stores/emdLabStore'
import { uploadPdf } from '@/apis/EMDProject/uploadPdf'


const props = defineProps({
    blockVo: Object,
    status: Number
})

const payload = ref<PAYLOAD>()
const labStore = useEmdStore()
const blockDetail = ref<blockVo>()


onMounted(() => {
    blockDetail.value = <blockVo>props.blockVo
    if (blockDetail.value) {
        payload.value = JSON.parse(blockDetail.value.payload)
        console.log(payload.value)
    }
})

const reUpload = computed(() => {
    let f = false
    let uploadFile = payload.value?.uploadFile
    if (uploadFile) {
        f = true
    }
    return f;
})

const beforeUpload = (file) => {
    let f = true;
    // Allowed file types 
    const allowedTypes = ['application/pdf']; // Updated to support PDF files
    if (!allowedTypes.includes(file.type)) {
        ElMessage.warning('仅支持上传 PDF 格式的文件。'); // Updated message for PDF
        f = false; // Abort upload
    }

    // Maximum file size (e.g., 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        ElMessage.warning('文件大小不能超过 10MB。');
        f = false; // Abort upload
    }

    if (f) {
        autoUpload(file);
    }

    return false; // Proceed with upload
};


const autoUpload = async (file: any) => {

    //   console.log(labStore.getEmdStudentTask)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pstId', labStore.getEmdStudentTask.id)

    try {
        const res = await uploadPdf(formData);
        if (res.state === 200) {
            payload.value!.uploadFile = res.data.resources
            blockDetail.value!.payload = JSON.stringify(payload.value)
            await upCell(blockDetail.value, labStore.getTaskId, payload.value!.stuAnswer.id)
        } else {
            ElMessage.error('图片上传失败，请稍后重试。');
        }
    } catch (error) {
        console.error('文件上传失败:', error);
        ElMessage.error('图片上传失败，请稍后重试。');
    }
};

const openPage = (type: String, filename: String) => {
    let href = ''
    if (type.includes("image")) {
        href = '/local-resource/image/' + filename
        window.open(href, '_blank')
    } else {
        // href = '/local-resource/file/' + filename
        href = '/pdf/web/viewer.html?file=/local-resource/file/' + filename;
        window.open(href)
    }
    // window.open(href, '_blank')
}

</script>
<style scoped></style>