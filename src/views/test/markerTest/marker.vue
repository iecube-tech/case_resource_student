<template>
    <div>
        <el-button @click="send()">发送</el-button>
    </div>
</template>

<script setup lang="ts">
import { CheckCell } from '@/apis/EMDProject/checkCell';
import { ElMessage } from 'element-plus';

const question = {
    analysis: '',
    answer: '$f_T$：30000-60000或30000-60000kHz',
    hint_when_wrong: '代入公式是否正确，$f_T=f_{\\beta}\\beta_{0}$，$\\beta_{0}$是低频下的交流放大系数。',
    id: 'asdf',
    images: [],
    question: '表4监测 $f_T$的计算值是否在参考范围内',
    stage: 'experiment',
    tag: '特征频率计算'
}

const check = {
    taskId: 691,
    sectionPrefix: "4.2",
    cellId: "poiuy6yuu",
    cellStuAnswer: "40000",
    cellStuImgList: [],
    question: null,
}

const send = () => {
    check.question = <any>question
    CheckCell(check).then(res => {
        if (res.state == 200) {
            ElMessage.success('yes')
        } else {
            ElMessage.error(res.message)
        }
    })
}

</script>
<style scoped></style>