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

const route = useRoute()
// console.log(route.params.taskId)

</script>

<style>
:root, body {
  font-size: 16px;
}
</style>

<style lang="scss" scoped>
:deep(.el-table) {
  --el-table-text-color: rgba(107,114,128, 1);
  --el-table-header-bg-color: rgba(107, 114, 128, .1);
}

:deep(.el-table thead tr th div.cell){
  font-weight: 500;
}
</style>