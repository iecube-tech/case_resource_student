<template>
    <div ref="lab" v-if="labModelList">
        <div v-for="i in (currentModelIndex + 1)" :key="'module-' + (i - 1)"
            class="model-item scroll-mt-[80px] card p-8 mb-8" :id="'module-' + (i - 1)">
            <div class="text-2xl font-bold mb-6 flex items-center">
                <!-- <i class="fas fa-info-circle text-blue-600 mr-3"></i> -->
                <font-awesome-icon :icon="labModelList[i - 1].icon" class="text-blue-600 mr-3" />
                {{ labModelList[i - 1].name }}
            </div>
            <div class="mb-8 overflow-x-auto">
                <div class="flex space-x-2 md:space-x-4 min-w-max">
                    <button v-for="(section, j) in labModelList[i - 1].sectionVoList"
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors">
                        {{ '步骤' + (j + 1) }}
                    </button>
                </div>
            </div>
            <div v-for="(section, j) in labModelList[i - 1].sectionVoList">
                <div v-if="i < (currentModelIndex + 1) || (i == (currentModelIndex + 1) && j <= currentSecIndex)"
                    class="section-container border rounded-lg mb-6 p-6 scroll-mt-[80px]"
                    :id="'module-' + (i - 1) + 'step-' + j">

                    <sectionItemV3 :section="section" />
                    <div class="text-center mt-6">
                        <button @click="nextStep(i - 1, j)"
                            class="btn bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-md flex items-center mx-auto">
                            <span
                                v-if="j == labModelList[i - 1].sectionVoList.length - 1 && labModelList[i - 1].stage == 'before-class'">开始实验操作</span>
                            <span
                                v-else-if="j == labModelList[i - 1].sectionVoList.length - 1 && i == labModelList.length">提交</span>
                            <span v-else>下一步</span>
                            <font-awesome-icon icon="fas fa-arrow-right" class="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex justify-end mb-4">
                <a :href="'#module-' + (i - 1)" class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <font-awesome-icon icon="fas fa-arrow-up" class="mr-1" />
                    返回本模块顶部
                </a>
            </div>
        </div>
    </div>
    <el-dialog v-if="!controllerDeviceVisible" v-model="labStore.deviceDataDialog" title="实验设备">
        <auto3835></auto3835>
    </el-dialog>

    <el-dialog v-model="labdoneDialog" width="300" center align-center :show-close="false">
        <div class="text-center">恭喜你已成功完成实验！</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="labdoneDialog = false">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { GetEMDTaskDetailVo } from '@/apis/EMDProject/getTaskDetailVo';
import { ElMessage } from 'element-plus';

import sectionItemV3 from './sectionContainer/sectionViewV4.vue';
import { useChatStore } from '@/stores/aiStore';
import { aiCheckStore } from '@/stores/aiCheckStore';
import { GetTaskRef } from '@/apis/EMDProject/getLabRef';
import { useEmdStore } from '@/stores/emdLabStore';
import auto3835 from '../../deviceData/auto-3835.vue';
import { UseQuestioner } from '@/apis/AI/useQuestioner';
import { ToNestSection } from '@/apis/EMDProject/toNextSection';
import { UpdateModelStatus } from '@/apis/EMDProject/upModelStatus';
import { UpdateTaskStatus } from '@/apis/EMDProject/updateEmdTaskStatus';

const props = defineProps({
    taskId: {
        type: Number,
        required: true
    },
    controllerDeviceVisible: { //用于控制 2830
        type: Boolean,
        default: false,
    }
})
const aistore = useChatStore()
const labModelList = ref()
// const sectionVoList = ref<sectionVo[]>([])
const labStore = useEmdStore()
const checkStore = aiCheckStore()
const labdoneDialog = ref(false)

