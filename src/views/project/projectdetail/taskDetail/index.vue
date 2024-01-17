<template>
    <div>
        <div class="task-module-small-title">
            <span>任务时间</span>
        </div>
        <div class="task-module-small-title-item">
            <span>
                {{ formatDate(<any>projectTask?.taskStartTime) }}
                    --
                    {{ formatDate(<any>projectTask?.taskEndTime) }}
            </span>
        </div>
        <div v-if="projectTask">
            <div v-if="projectTask.backDrops.length > 0">
                <div class="task-module-small-title">
                    <span>任务背景</span>
                </div>
                <div class="task-module-small-title-item">
                    <p v-for="j in projectTask.backDrops">{{ j.name }}</p>
                </div>
            </div>
            <div v-if="projectTask.taskTargets.length > 0">
                <div class="task-module-small-title">
                    <span>任务目的</span>
                </div>
                <div class="task-module-small-title-item">
                    <ol>
                        <li v-for="j in projectTask?.taskTargets">{{ j.name }}</li>
                    </ol>
                </div>
            </div>
            <div v-if="projectTask.taskDeliverables.length > 0">
                <div class="task-module-small-title">
                    <span>任务要求</span>
                </div>
                <div class="task-module-small-title-item">
                    <ol>
                        <li v-for="j in projectTask.taskDeliverables">{{ j.name }}</li>
                    </ol>
                </div>
            </div>
            <div v-if="projectTask.taskReferenceFiles.length > 0">
                <div class="task-module-small-title">
                    <span>参考资料</span>
                </div>
                <div class="task-module-small-title-item">
                    <el-row v-for="j in projectTask?.taskReferenceFiles">
                        <el-link type="primary" @click="openPage(j.type, j.filename)">
                            {{ j.originFilename }}</el-link>
                    </el-row>
                </div>
            </div>
            <div v-if="projectTask.taskReferenceLinks.length > 0">
                <div class="task-module-small-title">
                    <span>参考链接</span>
                </div>
                <div class="task-module-small-title-item">
                    <el-row v-for="j in projectTask?.taskReferenceLinks">
                        <span>{{ j.name }}：</span>
                        <el-link type="primary" @click="openPage2(j.url)">{{ j.url }}</el-link>
                    </el-row>
                </div>
            </div>
        </div>
        <el-divider border-style="dashed" />
        <div class="task-module-small-title">
            <el-icon>
                <StarFilled />
            </el-icon><span>提交任务文件</span>
        </div>
        <div v-if="myTask">
            <el-row v-for="j in myTask.resources">
                <el-link type="primary" @click="openPage(j.resource.type, j.resource.filename)">{{
                    j.resource.originFilename }}</el-link>
                <div v-if="myTask.taskStatus != 2">
                    <el-link v-if="isDisabled() == 0" type="warning" style="margin-left: 30px;"
                        @click="DeleteSubemitFile(j.id)">
                        删除
                    </el-link>
                </div>
            </el-row>
        </div>

        <!--  -->
        <div v-if="myTask" class="task-module-small-title-item">
            <el-upload class="upload-demo" drag action="/dev-api/task/submitfile" :data="{ pstId: myTask.pstid }" multiple
                :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeAvatarUpload"
                :show-file-list="false" :disabled="isDisabled() > 0">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div v-if="isDisabled() == 0" class="el-upload__text">
                    将文件拖动到这里或者 <em>点击上传</em>(只能上传PDF文件)
                </div>
                <div v-else-if="isDisabled() == 1" class="el-upload__text" style="color:red">
                    当前不在项目开放时间内，不能提交文件
                </div>
                <div v-else-if="isDisabled() == 2" class="el-upload__text" style="color:red">
                    当前不在任务开放时间内，不能提交文件
                </div>
                <div v-else-if="isDisabled() == 3" class="el-upload__text" style="color:#e6a23c">
                    已提交，点击下方修改按钮进行更改
                </div>
                <div v-else-if="isDisabled() == 4" class="el-upload__text" style="color:#e6a23c">
                    已批阅，不能再提交文件
                </div>
            </el-upload>
        </div>

        <div v-if="myTask">
            <div class="task-module-small-title">
                <span>我的留言</span>
            </div>

            <div class="task-module-small-title-item">
                <el-input type="textarea" :key="myTask.pstid" v-model="myTask.taskContent" :disabled="isDisabled() != 0">
                </el-input>
            </div>
            <div v-if="myTask.taskStatus < 3" style="display: flex; flex-direction: row; justify-content: center;">
                <div v-if="isDisabled() == 0 || isDisabled() == 3">
                    <el-button v-if="myTask.taskStatus == 0 || myTask.taskStatus == 1" type="primary"
                        @click="SubmitContent()">提交</el-button>
                    <el-button v-if="myTask.taskStatus == 2" type="primary" @click="ChangeStatus()">修改</el-button>
                    <el-button v-if="myTask.taskStatus < 2" @click="Cancle()">取消</el-button>
                </div>
            </div>
            <div v-else style="display: flex; flex-direction: row; justify-content: center;">
                <el-button type="primary">已批阅</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'
import { submitContent } from '@/apis/pst/submitContent'
import { deleteSubmitFile } from '@/apis/pst/deleteSubmitFile'
import { taskDetail } from '@/apis/pst/getTaskDetail'
import type { UploadProps } from 'element-plus'
import { defineComponent, ref, defineEmits } from 'vue';
import dayjs from 'dayjs';

