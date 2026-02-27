<template>
    <breadcrumb />
    <div class="exam">
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import breadcrumb from '@/components/breadcrumb/breadcrumb.vue';
</script>
<style scoped></style>