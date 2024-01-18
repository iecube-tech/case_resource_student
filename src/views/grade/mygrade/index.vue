<template>
    <div>
        <div v-if="route.name === 'grade'" class="contents">
            <div v-for="  project in projects" :key="project.id" class="contents_item">
                <el-card shadow="hover" class="resource_card" :body-style="{ padding: '0px' }"
                    @click="jumpToDetail(project.id)">
                    <div class="card_cover">
                        <img v-if="project.cover" class="card_img" :src="'/local-resource/image/' + project.cover" alt="">
                        <div v-if="project.grade != null" class="grade">
                            <span style="font-weight: bold;">{{ project.grade }}</span>
                            <span style="font-size: 32px; font-weight: bold;">分</span>
                        </div>
                    </div>
                </el-card>

                <div class="card_info">
                    <div class="card_info_title" @click="jumpToDetail(project.id)">
                        <span>
                            {{ project.projectName }}
                        </span>
                    </div>
                    <div class="card_info_info" @click="jumpToDetail(project.id)">
                        <span>
                            {{ project.introduction }}
                        </span>
                    </div>
                </div>
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
@import "@/styles/itemList/grid.css";

.card_cover {
    position: relative;
}

.grade {
    position: absolute;
    top: 0%;
    right: 0%;
    display: flex;
    justify-content: center;
    font-size: 4rem;
    align-items: center;
    color: #FFC300;
    padding-right: 10px;
    font-weight: bold;
}
</style>