interface task {
    id: number
    projectId: number
    num: number
    taskName: String
    backDrops: [{
        id: number
        name: String
    }]
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
interface pst {
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
export default defineComponent({
    name: 'PSTDetail',
    props: {
        indexValue: Number,
        message: String,
        projectTask: {
            type: Object as () => task,
            required: true,
        },
        myTask: {
            type: Object as () => pst,
            required: true,
        },
        projectStratTime: String,
        projectEndTime: String,
    },
    methods: {

    },
    setup(props, methods) {
        const indexValue = ref(0)
        const projectTask = ref<task>({
            id: 0,
            projectId: 0,
            num: 0,
            taskName: '',
            backDrops: [{
                id: 0,
                name: '',
            }],
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
        })

        const myTask = ref<pst>({
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
        })

        const projectStartTime = ref('')
        const projectEndTime = ref('')
        indexValue.value = <number>props.indexValue
        projectTask.value = props.projectTask
        myTask.value = props.myTask
        projectStartTime.value = props.projectStratTime!
        projectEndTime.value = props.projectEndTime!

        const notifyParent = () => {
            // 发送自定义事件到父组件
            // 第一个参数是事件名称，第二个参数是传递给父组件的数据
            methods.emit('notify', 'hh');
        }

        const changePage = (states: number, page?: number) => {
            methods.emit('changePage', states, page)
        }

        const formatDate = (time: string | Date) => {
            if (!time) {
                return "未设置时间节点"
            }
            return dayjs(time).format('YYYY年MM月DD日 HH:mm')
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

        const paramData = () => {
            return { pstId: myTask.value.pstid }
        }
        const isDisabled = () => {
            // 0:可用
            // 1:不在项目时间内
            // 2:不在任务时间内
            // 3:已提交
            // 4:已批阅
            let CurrDate = new Date()
            let StrartTime = projectTask.value.taskStartTime
            let EndTime = projectTask.value.taskEndTime
            let resubmit = myTask.value.taskResubmit
            let status = myTask.value.taskStatus
            // console.log(CurrDate);
            // console.log(EndTime)
            // console.log(new Date(EndTime))
            if (resubmit == 1) {
                return 0
            }
            if (CurrDate <= new Date(projectStartTime.value) || CurrDate >= new Date(projectEndTime.value)) {
                // 超出了项目周期
                return 1
            } else {
                // 在项目周期内
                if (EndTime == null && StrartTime == null) {
                    // 没有设置任务的起止时间
                    if (status == 2) {
                        return 3
                    } else if (status == 3) {
                        return 4
                    } else {
                        // console.log(1)
                        return 0
                    }
                } else if (EndTime == null && StrartTime != null) {
                    // 设置了任务的开始时间  没有设置结束时间
                    if (CurrDate < new Date(StrartTime)) {
                        // 早于开始时间
                        return 2
                    } else {
                        // 晚于开始时间
                        if (status == 2) {
                            return 3
                        } else if (status == 3) {
                            return 4
                        } else {
                            // console.log(2)
                            return 0
                        }
                    }
                } else if (EndTime != null && StrartTime == null) {
                    // 设置了结束时间 没有设置开始时间
                    if (CurrDate > new Date(EndTime)) {
                        // 晚于结束时间
                        return 2
                    } else {
                        // 早于结束时间
                        if (status == 2) {
                            return 3
                        } else if (status == 3) {
                            return 4
                        } else {
                            // console.log(3)
                            return 0
                        }
                    }
                } else {
                    // 设置了结束时间和开始时间
                    if (CurrDate >= new Date(EndTime) || CurrDate <= new Date(StrartTime)) {
                        // 早于开始时间  或者晚于结束时间
                        return 2
                    } else {
                        // 在时间段内
                        if (status == 2) {
                            return 3
                        } else if (status == 3) {
                            return 4
                        } else {
                            // console.log(4)
                            return 0
                        }
                    }
                }
            }
        }

        const DeleteSubemitFile = async (PSTResourceId: number) => {
            await deleteSubmitFile(PSTResourceId).then(res => {
                if (res.state == 200) {
                    myTask.value = res.data
                    notifyParent()
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
            myTask.value = response.data
            notifyParent()
        }

        const uploadError: UploadProps['onSuccess'] = (response) => {
            ElMessage.error(response.message, response.error)
        }

        const SubmitContent = async () => {
            await submitContent(myTask.value.taskContent, myTask.value.pstid).then(res => {
                if (res.state == 200) {
                    myTask.value = res.data
                    notifyParent()
                } else {
                    ElMessage.error(res.message)
                }
            })
        }

        const ChangeStatus = () => {
            myTask.value.taskStatus = 1
            // await changeStatus(projectTasks.value[index].pstid).then(res => {
            //     if (res.state == 200) {
            //         projectTasks.value[index] = res.data
            //     } else {
            //         ElMessage.error(res.message)
            //     }
            // })
        }

        const Cancle = async () => {
            await taskDetail(myTask.value.pstid).then(res => {
                if (res.state == 200) {
                    myTask.value = res.data
                    notifyParent()
                } else {
                    ElMessage.error(res.message)
                }
            })
        }

        return {
            projectTask,
            myTask,
            formatDate,
            openPage,
            openPage2,
            paramData,
            isDisabled,
            DeleteSubemitFile,
            uploadSuccess,
            uploadError,
            beforeAvatarUpload,
            SubmitContent,
            ChangeStatus,
            Cancle,
            changePage,
        }
    }

});
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

/* .task-module-deliverable {} */

.task-module-deliverable h1 {
    color: #33b8b9;
    font-size: 24px;
    font-weight: bold;
}

.task-module-deliverable span {
    font-size: 24px;
}
</style>