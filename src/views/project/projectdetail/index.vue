<template>
    <main>
        <pageHeader :route=route />
        <el-row style="padding: 20px 0; height: 360px;">
            <el-col :span="12" style="display: flex; flex-direction: column;">
                <el-row style="flex-grow: 1; align-items: center;">
                    <el-col :span="24">
                        <h1 style="font-size: 36px; color: #33b8b9;">{{ project.projectName + " " }}项目</h1>
                    </el-col>
                    <el-col :span="24">
                        <p>项目周期：{{ formatDate(thisProject.startTime) + '至' + formatDate(thisProject.endTime) }}</p>
                    </el-col>
                </el-row>
                <el-row>

                </el-row>
                <el-row style="flex-grow: 1; padding-right: 3.125vw;">
                    <span>{{ project.projectIntroduction }}</span>
                </el-row>
            </el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end; align-items: center;">
                <img v-if="project.projectCover" :src="'/local-resource/image/' + project.projectCover" alt=""
                    style="width: 80%;">
            </el-col>
        </el-row>
        <el-row style="height: 185px; padding-bottom: 20px; margin-bottom: 20px;">
            <el-col style="display: flex;justify-content:flex-end;flex-direction: column;">
                <el-steps align-center>
                    <el-step v-for="task in projectTasks" :key="task.taskNum" :title="getGrade(task.taskGrade)"
                        :description="'任务' + task.taskNum" :status="getstatus(task.taskStatus)" />
                </el-steps>
            </el-col>
        </el-row>
        <div class="task">
            <div v-for="i in project.projectTaskList.length" :key="i - 1" class="task-module">
                <div class="task-module-title">
                    <span>任务{{ project.projectTaskList[i - 1].num }}：{{ project.projectTaskList[i - 1].taskName }}</span>
                </div>
                <div class="task-module-small-title">
                    <span>任务起止时间</span>
                </div>
                <div class="task-module-small-title-item">
                    <span>
                        {{ formatDate(project.projectTaskList[i - 1].taskStartTime) }}
                        --
                        {{ formatDate(project.projectTaskList[i - 1].taskEndTime) }}
                    </span>
                </div>
                <div v-if="project.projectTaskList[i - 1].taskTargets.length > 0">
                    <div class="task-module-small-title">
                        <span>任务要求</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <ol>
                            <li v-for="j in project.projectTaskList[i - 1].taskTargets">{{ j.name }}</li>
                        </ol>
                    </div>
                </div>
                <div v-if="project.projectTaskList[i - 1].taskDeliverables.length > 0">
                    <div class="task-module-small-title">
                        <span>交付物要求</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <ol>
                            <li v-for="j in project.projectTaskList[i - 1].taskDeliverables">{{ j.name }}</li>
                        </ol>
                    </div>
                </div>
                <div v-if="project.projectTaskList[i - 1].taskReferenceFiles.length > 0">
                    <div class="task-module-small-title">
                        <span>参考资料</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <el-row v-for="j in project.projectTaskList[i - 1].taskReferenceFiles">
                            <el-link type="primary" @click="openPage(j.type, j.filename)">
                                {{ j.originFilename }}</el-link>
                        </el-row>
                    </div>
                </div>
                <div v-if="project.projectTaskList[i - 1].taskReferenceLinks.length > 0">
                    <div class="task-module-small-title">
                        <span>参考链接</span>
                    </div>
                    <div class="task-module-small-title-item">
                        <el-row v-for="j in project.projectTaskList[i - 1].taskReferenceLinks">
                            <span>{{ j.name }}：</span>
                            <el-link type="primary" @click="openPage2(j.url)">{{ j.url }}</el-link>
                        </el-row>
                    </div>
                </div>
                <el-divider border-style="dashed" />
                <div class="task-module-small-title">
                    <el-icon>
                        <StarFilled />
                    </el-icon><span>提交任务文件</span>
                </div>
                <div v-if="projectTasks[i - 1]">
                    <el-row v-for="j in projectTasks[i - 1].resources">
                        <el-link type="primary" @click="openPage(j.resource.type, j.resource.filename)">{{
                            j.resource.originFilename }}</el-link>
                        <el-link v-if="projectTasks[i - 1].taskStatus != 2" type="warning" style="margin-left: 30px;"
                            @click="DeleteSubemitFile(j.id)"
                            :disabled="isDisabled(project.projectTaskList[i - 1].taskStartTime, project.projectTaskList[i - 1].taskEndTime, projectTasks[i - 1].taskResubmit, projectTasks[i - 1].taskStatus)">
                            删除
                        </el-link>
                    </el-row>
                </div>

                <!--  -->
                <div v-if="projectTasks[i - 1]" class="task-module-small-title-item">
                    <el-upload class="upload-demo" drag action="/dev-api/task/submitfile" :data="paramData(i - 1)" multiple
                        :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeAvatarUpload"
                        :show-file-list="false"
                        :disabled="isDisabled(project.projectTaskList[i - 1].taskStartTime, project.projectTaskList[i - 1].taskEndTime, projectTasks[i - 1].taskResubmit, projectTasks[i - 1].taskStatus)">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖动到这里或者 <em>点击上传</em>(只能上传PDF文件)
                        </div>
                    </el-upload>
                </div>

                <div v-if="projectTasks[i - 1]">
                    <div class="task-module-small-title">
                        <span>我的留言</span>
                    </div>

                    <div class="task-module-small-title-item">
                        <el-input type="textarea" :key="projectTasks[i - 1].pstid" v-model="projectTasks[i - 1].taskContent"
                            :disabled="isDisabled(project.projectTaskList[i - 1].taskStartTime, project.projectTaskList[i - 1].taskEndTime, projectTasks[i - 1].taskResubmit, projectTasks[i - 1].taskStatus)">
                        </el-input>
                    </div>
                    <div v-if="projectTasks[i - 1].taskStatus < 3"
                        style="display: flex; flex-direction: row; justify-content: center;">
                        <el-button v-if="projectTasks[i - 1].taskStatus == 0 || projectTasks[i - 1].taskStatus == 1"
                            type="primary" @click="SubmitContent(i - 1)">保存</el-button>
                        <el-button v-if="projectTasks[i - 1].taskStatus == 2" type="primary"
                            @click="ChangeStatus(i - 1)">修改</el-button>
                        <el-button v-if="projectTasks[i - 1].taskStatus < 2" @click="Cancle(i - 1)">取消</el-button>
                    </div>
                    <div v-else style="display: flex; flex-direction: row; justify-content: center;">
                        <el-button type="primary">已批阅</el-button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { MyProjectDetail } from '@/apis/project/projectDetail'
