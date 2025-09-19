<!-- 播放一组视频-->
<template>
  <div id="video-group" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

    <div v-for="(compItem, k) in compList" :key="k" :class="{ completed: compItem.status == 1 }"
      class="video-card bg-white border-2 border-gray-200 rounded-lg p-4 " @click="openVideo(compItem)">
      <div v-if="compItem.type == 'VIDEO'" class="flex items-start space-x-4">
        <div class="video-icon">
          <font-awesome-icon icon="fas fa-play" size="lg" class="text-white" widthAuto></font-awesome-icon>
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-gray-900 mb-2">{{ compItem.payload.video.title }}</h4>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ compItem.payload.video.description }}</p>
          <div class="flex flex-wrap gap-1 mb-2">
            <span class="knowledge-point-badge" v-show="compItem.tagName">{{ compItem.tagName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">
              <font-awesome-icon icon="fas fa-clock" class="mr-1"></font-awesome-icon>
              <span v-show="compItem.payload.video.duration">{{ compItem.payload.video.duration
              }} 分钟</span>
            </span>
            <span v-if="compItem.status == 0" class="text-xs text-blue-600 font-medium">点击观看</span>
            <span v-else class="text-green-600 font-medium">
              <font-awesome-icon icon="fas fa-check" class="mr-1"></font-awesome-icon>
              <span class="text-xs text-green-600 font-medium">已完成</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog class="emdV4Dialog" v-if="videoDialog.visible" v-model="videoDialog.visible" :show-close="false"
      width="80%">
      <template #header="{ close, titleId, titleClass }">
        <div class="flex justify-between items-center">
          <span class="text-xl">{{ videoDialog.compItem.payload.video.title }}</span>
          <font-awesome-icon icon="fa-solid fa-xmark" @click="close" class="text-white"></font-awesome-icon>
        </div>
      </template>
      <div v-if="videoDialog.compItem.payload.video.tag" class="flex flex-wrap gap-1 mb-2">
        <span class="knowledge-point-badge">
          {{ videoDialog.compItem.payload.video.tag }}
        </span>
      </div>
      <div class="flow-root" style="height: 516px;">
        <div class="h-full">
          <my-video :video="videoDialog.compItem.payload.video"
            @playEnd="handlePlayEnd(videoDialog.compItem)"></my-video>
        </div>
      </div>
      <div :title="videoDialog.compItem.payload.video.description" class="video-description px-4 text-gray-600">
        {{ videoDialog.compItem.payload.video.description }}
      </div>

      <template #footer>
        <div v-if="videoDialog.compItem.status == 0" class="inline-block rounded-lg bg-orange-500 text-white py-2 px-4">未完成观看</div>
        <div v-else class="inline-block rounded-lg bg-cprimary-500 text-white py-2 px-4">已完成</div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import myVideo from "@/components/myVideo.vue"

import { updateEmdV4ComponentStatus } from "@/apis/emdV4/index.ts"

const props = defineProps({
  block: Object,
  sectionDisabled: Boolean,
})

const emits = defineEmits(['complete'])

const compList = ref([])
const init = () => {
  let res = []
  for (let i = 0; i < props.block.components.length; i++) {
    let item = props.block.components[i]
    if (typeof item.payload == 'string') {
      item.payload = JSON.parse(item.payload)
    }
    res.push(item)
  }

  res = res.sort((a, b) => a.order - b.order)
  compList.value = res;
}

const updateBlockStatus = () => {
  let status = props.block.status
  if (status == 0) {
    let hasChildren = props.block.hasChildren
    if (!hasChildren) {
      let components = props.block.components
      let total = components.length
      let count_complete = 0
      for (let i = 0; i < total; i++) {
        let component = components[i]
        let status = component.status
        if (status == 1) {
          count_complete++
        }
      }

      if (count_complete == total) {
        emits('complete', 1)
      }
    }
  }
}

const videoDialog = ref({
  visible: false,
  compItem: null,
})

const openVideo = (item) => {
  videoDialog.value.compItem = item
  videoDialog.value.visible = true;
}

/* const handleReaded = (compItem) => {
  updateEmdV4ComponentStatus(compItem.id, 1).then(res => {
    if (res.state == 200) {
      compItem.status = 1;
      videoDialog.value.visible = false;
    }
  })
} */

const handlePlayEnd = (compItem) => {
  updateEmdV4ComponentStatus(compItem.id, 1).then(res => {
    if (res.state == 200) {
      compItem.status = 1;
    }
  })
}

watchEffect(() => {
  init()
  updateBlockStatus()
})

</script>

<style scoped>
.video-card.completed {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}


.video-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.video-description {
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 8px;
  margin-bottom: 8px;
}

.knowledge-point-badge {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}
</style>