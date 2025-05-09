<template>
    <div class="flex flex-col lg:flex-row gap-6">
            <!-- 左侧 - 代码编辑器区域 (更长) -->
            <div class="lg:w-2/3">
                <section id="code-editor" class="bg-white rounded-xl shadow-lg p-6 h-full">
                    <h2 class="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">代码编辑</h2>

                    <div class="flex flex-col h-[calc(100%-4rem)]">
                        <div class="mb-3">
                            <div class="flex justify-between items-center mb-1">
                                <span class="block text-sm font-medium text-gray-700">MATLAB 代码</span>
                                <div class="flex space-x-2">
                                    <el-button type="text">
                                        <span class="text-blue-600 text-xs hover:underline">插入示例代码</span>
                                    </el-button>
                                    <el-button type="text">
                                        <span class="text-gray-600 text-xs hover:underline">清空</span>
                                    </el-button>
                                </div>
                            </div>
                        </div>

                        <div class="relative flex-grow">
                            <div class="absolute right-2 top-2 flex space-x-1">
                                <button class="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded">
                                    <svg class="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                </button>
                                
                                <button class="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6h16M4 12h16m-7 6h7"></path>
                                    </svg>
                                </button>
                            </div>

                            <!-- 更高更长的代码编辑区域 -->
                            <textarea class="w-full h-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                :placeholder="`// 在这里粘贴或编写MATLAB代码 \n\t// 例如:\n\t// K = 5;\t% 稳态增益\n\t// tau = 0.15;\t% 时间常数`"></textarea>
                               
                        </div>

                        <div class="flex justify-between text-xs text-gray-500 mt-2">
                            <span>编辑代码后点击下方的"验证代码"和"部署代码"按钮</span>
                            <span>0 行</span>
                        </div>

                        <div class="flex space-x-2 mt-3">
                            <button class="btn-hover flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                <div class="flex items-center justify-center">
                                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>验证代码</span>
                                </div>
                            </button>
                            <button class="btn-hover flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <div class="flex items-center justify-center">
                                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4">
                                        </path>
                                    </svg>
                                    <span>保存代码</span>
                                </div>
                            </button>
                        </div>

                        <!-- 代码验证结果区 -->
                        <div id="code-validation-result"
                            class="p-3 mt-3 rounded-md bg-gray-100">
                            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">验证结果</h3>
                            <div id="validation-messages" class="text-xs text-gray-600 space-y-1">
                                <!-- 验证消息将在这里显示 -->
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- 右侧 - 代码部署和数据可视化 -->
            <div class="lg:w-1/3 flex flex-col gap-6">
                <!-- 右上 - 代码部署区域 -->
                <section id="code-deployment" class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400 border-b pb-2">代码部署</h2>
                    <div class="flex flex-col space-y-4">
                        <el-form label-position="top">
                            <el-form-item label="设备IP地址">
                                <el-input placeholder="例如: 192.168.1.100"></el-input>
                            </el-form-item>
                            <el-form-item label="用户名">
                                <el-input placeholder="默认: pi"></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input placeholder="默认: 123456"></el-input>
                            </el-form-item>
                        </el-form>

                        <button class="btn-hover w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                             @click="connectToDevice">
                            <div class="flex items-center justify-center space-x-2">
                                <font-awesome-icon icon="fa-solid fa-link"></font-awesome-icon>
                                <span>连接设备</span>
                            </div>
                        </button>

                        <button class="btn-hover w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                            >
                            <div class="flex items-center justify-center space-x-2">
                                <font-awesome-icon icon="fa-solid fa-cloud-upload"></font-awesome-icon>
                                <span>部署代码</span>
                            </div>
                        </button>

                        <button class="btn-hover w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                            >
                            <div class="flex items-center justify-center space-x-2">
                                <font-awesome-icon icon="far fa-stop-circle"></font-awesome-icon>
                                <span>停止运行</span>
                            </div>
                        </button>
                        
                    </div>
                </section>

                <!-- 右下 - 数据可视化区域 -->
                <section class="bg-white rounded-xl shadow-lg p-6 ">
                    <h2 class="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">数据可视化</h2>
                    <div class="h-60">
                        <div class="h-full border border-gray-300 rounded-md"></div>
                    </div>
                    <div class="mt-4">
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">系统参数</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 p-3 rounded-md">
                                <p class="text-sm font-medium text-gray-600">稳态输出值</p>
                                <p id="steady-state-value" class="text-xl font-bold text-gray-800 dark:text-white">
                                    -- rad/s
                                </p>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-md">
                                <p class="text-sm font-medium text-gray-600">上升时间</p>
                                <p id="rise-time" class="text-xl font-bold text-gray-800">
                                    -- s
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
</template>

<script setup lang="ts">
const connectToDevice =()=>{
    console.log("connectToDevice");
}
</script>

<style scoped>

</style>