import { PST } from '@/apis/project/getPST'
import { deleteSubmitFile } from '@/apis/pst/deleteSubmitFile'
import { submitContent } from '@/apis/pst/submitContent'
import { taskDetail } from '@/apis/pst/getTaskDetail'
import { changeStatus } from '@/apis/pst/chageStatus'
import { ElMessage } from 'element-plus';
import pageHeader from '@/components/breadcrumb/index.vue'
import { UploadFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { UploadProps } from 'element-plus'
import { Project } from '@/apis/project/project'


const route = useRoute()
const projectId = route.params.id

const thisProject = ref({
    startTime: '',
    endTime: ''
})

const formatDate = (time: string | Date) => {
    if (!time) {
        return '未设置时间节点'
    }
    return dayjs(time).format('YYYY年MM月DD日 HH:mm')
}

interface project {
    projectName: String
    projectCover: String
    projectIntroduction: String
    projectTarget: String
    projectIntroduce: String
    projectTaskList: [task]
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
    taskTags: String
}

const project = ref<project>({
    projectName: '',
    projectCover: '',
    projectIntroduction: '',
    projectTarget: '',
    projectIntroduce: '',
    projectTaskList: [{
        id: 0,
        projectId: 0,
        num: 0,
        taskName: '',
        taskTargets: [{
            id: 0,
            name: '',
        }],
        taskDeliverables: [{
            id: 0,
            name: '',
        }],
        taskReferenceFiles: [{
            createTime: new Date,
            creator: 0,
            filename: '',
            id: 0,
            lastModifiedTime: new Date,
            lastModifiedUser: 0,
            name: '',
            originFilename: '',
            type: '',
        },],
        taskReferenceLinks: [{
            id: 0,
            name: '',
            url: '',
        }],
        taskStartTime: new Date,
        taskEndTime: new Date,
    }],
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
        taskTags: '',
    }
])

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

