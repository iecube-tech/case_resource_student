<!-- 通用组件 -->
<template>
  <div v-for="(compItem, k) in compList" :key="k" :class="k != 0 ? 'mt-8' : ''">
    <!-- {{ compItem.type }} -->
    <device v-if="compItem.type == 'DEVICE'" :comp="compItem" :index="k"></device>
    
    <content v-if="compItem.type == 'TEXT'" :comp="compItem"  :index="k"></content>
    <group v-if="compItem.type == 'GROUP'" :comp="compItem" :index="k"></group>

    <qa v-if="compItem.type == 'QA'" :comp="compItem" :index="k"></qa>
    <myVideo v-if="compItem.type == 'VIDEO'" :video="compItem.payload.video"></myVideo>
    <multipleChoice v-if="compItem.type == 'MULTIPLECHOICE'" :comp="compItem"></multipleChoice>
    <choice v-if="compItem.type == 'CHOICE'" :comp="compItem"></choice>
    
    <emdV4Table v-if="compItem.type == 'TABLE'" :index="k" :comp="compItem"></emdV4Table>
    
    <circuit v-if="compItem.type == 'CIRCUIT'" :index="k" :comp="compItem"></circuit>
    <tracneline v-if="compItem.type == 'TRACELINE'" :index="k" :comp="compItem"></tracneline>

  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue' // Added missing import
import device from "../block/device.vue"
import group from "../block/group.vue"
import content from "../block/content.vue"

import qa from '../block/qa.vue'
import myVideo from "@/components/myVideo.vue"
import multipleChoice from "../block/multipleChoice.vue"
import choice from '../block/choice.vue'

import circuit from '../block/circuit.vue'
// import range from '../block/range.vue'
import emdV4Table from '../block/emdV4Table.vue'
import tracneline from '../block/tracneline.vue'

const props = defineProps({
  block: Object,
  sectionDisabled: Boolean,
})

const compList = ref([])

const init = () => {
  let res = []
  for (let i = 0; i < props.block.components?.length; i++) {
    let item = props.block.components[i]
    if (typeof item.payload == 'string') {
      item.payload = JSON.parse(item.payload)
    }
    res.push(item)
  }

  res = res.sort((a, b) => a.order - b.order)
  compList.value = res;
}

watchEffect(() => {
  init()
})

</script>

<style scoped></style>