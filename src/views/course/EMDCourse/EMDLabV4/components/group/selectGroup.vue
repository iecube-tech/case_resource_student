<!-- 播放一组视频-->
<template>
  <div v-for="(compItem, k) in compList" :key="k" :class="k != 0 ? 'mt-8' : ''">
    <choice :index="k + 1" v-if="compItem.type == 'CHOICE'" :comp="compItem"></choice>
    <multipleChoice :index="k + 1" v-if="compItem.type == 'MULTIPLECHOICE'" :comp="compItem">
    </multipleChoice>
  </div>
</template>

<script setup lang="ts">
import choice from '../block/choice.vue'
import multipleChoice from '../block/multipleChoice.vue'

const props = defineProps({
  block: Object,
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
      console.log(count_complete, total)

      if (count_complete == total) {
        emits('complete', 1)
      }
    }
  }
}

watchEffect(() => {
  init()
  updateBlockStatus()
})


</script>

<style scoped></style>