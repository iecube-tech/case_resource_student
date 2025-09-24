<template>
    <div class="mt-6 space-y-6 fade-in">
        <!-- 课程目标达成度雷达图 -->
        <div class="bg-white rounded-lg shadow p-4 hover-card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">课程目标达成度雷达图</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <v-chart ref="chart1Ref" :option="option1" class="w-full h-64 chart-container" />
                <div>
                    <h4 class="text-md font-medium text-gray-700 mb-3">课程目标达成度说明</h4>
                    <p class="text-sm text-gray-600 mb-4">
                        根据您在各个实验中的表现，系统评估了您对课程目标的达成程度。该分析基于您的实验操作、问题回答和实验报告等多维数据。
                    </p>
                    <div class="space-y-2">
                        <div class="flex items-start space-x-2">
                            <font-awesome-icon icon="star" class="text-yellow-500 mt-1" />
                            <span class="text-sm text-gray-700">
                                <span class="font-medium">优势能力:</span> 课程目标1
                            </span>
                        </div>
                        <div class="flex items-start space-x-2">
                            <font-awesome-icon icon="tools" class="text-blue-500 mt-1" />
                            <span class="text-sm text-gray-700">
                                <span class="font-medium">待提升:</span> 课程目标4
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 课程目标详细分析 -->
        <div class="bg-white rounded-lg shadow p-4 hover-card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">课程目标分析</h3>
            <div class="flex flex-start space-x-4 mb-2">
                <div class="space-x-1 flex items-center" v-for="(item, index) in legends" :key="index">
                    <span :class="getPrecentLegendStyle(item.percentage)" class="w-4 h-4 inline-block"></span>
                    <span class="text-gray-500">{{ item.name }}</span>
                </div>
            </div>
            <div class="space-y-6">
                <div v-for="(goal, index) in courseGoals" :key="index">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-md font-medium text-gray-700">{{ goal.title }}</h4>
                        <div class="flex items-center">
                            <span class="text-sm font-medium" :class="goal.statusClass">{{ goal.statusLabel }}</span>
                            <span class="px-2 py-1 rounded-full text-xs font-medium" :class="goal.scoreClass">
                                {{ goal.score }}
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div class="bg-gray-50 p-3 rounded-lg h-full flex flex-col justify-center">
                                <h5 class="text-sm font-medium text-gray-700 mb-2">表现概述</h5>
                                <p class="text-sm text-gray-600">{{ goal.summary }}</p>
                            </div>
                        </div>
                        <div>
                            <div class="bg-gray-50 p-3 rounded-lg h-full flex flex-col justify-center">
                                <h5 class="text-sm font-medium text-gray-700 mb-2">相关监测点与评分</h5>
                                <div class="grid grid-cols-2 gap-2">
                                    <div v-for="(point, idx) in goal.monitoringPoints" :key="idx"
                                        class="flex items-center justify-between py-1 px-2 bg-white rounded">
                                        <span class="text-sm text-gray-700">{{ point.label }}</span>
                                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                            :class="point.bgClass">
                                            {{ point.score }}
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
const props = defineProps({
    name: String,
});

// 雷达图配置
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
            { name: '课程目标1', max: 100 },
            { name: '课程目标2', max: 100 },
            { name: '课程目标3', max: 100 },
            { name: '课程目标4', max: 100 },
        ],
    },
    series: [
        {
            type: 'radar',
            data: [
                {
                    value: [92, 88, 85, 78],
                    name: '您的达成度',
                    areaStyle: {
                        color: 'rgba(0, 128, 0, 0.2)',
                        opacity: 0.5,
                    },
                },
                {
                    value: [85, 80, 75, 70],
                    name: '班级平均',
                    areaStyle: {
                        color: 'rgba(128, 128, 128, 0.2)',
                        opacity: 0.5,
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
        data: ['学期初', '第一次实验', '第二次实验', '第三次实验', '第四次实验', '当前'], // 根据事件数据渲染
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
    series: [
        {
            name: '课程目标1',
            type: 'line',
            data: [65, 70, 72, 75, 78, 80],
            smooth: true,
            itemStyle: {
                color: '#22c55e'
            },
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
            itemStyle: {
                color: '#3b82f6'
            },
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
            itemStyle: {
                color: '#EAB308'
            },
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
            itemStyle: {
                color: '#EF4444'
            },
            areaStyle: {
                opacity: 0.1
            },
            connectNulls: true
        }
    ]
})

// 课程目标数据
const courseGoals = ref([
    {
        title: '课程目标1：电子电路基础原理掌握',
        statusLabel: '优秀',
        score: '92%',
        statusClass: 'text-green-600',
        scoreClass: 'bg-green-100 text-green-700',
        summary:
            '您在电子电路基础原理掌握方面表现优秀，特别是对晶体管电路的工作原理理解透彻，能够准确分析各类电路的静态工作点和动态特性。在各项实验中，您展现出扎实的理论基础和良好的分析能力。',
        monitoringPoints: [
            { label: '频率特性', score: '90%', bgClass: 'bg-green-100 text-green-700' },
            { label: '测量原理', score: '85%', bgClass: 'bg-blue-100 text-blue-700' },
            { label: '静态工作点', score: '92%', bgClass: 'bg-green-100 text-green-700' },
            { label: '特征频率测量', score: '95%', bgClass: 'bg-green-100 text-green-700' },
            { label: '参数提取', score: '87%', bgClass: 'bg-blue-100 text-blue-700' },
        ],
    },
    {
        title: '课程目标2：电子电路设计与应用能力',
        statusLabel: '良好',
        score: '88%',
        statusClass: 'text-blue-600',
        scoreClass: 'bg-blue-100 text-blue-700',
        summary:
            '您在电子电路设计与应用方面表现良好，能够根据设计指标搭建基本的放大电路和特殊功能电路。在共射放大器和运算放大器应用实验中，您能灵活运用设计原则，实现电路功能。您的电路设计规范有序，但在某些复杂电路设计方面还有提升空间。',
        monitoringPoints: [
            { label: '测量电路', score: '70%', bgClass: 'bg-yellow-100 text-yellow-700' },
            { label: '电路连接及仪器使用', score: '80%', bgClass: 'bg-blue-100 text-blue-700' },
            { label: '放大器设计', score: '85%', bgClass: 'bg-blue-100 text-blue-700' },
            { label: '频率响应', score: '77%', bgClass: 'bg-yellow-100 text-yellow-700' },
            { label: '电路仿真', score: '82%', bgClass: 'bg-blue-100 text-blue-700' },
        ],
    },
    // 其他课程目标类似...
]);

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