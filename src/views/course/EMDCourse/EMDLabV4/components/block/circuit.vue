<template>
    <div class="ist-theam border my-8 p-8">
        <h2 name="电路连线检测">电路连线检测</h2>
        <el-row class="my-4">
            <el-col :span="6" class="my-4 flex flex-row justify-center items-center">
                <button v-if="!isCheckIng" @click="toClickChenk()"
                    class="w-full btn bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex justify-center items-center mx-8">
                    电路检查
                </button>

                <button v-else disabled
                    class="w-full btn bg-gray-400 text-white font-medium py-2 px-6 rounded-md flex justify-center items-center mx-8">
                    检查中
                    <span class="loading"></span>
                </button>
            </el-col>
            <el-col :span="18" class="my-4 flex flex-row justify-center items-center">
                <div v-if="checkRes.score == null">

                </div>
                <div v-else class="w-full">
                    <div v-if="checkRes.score == checkRes.full_mark"
                        class="w-full bg-green-100 p-4 border-l-4 border-green-500">
                        <div class="mb-4 flex flex-row items-center text-green-900 text-xl">
                            <!-- <font-awesome-icon icon="fa-solid fa-check" class="mr-4" /> -->
                            <font-awesome-icon icon="fa-solid fa-check-double" class="mr-4" />
                            <span>
                                电路连接正确！
                            </span>
                        </div>
                        <div class="mb-4 text-green-700 text-xl">
                            所有连接点均正确，您可以继续进行操作。
                        </div>
                    </div>

                    <div v-if="checkRes.score < checkRes.full_mark"
                        class="w-full bg-red-100 p-4 border-l-4 border-red-500">
                        <div class="mb-4 flex flex-row items-center text-red-900 text-xl">
                            <font-awesome-icon icon="fa-solid fa-xmark" class="mr-4" />
                            <span>
                                电路连接存在问题！
                            </span>
                        </div>
                        <div class="mb-4 text-red-700 text-xl">
                            {{ checkRes.remark }}
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">

import { aiCheckStore } from '@/stores/aiCheckStore';
import { emitter } from '@/ts/eventBUs';

const props = defineProps({
    blockVo: Object,
    status: Number,
    comp: Object,
    index: Number,
})

const payload = ref<PAYLOAD>()

const checkStore = aiCheckStore()
const blockDetail = ref<blockVo>()


const isCheckIng = ref(false)
const checkId = ref()


const toClickChenk = () => {
    isCheckIng.value = true
    checkRes.value.score = null
    checkRes.value.remark = ''
    // 获取电路连线数据
    if (payload.value?.question) {
        checkId.value = payload.value?.question.id
        emitter.emit("getSFBData", { id: payload.value?.question.id })
    } else {
        console.log("电路检查未设计问题")
        isCheckIng.value = false
    }
}

const circuitData = ref<any[]>()

/**
 * auto-3835.vue 接收电路检查数据
 * @param arg {id：questionId, data:list}
 */
const handleGetSFBData = (arg: any) => {
    // console.log("取到数据", arg)
    // console.log("checkId", checkId.value)
    if (arg.id == checkId.value) {
        circuitData.value = arg.data
        aiCheckCircuit(circuitData.value!)
    }
}

// 使用ai进行电路检查
const aiCheckCircuit = (circuitList: any[]) => {
    console.log("使用ai进行电路检查")
    if (payload.value?.question == null) {
        return
    }
    const markerQuestion = {
        id: checkId.value,
        stage: payload.value!.question.stage,
        question: payload.value!.question.question,
        images: [],
        answer: payload.value!.question.answer,
        tag: payload.value!.question.tag,
        analysis: payload.value!.question.analysis,
        hint_when_wrong: payload.value!.question.hintWhenWrong,
    }
    const markerQo = {
        chatId: checkStore.getCheckId,
        sectionPrefix: checkStore.getSectionPrefix,
        stuInput: circuitList.toString(),
        imgDataurls: [],
        scene: markerQuestion.stage,
        question: markerQuestion
    }
    // console.log(markerQo)

    checkStore.addNeedCheckItem(markerQo)  //添加到队列中
}

const checkRes = ref({
    full_mark: 5,
    score: null,
    remark: ''
})
const handleCheckRes = (result: any) => {
    // console.log(result)
    // console.log(checkId.value)
    if (result.question.id == checkId.value) {
        checkRes.value.full_mark = result.full_mark
        checkRes.value.score = <any>result.score
        checkRes.value.remark = result.remark
        // console.log(checkRes.value)
        isCheckIng.value = false
    }
}

const handleDeviceError = (error: any) => {
    if (error.id == checkId.value) {
        isCheckIng.value = false
    }
}




onMounted(() => {
    // blockDetail.value = <blockVo>props.blockVo
    // if (blockDetail.value) {
    //     payload.value = JSON.parse(blockDetail.value.payload)
    //     emitter.on("3835CircuitData", handleGetSFBData)
    //     emitter.on("aiCheckRes", handleCheckRes)
    //     emitter.on("deviceError", handleDeviceError)
    // }
    
    payload.value = props.comp.payload
    emitter.on("3835CircuitData", handleGetSFBData)
        emitter.on("aiCheckRes", handleCheckRes)
        emitter.on("deviceError", handleDeviceError)
    
})
</script>
<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, .3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-left: 10px;
}
</style>