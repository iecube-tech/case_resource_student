<template>
    <div>
        {{ aiRole }}
    </div>

    <div>
        <el-input v-model="val"></el-input>
        <el-button type="primary" @click="setVal">设置</el-button>
    </div>

    <el-button @click="getVal">刷新</el-button>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue'
import { useChatStore } from '@/stores/testStore'

const store = useChatStore()

const aiRole = ref('')
const val = ref('')

const setVal = () => {
    store.setAIRole(val.value)
}

const getVal = () => {
    aiRole.value = store.getAIRole
    console.log(aiRole.value)
}

watch(store, (newVal) => {
    console.log(newVal)
    aiRole.value = newVal.aiRole
})
</script>
<style scoped></style>