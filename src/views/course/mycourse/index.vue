<template>
    <div>
        <div v-if="route.name === 'mycourse'" class="contents">
            <div v-for="project in projects" :key="project.id" class="contents_item">
                <el-card shadow="hover" class="resource_card" :body-style="{ padding: '0px' }"
                    @click="jumpToDetail(project.id, project.emdCourse)">
                    <div class="card_cover">
                        <img v-if="project.cover" class="card_img" :src="'/local-resource/image/' + project.cover"
                            alt="">
                    </div>
                </el-card>

                <div class="card_info">
                    <div class="card_info_title" @click="jumpToDetail(project.id, project.emdCourse)">
                        <span>
                            {{ project.projectName }}
                        </span>
                    </div>
                    <div class="card_info_info" @click="jumpToDetail(project.id, project.emdCourse)">
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
import { MyCourse } from '@/apis/project/mycourses';
import { ElMessage } from 'element-plus';

interface project {
    id: number
    projectName: string
    cover: string
    introduction: string
    emdCourse: number | null
}

const route = useRoute()
const projects = ref<[project]>([{
    id: 0,
    projectName: '',
    cover: '',
    introduction: '',
    emdCourse: null
}])

const jumpToDetail = async (id: number, emdCourse: number | null) => {
    if (emdCourse) {
        router.push({
            name: 'TheTaskListOfCourse',
            params: {
                id: id
            }
        })
    } else {
        await router.push({
            name: 'courseDetail',
            params: {
                id: id,
            }
        })
    }

}

onBeforeMount(() => {
    MyCourse().then((res: any) => {
        if (res.state == 200) {
            projects.value = res.data
            if (projects.value.length < 1) {
                ElMessage({
                    message: '您还未参与任何课程',
                    type: 'warning'
                })
            }
        } else {
            ElMessage.error(res.message)
        }
    })
})
</script>
<style scoped>
@import "@/styles/itemList/grid.css";
</style>
