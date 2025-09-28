<template>
  <div>
    <!-- Display description -->
    <text-preview class="ist-theam" :content="comp.payload.upload.description"></text-preview>

    <!-- Upload Section -->
    <div>
      <el-upload
        :show-file-list="false"
        :before-upload="beforeUpload"
        :disabled="blockStatusDisabled"
      >
        <template #trigger>
          <el-button type="primary" :disabled="blockStatusDisabled">
            <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="mr-2"></font-awesome-icon>
            请上传指定图片
          </el-button>
        </template>
      </el-upload>

      <!-- Preview Uploaded Image -->
      <div v-if="comp.payload.upload.imgUrl" class="mt-4 flex justify-center">
        <img :src="`/dev-api${comp.payload.upload.imgUrl}`" alt="Uploaded Image" class="h-[400px] w-auto rounded" />
      </div>
    </div>
  </div>
</template>

<script setup>
import textpreview from '@/components/textPreview.vue';
import { useEmdV4Store } from '@/stores/emdV4TaskStore';
import { uploadImg } from '@/apis/emdV4/index';
import { updateCompPayload, updateCompStatus } from './update';

// Props
const props = defineProps({
  index: Number,
  comp: Object,
});

// Store instance
const emdV4Store = useEmdV4Store();

// Computed property for block status
const blockStatusDisabled = computed(() => {
  let blockStatus = emdV4Store.getBlockStatusByComponentId(props.comp.id);
  return blockStatus === 1;
});

/**
 * Before Upload Function
 * Validates the file before uploading.
 */
const beforeUpload = (file) => {
  let f = true;
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.warning('仅支持上传 JPG、PNG 格式的图片。');
    f= false; // Abort upload
  }

  // Maximum file size (e.g., 5MB)
  const maxSize = 2 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    ElMessage.warning('文件大小不能超过 2MB。');
    f= false; // Abort upload
  }
  
  if(f){
    autoUpload(file)
  }

  return false; // Proceed with upload
};

/**
 * Custom Upload Function
 * Handles the file upload process.
 */
const autoUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // Append the file to FormData

  try {
    // Make the API call to upload the file
    const res = await uploadImg(formData);
    if (res.state === 200) {
      const uploadedImageUrl = res.data.url; // Get the uploaded image URL
      props.comp.payload.upload.imgUrl = uploadedImageUrl;

      // Update the payload
      const payloadStr = JSON.stringify(props.comp.payload);
      updateCompPayload( props.comp.id, payloadStr);

      // Update the component status
      if(props.comp.status === 0){
        updateCompStatus(props.comp.id, 1);
      }
    } else {
      ElMessage.error('图片上传失败，请稍后重试。');
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    ElMessage.error('图片上传失败，请稍后重试。');
  }
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>