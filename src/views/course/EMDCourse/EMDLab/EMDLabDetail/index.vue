<template>
    <div class="lab-container" v-if="sectionVoList">
        <div v-for="(item, i) in sectionVoList">
            <div v-if="i <= maxShowIndex" :id="'step-' + (i + 1)" class="section-container">
                <sectionItem :section="item" />
                <div style="margin-top: 30px;">
                    <el-button class="last-button" v-if="i != 0" @click="lastStep(i)" size="large"
                        :icon="ArrowLeftBold">上一步</el-button>
                    <el-button class="next-button" v-if="(i < sectionVoList.length - 1)" @click="nextStep(i)"
                        size="large" :icon="ArrowRightBold">下一步</el-button>
                    <el-button class="done-button" v-if="(i == sectionVoList.length - 1)" size="large"
                        :icon="Select">提交</el-button>
                    <el-button class="help-button" size="large" :icon="QuestionFilled"
                        @click="aistore.setChangeRightPaneVisible(true)">帮助</el-button>
                    <el-button @click="openDevice()">设备dialog</el-button>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="labStore.deviceDataDialog" title="实验设备">
        <auto3835></auto3835>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetEMDTaskDetailVo } from '@/apis/EMDProject/getTaskDetailVo';
import { ToNestSection } from '@/apis/EMDProject/toNextSection';
import { ElMessage } from 'element-plus';
import { type taskDetailVo, type sectionVo } from './EMDLab';
import sectionItem from './sectionContainer/index.vue';
import { useChatStore } from '@/stores/aiStore';
import { ArrowLeftBold, ArrowRightBold, QuestionFilled, Select } from '@element-plus/icons-vue';
import { GetTaskRef } from '@/apis/EMDProject/getLabRef';
import { useEmdStore } from '@/stores/emdLabStore';
import auto3835 from '../../deviceData/auto-3835.vue';
const props = defineProps({
    taskId: {
        type: Number,
        required: true
    },
})
const aistore = useChatStore()
const sectionVoList = ref<sectionVo[]>([])
const maxShowIndex = ref(0)
const labStore = useEmdStore()

const openDevice = () => {
    labStore.setDeviceDataDialog()
}

const canShow = (index: number) => {
    if (index == 0) {
        return true
    }
    if (sectionVoList.value[index - 1].status == 1) {
        return true
    }
    return false
}

const lastStep = (index: number) => {
    window.location.hash = 'step-' + index
}

const nextStep = async (index: number) => {
    // 校验
    if (index == maxShowIndex.value) {
        // 判断当前的section的status 是不是为1
        if (sectionVoList.value[index].status != 1) {
            await ToNestSection(<number>sectionVoList.value[index].stsid).then(res => {
                console.log(res)
                if (res.state == 200) {
                    sectionVoList.value[index].status == 1
                    maxShowIndex.value++
                } else {
                    ElMessage.error(res.message)
                    return
                }
            })
        }
    }
    setTimeout(() => {
        window.location.hash = 'step-' + (index + 2)
    }, 300)
}


const getTaskDetailVo = () => {
    return new Promise<void>((resolve, reject) => {
        GetEMDTaskDetailVo(props.taskId).then(res => {
            if (res.state == 200) {
                sectionVoList.value = res.data.sectionVoList
                for (let i = 0; i < sectionVoList.value.length - 1; i++) {
                    if (sectionVoList.value[i].status == 0) {
                        break;
                    } else {
                        maxShowIndex.value = i + 1
                    }
                }
                console.log(sectionVoList.value)
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
                aistore.setReferenceMaterial(res.data)
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
    await getTaskRefence() // 获取实验参考资料
})
</script>
<style scoped>
.lab-container,
.section-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: var(--el-box-shadow-lighter)
}

.lab-container {
    padding: 20px;
}

.section-container {
    padding: 20px;
    margin-top: 20px;
}

.next-button {
    --tw-text-opacity: 1;
    color: rgb(255 255 255);
    background-color: rgb(94 234 212 /1);
}

.next-button:hover {
    border-bottom-color: rgb(198, 226, 255);
    border-left-color: rgb(198, 226, 255);
    border-right-color: rgb(198, 226, 255);
    color: rgb(64, 158, 255);
    border-top-color: rgb(198, 226, 255);
    background-color: rgb(45, 212, 191);
}

.last-button {
    color: rgb(75 85 99 / 1);
    background-color: rgb(243 244 246 / 1);
}

.last-button:hover {
    border-bottom-color: rgb(198, 226, 255);
    border-left-color: rgb(198, 226, 255);
    border-right-color: rgb(198, 226, 255);
    color: rgb(64, 158, 255);
    border-top-color: rgb(198, 226, 255);
    background-color: rgb(229, 231, 235);
}

.help-button {
    color: rgb(255 255 255);
    background-color: rgb(165 180 252 / 1);
}

.help-button:hover {
    background-color: rgb(129 140 248 / 1);
    border-color: var(--el-button-hover-border-color);
    color: var(--el-button-hover-text-color);
}

.done-button {
    color: rgb(255 255 255);
    background-color: rgb(45 212 191 / 1);
}

.done-button:hover {
    border-color: var(--el-button-hover-border-color);
    color: var(--el-button-hover-text-color);
}
</style>