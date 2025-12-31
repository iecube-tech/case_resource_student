<template>
    <div>
        <div v-if="route.name === 'grade'" class="contents">
            <div v-for="project in projects" :key="project.id" class="contents_item" @click="jumpToDetail(project)">
                <el-card shadow="hover" class="resource_card" :body-style="{ padding: '0px' }">
                    <div class="card_cover">
                        <img v-if="project.cover" class="card_img" :src="'/local-resource/image/' + project.cover"
                            alt="">
                        <div v-if="project.grade != null" class="grade">
                            <span style="font-weight: bold;">{{ project.grade }}</span>
                            <span style="font-size: 32px; font-weight: bold;">分</span>
                        </div>
                    </div>
                </el-card>

                <div class="card_info">
                    <div class="card_info_title">
                        <span>
                            {{ project.projectName }}
                        </span>
                    </div>
                    <div class="card_info_info">
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
import { MyGrade } from '@/apis/grade/grade';
import { ElMessage } from 'element-plus';

import { useUserStore } from '@/store'
const userStore = useUserStore()
const studentId = userStore.getUser()!.studentId

interface project {
    id: number
    projectName: string
    cover: string
    introduction: string
    grade: number
}

const route = useRoute()
const projects = ref<[project] | any>([])

const jumpToDetail = (project: any) => {
    if (project.version >= 4) {
        // TODO 跳转演示页面
        // window.open('/studentAnalysis.html', '_blank')
        router.push({
            name: 'courseAnalysisStudent',
            params: {
                projectId: project.id,
                studentId: studentId,
            }
        })
    } else {
        router.push({
            name: 'GradeDetail',
            params: {
                id: project.id,
            }
        })
    }
}

onBeforeMount(async () => {
    await MyGrade().then((res: any) => {
        if (res.state == 200) {
            projects.value = res.data
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