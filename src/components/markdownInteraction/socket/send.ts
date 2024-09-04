import { ref } from "vue";
import { ElMessage } from "element-plus";
const socket = ref<WebSocket | null | undefined>()
// message 中字段顺序不能改
const message = ref(
    {
        platform: "SIGEX",
        type: "web",
        lab: "lab1",
        cmd: "config",
        data: {
            "tab": 4,
            "frequency": 1000,
            "duty cycle": 0.5,
            "SECTION 3: Signal Select": false,
            "VARIABLE DC (V)": 0,
            "n": 1,
            "Signal select - Lab 6": 1,
            "Reference Amplitude": 1,
            "Shiftable Amplitude": 1,
            "phaseDAC1 (degrees)": 30,
            "phaseDAC0 (degrees)": 0,
            "set DAC0 to conjugate of DAC1": false,
            "Section 1.3 signals": false,
            "to DAC-0": false,
            "sine harmonic": 1,
            "sine phase (degrees)": 0,
            "COSINE AMPL.": [0, 0, 0, 0, 0, 0, 0, 0],
            "SINE AMPL.": [0, 0, 0, 0, 0, 0, 0, 0],
            "DC LEVEL -X5": 0,
            "1KHz + 2kHz": false,
            "VAR-DC_X13": 0,
            "a0": 1,
            "a1": 0,
            "a2": 0,
            "b0": 1,
            "b1": 0,
            "b2": 0,
            "D-OUT-0": false
        },
        check: "sss",
    }
)
const wsUrl = 'ws://127.0.0.1:61234/'

export function SendToSIGEX(data: any) {

    return new Promise<void>((resolve, reject) => {
        if (data != null) {
            message.value.data = data
        }
        let newSocket = new WebSocket(wsUrl)
        newSocket.onopen = () => {
            socket.value = newSocket
            setTimeout(() => {
                if (socket.value?.readyState === 1) {
                    socket.value?.send(JSON.stringify(message.value))
                }
            }, 200)
        }
        newSocket.onclose = () => {
            // console.log("socket断连")
            // console.log(socket.value)
        }
        newSocket.onmessage = (message) => {
            // console.log(JSON.parse(message.data))
            ElMessage
            resolve(JSON.parse(message.data))
        }
        newSocket.onerror = () => {
            ElMessage.error("连接设备错误")
            reject()
        }
    })
}