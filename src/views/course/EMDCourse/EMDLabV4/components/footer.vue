<template>
    <!-- 页脚 -->
    <footer class="mt-16 border-t pt-8 pb-16">
        <div class="max-w-4xl mx-auto text-center">
            <div class="flex items-center justify-center mb-6">
                <img src="/logo.ico" alt="IECUBE" class="w-12 h-12 mr-4">
                <h2 class="text-xl font-bold text-gray-800">{{ name }}</h2>
            </div>
            <div class="text-sm text-gray-500 mt-6">
                <p>作者：北京曾益慧创科技有限公司</p>
                <p>版权所有 © 2025 北京曾益慧创科技有限公司 保留所有权利。</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const props = defineProps({
    name: String,
})
</script>
<style scoped></style>
