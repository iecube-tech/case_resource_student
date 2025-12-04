<!-- 学生课程分析 -->
<template>
  <div class="bg-gray-50 text-gray-900 transition-colors duration-200">
    <c-header></c-header>
    <c-content></c-content>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import CHeader from './components/c-header.vue'
import CContent from './components/c-content.vue'

defineOptions({ name: 'courseAnalysisStudent' });

const route = useRoute()
// console.log(route.params.projectId)

import { useRouteCacheStore } from '@/stores/useRouteCacheStore'
const routeCacheStore = useRouteCacheStore()

onBeforeRouteLeave((to, from, next)=>{
  const toName = to.name
  // to --> 学生实验分析
  if(['courseTaskAnalysisStudent'].includes(toName)){
    routeCacheStore.addRouteToCache('courseAnalysisStudent')
  } else {
    routeCacheStore.removeRouteFromCache('courseAnalysisStudent')
  }
  next()
})


</script>

<style>
:root, body {
  font-size: 16px;
}
</style>

<style lang="scss" scoped>


</style>