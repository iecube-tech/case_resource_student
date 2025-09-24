<template>
  <nav class="bg-white shadow sticky top-0 z-50 relative">
    <div @click="goBack" class="absolute h-full flex items-center p-8 gap-1 text-primary-600 hover:text-primary-800 cursor-pointer">
      <font-awesome-icon icon="arrow-left" class="w-5 h-5" />
      <span>返回</span>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-primary-600" @click="goHome">IECUBE</span>
            <span class="ml-2 text-lg text-gray-700 ">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const router = useRouter()

const props = defineProps({
  name: {
    type: String,
    default: '课程能力评价系统'
  }
})

const goBack = () => {
  router.push({
    path: '/grade'
  })
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped></style>