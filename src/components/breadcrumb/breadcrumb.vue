<template>
    <div class="breadcrumb-container">
        <!-- 遍历matched数组生成面包屑 -->
        <template v-for="(item, index) in breadcrumbList" :key="item.path">
            <div v-if="index != 0">
                <!-- 面包屑节点 -->
                <router-link v-if="index < breadcrumbList.length - 1" :to="item.path" class="breadcrumb-item">
                    {{ item.meta.title }}
                </router-link>
                <!-- 最后一个节点（当前页），不跳转 -->
                <span v-else class="breadcrumb-item active">
                    {{ item.meta.title }}
                </span>
                <!-- 分隔符，最后一个节点不显示 -->
                <span v-if="index < breadcrumbList.length - 1" class="breadcrumb-separator">
                    >
                </span>
            </div>
        </template>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// 获取当前路由对象
const route = useRoute()

// 计算面包屑列表（过滤掉空路径或不需要的路由）
const breadcrumbList = computed(() => {
    // matched数组包含所有匹配的路由记录
    return route.matched.filter(item => {
        // 过滤条件：有面包屑名称且不是空路径（可根据需求调整）
        return item.meta.title && item.path !== ''
    })
})
</script>

<style scoped>
.breadcrumb-container {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.breadcrumb-item {
    color: #666;
    text-decoration: none;
}

.breadcrumb-item.active {
    color: #333;
    font-weight: 600;
}

.breadcrumb-separator {
    color: #ccc;
    padding: 0px 4px;
}

.breadcrumb-item:hover {
    color: #33b8b9;
}
</style>