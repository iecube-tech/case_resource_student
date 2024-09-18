<template>
    <div v-if="dataSource.length > 2">
        <div style="display: flex; flex-direction: row; justify-content: flex-end; width: 100%; padding: 20px 20px;">
            <el-button v-if="displayMapping" link type="primary" @click="foldMapping()">折叠理实映射</el-button>
            <el-button v-else link type="primary" @click="showMapping()">展开理实映射</el-button>
        </div>
        <div ref="mappingDiv" class="mapping" id="course_mapping" :style="{ height: courseMappingHeight + 'px' }">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { GetCaseMapping } from '@/apis/map/getCaseMapping';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { watch } from 'vue';

const props = defineProps({
    caseId: Number
})

const caseId = ref()
interface Tree {
    id?: number
    name: string
    level?: number
    pid: number,
    itemStyle?: {
        color: string
    }
    label?: {
        position: string,
        color: string,
        fontSize: number,
    }
    symbolSize?: number
    link?: string
    children?: Tree[]
}

const option = ref({
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    // title: {
    //     id: 1,
    //     text: '单击展开/折叠节点，右击跳转节点详细信息',
    //     left: 'center',
    //     textStyle: {
    //         color: '#D3D3D3',
    //         fontWeight: 'bold',
    //     }
    // },
    series: [
        {
            type: 'tree',
            name: 'tree',
            data: [],
            top: '5%',
            left: '12%',
            bottom: '5%',
            right: '10%',
            // roam: 'move',
            // zoom: 0.8,
            symbolSize: 10, // 标记的大小
            symbol: "emptyCircle",
            itemStyle: {
                color: "#89c7c7",
            },
            leaves: {
                label: {
                    position: 'right',
                },
            },
            emphasis: {
                focus: 'relative', // 聚焦方式
            },
            initialTreeDepth: 3, // 全部展开-1 / 展开层级
            animationDuration: 550,
            animationDurationUpdate: 750,
            layout: 'orthogonal',
            orient: 'LR',
        },
    ]
})
const dataSource = ref<Tree[]>([])
const treeChart = ref()
const InitChartStatus = ref(false)
const mappingDiv = ref()
const courseMappingHeight = ref(40)
const displayMapping = ref(true)
const treeLeafNum = ref(0)
function getTreeLeaf(treeData: any, leafList: any) {
    // 判断是否为数组
    if (Array.isArray(treeData)) {
        treeData.forEach(item => {
            if (item.children && item.children.length > 0) {
                getTreeLeaf(item.children, leafList)
            } else {
                leafList.push(item)
            }
        })
    } else {
        if (treeData.children && treeData.children.length > 0) {
            getTreeLeaf(treeData.children, leafList)
        } else {
            leafList.push(treeData)
        }
    }
    return leafList
}

const initChart = () => {
    destoryEchart()
    if (!document.getElementById("course_mapping")) {
        return
    }
    const eleArr = getTreeLeaf(dataSource.value, [])
    const itemHeight = 40;
    const currentHeight = itemHeight * (eleArr.length - 1) || itemHeight;
    const newHeight = Math.max(currentHeight, itemHeight, courseMappingHeight.value);
    courseMappingHeight.value = newHeight;
    mappingDiv.value.style.height = courseMappingHeight.value + 'px'
    treeChart.value = echarts.init(document.getElementById("course_mapping"))
    treeChart.value.showLoading();
    //todo 初始化数据
    option.value.series[0].data = <any>dataSource.value
    treeChart.value.setOption(option.value);
    treeChart.value.hideLoading();
    treeChart.value.on('mousedown', function (params: any) {
        const name = params.data.name;
        const dataIndex = params.dataIndex;
        console.log(dataIndex)
        const curNode = treeChart.value._chartsViews[0]._data.tree._nodes.filter(function (item: any) {
            return item.name === name;
        });
        if (curNode[0].depth) {
            treeChart.value._chartsViews[0]._data.tree._nodes.forEach(function (item: any) {
                if (params.event.target.culling === false) {
                    //点击标签阻止默认节点展开或收缩事件
                    if (item.dataIndex === dataIndex) {
                        // 若是展开状态不允许收缩，若是收缩状态不允许展开
                        item.isExpand = !item.isExpand;
                    }
                }
            });
        }
    })
    treeChart.value.on('click', function (params: any) {
        if (params.event.target.culling === false) {
            if (params.data.link && params.data.link != '') {
                if (params.data.link.startsWith('http', 0)) {
                    window.open(params.data.link);
                }
            }
        }

    })
    window.addEventListener('resize', function () {
        if (treeChart.value) {
            treeChart.value.resize();
        }
    })
    if (treeChart.value.getWidth() && treeChart.value.getHeight()) {
        InitChartStatus.value = true
        treeChart.value.resize({ height: courseMappingHeight.value + 'px' });
    } else {
        treeChart.value = null
    }
    window.dispatchEvent(new Event('resize'));
}

const resetChart = () => {
    // console.log(treeChart.value.isRevoked)
    if (InitChartStatus.value) {
        return
    }
    initChart();
}

const foldMapping = () => {
    mappingDiv.value.style.display = "none"
    displayMapping.value = false
}

const showMapping = () => {
    mappingDiv.value.style.display = "block"
    displayMapping.value = true
}

const updataChart = () => {
    if (treeChart.value != null) {
        option.value.series[0].data = <any>dataSource.value
        treeChart.value.setOption(option.value)
    }
}

const destoryEchart = () => {
    if (treeChart.value != null) {
        treeChart.value.dispose()
        treeChart.value = null
    }
    InitChartStatus.value = false
}

const getMapping = (id: number) => {
    GetCaseMapping(id).then(res => {
        if (res.state == 200) {
            dataSource.value = res.data
            updataChart()
        } else {
            ElMessage.error(res.message)
        }
    })
}

watch(dataSource, (newValue, oldValue) => {
    if (newValue) {
        initChart();
    }
})

onBeforeMount(() => {
    caseId.value = props.caseId
    console.log(caseId.value)
    if (caseId.value) {
        getMapping(caseId.value)
    }
})

onMounted(() => {
})
</script>
<style scoped>
.mapping {
    width: 100%;
}

.mapping_control {
    width: 100%;
    height: 30px;
    background-color: black;
}
</style>