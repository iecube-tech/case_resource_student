<template>
    <div>
        <component :is="currentPageComponent"></component>
    </div>
</template>

<script setup lang="ts">
import groupInit from './groupInit.vue';
import groupDetail from './groupDetail.vue';
import groupCreate from './groupCreate.vue';
import groupCreateSuccess from './groupCreateSuccess.vue';
import groupJoin from './groupJoin.vue';
import groupJoinSuccess from './groupJoinSuccess.vue';
import { onMounted, ref, watch, computed } from 'vue';
import { useTaskGroupStore } from '@/stores/taskGroupStore';
import { MyGroup } from '@/apis/group/mygroup';
import { useUserStore } from '@/store/index';
import { useCourseStore } from '@/stores/courseStore';
import { ElMessage } from 'element-plus';

const userStore = useUserStore()
const { getUser } = userStore
const studentId = getUser()?.id

const groupStore = useTaskGroupStore()
const courseStore = useCourseStore()

const studentTaskGroup = ref()

const pageComponents = {
    a: null,
    groupInit: groupInit,
    groupDetail: groupDetail,
    groupCreate: groupCreate,
    groupCreateSuccess: groupCreateSuccess,
    groupJoin: groupJoin,
    groupJoinSuccess: groupJoinSuccess,
};

watch(() => groupStore.currPage, (newVal) => {
    currentPage.value = <keyof typeof pageComponents>newVal
})

const currentPage = ref<keyof typeof pageComponents>("a");
const currentPageComponent = computed(() => pageComponents[currentPage.value]);

const getStudentTaskGroup = () => {
    return new Promise<void>((resolve, reject) => {
        if (!courseStore.getCurrTask?.taskId) {
            currentPage.value = "groupInit"
            groupStore.setCurrPage("groupInit")
            return reject()
        }
        MyGroup(courseStore.getCurrTask?.taskId!, studentId!).then(res => {
            if (res.state == 200) {
                if (res.data != null) {
                    studentTaskGroup.value = res.data
                    groupStore.setCurrGroup(studentTaskGroup.value)
                    currentPage.value = "groupDetail"
                    groupStore.setCurrPage("groupDetail")
                    return resolve()
                } else {
                    console.log("groupInit")
                    currentPage.value = "groupInit"
                    groupStore.setCurrPage("groupInit")
                    return resolve()
                }
            }
            else {
                ElMessage.error(res.message)
                currentPage.value = "groupInit"
                groupStore.setCurrPage("groupInit")
                return reject()
            }
        })
    })
}

onMounted(async () => {
    await getStudentTaskGroup()
})
</script>
<style scoped></style>