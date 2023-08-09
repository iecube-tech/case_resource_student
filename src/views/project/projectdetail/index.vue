<template>
    <div>
        <el-row style="padding: 20px 20px;">
            <el-col :span="10" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <el-row>
                    <h1 style="font-size: 46px; color: #33b8b9;">{{ project.projectName }}项目</h1>
                </el-row>
            </el-col>
            <el-col :span="14" style="display: flex; justify-content: center; align-items: center;">
                <img v-if="project.projectCover" :src="'/local-resource/image/' + project.projectCover" alt=""
                    style="width: 100%; height: 100%; object-fit: cover;">
            </el-col>
        </el-row>
        <el-row class="summary">
            <el-row class="summary_title">
                项目介绍
            </el-row>
            <el-row class="summary_detail">
                <div style="font-size: 18px;">
                    {{ project.projectIntroduction }}
                </div>
                <div style="font-size: 18px;">
                    {{ project.projectIntroduce }}
                </div>
                <div style="font-size: 18px;">
                    {{ project.projectTarget }}
                </div>
            </el-row>
        </el-row>
        <el-row class="task-title">
            案例子任务模块
        </el-row>
        <el-row class="task-info">
            {{ project.projectName }}这个工程问题按照功能分解为若干子任务，每个任务的实施过程中贯穿着学习成果目标和专业课程知识，在实践过程中加深专业知识的理解，快速帮助学生达成设定的学习目标。将{{
                project.projectName }}的设计制作过程分解为{{ project.projectTaskList.length }}个子任务。
        </el-row>
        <div class="task">
            <div class="task-module" v-for="task in project.projectTaskList" :key="task.id">
                <div class="task-module-img" @click="toTaskDetail(task)">
                    <img :src="'/local-resource/image/' + task.taskCover" alt=""
                        style="width: 100%; height: 100%; object-fit: cover; position: relative;">
                    <div style="position: absolute;z-index: 999;top: 36%;width: 100px;text-align: center;height: 90px;left: 39%;display: flex;
                            align-items: center;justify-content: center;font-size: 20%;">{{ task.taskName }}</div>
                </div>
                <!-- <div style="display: flex; flex-direction: column;">
                    <div class="task-module-content">
                        <h1>主要内容</h1>
                        <div v-for="i in task.taskTargets.length">
                            {{ task.taskTargets[i - 1] }}
                        </div>
                    </div>
                    <div class="task-module-deliverable">
                        <h1>交付物</h1>
                        <div v-for="i in task.taskDeliverables.length">
                            {{ task.taskDeliverables[i - 1] }}
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <div v-if="taskDetail.PSTId != 0" class="task_detail">
            <div class="task-module-content">
                <h1>主要内容</h1>
                <div v-for="i in taskDetail.task.taskTargets.length">
                    {{ taskDetail.task.taskTargets[i - 1] }}
                </div>
            </div>
            <div class="task-module-deliverable">
                <h1>交付物</h1>
                <div v-for="i in taskDetail.task.taskDeliverables.length">
                    {{ taskDetail.task.taskDeliverables[i - 1] }}
                </div>
            </div>
            <div>
                <el-input>
                    
                </el-input>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { MyProjectDetail } from '@/apis/project/projectDetail.ts'
import { ElMessage } from 'element-plus';

const route = useRoute()
console.log(route);
const projectId = route.params.id
console.log(projectId);

interface task {
    id: number
    projectId: number
    num: number
    taskName: String
    taskCover: String
    taskTargets: []
    taskDeliverables: []
    taskStartTime: String
    taskEndTime: String
}
const project = ref({
    projectName: '',
    projectCover: '',
    projectIntroduction: '',
    projectTarget: '',
    projectIntroduce: '',
    projectTaskList: [],
})

interface taskDetail {
    task: task
    PSTId: number
}
const taskDetail = ref<taskDetail>({
    task: {
        id: 0,
        projectId: 0,
        num: 0,
        taskName: '',
        taskCover: '',
        taskTargets: [],
        taskDeliverables: [],
        taskStartTime: '',
        taskEndTime: '',
    },
    PSTId: 0
})
const toTaskDetail = async (task: task) => {
    taskDetail.value.task = task
    taskDetail.value.PSTId = 1
    console.log(taskDetail);

}

onBeforeMount(async () => {
    await MyProjectDetail(Number(projectId)).then(res => {
        console.log(res);
        if (res.state == 200) {
            project.value = res.data
            console.log(project);

        } else {
            ElMessage.error(res.message)
        }

    })
})


</script>
<style scoped>
.summary {
    min-height: 30vh;
    background-color: #ffffff;
    /* padding-top: 20px; */
    padding: 20px 20px;
    flex-direction: column;
}

.summary_title {
    font-size: 36px;
    color: #33b8b9;
}

.summary_detail {
    padding-top: 10px;
    /* flex-grow: 1; */
    font-size: 16px;
}

.task-title {
    padding: 20px 20px;
    font-size: 36px;
    color: #33b8b9;
}

.task-info {
    padding: 20px 20px;
    font-size: 24px;
}

.task {
    padding: 20px 20px;
    display: flex;
    justify-content: center;
}

.task-module {
    /* width: 10vw; */
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
}

.task-module-img {
    margin-top: 5vh;
    position: relative;
}

.task-module-content {
    height: 200px;
}

.task-module-content h1 {
    color: #33b8b9;
    font-size: 24px;
    font-weight: bold;
}

.task-module-content span {
    font-size: 24px;
}

.task-module-deliverable {}

.task-module-deliverable h1 {
    color: #33b8b9;
    font-size: 24px;
    font-weight: bold;
}

.task-module-deliverable span {
    font-size: 24px;
}
</style>