<template>
    <div class="mt-6 space-y-6 fade-in">
        <!-- 课程目标达成度雷达图 -->
        <div class="bg-white rounded-lg shadow p-4 hover-card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">课程目标达成度雷达图</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <v-chart v-if="chart1Show" ref="chart1Ref" :option="option1" class="w-full h-64 chart-container" />
                <div>
                    <h4 class="text-md font-medium text-gray-700 mb-3">课程目标达成度说明</h4>
                    <p class="text-sm text-gray-600 mb-4">
                        根据您在各个实验中的表现，系统评估了您对课程目标的达成程度。该分析基于您的实验操作、问题回答和实验报告等多维数据。
                    </p>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2" v-if="targetList.length > 0">
                            <font-awesome-icon icon="star" class="text-yellow-500 w-4 h-4" />
                            <span class="text-sm text-gray-700 font-medium w-[60px] inline-block"
                                style="text-align-last: justify">优势能力</span>
                            <span class="text-sm text-gray-700">课程目标{{ analysis_target.max_score_target_index + 1
                                }}</span>
                        </div>
                        <div class="flex items-center space-x-2" v-if="targetList.length > 1">
                            <font-awesome-icon icon="tools" class="text-blue-500 w-4 h-4" />
                            <span class=" text-sm text-gray-700 font-medium  w-[60px] inline-block"
                                style="text-align-last: justify">待提升</span>
                            <span class="text-sm text-gray-700">课程目标
                                {{ analysis_target.min_score_target_index + 1 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 课程目标详细分析 -->
        <div class="bg-white rounded-lg shadow p-4 hover-card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">课程目标分析</h3>
            <div class="space-y-6">
                <div v-for="(target, index) in targetList" :key="index">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-md font-medium text-gray-700">课程目标{{ index + 1 }}</h4>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium" :class="getPrecentTextStyle(target.rage).label">{{
                                getPrecentText(target.rage) }}</span>
                            <span class="px-2 py-1 rounded-full text-xs font-medium"
                                :class="getPrecentTextStyle(target.rage).score">
                                {{ target.rage }}
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div class="bg-gray-50 p-3 rounded-lg h-full flex flex-col justify-center">
                                <h5 class="text-sm font-medium text-gray-700 mb-2">表现概述</h5>
                                <p class="text-sm text-gray-600">{{ target.targetName }}</p>
                            </div>
                        </div>
                        <div>
                            <div class="bg-gray-50 p-3 rounded-lg h-full flex flex-col justify-center">
                                <h5 class="text-sm font-medium text-gray-700 mb-2">相关监测点与评分</h5>
                                <div class="grid grid-cols-2 gap-2">
                                    <div v-for="(tag, idx) in target.tag" :key="idx"
                                        class="flex items-center justify-between py-1 px-2 bg-white rounded">
                                        <span class="text-sm text-gray-700">{{ tag.tagName }}</span>
                                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                            :class="getPrecentTextStyle(tag.rage).score">
                                            {{ tag.rage }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 课程目标达成度趋势 -->
        <div class="bg-white rounded-lg shadow p-4 hover-card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">课程目标达成度趋势</h3>
            <v-chart ref="chart2Ref" :option="option2" class="w-full h-64 chart-container" />
        </div>
    </div>
</template>

<script setup>
import { StudentAnalysisTypeEnum, getStudentAnalysis } from '@/apis/emdV4/analysis_student'
import { color, targetItemColor } from '@/apis/color'

const route = useRoute();
const projectId = route.params.projectId
const studentId = route.params.studentId

const props = defineProps({
    name: String,
});

// 根据分数生成状态
const getPrecentText = (score) => {
    if (score >= 90)
        return '优秀';
    if (score >= 80)
        return '良好';
    if (score >= 70)
        return '较好';
    if (score >= 60)
        return '及格';
    return '不及格';
}

const getPrecentTextStyle = (score) => {
    if (score >= 90)
        return {
            label: 'text-green-600',
            score: 'text-green-600 bg-green-100',
        };
    if (score >= 80)
        return {
            label: 'text-blue-600',
            score: 'text-blue-600 bg-blue-100',
        };
    if (score >= 70)
        return {
            label: 'text-yellow-600',
            score: 'text-yellow-600 bg-yellow-100',
        };
    if (score >= 60)
        return {
            label: 'text-orange-600',
            score: 'text-orange-600 bg-orange-100',
        };
    return {
        label: 'text-red-600',
        score: 'text-red-600 bg-red-100',
    };
}

// 雷达图配置
const chart1Show = ref(false)
const chart1Ref = ref(null);
const option1 = ref({
    tooltip: {
        trigger: 'item',
    },
    legend: {
        data: ['您的达成度', '班级平均'],
        top: 0,
    },
    grid: {
        top: 0,
        bottom: 0,
    },
    radar: {
        indicator: [
            // { name: '课程目标1', max: 100 },
            // { name: '课程目标2', max: 100 },
            // { name: '课程目标3', max: 100 },
            // { name: '课程目标4', max: 100 },
        ],
    },
    color: color,
    series: [
        {
            type: 'radar',
            data: [
                {
                    value: [], //[92, 88, 85, 78],
                    name: '您的达成度',
                    areaStyle: {
                        // color: '#619AF7',
                        opacity: 0.1,
                    },
                },
                {
                    value: [], // [85, 80, 75, 70],
                    name: '班级平均',
                    areaStyle: {
                        // color: '#4DD07D',
                        opacity: 0.1,
                    },
                },
            ],
        },
    ],

});

// 趋势图配置
const chart2Ref = ref(null);
const option2 = ref({
    title: {
        show: false
    },
    grid: {
        top: '10%',
        bottom: '15%',  // Increased bottom margin to accommodate labels
        left: '10%',    // Add some left margin for better visibility
        right: '10%'    // Add some right margin
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: '0',
        icon: 'rect'
    },
    xAxis: {
        type: 'category',
        // Remove startValue and use boundaryGap instead
        boundaryGap: false,  // This makes the line start from the edge
        data: [], //['学期初', '第一次实验', '第二次实验', '第三次实验', '第四次实验', '当前'], // 根据事件数据渲染
        // Make labels more visible
        axisLabel: {
            rotate: 0,  // No rotation for better readability
            interval: 0 // Show all labels
        }
    },
    yAxis: {
        type: 'value',
        // Make sure y-axis starts from 0
        min: 0,
        // You can also set a reasonable max value
        max: 100,
        // Add some split lines for better readability
        splitLine: {
            show: true
        }
    },
    color: targetItemColor,
    series: [
        /* {
            name: '课程目标1',
            type: 'line',
            data: [65, 70, 72, 75, 78, 80],
            smooth: true,
            areaStyle: {
                opacity: 0.1
            },
            // Make sure the line connects to the y=0 axis
            connectNulls: true
        },
        {
            name: '课程目标2',
            type: 'line',
            data: [60, 65, 68, 72, 75, 77],
            smooth: true,
            areaStyle: {
                opacity: 0.1
            },
            connectNulls: true
        },
        {
            name: '课程目标3',
            type: 'line',
            data: [55, 60, 63, 65, 68, 70],
            smooth: true,
            areaStyle: {
                opacity: 0.1
            },
            connectNulls: true
        },
        {
            name: '课程目标4',
            type: 'line',
            data: [50, 55, 58, 60, 62, 64],
            smooth: true,
            areaStyle: {
                opacity: 0.1
            },
            connectNulls: true
        } */
    ]
})

// 课程目标数据
// const courseGoals = ref([
//     {
//         title: '课程目标1：电子电路基础原理掌握',
//         statusLabel: '优秀',
//         score: '92%',
//         statusClass: 'text-green-600',
//         scoreClass: 'bg-green-100 text-green-700',
//         summary:
//             '您在电子电路基础原理掌握方面表现优秀，特别是对晶体管电路的工作原理理解透彻，能够准确分析各类电路的静态工作点和动态特性。在各项实验中，您展现出扎实的理论基础和良好的分析能力。',
//         monitoringPoints: [
//             { label: '频率特性', score: '90%', bgClass: 'bg-green-100 text-green-700' },
//             { label: '测量原理', score: '85%', bgClass: 'bg-blue-100 text-blue-700' },
//             { label: '静态工作点', score: '92%', bgClass: 'bg-green-100 text-green-700' },
//             { label: '特征频率测量', score: '95%', bgClass: 'bg-green-100 text-green-700' },
//             { label: '参数提取', score: '87%', bgClass: 'bg-blue-100 text-blue-700' },
//         ],
//     },
//     {
//         title: '课程目标2：电子电路设计与应用能力',
//         statusLabel: '良好',
//         score: '88%',
//         statusClass: 'text-blue-600',
//         scoreClass: 'bg-blue-100 text-blue-700',
//         summary:
//             '您在电子电路设计与应用方面表现良好，能够根据设计指标搭建基本的放大电路和特殊功能电路。在共射放大器和运算放大器应用实验中，您能灵活运用设计原则，实现电路功能。您的电路设计规范有序，但在某些复杂电路设计方面还有提升空间。',
//         monitoringPoints: [
//             { label: '测量电路', score: '70%', bgClass: 'bg-yellow-100 text-yellow-700' },
//             { label: '电路连接及仪器使用', score: '80%', bgClass: 'bg-blue-100 text-blue-700' },
//             { label: '放大器设计', score: '85%', bgClass: 'bg-blue-100 text-blue-700' },
//             { label: '频率响应', score: '77%', bgClass: 'bg-yellow-100 text-yellow-700' },
//             { label: '电路仿真', score: '82%', bgClass: 'bg-blue-100 text-blue-700' },
//         ],
//     },
//     // 其他课程目标类似...
// ]);

// 根据课程目标达成度获取背景颜色
const legends = ref([
    { name: '>= 90分', percentage: 90 },
    { name: '80-90分', percentage: 80 },
    { name: '70-80分', percentage: 70 },
    { name: '60-70分', percentage: 60 },
    { name: '50-60分', percentage: 50 }
])

const getPrecentLegendStyle = (percentage) => {
    if (percentage >= 90) {
        return 'bg-green-500';
    } else if (percentage >= 80) {
        return 'bg-blue-500';
    } else if (percentage >= 70) {
        return 'bg-yellow-500';
    } else if (percentage >= 60) {
        return 'bg-orange-500';
    } else {
        return 'bg-red-500';
    }
}

watchEffect(() => {
    if (props.name === 'courseTargets') {
        setTimeout(() => {
            chart1Ref.value && chart1Ref.value.resize()
            chart2Ref.value && chart2Ref.value.resize()
        }, 200)
    };
})

onMounted(() => {
    setTimeout(() => {
        updateChart()
    }, 200)
})

function updateChart() {
    getStudentAnalysis(projectId, studentId, StudentAnalysisTypeEnum.STU_P_TARGET).then(res => {
        if (res.state == 200) {
            setTargetList(res.data.target)
            setTrendList(res.data.trend)
        }
    })
}

const targetList = ref([])

const analysis_target = ref({
    max_score_target_index: -1,
    min_score_target_index: -1
})

function analysisTarget(list) {
    if (list.length === 0) {
        analysis_target.value.max_score_target_index = -1;
        analysis_target.value.min_score_target_index = -1;
        return;
    }
    let scores = list.map(_ => _.rage)
    const maxValue = Math.max(...scores);
    const maxIndex = scores.indexOf(maxValue);
    const minValue = Math.min(...scores);
    const minIndex = scores.indexOf(minValue);
    analysis_target.value.max_score_target_index = maxIndex;
    analysis_target.value.min_score_target_index = minIndex;
}


function setTargetList(list) {
    targetList.value = list
    analysisTarget(list)
    let indicator = []
    let yourData = []
    let classData = []
    for (let i = 0; i < list.length; i++) {
        let target = list[i]
        indicator.push({
            name: `课程目标${i + 1}`, max: 100
        })
        yourData.push(target.rage)
        classData.push(target.classRage)
    }
    option1.value.radar.indicator = indicator
    option1.value.series[0].data[0].value = yourData
    option1.value.series[0].data[1].value = classData
    chart1Show.value = true
    chart1Ref.value && chart1Ref.value.setOption(option1.value)
}

function setTrendList(obj) {
    let list = Object.values(obj)
    let xAxisData = []
    let one = list[0]
    xAxisData = one.map(_ => _.label)
    option2.value.xAxis.data = xAxisData
    list.forEach((item, index) => {
        option2.value.series.push({
            name: `课程目标${index + 1}`,
            type: 'line',
            data: item.map(_ => _.value),
            smooth: true,
            areaStyle: {
                opacity: 0.1
            },
            connectNulls: true
        })
    })
    chart2Ref.value && chart2Ref.value.setOption(option2.value)
}
</script>

<style scoped>
.chart-container {
    position: relative;
}

.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>