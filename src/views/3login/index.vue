<template>
    <div>
        Processing...
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { getAccount } from '@/apis/student/getAccount'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/index';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const userStore = useUserStore()
const { setUser, getUser } = userStore

if (token) {
    localStorage.setItem('x-access-token', token);
    getAccount().then(res => {
        if (res.state == 200) {
            setUser(res.data)
            router.push("/mycourse")
        } else {
            ElMessage.error(res.message)
            router.push("/login")
        }
    })
} else {
    router.push("/login")
}
</script>
<style scoped></style>