<template>
    <div>
        <div v-if="route.name === 'grade'" class="projects">
            <div v-for="  project in projects" :key="project.id" class="project">
                <el-card shadow="hover" class="resource_card" :body-style="{ padding: '0px' }"
                    @click="jumpToDetail(project.id)">
                    <div class="card_img_div">
                        <img v-if="project.cover" class="card_img" :src="'/local-resource/image/' + project.cover" alt="">
                    </div>
                    <div class="title_grade_div">
                        <div class="card_title">
                            {{ project.projectName }}
                        </div>
                        <div v-if="project.grade != null" class="grade">
                            <span style="font-weight: bold;">{{ project.grade }}</span>
                            <span style="font-size: 32px; font-weight: bold;">分</span>
                        </div>
                    </div>
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
import { MyCourse } from '@/apis/project/mycourses';
import { ElMessage } from 'element-plus';

interface project {
    id: number
    projectName: string
    cover: string
    introduction: string
    grade: number
}

const route = useRoute()
const projects = ref<[project] | any>([])

const jumpToDetail = async (id: number) => {
    await router.push({
        name: 'GradeDetail',
        params: {
            id: id,
        }
    })
}

onBeforeMount(async () => {
    await MyProject().then((res: any) => {
        if (res.state == 200) {
            for (let i = 0; i < res.data.length; i++) {
                projects.value.push(res.data[i])
            }
        } else {
            ElMessage.error(res.message)
        }
    })

    await MyCourse().then(res => {
        if (res.state == 200) {
            for (let i = 0; i < res.data.length; i++) {
                projects.value.push(res.data[i])
            }
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
    height: 400px;
    width: 400px;
    margin-top: 30px;
    margin-left: 30px;
    border-radius: 22px;
}

.card_img_div {
    width: 400px;
    height: 240px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    overflow: hidden;
}

.card_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.title_grade_div {
    position: relative;
}

.grade {
    position: absolute;
    top: -60%;
    right: 0%;
    display: flex;
    justify-content: center;
    font-size: 40px;
    align-items: center;
    color: #FFC300;
    padding-right: 10px;
    font-weight: bold;
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