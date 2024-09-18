<template>
    <main>
        <pageHeader :route=route />
        <el-row style="padding: 20px 0; height: 360px;">
            <el-col :span="12" style="display: flex; flex-direction: column;">
                <el-row style="flex-grow: 1; align-items: center;">
                    <h1 style="font-size: 36px; color: #33b8b9;">{{ project.projectName }}</h1>
                </el-row>
                <el-row style="flex-grow: 1; padding-right: 3.125vw;">
                    <span>{{ project.introduction }}</span>
                </el-row>
            </el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end; align-items: center;">
                <img v-if="project.cover" :src="'/local-resource/image/' + project.cover" alt=""
                    style="width: auto; height: 31vh; object-fit: contain;">
            </el-col>
        </el-row>

        <el-row style="height: 185px; padding-bottom: 20px; margin-bottom: 20px;">
            <el-col style="display: flex;justify-content:flex-end;flex-direction: column;">
                <el-steps align-center>
                    <el-step v-for="task in projectTasks" :key="task.taskNum" :title="getGrade(task.taskGrade)"
                        :status="getstatus(task.taskStatus)" />
                </el-steps>
            </el-col>
        </el-row>
        <div class="task">
            <div v-for="i in projectTasks.length" :key="i - 1" class="task-module">
                <div class="task-module-title">
                    <span v-if="project.caseType == 0">任务</span>
                    <span v-if="project.caseType == 1">实验</span>
                    <span>{{ projectTasks[i - 1].taskNum }}：{{ projectTasks[i - 1].taskName }}</span>
                </div>
                <div v-if="projectTasks[i - 1].resources">
                    <div class="task-module-small-title">
                        <span>报告</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <el-row v-for="j in projectTasks[i - 1].resources">
                            <el-link v-if="!j.readOver" @click="openPage(j.resource.type, j.resource.filename)">
                                {{ j.resource.originFilename }}
                            </el-link>

                            <el-link v-if="j.readOver != null" type="primary"
                                @click="openPage(j.readOver.type, j.readOver.filename)">
                                {{ j.readOver.originFilename }}
                            </el-link>
                        </el-row>
                    </div>
                </div>
                <div v-if="projectTasks[i - 1].taskGrade">
                    <div class="task-module-small-title">
                        <span>教师评分</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <el-progress :text-inside="true" :stroke-width="24" :percentage="projectTasks[i - 1].taskGrade">
                            <span>{{ projectTasks[i - 1].taskGrade }}</span>
                        </el-progress>
                    </div>
                </div>
                <div v-if="projectTasks[i - 1].taskTags.length > 0">

                    <div class="task-module-small-title">
                        <span>教师评定</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <el-row v-for="(item, j) in projectTasks[i - 1].taskTags">
                            <el-button type="primary" size="small">{{ item.name }}</el-button>
                            <el-button style="margin-left: 20px;" link type="primary" size="small"
                                v-if="item.suggestionProject" @click="suggestionProjectClick(item.suggestionProject)">
                                建议学习：{{ item.suggestionProjectName }}</el-button>
                        </el-row>

                    </div>
                </div>
                <div v-if="projectTasks[i - 1].taskTags.length > 0">
                    <div class="task-module-small-title">
                        <span>改进建议</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <el-row v-for="j in projectTasks[i - 1].taskTags" :key="j.id">
                            <li v-if="j.suggestion">
                                <span>
                                    {{ j.suggestion }}
                                </span>
                            </li>
                        </el-row>
                    </div>
                </div>
                <div v-if="projectTasks[i - 1].taskEvaluate">

                    <div class="task-module-small-title">
                        <span>教师评价</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <span>{{ projectTasks[i - 1].taskEvaluate }}</span>
                    </div>
                </div>
                <el-divider border-style="dashed" />
            </div>

            <el-dialog v-model="InquireDialog" title="加入学习" width="500">
                <span>您要加入教师推荐的项目学习吗</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="InquireDialog = false">取消</el-button>
                        <el-button type="primary" @click="StudentJoinProject()">
                            确定
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { getProject } from '@/apis/project/getproject'
import { PST } from '@/apis/project/getPST'
import { ElMessage } from 'element-plus';
import pageHeader from '@/components/breadcrumb/index.vue'
import { MyProject } from '@/apis/project/myproject'
import router from '@/router';
import { JoinProject } from "@/apis/project/studnetJoinProject"

const route = useRoute()
// console.log(route);

const projectId = route.params.id

interface project {
    projectName: String
    cover: String
    introduction: String
    target: String
    introduce: String
    caseType: number | any
}

