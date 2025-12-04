<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedComponents">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>

import { useRouteCacheStore } from '@/stores/useRouteCacheStore'
const routeCacheStore = useRouteCacheStore()

const cachedComponents = computed(()=>{
  let cache = routeCacheStore.getCachedRoutes
  return cache
})

</script>