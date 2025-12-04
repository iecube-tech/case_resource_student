<template>
  <div x-show="experimentStudentTab === 'process'" class="mt-6 space-y-6 fade-in">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">实验操作流程记录</h3>
      <div class="relative">
        <!-- 时间线 -->
        <div class="absolute h-full w-0.5 bg-gray-200 dark:bg-gray-700 left-9 top-0"></div>

        <!-- 实验步骤 -->
        <div class="space-y-6 ml-20">
          <div class="relative">
            <div class="absolute -left-20 mt-1.5 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'plug']" class="text-white text-sm" />
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">电路连接</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">09:15 AM</span>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                连接SMU1到Vb_in (1,7)，SMU2到Vc_in (2,12)。<br>
                <span class="text-yellow-600 dark:text-yellow-400">
                  系统提示：请确认特征频率测量电路连线是否完整
                </span>
              </p>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -left-20 mt-1.5 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'chart-line']" class="text-white text-sm" />
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">静态工作点测量</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">09:22 AM</span>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                测量IB=0.05mA，IC=5.2mA，计算β=104，VCE=4.8V。
              </p>
              <div class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                <div class="flex space-x-2">
                  <span class="text-gray-500 dark:text-gray-400">系统记录：</span>
                  <span>SMU1电压设置：0.72V，电流读数：0.05mA</span>
                </div>
                <div class="flex space-x-2">
                  <span class="text-gray-500 dark:text-gray-400">系统记录：</span>
                  <span>SMU2电压设置：10V，电流读数：5.2mA</span>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -left-20 mt-1.5 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'sync-alt']" class="text-white text-sm" />
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">交流特性测量</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">09:30 AM</span>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                完成信号源连接：AWG到Fb_in (5,14)。<br>
                设置信号源：正弦波，频率1kHz，幅值0.2V。<br>
                <span class="text-yellow-600 dark:text-yellow-400">
                  系统提示：缺少示波器连接，请连接OSC1到Vce_out
                </span>
              </p>
              <div class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                <div class="flex space-x-2">
                  <span class="text-gray-500 dark:text-gray-400">系统记录：</span>
                  <span>信号源设置：正弦波，频率1kHz，幅值0.2V</span>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -left-20 mt-1.5 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-white text-sm" />
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">连线错误修正</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">09:33 AM</span>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                完成示波器连接：OSC1到Vce_out (3,17)。<br>
                <span class="text-green-600 dark:text-green-400">
                  系统提示：电路连接正确，可以继续实验
                </span>
              </p>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -left-20 mt-1.5 w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'wave-square']" class="text-white text-sm" />
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">特征频率测量</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">09:40 AM</span>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                调整信号频率为1kHz、10kHz、100kHz、500kHz、1MHz，记录对应输出电压。<br>
                计算β在各频率下的值，确定特征频率fβ=550kHz。<br>
                计算fT=β0×fβ=104×550kHz=57200kHz。
              </p>
              <div class="mt-2 bg-gray-50 dark:bg-gray-700 rounded">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  <thead>
                    <tr>
                      <th class="px-2 py-1 text-left text-gray-500 dark:text-gray-400">频率</th>
                      <th class="px-2 py-1 text-left text-gray-500 dark:text-gray-400">输出电压</th>
                      <th class="px-2 py-1 text-left text-gray-500 dark:text-gray-400">ic (mA)</th>
                      <th class="px-2 py-1 text-left text-gray-500 dark:text-gray-400">β</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td class="px-2 py-1">1kHz</td>
                      <td class="px-2 py-1">2.1V</td>
                      <td class="px-2 py-1">2.1</td>
                      <td class="px-2 py-1">105</td>
                    </tr>
                    <tr>
                      <td class="px-2 py-1">10kHz</td>
                      <td class="px-2 py-1">2.1V</td>
                      <td class="px-2 py-1">2.1</td>
                      <td class="px-2 py-1">105</td>
                    </tr>
                    <tr>
                      <td class="px-2 py-1">100kHz</td>
                      <td class="px-2 py-1">2.0V</td>
                      <td class="px-2 py-1">2.0</td>
                      <td class="px-2 py-1">100</td>
                    </tr>
                    <tr>
                      <td class="px-2 py-1">500kHz</td>
                      <td class="px-2 py-1">1.5V</td>
                      <td class="px-2 py-1">1.5</td>
                      <td class="px-2 py-1">75</td>
                    </tr>
                    <tr>
                      <td class="px-2 py-1">1MHz</td>
                      <td class="px-2 py-1">1.1V</td>
                      <td class="px-2 py-1">1.1</td>
                      <td class="px-2 py-1">55</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -left-20 mt-1.5 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'clipboard-check']" class="text-white text-sm" />
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">实验完成</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">09:55 AM</span>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                完成所有测量与计算，提交实验数据。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI互动记录 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        AI互动记录
        <span class="text-sm text-gray-500 dark:text-gray-400">(3次互动)</span>
      </h3>
      <div class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <font-awesome-icon :icon="['fas', 'user']" class="text-blue-500 dark:text-blue-300" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">学生询问</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">09:25 AM</span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                我该如何确定晶体管的截止频率？
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-3 mt-3 ml-8">
            <div class="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <font-awesome-icon :icon="['fas', 'robot']" class="text-green-500 dark:text-green-300" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">AI助手</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">09:25 AM</span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                晶体管的截止频率fβ是指电流增益β降低到低频值β0的0.707倍时的频率。要测量它，您需要在不同频率下测量输出电压（与ic成比例），然后计算各频率下的β值。当β值下降到β0×0.707时，对应的频率就是fβ。
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <font-awesome-icon :icon="['fas', 'user']" class="text-blue-500 dark:text-blue-300" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">学生询问</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">09:34 AM</span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                我看不到示波器上的波形，可能是什么原因？
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-3 mt-3 ml-8">
            <div class="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <font-awesome-icon :icon="['fas', 'robot']" class="text-green-500 dark:text-green-300" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">AI助手</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">09:34 AM</span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                可能有几个原因：
                <br>1. 检查OSC1是否正确连接到Vce_out (3,17)
                <br>2. 确认信号源已打开（绿色ON标识）
                <br>3. 示波器通道是否已启用
                <br>4. 尝试点击示波器面板上的"自动设置"按钮调整量程
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <font-awesome-icon :icon="['fas', 'user']" class="text-blue-500 dark:text-blue-300" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">学生询问</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">09:46 AM</span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                我得到的fT值是57.2MHz，这个结果合理吗？
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-3 mt-3 ml-8">
            <div class="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <font-awesome-icon :icon="['fas', 'robot']" class="text-green-500 dark:text-green-300" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">AI助手</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">09:46 AM</span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                是的，您的结果合理。对于普通的小信号BJT晶体管，fT通常在30-100MHz范围内。您的计算fT = β0 × fβ = 104 × 0.55MHz = 57.2MHz在正常范围内，计算方法也正确。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>