interface task {
    id: number
    projectId: number
    num: number
    taskName: String
    taskTargets: [{
        id: number
        name: String
    }]
    taskDeliverables: [{
        id: number
        name: String
    }]
    taskReferenceFiles: [resource]
    taskReferenceLinks: [{
        id: number
        name: String
        url: string
    }]
    taskStartTime: Date
    taskEndTime: Date
}

interface resource {
    createTime: Date
    creator: number
    filename: String
    id: number
    lastModifiedTime: Date
    lastModifiedUser: number
    name: String
    originFilename: String
    type: String
}

interface PST {
    pstid: number
    resources: [
        {
            id: number
            pstId: number
            readOver: resource
            resource: resource

        }
    ]
    taskContent: String
    taskEvaluate: String
    taskGrade: number
    taskImprovement: String
    taskName: String
    taskNum: number
    taskResubmit: number
    taskStatus: number
    taskTags: [{
        id: number
        name: String
        suggestion: String
        suggestionProject: number | null
        suggestionProjectName: string
    }
    ]
}

const project = ref<project>({
    projectName: '',
    cover: '',
    introduction: '',
    target: '',
    introduce: '',
    caseType: null,
})

const projectTasks = ref<[PST]>([
    {
        pstid: 0,
        resources: [
            {
                id: 0,
                pstId: 0,
                readOver: {
                    createTime: new Date,
                    creator: 0,
                    filename: '',
                    id: 0,
                    lastModifiedTime: new Date,
                    lastModifiedUser: 0,
                    name: '',
                    originFilename: '',
                    type: '',
                },
                resource: {
                    createTime: new Date,
                    creator: 0,
                    filename: '',
                    id: 0,
                    lastModifiedTime: new Date,
                    lastModifiedUser: 0,
                    name: '',
                    originFilename: '',
                    type: '',
                },
            }
        ],
        taskContent: '',
        taskEvaluate: '',
        taskGrade: 0,
        taskImprovement: '',
        taskName: '',
        taskNum: 0,
        taskResubmit: 0,
        taskStatus: 0,
        taskTags: [{
            id: 0,
            name: '',
            suggestion: '',
            suggestionProject: null,
            suggestionProjectName: ''
        }],
    }
])

const InquireDialog = ref(false)
const newProjectId = ref()

const getGrade = (grade: number) => {
    if (grade) {
        return grade + '分'
    }
    return ''
}

const getstatus = (status: number) => {
    if (!status || status == 0) {
        return 'wait'
    }
    else if (status === 1) {
        return 'process'
    }
    else if (status >= 2) {
        return 'finish'
    }
}

const openPage = (type: String, filename: String) => {
    let href = ''
    if (type.includes("image")) {
        href = '/local-resource/image/' + filename
        window.open(href, '_blank')
    } else {
        // href = '/local-resource/file/' + filename
        href = '/pdf/web/viewer.html?file=/local-resource/file/' + filename;
        window.open(href)
    }
    // window.open(href, '_blank')
}



const StudentJoinProject = () => {
    InquireDialog.value = false
    JoinProject(newProjectId.value).then(res => {
        if (res.state == 200) {
            router.push({
                name: 'ProjectDetail',
                params: { id: res.data, }
            })
        }
        else {
            ElMessage.error("操作错误")
        }
    })

}

const suggestionProjectClick = (id: number) => {
    MyProject().then(res => {
        if (res.state == 200) {
            for (let i = 0; i < res.data.length; i++) {
                if (id == res.data[i].id) {
                    router.push({
                        name: 'ProjectDetail',
                        params: {
                            id: id,
                        }
                    })
                    return
                }
            }
            newProjectId.value = id
            InquireDialog.value = true
        } else {
            ElMessage.error("操作失败")
        }
    })
}


onBeforeMount(async () => {
    await getProject(Number(projectId)).then(res => {
        if (res.state == 200) {
            // console.log(res)
            project.value = res.data
            // console.log(project.value);
        } else {
            ElMessage.error(res.message)
        }

    })

    await PST(Number(projectId)).then(res => {
        if (res.state == 200) {
            // console.log(res);
            projectTasks.value = res.data
            // console.log(projectTasks.value);
        } else {
            ElMessage.error(res.message)
        }
    })

})

onMounted(() => {

})

</script>
<style scoped>
.task {
    background-color: #ffffff;
    padding: 30px 3.125vw;
    display: flex;
    flex-direction: column;
}

.task-module {
    padding: 20px 0;
}

.task-module-title {
    color: #33b8b9;
    font-size: 24px;
    padding: 10px 0;
}

.task-module-small-title span {
    font-size: 18px;
    font-weight: bold;
    padding: 10px 0;
}

.task-module-small-title-item {
    font-size: 16px;
    padding: 10px 0;
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