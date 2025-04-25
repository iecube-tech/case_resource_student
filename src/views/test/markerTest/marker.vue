<template>
    <div>
        <el-button v-for="(item, i) in questions" @click="send(i)">发送{{ i }}</el-button>
    </div>
</template>

<script setup lang="ts">
import { CheckCell } from '@/apis/EMDProject/checkCell';
import { ElMessage } from 'element-plus';

const questions = [
    {
        id: "1",
        stage: "experiment",
        question: "表1监测 $\\bar{\\beta}$计算值是否在参考范围内\n",
        images: [],
        answer: "$\\bar{\\beta}$：60-120",
        tag: "电路连接及仪器使用",
        analysis: "",
        hint_when_wrong: "1. 检查硬件连接是否正确，SMU1连接Vb_in，SMU2连接Vc_in;\n2. 检查器件引脚是否正确放置到管座，管脚间不要短路;\n3.  尝试更换器件。"
    },
    {
        id: "2",
        stage: "experiment",
        question: "实验过程中，将集电极电流设置为5mA左右的原因是什么？\nA、获得合适的静态工作点\nB、实现对交流信号的无失真放大\nC、有足够的动态范围对信号进行不失真放大\nD、避免过早的进入饱和区或者截止区\n",
        images: [],
        answer: "ABCD",
        tag: "静态工作点",
        analysis: "集电结电流5mA时，由于$R_{C}$为1k，所以$V_{CE}$约为5V，集电极电压约为集电极供电电压的一半，当静态工作点设置在直流负载线的中点时，能使晶体管在输入交流信号时，有足够的动态范围来对信号进行不失真放大，避免过早进入饱和区或截止区。如果静态时集电极电压远离电源电压的一半，比如接近电源电压，则集电极电流很小，晶体管接近截止区。当输入交流信号时，在信号的负半周，很容易使晶体管进入截止状态，产生截止失真。 相反，如果集电结电压接近0，则集电极电流很大，晶体管接近饱和区。在输入交流信号的正半周，容易使晶体管进入饱和状态，产生饱和失真。而当集电极电压为电源电压的一半时，在输入交流信号的正负半周内，晶体管都有较大的动态范围来线性地放大信号，能最大程度地避免饱和失真和截止失真，保证输出信号的质量。总之将放大电路集电极电压设置为电源电压的一半左右，是为了获得合适的静态工作点，以实现对交流信号的无失真放大。",
        hint_when_wrong: ""
    },
    {
        id: "3",
        stage: "experiment",
        question: "测量静态工作点时，环境温度升高，晶体管的电流放大系数增大，发射结电压$V_{BE}$减小，以下关于静态工作点参数变化的描述正确的是( )\nA、基极电流$I_{B}$减小，集电极电流$I_{C}$减小，集射极电压$V_{CE}$增大\nB、基极电流$I_{B}$增大，集电极电流$I_{C}$增大，集射极电压$V_{CE}$减小\nC、基极电流$I_{B}$不变，集电极电流$I_{C}$增大，集射极电压$V_{CE}$减小\nD、基极电流$I_{B}$不变，集电极电流$I_{C}$减小，集射极电压$V_{CE}$增大\n",
        images: [],
        answer: "B",
        tag: "静态工作点",
        analysis: "温度升高时，晶体管的电流放大系数$\\beta$增大，发射结电压$V_{BE}$减小。因为$V_{BE}$减小，在基极偏置电路不变的情况下，基极电流$I_{B}$会增大，又因为$\\beta$增大，所以集电极电流$I_C=\\beta I_B$增大。根据$V_{CE}=V_{CC}-I_CR_C$ （$V_{CC}$和$R_{C}$​不变），$I_C$增大则$V_{CE}$减小。",
        hint_when_wrong: ""
    },
    {
        id: "4",
        stage: "experiment",
        question: "用示波器观察BJT放大电路中晶体管各极电压波形时，若发现集电极电压的静态值偏离预期值，而基极电压静态值正常，可能的原因是（ ）\nA、输入耦合电容短路\nB、输出耦合电容短路\nC、集电极电阻$R_{c}$阻值变化\nD、基极偏置电阻$R_{b}$阻值变化\n",
        images: [],
        answer: "C",
        tag: "静态工作点",
        analysis: "输入耦合电容短路主要影响输入信号的传输，对集电极静态电压影响不大；输出耦合电容短路一般影响输出信号，对集电极静态电压无直接影响；基极偏置电阻$R_b$​阻值变化会影响基极电压静态值；而集电极电阻$R_c$​阻值变化会直接影响集电极电流和集电极电压，在基极电压正常时，会使集电极电压的静态值偏离预期值。",
        hint_when_wrong: ""
    },
    {
        id: "5",
        stage: "experiment",
        question: "表2监测 $i_b$测量值是否正确\n",
        images: [],
        answer: "$i_b$：0.02或0.02mA",
        tag: "特征频率测量",
        analysis: "",
        hint_when_wrong: "1. 检查硬件连接是否正确，SMU1连接Vb_in，SMU2连接Vc_in，信号源连接Fb_in，示波器连接Vc_out\n2. 信号源仪器面板中信号源类型、频率、幅值是否设置正确，波形为正弦波，频率为1kHz，幅值为0.2V\n3. 信号源仪器面板是否勾选启用并出现绿色标识“ON”\n4. 示波器仪器面板中是否勾选启用通道，点击左上角“自动设置”按钮，能否获取到波形\n"
    },
    {
        id: "6",
        stage: "experiment",
        question: "表2监测 $V_{ce\\_out}$测量值是否在参考范围内\n",
        images: [],
        answer: "$V_{ce\\_out}$：1-3或1-3V",
        tag: "特征频率测量",
        analysis: "",
        hint_when_wrong: "1. 检查硬件连接是否正确，SMU1连接Vb_in，SMU2连接Vc_in，信号源连接Fb_in，示波器连接Vc_out\n2. 信号源仪器面板中信号源类型、频率、幅值是否设置正确，波形为正弦波，频率为1kHz，幅值为0.2V\n3. 信号源仪器面板是否勾选启用并出现绿色标识“ON”\n4. 示波器仪器面板中是否勾选启用通道，点击左上角“自动设置”按钮，能否获取到波形\n"
    },
    {
        id: "7",
        stage: "experiment",
        question: "表2监测 $\\beta_0$计算值是否在参考范围内\n",
        images: [],
        answer: "$\\beta_0$：60-120",
        tag: "特征频率测量",
        analysis: "",
        hint_when_wrong: "1. 检查硬件连接是否正确，SMU1连接Vb_in，SMU2连接Vc_in，信号源连接Fb_in，示波器连接Vc_out\n2. 信号源仪器面板中信号源类型、频率、幅值是否设置正确，波形为正弦波，频率为1kHz，幅值为0.2V\n3. 信号源仪器面板是否勾选启用并出现绿色标识“ON”\n4. 示波器仪器面板中是否勾选启用通道，点击左上角“自动设置”按钮，能否获取到波形\n"
    },
    {
        id: "8",
        stage: "experiment",
        question: "测量过程中，输入信号幅值过大，会使晶体管( )\nA、工作在线性区，不影响特征频率测量\nB、进入饱和区或截止区，影响特征频率测量结果\nC、使特征频率变大\nD、使特征频率变小\n",
        images: [],
        answer: "B",
        tag: "特征频率测量",
        analysis: "过大的小信号会使晶体管的输入信号超出线性范围，进入饱和区或截止区，此时晶体管的电流放大特性发生改变，$\\beta$值的变化规律不再符合正常情况，从而影响特征频率的测量结果。",
        hint_when_wrong: ""
    },
    {
        id: "9",
        stage: "experiment",
        question: "表3监测 $i_b$的测量值是否正确",
        images: [],
        answer: "$i_b$均为：0.02或0.02mA",
        tag: "特征频率计算",
        analysis: "",
        hint_when_wrong: "检查示波器接收信号是否正常，集电结和基极电流计算是否正确。"
    },
    {
        id: "10",
        stage: "experiment",
        question: "表3监测 $V_{ce\\_out}$测量值是否在参考范围内",
        images: [],
        answer: "$V_{ce\\_out}$的测量值在：1-3或1-3V之间",
        tag: "特征频率计算",
        analysis: "",
        hint_when_wrong: "检查示波器接收信号是否正常，集电结和基极电流计算是否正确。"
    },
    {
        id: "11",
        stage: "experiment",
        question: "表3监测 $i_c$测量值是否在参考范围内",
        images: [],
        answer: "$i_c$的测量值在：1-3或1-3mA之间",
        tag: "特征频率计算",
        analysis: "",
        hint_when_wrong: "检查示波器接收信号是否正常，集电结和基极电流计算是否正确。"
    },
    {
        id: "12",
        stage: "experiment",
        question: "表4监测 $f_{\\beta}$测量值是否在参考范围内",
        images: [],
        answer: "$f_{\\beta}$：400-800或400-800kHz",
        tag: "特征频率计算",
        analysis: "",
        hint_when_wrong: "请确认测量得到的截止频率满足其定义，即截止频率对应的电流放大倍数为低频时电流放大倍数的0.707倍。"
    },
    {
        id: "13",
        stage: "experiment",
        question: "表4监测 $f_T$的计算值是否在参考范围内",
        images: [],
        answer: "$f_T$：30000-60000或30000-60000kHz",
        tag: "特征频率计算",
        analysis: "",
        hint_when_wrong: "代入公式是否正确，$f_T=f_{\\beta}\\beta_{0}$，$\\beta_{0}$是低频下的交流放大系数。"
    }
]

const check = {
    taskId: 691,
    sectionPrefix: "4.2",
    cellId: "poiuy6yuu",
    cellStuAnswer: "不会",
    cellStuImgList: [],
    question: null,
}

const send = (i: any) => {
    check.question = <any>questions[i]
    check.cellId = "poiuy6yuu" + i
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