const isDisabled = (StrartTime: string | Date, EndTime: string | Date, resubmit: number, status: number) => {
    let CurrDate = new Date()
    console.log(CurrDate);

    console.log(EndTime)
    console.log(new Date(EndTime))
    if (resubmit == 1) {
        return false
    }
    if (CurrDate <= new Date(thisProject.value.startTime) || CurrDate >= new Date(thisProject.value.endTime)) {
        // 超出了项目周期
        return true
    } else {
        // 在项目周期内
        if (EndTime == null && StrartTime == null) {
            // 没有设置任务的起止时间
            if (status >= 2) {
                return true
            } else {
                console.log(1)
                return false
            }
        } else if (EndTime == null && StrartTime != null) {
            // 设置了任务的开始时间  没有设置结束时间
            if (CurrDate < new Date(StrartTime)) {
                // 早于开始时间
                return true
            } else {
                // 晚于开始时间
                if (status >= 2) {
                    return true
                } else {
                    console.log(2)
                    return false
                }
            }
        } else if (EndTime != null && StrartTime == null) {
            // 设置了结束时间 没有设置开始时间
            if (CurrDate > new Date(EndTime)) {
                // 晚于结束时间
                return true
            } else {
                // 早于结束时间
                if (status >= 2) {
                    return true
                } else {
                    console.log(3)
                    return false
                }
            }
        } else {
            // 设置了结束时间和开始时间
            if (CurrDate >= new Date(EndTime) || CurrDate <= new Date(StrartTime)) {
                // 早于开始时间  或者晚于结束时间
                return true
            } else {
                // 在时间段内
                if (status >= 2) {
                    return true
                } else {
                    console.log(4)
                    return false
                }
            }
        }
    }

    console.log('s1', StrartTime)
    console.log('e1', EndTime)



}


const openPage = (type: String, filename: String) => {
    let href = ''
    if (type.includes("image")) {
        href = '/local-resource/image/' + filename
    } else {
        href = '/local-resource/file/' + filename
    }
    window.open(href, '_blank')
}

const openPage2 = (href: string) => {
    if (href.includes('http://') || href.includes('https://')) {
        window.open(href, '_blank')
    } else {
        window.open('https://' + href, '_blank')
    }
}

const paramData = (index: number) => {
    if (projectTasks.value[index]) {
        return { pstId: projectTasks.value[index].pstid }
    }
}

const DeleteSubemitFile = async (PSTResourceId: number) => {
    await deleteSubmitFile(PSTResourceId).then(res => {
        if (res.state == 200) {
            let taskDetail: PST = res.data
            let i = 0
            let index = 0
            for (i; i < projectTasks.value.length; i++) {
                if (taskDetail.pstid == projectTasks.value[i].pstid) {
                    index = i
                    break
                }
            }
            projectTasks.value[index] = taskDetail
        } else {
            ElMessage.error(res.message)
        }
    })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'application/pdf') {
        ElMessage.error('只能上传PDF文件')
        return false
    } else if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('Avatar picture size can not exceed 10MB!')
        return false
    }
    return true
}

const uploadSuccess: UploadProps['onSuccess'] = (response) => {
    let taskDetail: PST = response.data
    let i = 0
    let index = 0
    for (i; i < projectTasks.value.length; i++) {
        if (taskDetail.pstid == projectTasks.value[i].pstid) {
            index = i
            break
        }
    }
    projectTasks.value[index] = taskDetail
}

const uploadError: UploadProps['onSuccess'] = (response) => {
    ElMessage.error(response.message)
}

const SubmitContent = async (index: number) => {
    await submitContent(projectTasks.value[index].taskContent, projectTasks.value[index].pstid).then(res => {
        if (res.state == 200) {
            projectTasks.value[index] = res.data
        } else {
            ElMessage.error(res.message)
        }
    })
}

const ChangeStatus = async (index: number) => {
    projectTasks.value[index].taskStatus = 1
    // await changeStatus(projectTasks.value[index].pstid).then(res => {
    //     if (res.state == 200) {
    //         projectTasks.value[index] = res.data
    //     } else {
    //         ElMessage.error(res.message)
    //     }
    // })
}

const Cancle = async (index: number) => {
    await taskDetail(projectTasks.value[index].pstid).then(res => {
        if (res.state == 200) {
            projectTasks.value[index] = res.data
        } else {
            ElMessage.error(res.message)
        }
    })
}

onBeforeMount(async () => {
    await MyProjectDetail(Number(projectId)).then(res => {
        if (res.state == 200) {
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

    await Project(Number(projectId)).then(res => {
        if (res.state == 200) {
            thisProject.value = res.data
        }
    })

})

onMounted(() => {

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

ol {
    padding-inline-start: 20px;
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