const nextStep = async (modelIdex: number, secIndex: number) => {
    console.log(labModelList.value[modelIdex])
    window.location.hash = ''
    if (modelIdex == currentModelIndex.value && secIndex == currentSecIndex.value) {
        // 处理section
        await ToNestSection(labModelList.value[modelIdex].sectionVoList[secIndex].id).then(res => {
            if (res.state == 200) {
                if (res.data != true) {
                    ElMessage.warning("步骤校验未通过")
                    return
                }
                else {
                    labModelList.value[modelIdex].sectionVoList[secIndex].status = 1
                }
            }
            else {
                ElMessage.error(res.message)
            }
        })

        if (secIndex == labModelList.value[modelIdex].sectionVoList.length - 1) {
            // 是不是 model 中的最后一步 : 下一个model currentSecIndex --> 0
            // 处理model
            // 检查是不是需要ai出题 需要出几道题
            console.log(labModelList.value[modelIdex])
            if (labModelList.value[modelIdex].isNeedAiAsk && labModelList.value[modelIdex].status == 0) {
                // 需要出题
                if (aistore.getCurrQuestion !== null) {
                    aistore.setChangeRightPaneVisible(true)
                    ElMessage.warning("请回答AI提问")
                    return
                }
                const msg = {
                    chatId: aistore.getAssistantChatId,
                    scene: labModelList.value[modelIdex].stage,
                    sectionPrefix: labModelList.value[modelIdex].sectionPrefix,
                    amount: 1
                }
                UseQuestioner(JSON.parse(JSON.stringify(msg))).then(res => {
                    if (res.state == 200) {
                        ElMessage.warning("请回答AI提问")
                    }
                })
                return
            } else if (labModelList.value[modelIdex].status == 1) {
                if (modelIdex == labModelList.value.length - 1 && secIndex == labModelList.value[labModelList.value.length - 1].sectionVoList.length - 1) {
                    // 是不是最后一步，如果最后一步 
                    UpdateTaskStatus(props.taskId, 2).then(res => {
                        if (res.state == 200) {
                            labdoneDialog.value = true
                        }
                    })
                    return
                }
            } else {
                // 不需要出题
                UpdateModelStatus(labModelList.value[modelIdex].id, 0, 1).then(res => {
                    if (res.state == 200) {
                        labModelList.value[modelIdex].status = 1
                    } else {
                        ElMessage.warning("步骤校验未通过")
                        return
                    }
                })
            }
            currentModelIndex.value++
            currentSecIndex.value = 0
            window.location.hash = 'module-' + currentModelIndex.value + 'step-' + currentSecIndex.value
            labStore.setCurrModel(labModelList.value[currentModelIndex.value])
        } else if (secIndex < labModelList.value[modelIdex].sectionVoList.length - 1) {
            currentSecIndex.value++
            window.location.hash = 'module-' + currentModelIndex.value + 'step-' + currentSecIndex.value
        }
        //  当前页面中的最后一个下一步
        if (modelIdex == labModelList.value.length - 1 && secIndex == labModelList.value[labModelList.value.length - 1].sectionVoList.length - 1) {
            // 是不是最后一步，如果最后一步 
            UpdateTaskStatus(props.taskId, 2).then(res => {
                if (res.state == 200) {
                    labdoneDialog.value = true
                }
            })
            return
        }
        return
    }
    // 下滑
    if (secIndex == labModelList.value[modelIdex].sectionVoList.length - 1) {
        // 是不是 model 中的最后一步
        window.location.hash = 'module-' + (modelIdex + 1) + 'step-0'
    } else if (secIndex < labModelList.value[modelIdex].sectionVoList.length - 1) {
        window.location.hash = 'module-' + modelIdex + 'step-' + (secIndex + 1)
    }
}

watch(() => labStore.canNextModel, (newVal) => {
    if (newVal) {
        if (currentModelIndex.value == labModelList.value.length - 1 && currentSecIndex.value == labModelList.value[labModelList.value.length - 1].sectionVoList.length - 1) {
            // 是不是最后一步，如果最后一步 
            labModelList.value[currentModelIndex.value].status = 1
            UpdateTaskStatus(props.taskId, 2).then(res => {
                if (res.state == 200) {
                    labdoneDialog.value = true
                }
            })
            // todo 最后的提交， 设置task的status， 提交和保存数据
            return
        }
        currentModelIndex.value++
        currentSecIndex.value = 0
        window.location.hash = 'module-' + currentModelIndex.value + 'step-' + currentSecIndex.value
        labStore.setCanNextModel(false)
        labStore.setCurrModel(labModelList.value[currentModelIndex.value])
    }
})

const handlePageClick = () => {
    document.addEventListener('click', function (event: Event) {
        // console.log(event)
        if ((event.target as HTMLElement).classList.contains("md-image")) {
            labStore.showZoomed = true
            labStore.setimageSrc((event.target as HTMLImageElement).currentSrc)
        }
    })
}

const currentModelIndex = ref(0)
const currentSecIndex = ref(0)

const computeCurrent = () => {
    for (let i = 0; i < labModelList.value.length; i++) {
        currentModelIndex.value = i
        if (labModelList.value[i].status == 0) {
            break
        }
        console.log('model' + i + 'status->' + labModelList.value[i].status)
    }
    for (let j = 0; j < labModelList.value[currentModelIndex.value].sectionVoList.length; j++) {
        currentSecIndex.value = j
        if (labModelList.value[currentModelIndex.value].sectionVoList[j].status == 0) {
            break
        }
        console.log('sec' + j + 'status->' + labModelList.value[currentModelIndex.value].sectionVoList[j].status)
    }
    labStore.setCurrModel(labModelList.value[currentModelIndex.value])
    console.log(labStore.getCurrModel)
    console.log('modelIdex-->' + currentModelIndex.value + ', secIndex-->' + currentSecIndex.value)
}

const getTaskDetailVo = () => {
    return new Promise<void>((resolve, reject) => {
        GetEMDTaskDetailVo(props.taskId).then(res => {
            if (res.state == 200) {
                labModelList.value = res.data.labModelVoList
                labStore.setLabModelList(labModelList.value)
                labStore.setEmdStudentTask(res.data.emdStudentTask)
                computeCurrent();
                console.log(labModelList.value)
                resolve()
            } else {
                ElMessage.error(res.message)
                reject()
            }
        })
    })
}
const getTaskRefence = () => {
    return new Promise<void>((resolve, reject) => {
        GetTaskRef(props.taskId).then(res => {
            if (res.state == 200) {
                aistore.setReferenceMaterial(res.data.ref)
                aistore.setSectionPrefix(res.data.sectionPrefix)
                checkStore.setSectionPrefix(res.data.sectionPrefix)
                console.log(aistore.getSectionPrefix)
                resolve()
            } else {
                ElMessage.error("AI相关数据加载失败")
                reject()
            }
        })
    })
}



onMounted(async () => {
    await getTaskDetailVo()  // 获取实验内容
    // 获取实验设备
    getTaskRefence() // 获取实验参考资料
    handlePageClick()
})
</script>
<style scoped></style>