<template>
    <div class="flex flex-col h-full">
        <section id="code-editor" class="bg-white rounded-xl shadow-lg p-6 h-full">
            <div class="flex flex-row items-center justify-between border-b pb-2">
                <h2 class="text-2xl font-bold text-blue-600">连接设备</h2>
            </div>
            <el-form :model="formData" inline class="mt-2">
                <el-form-item prop="ip">
                    <template #label>
                        <span class="text-base" style="line-height: 32px;">设备ip地址</span>
                    </template>
                    <el-input v-model="formData.ip" @keydown.enter.prevent="stopEvent" placeholder="请输入设备ip地址"></el-input>
                </el-form-item>
                <!-- <el-form-item label="端口号" prop="port">
                    <el-input v-model="formData.port" placeholder="请输入端口号"></el-input>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="blue" @click="checkServer">
                        <span class="text-base leading-8">
                            <font-awesome-icon icon="fa fa-link" class="mr-2" />
                            连接设备
                        </span>
                    </el-button>
                    <el-tag class="ml-4" v-show="grpcStatus != ''" :type="grpcStatus == '在线' ? 'success' : 'danger'">{{ grpcStatus }}</el-tag>
                </el-form-item>
            </el-form>

            <div class="flex flex-row items-center justify-between border-b pb-2">
                <h2 class="text-2xl font-bold text-blue-600">代码编辑</h2>
            </div>

            <div ref="editorContainer" class="codemirror-container h-[500px]"></div>

            <div class="flex space-x-2 mt-3" id="btnTools">
                <el-button type="success" :disabled="isCodeRunning" @click="runCode">
                    <span class="text-base leading-8">
                        <font-awesome-icon icon="fa fa-cloud-upload" class="mr-2" />
                        部署代码
                    </span>
                    </el-button>
                <el-button type="danger" :disabled="!isCodeRunning" @click="stopCode">
                    <span class="text-base leading-8">
                        <font-awesome-icon icon="fa fa-stop" class="mr-2" />
                        停止运行
                    </span>
                </el-button>
            </div>
            <div class="pt-2 pb-2">
                <h2 class="text-2xl font-bold text-blue-600">系统参数</h2>
                <div class="bg-gray-50 rounded-md p-3 mt-2 text-gray-600">
                    <div class="flex flex-row items-center justify-between mb-2">
                        <div class="flex-1">
                            <span class="flex flex-row items-center text-base leading-8">
                                <span class="mr-2">程序状态:</span>
                                <el-tag type="success" v-if="programInfo.program_status == '运行中'">{{ programInfo.program_status }}</el-tag>
                                <el-tag type="warning" v-else-if="programInfo.program_status == '未运行'">{{ programInfo.program_status }}</el-tag>
                            </span>
                        </div>
                        <div class="flex-1 text-base leading-8">
                            <span class="mr-2">程序id:</span>
                            <span>{{ programInfo.program_id }}</span>
                        </div>
                        
                    </div>
                    <div class="flex flex-row items-center justify-between">
                        <div class="flex-1 text-base leading-8">
                            <span class="mr-2">当前值:</span>
                            <span>{{ programInfo.currentValue }}</span>
                        </div>
                        <div class="flex-1 text-base leading-8">
                            <span class="mr-2">更新时间:</span>
                            <span>{{ programInfo.timestamp }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            
            <div id="chartContainer" class="h-[500px] mt-4 rounded-md border-gray-300 border">
                <!-- <canvas id="myChart"></canvas> -->
            </div>

        </section>  
    </div>
</template>

<script setup lang="ts">
// import {checkGrpcServer, executeProgram, stopProgram} from '@/apis/controllerApi/controllerApi.ts'
import Chart from 'chart.js/auto';
import 'moment'
import 'chartjs-adapter-moment';

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const formData = reactive({
    ip: '',
    port: '50051',
})

const grpcStatus = ref('')

const isCodeRunning = ref(false)

const programInfo = reactive({
    program_id: '',
    program_status: '未运行',
    currentValue: '',
    timestamp: '',
})

let currentChart = shallowRef(null)

// import {code} from './code.ts'
const codeText = ref('')
// codeText.value = code

const editorContainer = shallowRef(null);
const startState = shallowRef(null);
const editorView = shallowRef(null);

 // 初始化代码编辑器
const initCodeEditor = ()=> {
    if (!editorContainer.value) return

    startState.value = EditorState.create({
        doc: codeText.value,
        extensions: [
            basicSetup,
            python(),
            oneDark,
            // 关键：使编辑器自动填充容器
            EditorView.theme({
                "&": { height: "100%" },
                ".cm-scroller": { overflow: "auto" }
            })
        ],
        
    });

    editorView.value = new EditorView({
        state: startState.value,
        parent: editorContainer.value
    })
}

onMounted(()=>{
    initCodeEditor();
})

// grpc服务器检查
const checkServer = () => {
    checkGrpcServer({
        host: formData.ip,
        port: formData.port,
    }).then(res=>{
        if(res.data.code === 200 && res.data.message.includes('正常')){
            grpcStatus.value = '在线'
        }else{
            grpcStatus.value = '离线'
        }
    })
}

// 执行程序
const runCode = () => {
    isCodeRunning.value = true
    let data = {
        grpc_host: formData.ip,
        grpc_port: formData.port,
        code: editorView.value.state.doc.toString(),
        encoder_ids:["motor1"]
    }
    executeProgram(data).then(res=>{
        if(res.data.code === 200){
            programInfo.program_id = res.data.data.program_id
            programInfo.program_status = '运行中'
            initSocketIo();
            initChart();
            ElMessage.success(res.data.message)
            // scrollToElement('btnTools')
        }else{
            isCodeRunning.value = false
            ElMessage.error(res.data.message)
        }
    })
}

// 停止程序
const stopCode = () => {
     isCodeRunning.value = false
     stopProgram(programInfo.program_id).then(res=>{
        if(res.data.code === 200){
            stopSocket()
            programInfo.program_status = '未运行'
            ElMessage.success(res.data.message)
        }else{
            ElMessage.error(res.data.message)
        }
     })
}

// init websocket
// 引入socket.io
import { io } from "socket.io-client"

const socket = ref(null);
const initSocketIo = () => {
    if(socket.value){
        socket.value.close(); // 关闭之前的连接
    }
    // 使用当前页面的主机名和端口，而不是硬编码的localhost
            // const socketUrl = `${window.location.protocol}//${window.location.host}`;
            // 增加Socket.IO连接选项，确保与后端配置匹配
            socket.value = io(`wss://${formData.ip}:5000`, {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: Infinity,
                transports: ['polling', 'websocket'],  // 首先尝试polling，然后再升级到websocket
                path: '/socket.io',  // 确保路径与后端配置匹配
                forceNew: true,  // 强制创建新连接
                timeout: 20000   // 增加超时时间
            });

            socket.value.on('connect', () => {
                console.log('Socket.IO连接成功');
            });

            socket.value.on('error', error => {
                console.error(error)
            })
            
            // 监听编码器数据事件
            socket.value.on('encoder_data', (data) => {
                if (data.program_id === programInfo.program_id ) {
                    const encoderId = data.encoder_id;
                    // 强制转换为数值类型，确保数据正确显示
                    const value = parseInt(data.value, 10);
                    const timestamp = parseFloat(data.timestamp);
                    
                    if (isNaN(value)) {
                        console.error(`编码器${encoderId}的值不是有效数字: ${value}`);
                        return;
                    }
                    
                    programInfo.currentValue = value
                    programInfo.timestamp = new Date(timestamp * 1000).toLocaleString()
                    
                    // 更新图表 
                    updateChart(encoderId, value, timestamp);
                    
                    // // 缓存数据
                    // if (!dataCache[encoderId]) {
                    //     dataCache[encoderId] = [];
                    // }
                    
                    // dataCache[encoderId].push({value: value, timestamp: timestamp});
                    // if (dataCache[encoderId].length > 1000) {
                    //     dataCache[encoderId].shift();
                    // }
                } 
            });
}
onUnmounted(()=>{
    stopSocket(); // 关闭Socket.IO连接
})

const stopSocket = ()=>{
    if(socket.value){
        socket.value.close(); // 关闭Socket.IO连接
    }
}


// 更新图表数据
function updateChart(encoderId, value, timestamp) {
    if (!currentChart.value) {
        console.error('Chart instance is not initialized.');
        return;
    }
    const maxDataPoints = 100;
    // 创建数据点对象，确保大数值也能正确表示
    const dataPoint = {
        x: new Date(timestamp * 1000),
        y: value
    };

    currentChart.value.data.labels.push(dataPoint.x);
    currentChart.value.data.datasets[0].data.push(dataPoint.y);

    if (currentChart.value.data.labels.length > maxDataPoints) {
        currentChart.value.data.labels.shift();
        currentChart.value.data.datasets[0].data.shift();
    }

    // 使用none参数禁用动画，以提高性能
    currentChart.value.update('none');
}




// init chart 
const initChart = () => {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '<canvas id="myChart"></canvas>';
    const ctx = document.getElementById('myChart').getContext('2d');

  currentChart.value = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: `编码器`,
            data: [],
            tension: 0.1,
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'HH:mm:ss'
                    }
                },
                title: {
                    display: true,
                    text: '时间'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '编码器值'
                }
            }
        },
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                display: true
            }
        }
    }
 
  });

}

// 滚动到目标元素的方法
const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId)
  const container = document.getElementsByClassName('left-container')[0]
  if (element) {
   element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }
}

import axios from 'axios'

const httpInstance = axios.create({
    // baseURL: '/2830-api',
    timeout: 10000
})

const checkGrpcServer = (data: any)  =>{
    return httpInstance({
        url: `https://${formData.ip}:5000/check_grpc_server`,
        method: 'get',
        params: data
    })
}

const executeProgram = (data: any) =>{
    return httpInstance({
        url: `https://${formData.ip}:5000/execute_program`,
        method: 'post',
        data: data
    })
}

const stopProgram = (programId: string) =>{
    return httpInstance({
        url: `https://${formData.ip}:5000/stop_program/${programId}`,
        method: 'post',
    })
}

const stopEvent = (event) =>{
     event.preventDefault();
}
</script>

<style scoped>

/* 自定义蓝色按钮 */
.el-button--blue {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--blue:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button--blue:focus {
  background-color: #3a8ee6;
  border-color: #3a8ee6;
}

.el-button--blue.is-plain {
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #b3d8ff;
}

.el-button--blue.is-plain:hover {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>