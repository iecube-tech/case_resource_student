<template>
  <nav class="bg-white shadow sticky top-0 z-50 relative">
    <div
      v-if="showBackButton"
      @click="goBack"
      class="absolute h-full flex items-center px-4 py-2 gap-1 text-primary-600 hover:text-primary-800 cursor-pointer"
      aria-label="返回上一页"
    >
      <font-awesome-icon icon="fas fa-arrow-left" class="w-5 h-5" />
      <span>返回</span>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div
            v-if="!showBackButton"
            @click="goBack"
            class="flex items-center px-4 py-2 gap-1 text-primary-600 hover:text-primary-800 cursor-pointer"
            aria-label="返回上一页"
          >
            <font-awesome-icon icon="fas fa-arrow-left" class="w-5 h-5" />
            <span>返回</span>
          </div>

          <span class="text-xl font-bold text-primary-600" @click="goHome">IECUBE</span>
          <span class="ml-2 text-lg text-gray-700">{{ name }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '课程能力评价系统',
  },
});

const emits = defineEmits(['goBack', 'goHome']);

const windowWidth = ref(window.innerWidth)

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth
})

const showBackButton = ref(false)

watchEffect(() => {
  showBackButton.value = windowWidth.value > 1272
})

const goHome = () => {
  emits('goHome');
};

const goBack = () => {
  emits('goBack');
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>