<template>
    <div>
        <div v-if="route.name === 'grade'" class="projects">
            <div v-for="  project in projects" :key="project.id" class="project">
                <el-card shadow="hover" class="resource_card" :body-style="{ padding: '0px' }"
                    @click="jumpToDetail(project.id)">
                    <img class="card_img" :src="'/local-resource/image/' + project.cover" alt="">
                    <div class="card_title">{{ project.projectName }}</div>
                    <div class="card-introduction">
                        {{ project.introduction }}
                    </div>
                </el-card>
            </div>
        </div>
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { MyProject } from '@/apis/project/myproject';
import { ElMessage } from 'element-plus';

const route = useRoute()
const projects = ref({})

const jumpToDetail = async (id: Number) => {
    await router.push({
        name: 'GradeDetail',
        params: {
            id: id,
            projects: projects,
        }
    })
}

onBeforeMount(() => {
    MyProject().then((res: any) => {
        if (res.state == 200) {
            projects.value = res.data
        } else {
            ElMessage.error(res.message)
        }
    })
})
</script>
<style scoped>
main {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.projects {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.resource_card {
    /* width: 310px; */
    height: 400px;
    width: 400px;
    margin-top: 30px;
    margin-left: 30px;
    border-radius: 22px;
}

.card_img {
    width: 400px;
    height: 240px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

}

.card_title {
    display: flex;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    color: #33b8b9;
    line-height: 30px;
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 20px;
}

.card-introduction {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 24px;
    height: 72px;
    margin: 0 20px;
    overflow: hidden;
    word-break: normal;
}
</style>