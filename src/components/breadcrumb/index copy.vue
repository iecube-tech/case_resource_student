<template>
    <div class="pageheader">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item v-for="item in route.matched" :key="item.path" style="font-size: 16px;"
                :to="{ path: item.path }">
                {{ item.meta.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type RouteLocationNormalizedLoaded, useRoute } from 'vue-router';


const props = withDefaults(defineProps<{
    route?: RouteLocationNormalizedLoaded, //加了?:就是可传可不传
}>(), {
    route: useRoute
})
</script>
<style scoped>
.pageheader {
    /* padding-left: 13.8021vw; */
    height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
}

/* .pageheader::-webkit-scrollbar {
    width: 0;
} */

.el-breadcrumb {
    margin-top: 10px;
}
</style>